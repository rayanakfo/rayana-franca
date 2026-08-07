import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, ArrowRight, Palette, Target, Sparkles, MessageCircle } from "lucide-react";

import portrait from "@/assets/rayana-portrait.jpg";
import { CONTACT, whatsappUrl } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rayana Oliveira | Gestão Estratégica de Instagram" },
      {
        name: "description",
        content:
          "Eleve a presença e as vendas do seu negócio no Instagram com gestão estratégica de conteúdos. Diagnóstico gratuito com Rayana Oliveira.",
      },
      { property: "og:title", content: "Rayana Oliveira | Gestão Estratégica de Instagram" },
      {
        property: "og:description",
        content:
          "Estratégia de conteúdo, Reels e posicionamento de marca para negócios que querem crescer no Instagram.",
      },
    ],
  }),
  component: Home,
});

const pillars = [
  {
    icon: Target,
    title: "Estratégia de Conteúdo",
    text: "Calendário editorial construído a partir de dados, objetivos comerciais e comportamento da sua audiência.",
  },
  {
    icon: Palette,
    title: "Identidade Visual & Reels",
    text: "Feed coerente, capas desenhadas e Reels com ritmo, ganchos e edição pensada para retenção.",
  },
  {
    icon: Sparkles,
    title: "Posicionamento de Marca",
    text: "Narrativa, tom de voz e autoridade: a sua marca deixa de ser mais uma no scroll.",
  },
];

const steps = [
  {
    n: "01",
    title: "Briefing de Diagnóstico",
    text: "Preenche o questionário inteligente com objetivos, referências e áudio explicativo.",
  },
  {
    n: "02",
    title: "Proposta & Contrato",
    text: "Recebe um escopo personalizado, investimento claro e contrato pronto a assinar.",
  },
  {
    n: "03",
    title: "Onboarding & Crescimento",
    text: "Produção, publicação e acompanhamento mensal com relatório de performance.",
  },
];

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-champagne/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-8 lg:py-28">
          <div>
            <p className="eyebrow">Gestão de Redes Sociais · {CONTACT.location}</p>
            <h1 className="mt-6 font-display text-4xl leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
              Eleve a presença e as vendas do seu negócio no Instagram com gestão estratégica de
              conteúdos.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Trabalho com marcas que já têm um bom produto e precisam de consistência, estética e
              estratégia para transformar seguidores em clientes. Tudo começa com um diagnóstico
              honesto do seu perfil.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/briefing"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
              >
                Preencher Questionário de Diagnóstico <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href={whatsappUrl(
                  "Olá Rayana! Gostaria de falar sobre gestão do meu Instagram.",
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 bg-background px-7 py-4 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-secondary"
              >
                <MessageCircle className="h-3.5 w-3.5 text-gold" /> Falar no WhatsApp{" "}
                {CONTACT.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border border-gold/40" />
            <div className="surface-panel relative overflow-hidden rounded-[2rem] p-3 shadow-elegant">
              <img
                src={portrait}
                alt="Retrato de Rayana Oliveira, especialista em gestão de redes sociais"
                width={896}
                height={1152}
                className="h-[440px] w-full rounded-[1.6rem] object-cover object-top sm:h-[520px]"
              />
              <div className="flex items-center gap-3 px-3 py-4">
                <BadgeCheck className="h-5 w-5 shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="truncate font-display text-lg text-foreground">Rayana Oliveira</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Especialista em Gestão de Redes Sociais
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <p className="eyebrow">Pilares do trabalho</p>
        <div className="gold-rule mt-4 w-24" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <article
              key={p.title}
              className="group rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-elegant"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-champagne/50 text-foreground">
                <p.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-6 font-display text-2xl text-foreground">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <p className="eyebrow">Como trabalhamos</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl text-foreground lg:text-4xl">
            Três passos entre o primeiro contacto e um Instagram que vende.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <span className="font-display text-5xl text-gold/70">{s.n}</span>
                <div className="gold-rule mt-4" />
                <h3 className="mt-5 font-display text-xl text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <Link
              to="/briefing"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-xs uppercase tracking-[0.18em] text-primary-foreground"
            >
              Começar diagnóstico <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
