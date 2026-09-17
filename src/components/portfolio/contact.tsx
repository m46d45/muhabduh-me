import { useState, type FormEvent } from "react";
import {
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Send,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ORCID = "https://orcid.org/0000-0001-6926-6665";

/** Primary row — email, LinkedIn, ORCID, ITB staff, Zoom */
const primary = [
  {
    label: "Email",
    href: "mailto:abduh@itb.ac.id",
    icon: Mail,
    value: "abduh@itb.ac.id",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/muhamad-abduh-5626666",
    icon: Linkedin,
    value: "linkedin.com/in/muhamad-abduh",
  },
  {
    label: "ORCID",
    href: ORCID,
    icon: ExternalLink,
    value: "0000-0001-6926-6665",
  },
  {
    label: "ITB staff page",
    href: "https://www.itb.ac.id/staff/view/muhamad-abduh-stw",
    icon: ExternalLink,
    value: "itb.ac.id/staff",
  },
  {
    label: "Zoom room",
    href: "https://itb-ac-id.zoom.us/my/abduh",
    icon: ExternalLink,
    value: "itb-ac-id.zoom.us/my/abduh",
  },
];

/** Demoted from primary row */
const socialMore = [
  {
    label: "Instagram",
    href: "https://instagram.com/abduh.muhamad",
    icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UC4iziTaKqYp_lCNwE-IUiNQ",
    icon: Youtube,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/mabdas",
    icon: Facebook,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/mabdas",
    icon: ExternalLink,
  },
];

const moreLinks = [
  { label: "ITB", href: "https://www.itb.ac.id" },
  { label: "IAMKRI", href: "https://iamkri.id" },
  { label: "Linktree", href: "https://linktr.ee/muhabduh" },
  {
    label: "ITB Scholar",
    href: "https://scholar.itb.ac.id/profile/muhamad-abduh_40559",
  },
  {
    label: "Google Scholar",
    href: "https://scholar.google.com/citations?user=DctmufgAAAAJ&hl=en",
  },
  {
    label: "WhatsApp",
    href: "https://api.whatsapp.com/send?phone=62811200142",
  },
];

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSending(true);
    const subject = encodeURIComponent(`Message from ${name.trim()}`);
    const body = encodeURIComponent(
      `${message.trim()}\n\n— ${name.trim()}\n${email.trim()}`,
    );
    window.location.href = `mailto:abduh@itb.ac.id?subject=${subject}&body=${body}`;
    window.setTimeout(() => {
      setSending(false);
      setName("");
      setEmail("");
      setMessage("");
      toast.success("Opening your email app to send the message.");
    }, 400);
  }

  return (
    <section
      id="contact"
      className="section-pad border-t border-border py-24 sm:py-28"
    >
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.08em] uppercase text-accent">
            Contact
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Get in touch
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Happy to hear about teaching, research, or collaboration. Email is
            usually the easiest way to reach me. Office: CIBE Building, 6th
            floor, room 0604, Jl. Ganesha No. 10, Bandung 40132.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div className="space-y-3">
            {primary.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-4 shadow-soft transition-colors duration-150 hover:border-accent/30"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-teal-wash text-accent transition-colors">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium uppercase tracking-wider text-subtle">
                      {item.label}
                    </span>
                    <span className="block truncate text-sm text-ink">
                      {item.value}
                    </span>
                  </span>
                </a>
              );
            })}

            <div className="pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-subtle">
                Also on
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {socialMore.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      <Icon className="h-3 w-3" />
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-3">
              {moreLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-xl border border-border bg-surface p-6 shadow-soft sm:p-8"
            noValidate
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="A short note is welcome..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={sending}
              >
                {sending ? "Opening email..." : "Send via email"}
                <Send className="h-4 w-4" />
              </Button>
              <p className="text-xs text-subtle">
                Opens your email app to send to abduh@itb.ac.id.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
