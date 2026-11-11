"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Something went wrong. Please try again.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <div className="contact-form contact-form--sent" role="status">
      <CheckCircle2 size={34}/>
      <h3>INQUIRY SENT.</h3>
      <p>Thanks for reaching out. We'll get back to you soon.</p>
      <button type="button" className="contact-reset" onClick={() => setStatus("idle")}>SEND ANOTHER</button>
    </div>;
  }

  return <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
    <div className="contact-form-row">
      <label><span>NAME *</span><input name="name" type="text" required maxLength={100} autoComplete="name"/></label>
      <label><span>EMAIL *</span><input name="email" type="email" required maxLength={200} autoComplete="email"/></label>
    </div>
    <div className="contact-form-row">
      <label><span>COMPANY</span><input name="company" type="text" maxLength={150} autoComplete="organization"/></label>
      <label><span>INQUIRY TYPE</span>
        <select name="type" defaultValue="Sponsorship">
          <option>Sponsorship</option>
          <option>Advertising</option>
          <option>Partnership</option>
          <option>Collaboration</option>
          <option>Other</option>
        </select>
      </label>
    </div>
    <label><span>MESSAGE *</span><textarea name="message" required minLength={10} maxLength={5000} rows={5}/></label>
    {/* Honeypot: hidden from people, bots tend to fill it in. */}
    <input className="contact-hp" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
    {status === "error" && <p className="contact-error" role="alert">{error}</p>}
    <button type="submit" className="contact-email contact-submit" disabled={status === "sending"}>
      {status === "sending" ? <><Loader2 size={20} className="contact-spin"/> SENDING...</> : <>SEND INQUIRY <ArrowUpRight size={20}/></>}
    </button>
  </form>;
}
