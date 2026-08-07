import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Mic,
  Square,
  Trash2,
  Upload,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { CONTACT, whatsappUrl } from "@/lib/site";

export const Route = createFileRoute("/briefing")({
  head: () => ({
    meta: [
      { title: "Questionário de Diagnóstico | Rayana Oliveira Social Media" },
      {
        name: "description",
        content:
          "Preencha o briefing inteligente: perfil, objetivos, referências, ficheiros e áudio. Receba uma proposta personalizada de gestão de Instagram.",
      },
      { property: "og:title", content: "Questionário de Diagnóstico | Rayana Oliveira" },
      {
        property: "og:description",
        content: "Briefing em 4 passos para desenhar a estratégia e o investimento da sua marca.",
      },
    ],
  }),
  component: Briefing,
});

type Form = {
  full_name: string;
  brand_name: string;
  instagram_handle: string;
  website: string;
  niche: string;
  contact: string;
  main_need: string;
  needs_details: string;
  post_frequency: string;
  team_structure: string;
  reference_links: string;
  budget_range: string;
  currency: string;
  timeline: string;
};

const empty: Form = {
  full_name: "",
  brand_name: "",
  instagram_handle: "",
  website: "",
  niche: "",
  contact: "",
  main_need: "",
  needs_details: "",
  post_frequency: "",
  team_structure: "",
  reference_links: "",
  budget_range: "",
  currency: "EUR",
  timeline: "",
};

const NEEDS = [
  "Aumentar vendas",
  "Melhorar a estética do feed",
  "Criar Reels virais",
  "Falta de tempo para publicar",
  "Construir autoridade / posicionamento",
];

const FREQUENCY = ["Não publico", "1-2x por semana", "3-4x por semana", "Todos os dias"];
const TEAM = ["Sozinho(a)", "Tenho um assistente", "Equipa interna de marketing", "Agência atual"];
const BUDGETS_EUR = ["Até 300 €", "300 – 600 €", "600 – 1.000 €", "1.000 – 2.000 €", "+2.000 €"];
const BUDGETS_BRL = [
  "Até R$ 1.500",
  "R$ 1.500 – 3.000",
  "R$ 3.000 – 6.000",
  "R$ 6.000 – 12.000",
  "+R$ 12.000",
];
const TIMELINE = ["Imediato", "Nas próximas 2 semanas", "Próximo mês", "Ainda a explorar"];

const STEPS = ["Perfil", "Objetivos", "Referências & Media", "Orçamento"];

const labelCls = "eyebrow block";
const inputCls =
  "mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

function Choice({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2.5">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors " +
              (active
                ? "border-gold bg-champagne/50 text-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-secondary")
            }
          >
            {active && <Check className="h-3.5 w-3.5 text-gold" />}
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Briefing() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(empty);
  const [files, setFiles] = useState<File[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch {
      toast.error("Não foi possível acessar o microfone. Pode enviar um ficheiro de áudio.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  function validateStep() {
    if (step === 0 && (!form.full_name.trim() || !form.instagram_handle.trim())) {
      toast.error("Indique o seu nome e o @ do Instagram.");
      return false;
    }
    if (step === 1 && !form.main_need) {
      toast.error("Selecione o que mais precisa hoje.");
      return false;
    }
    return true;
  }

  async function submit() {
    if (!form.full_name.trim()) {
      toast.error("O nome é obrigatório.");
      return;
    }
    setSubmitting(true);
    try {
      const folder = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const uploaded: { name: string; path: string; type: string }[] = [];

      for (const file of files) {
        const path = `${folder}/${file.name.replace(/[^\w.\-]/g, "_")}`;
        const { error } = await supabase.storage.from("briefing-media").upload(path, file);
        if (error) throw new Error(error.message);
        uploaded.push({ name: file.name, path, type: file.type });
      }

      let audioPath: string | null = null;
      if (audioBlob) {
        audioPath = `${folder}/mensagem-de-voz.webm`;
        const { error } = await supabase.storage
          .from("briefing-media")
          .upload(audioPath, audioBlob, { contentType: audioBlob.type || "audio/webm" });
        if (error) throw new Error(error.message);
      }

      const { error } = await supabase.from("briefings").insert({
        ...form,
        files: uploaded,
        audio_url: audioPath,
      });
      if (error) throw new Error(error.message);

      setDone(true);
      window.scrollTo({ top: 0 });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao enviar o diagnóstico.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center lg:px-8">
        <CheckCircle2 className="mx-auto h-14 w-14 text-gold" />
        <h1 className="mt-8 font-display text-4xl text-foreground">Diagnóstico recebido</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Obrigada, {form.full_name.split(" ")[0]}. Vou analisar o seu perfil, referências e áudio e
          preparar uma proposta com escopo e investimento personalizados.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl(
              `Olá Rayana! Acabei de submeter o meu diagnóstico. Nome: ${form.full_name}. Instagram: ${form.instagram_handle}`,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-xs uppercase tracking-[0.18em] text-primary-foreground"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Avisar Rayana no WhatsApp{" "}
            {CONTACT.phoneDisplay}
          </a>
          <Link
            to="/pagamentos"
            className="inline-flex items-center justify-center rounded-full border border-primary/20 px-7 py-4 text-xs uppercase tracking-[0.18em] text-foreground hover:bg-secondary"
          >
            Ver dados de pagamento
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
      <p className="eyebrow">Briefing inteligente</p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-foreground lg:text-5xl">
        Questionário de diagnóstico
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Quatro passos, cerca de 5 minutos. Quanto mais detalhe, mais precisa será a proposta.
      </p>

      <div className="mt-10 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <div key={s}>
            <div
              className={
                "h-0.5 w-full " + (i <= step ? "bg-gold" : "bg-border")
              }
            />
            <p
              className={
                "mt-3 text-[0.65rem] uppercase tracking-[0.16em] " +
                (i <= step ? "text-foreground" : "text-muted-foreground")
              }
            >
              {i + 1}. {s}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-9">
        {step === 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Nome completo *">
              <input
                className={inputCls}
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                placeholder="Ex: Ana Martins"
              />
            </Field>
            <Field label="Nome da marca / negócio">
              <input
                className={inputCls}
                value={form.brand_name}
                onChange={(e) => set("brand_name", e.target.value)}
                placeholder="Ex: Studio Ana"
              />
            </Field>
            <Field label="Instagram (@username) *">
              <input
                className={inputCls}
                value={form.instagram_handle}
                onChange={(e) => set("instagram_handle", e.target.value)}
                placeholder="@studioana"
              />
            </Field>
            <Field label="Website / link da página">
              <input
                className={inputCls}
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://"
              />
            </Field>
            <Field label="Nicho / setor">
              <input
                className={inputCls}
                value={form.niche}
                onChange={(e) => set("niche", e.target.value)}
                placeholder="Ex: Estética, moda, consultoria"
              />
            </Field>
            <Field label="WhatsApp ou e-mail de contacto">
              <input
                className={inputCls}
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
                placeholder="+351 ... / email@dominio.com"
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-8">
            <div>
              <span className={labelCls}>O que mais precisa hoje? *</span>
              <Choice options={NEEDS} value={form.main_need} onChange={(v) => set("main_need", v)} />
            </div>
            <div>
              <span className={labelCls}>Com que frequência publica atualmente?</span>
              <Choice
                options={FREQUENCY}
                value={form.post_frequency}
                onChange={(v) => set("post_frequency", v)}
              />
            </div>
            <div>
              <span className={labelCls}>Como está estruturada a equipa?</span>
              <Choice
                options={TEAM}
                value={form.team_structure}
                onChange={(v) => set("team_structure", v)}
              />
            </div>
            <Field label="Conte-me com detalhe a sua situação atual e objetivos">
              <textarea
                rows={6}
                className={inputCls}
                value={form.needs_details}
                onChange={(e) => set("needs_details", e.target.value)}
                placeholder="O que já tentou, o que funciona, o que trava as vendas..."
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-8">
            <Field label="Perfis de referência ou concorrentes (um por linha)">
              <textarea
                rows={4}
                className={inputCls}
                value={form.reference_links}
                onChange={(e) => set("reference_links", e.target.value)}
                placeholder="@perfil_referencia&#10;https://instagram.com/..."
              />
            </Field>

            <div>
              <span className={labelCls}>Ficheiros (logo, fotos, vídeos de exemplo)</span>
              <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gold/60 bg-muted/30 px-6 py-10 text-center">
                <Upload className="h-6 w-6 text-gold" />
                <span className="mt-3 text-sm text-foreground">Clique para selecionar</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  Imagens, PDFs ou vídeos curtos
                </span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => setFiles((f) => [...f, ...Array.from(e.target.files ?? [])])}
                />
              </label>
              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-background px-4 py-3"
                    >
                      <span className="truncate text-sm text-foreground">{f.name}</span>
                      <button
                        type="button"
                        aria-label="Remover ficheiro"
                        onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <span className={labelCls}>Mensagem de voz (explique na sua própria voz)</span>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {recording ? (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-3 text-xs uppercase tracking-[0.18em] text-destructive-foreground"
                  >
                    <Square className="h-3.5 w-3.5" /> Parar gravação
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.18em] text-primary-foreground"
                  >
                    <Mic className="h-3.5 w-3.5" /> Gravar áudio
                  </button>
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/20 px-5 py-3 text-xs uppercase tracking-[0.18em] text-foreground hover:bg-secondary">
                  <Upload className="h-3.5 w-3.5" /> Enviar ficheiro de áudio
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setAudioBlob(f);
                      setAudioUrl(URL.createObjectURL(f));
                    }}
                  />
                </label>
              </div>
              {audioUrl && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <audio controls src={audioUrl} className="w-full max-w-sm" />
                  <button
                    type="button"
                    onClick={() => {
                      setAudioBlob(null);
                      setAudioUrl(null);
                    }}
                    className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-destructive"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-8">
            <div>
              <span className={labelCls}>Moeda</span>
              <Choice
                options={["EUR", "BRL"]}
                value={form.currency}
                onChange={(v) => set("currency", v)}
              />
            </div>
            <div>
              <span className={labelCls}>Investimento mensal previsto</span>
              <Choice
                options={form.currency === "BRL" ? BUDGETS_BRL : BUDGETS_EUR}
                value={form.budget_range}
                onChange={(v) => set("budget_range", v)}
              />
            </div>
            <div>
              <span className={labelCls}>Quando quer começar?</span>
              <Choice
                options={TIMELINE}
                value={form.timeline}
                onChange={(v) => set("timeline", v)}
              />
            </div>
          </div>
        )}

        <div className="mt-10 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-3 text-xs uppercase tracking-[0.18em] text-foreground disabled:opacity-40"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => validateStep() && setStep((s) => s + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.18em] text-primary-foreground"
            >
              Continuar <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={submit}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Submeter Diagnóstico
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
