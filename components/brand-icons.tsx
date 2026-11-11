import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { SiRumble } from "react-icons/si";
import { Globe2 } from "lucide-react";

export function BrandIcon({ name, size = 23 }: { name: string; size?: number }) {
  switch (name) {
    case "youtube": return <FaYoutube size={size} aria-hidden="true" />;
    case "x": return <FaXTwitter size={size} aria-hidden="true" />;
    case "facebook": return <FaFacebookF size={size} aria-hidden="true" />;
    case "instagram": return <FaInstagram size={size} aria-hidden="true" />;
    case "tiktok": return <FaTiktok size={size} aria-hidden="true" />;
    case "rumble": return <SiRumble size={size} aria-hidden="true" />;
    case "truth": return <Globe2 size={size} strokeWidth={1.9} aria-hidden="true" />;
    default: return <Globe2 size={size} aria-hidden="true" />;
  }
}
