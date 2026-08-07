import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, FileText, Loader2, Lock, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminLogin, saveContract } from "@/lib/admin.functions";
import { CONTACT } from "@/lib/site";

export const Route = createFileRoute("/admin/contrato")({
  head: () => ({
    meta: [
      { title: "Gerador de Contratos | Rayana Oliveira" },
      {
        name: "description",
        content: "Gerador interno de propostas e contratos de gestão de redes sociais.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Gerador de Contratos | Rayana Oliveira" },
      { property: "og:description", content: "Ferramenta interna de contratos." },
    ],
  }),
  component: Contrato,
});

const STORAGE_KEY = "rayana-admin-pass";

const initial = {
  client_name: "",
  tax_id: "",
  monthly_investment: "600",
  currency: "EUR",
  deliverables: "12 Reels + 20 Stories + Gestão de Comentários",
  duration_months: 3,
  start_date: new Date().toISOString().slice(0, 10),
  notes: "",
};

function Contrato() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initial);
  const login = useServerFn(adminLogin);
  const save = useServerFn(saveContract);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      login({ data: { password: saved } })
        .then(() => setAuthed(true))
        .catch(() => sessionStorage.removeItem(STORAGE_KEY));
    }
  }, [login]);

  async function tryLogin() {
    setChecking(true);
    try {
      await login({ data: { password } });
      sessionStorage.setItem(STORAGE_KEY, password);
      setAuthed(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Palavra-passe incorreta.");
    } finally {
      setChecking(false);
    }
  }

  async function persist() {
    setSaving(true);
    try {
      await save({ data: { password, ...form } });
      toast.success("Contrato guardado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  }

  const symbol = form.currency === "BRL" ? "R$" : "€";

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-20">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-champagne/50">
            <Lock className="h-5 w-5 text-foreground" />
          </span>
          <h1 className="mt-6 font-display text-3xl text-foreground">Gerador de contratos</h1>
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              void tryLogin();
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Palavra-passe"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={checking}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-60"
            >
              {checking && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const inputCls =
    "mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold";

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground print:hidden"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar aos briefings
      </Link>

      <h1 className="mt-6 font-display text-4xl text-foreground print:hidden">
        Gerador de propostas e contratos
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-border bg-card p-7 print:hidden">
          <p className="eyebrow">Dados do contrato</p>
          <div className="mt-5 grid gap-5">
            <label className="block">
              <span className="eyebrow">Nome do cliente</span>
              <input
                className={inputCls}
                value={form.client_name}
                onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                placeholder="Ex: Studio Ana, Lda."
              />
            </label>
            <label className="block">
              <span className="eyebrow">NIF / CPF</span>
              <input
                className={inputCls}
                value={form.tax_id}
                onChange={(e) => setForm({ ...form, tax_id: e.target.value })}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="eyebrow">Investimento mensal</span>
                <input
                  className={inputCls}
                  value={form.monthly_investment}
                  onChange={(e) => setForm({ ...form, monthly_investment: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="eyebrow">Moeda</span>
                <select
                  className={inputCls}
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="BRL">BRL (R$)</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="eyebrow">Entregáveis</span>
              <textarea
                rows={3}
                className={inputCls}
                value={form.deliverables}
                onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="eyebrow">Duração</span>
                <select
                  className={inputCls}
                  value={form.duration_months}
                  onChange={(e) =>
                    setForm({ ...form, duration_months: Number(e.target.value) })
                  }
                >
                  {[3, 6, 12].map((m) => (
                    <option key={m} value={m}>
                      {m} meses
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="eyebrow">Início</span>
                <input
                  type="date"
                  className={inputCls}
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </label>
            </div>
            <label className="block">
              <span className="eyebrow">Notas / cláusulas extra</span>
              <textarea
                rows={3}
                className={inputCls}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.16em] text-primary-foreground"
            >
              <FileText className="h-3.5 w-3.5" /> Gerar Contrato Pronto a Assinar
            </button>
            <button
              type="button"
              disabled={saving || !form.client_name}
              onClick={persist}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-3 text-xs uppercase tracking-[0.16em] text-foreground hover:bg-secondary disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Guardar
            </button>
          </div>
        </div>

        <article className="rounded-2xl border border-border bg-card p-8 leading-relaxed lg:p-10">
          <p className="eyebrow">Contrato de prestação de serviços</p>
          <h2 className="mt-3 font-display text-3xl text-foreground">
            Gestão de Redes Sociais — Instagram
          </h2>
          <div className="gold-rule mt-4" />

          <div className="mt-7 space-y-5 text-sm text-foreground">
            <p>
              <strong>PRESTADOR:</strong> {CONTACT.name}, Social Media Specialist, com contacto{" "}
              {CONTACT.phoneDisplay}, {CONTACT.location}.
            </p>
            <p>
              <strong>CLIENTE:</strong> {form.client_name || "________________"}, NIF/CPF{" "}
              {form.tax_id || "____________"}.
            </p>
            <p>
              <strong>1. Objeto.</strong> O Prestador obriga-se a executar serviços de gestão de
              redes sociais para o Cliente, compreendendo:{" "}
              {form.deliverables || "________________"}.
            </p>
            <p>
              <strong>2. Prazo.</strong> O presente contrato tem a duração de{" "}
              {form.duration_months} meses, com início a {form.start_date}, renovável por acordo
              escrito entre as partes.
            </p>
            <p>
              <strong>3. Investimento.</strong> O Cliente pagará ao Prestador o valor mensal de{" "}
              {symbol} {form.monthly_investment || "____"}, devido até ao dia 5 de cada mês, por MB
              WAY, transferência bancária (IBAN {CONTACT.iban}) ou Pix.
            </p>
            <p>
              <strong>4. Obrigações do Cliente.</strong> Fornecer acessos, materiais de marca e
              aprovações de conteúdo em prazo não superior a 48 horas, sob pena de reagendamento do
              calendário editorial.
            </p>
            <p>
              <strong>5. Propriedade intelectual.</strong> Os conteúdos produzidos são licenciados
              ao Cliente para uso nas suas redes sociais; o Prestador reserva o direito de os
              utilizar em portfólio.
            </p>
            <p>
              <strong>6. Confidencialidade.</strong> Ambas as partes obrigam-se a manter sigilo
              sobre informações estratégicas e comerciais partilhadas.
            </p>
            <p>
              <strong>7. Cessação.</strong> Qualquer das partes pode denunciar o contrato com
              aviso prévio de 30 dias, mantendo-se devidas as prestações do mês em curso.
            </p>
            <p>
              <strong>8. Lei aplicável.</strong> Este contrato rege-se pela lei portuguesa, sendo
              competente o foro da comarca de Lisboa, sem prejuízo do Regulamento Geral de
              Proteção de Dados (RGPD).
            </p>
            {form.notes && (
              <p>
                <strong>9. Disposições adicionais.</strong> {form.notes}
              </p>
            )}
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <div>
              <div className="h-px bg-border" />
              <p className="mt-2 text-xs text-muted-foreground">{CONTACT.name} (Prestador)</p>
            </div>
            <div>
              <div className="h-px bg-border" />
              <p className="mt-2 text-xs text-muted-foreground">
                {form.client_name || "Cliente"} (Cliente)
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
