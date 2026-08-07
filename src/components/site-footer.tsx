import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";

import { CONTACT, NAV_LINKS, whatsappUrl } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl text-foreground">Rayana Oliveira</p>
          <p className="eyebrow mt-2">Social Media & Gestão de Instagram</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Gestão estratégica de conteúdos para marcas que querem presença consistente e vendas
            reais no Instagram.
          </p>
        </div>

        <div>
          <p className="eyebrow">Navegação</p>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contacto</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a
                className="inline-flex items-center gap-2 hover:text-foreground"
                href={whatsappUrl("Olá Rayana! Vim através do seu site.")}
                target="_blank"
                rel="noreferrer"
              >
                <Phone className="h-3.5 w-3.5 text-gold" /> {CONTACT.phoneDisplay}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-gold" /> {CONTACT.email}
            </li>
            <li className="inline-flex items-center gap-2">
              <Instagram className="h-3.5 w-3.5 text-gold" /> {CONTACT.location}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70 px-5 py-6 text-center text-xs text-muted-foreground lg:px-8">
        © {new Date().getFullYear()} Rayana Oliveira · Social Media Specialist
      </div>
    </footer>
  );
}
