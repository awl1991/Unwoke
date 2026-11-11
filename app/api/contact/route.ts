import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/config";

export const runtime = "nodejs";

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden "website" field; pretend success and drop it.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const company = clean(body.company, 150);
  const type = clean(body.type, 50) || "General";
  const message = clean(body.message, 5000);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please fill in your name, email, and message." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: "Your message is a little short. Add a bit more detail." }, { status: 400 });
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.error("Contact form: SMTP_USER / SMTP_PASS are not set.");
    return NextResponse.json({ error: `The form isn't set up yet. Please email ${siteConfig.email} directly.` }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user, pass },
  });

  const to = process.env.CONTACT_TO_EMAIL || siteConfig.email;
  const subject = `${type} inquiry from ${name}${company ? ` (${company})` : ""}`;
  const text = `New inquiry from unwokethoughts.com\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || "-"}\nType: ${type}\n\n${message}\n`;
  const html = `<h2>New inquiry from unwokethoughts.com</h2>
<p><b>Name:</b> ${escapeHtml(name)}<br/><b>Email:</b> ${escapeHtml(email)}<br/><b>Company:</b> ${escapeHtml(company || "-")}<br/><b>Type:</b> ${escapeHtml(type)}</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

  try {
    await transporter.sendMail({
      from: `"UnwokeThoughts Website" <${user}>`,
      to,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return NextResponse.json({ error: `Couldn't send right now. Please email ${siteConfig.email} directly.` }, { status: 502 });
  }
}
