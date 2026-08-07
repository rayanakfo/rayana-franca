import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";

import portrait from "@/assets/rayana-portrait.jpg";
import { CONTACT } from "@/lib/site";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre & Método | Rayana Oliveira Social Media" },
      {
        name: "description",
        content:
          "Conheça o método de trabalho de Rayana Oliveira: diagnóstico, estratégia editorial, produção de Reels e relatórios mensais de performance.",
      },
      { property: "og:title", content: "Sobre & Método | Rayana Oliveira Social Media" },
      {
        property: "og:description",
        content: "O método por trás de perfis de Instagram consistentes, elegantes e rentáveis.",
      },
    ],
  }),
  component: Sobre,
});

const method = [
  {
    title: "1. Diagnóstico profundo",
    text: "Análise do perfil, concorrência, oferta e público. Nada é criado antes de entender o negócio.",
  },
  {
    title: "2. Estratégia editorial",
    text: "Pilares de conteúdo, linhas narrativas e calendário mensal alinhado com lançamentos e sazonalidade.",
  },
  {
    title: "3. Produção & estética",
    text: "Direção de arte, captação guiada, edição de Reels, capas, legendas e copy orientada a conversão.",
  },
  {
    title: "4. Comunidade & vendas",
    text: "Gestão de comentários e DMs, sequências de stories e chamadas à ação que conduzem à compra.",
  },
  {
    title: "5. Relatório & iteração",
    text: "Métricas que importam: alcance qualificado, guardados, cliques e conversas iniciadas.",
  },
];

const deliverables = [
  "Estratégia e calendário editorial mensal",
  "Reels editados com legendas e ganchos",
  "Stories diários estruturados",
  "Design de capas e destaques",
  "Gestão de comentários e mensagens diretas",
  "Relatório mensal de performance",
];

function Sobre() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-0 -translate-x-4 translate-y-4 rounded-[2rem] border border-gold/40" />
            <img
              src={portrait}
              alt="Rayana Oliveira, especialista em social media"
              width={896}
              height={1152}
              loading="lazy"
              className="relative h-[460px] w-full rounded-[2rem] object-cover object-top shadow-elegant"
            />
          </div>
          <div>
            <p className="eyebrow">Sobre</p>
            <h1 className="mt-5 font-display text-4xl leading-tight text-foreground lg:text-5xl">
              Estratégia primeiro. Estética sempre. Resultados no fim do mês.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Sou Rayana Oliveira, especialista em gestão de redes sociais baseada em{" "}
              {CONTACT.location}. Trabalho com negócios de serviços, beleza, moda e produtos
              artesanais que querem sair da produção aleatória de conteúdo e construir um perfil
              com identidade, autoridade e vendas previsíveis.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Cada conta é tratada como um projeto de posicionamento: entendo o negócio, defino a
              narrativa, produzo o conteúdo e meço o que gera receita — não apenas seguidores.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <p className="eyebrow">O método</p>
        <div className="gold-rule mt-4 w-24" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {method.map((m) => (
            <article key={m.title} className="rounded-2xl border border-border bg-card p-7">
              <h2 className="font-display text-xl text-foreground">{m.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="eyebrow">Entregáveis típicos</p>
            <h2 className="mt-4 font-display text-3xl text-foreground lg:text-4xl">
              O que está incluído numa gestão mensal.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              O escopo final é definido no briefing de diagnóstico e ajustado à realidade da sua
              marca.
            </p>
            <Link
              to="/briefing"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-xs uppercase tracking-[0.18em] text-primary-foreground"
            >
              Quero o meu diagnóstico <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="space-y-3">
            {deliverables.map((d) => (
              <li
                key={d}
                className="flex items-start gap-3 rounded-xl border border-border bg-card px-5 py-4 text-sm text-foreground"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
