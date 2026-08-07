import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Copy,
  Download,
  ExternalLink,
  FileText,
  HardDriveUpload,
  Lock,
  Loader2,
  MessageCircle,
  RefreshCw,
  ScrollText,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { listLeads, updateLeadStatus, type AdminLead } from "@/lib/admin.functions";
import { STATUSES, whatsappUrl } from "@/lib/site";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Área Privada | Rayana Oliveira" },
      { name: "description", content: "Gestão de briefings e propostas de clientes." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Área Privada | Rayana Oliveira" },
      { property: "og:description", content: "Painel interno de gestão de leads." },
    ],
  }),
  component: Admin,
});

const STORAGE_KEY = "rayana-admin-pass";

function summary(l: AdminLead) {
  return [
    `BRIEFING — ${l.full_name}`,
    `Data: ${new Date(l.created_at).toLocaleString("pt-PT")}`,
    `Estado: ${l.status}`,
    `Marca: ${l.brand_name || "-"}`,
    `Instagram: ${l.instagram_handle || "-"}`,
    `Website: ${l.website || "-"}`,
    `Nicho: ${l.niche || "-"}`,
    `Contacto: ${l.contact || "-"}`,
    "",
    `Necessidade principal: ${l.main_need || "-"}`,
    `Frequência atual: ${l.post_frequency || "-"}`,
    `Equipa: ${l.team_structure || "-"}`,
    `Detalhes: ${l.needs_details || "-"}`,
    "",
    `Referências: ${l.reference_links || "-"}`,
    `Ficheiros: ${l.files.length}`,
    `Áudio: ${l.audio_url ? "sim" : "não"}`,
    "",
    `Orçamento: ${l.budget_range || "-"} (${l.currency || "-"})`,
    `Timeline: ${l.timeline || "-"}`,
  ].join("\n");
}

function statusTone(status: string) {
  switch (status) {
    case "Novo":
      return "bg-champagne/60 text-foreground";
    case "Em Análise":
      return "bg-gold/25 text-foreground";
    case "Proposta Enviada":
      return "bg-secondary text-foreground";
    default:
      return "bg-primary text-primary-foreground";
  }
}

function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [active, setActive] = useState<AdminLead | null>(null);

  const fetchLeads = useServerFn(listLeads);
  const setStatus = useServerFn(updateLeadStatus);

  const load = useCallback(
    async (pass: string) => {
      setLoading(true);
      try {
        const rows = await fetchLeads({ data: { password: pass } });
        setLeads(rows);
        setAuthed(true);
        sessionStorage.setItem(STORAGE_KEY, pass);
      } catch (e) {
        setAuthed(false);
        sessionStorage.removeItem(STORAGE_KEY);
        toast.error(e instanceof Error ? e.message : "Falha na autenticação.");
      } finally {
        setLoading(false);
      }
    },
    [fetchLeads],
  );

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      void load(saved);
    }
  }, [load]);

  async function changeStatus(lead: AdminLead, status: string) {
    try {
      await setStatus({ data: { password, id: lead.id, status } });
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
      setActive((prev) => (prev && prev.id === lead.id ? { ...prev, status } : prev));
      toast.success("Estado atualizado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar");
    }
  }

  function exportDoc(lead: AdminLead) {
    const html = `<html><head><meta charset="utf-8"></head><body><pre style="font-family:Georgia,serif">${summary(
      lead,
    )}</pre></body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `briefing-${lead.full_name.replace(/\s+/g, "-").toLowerCase()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-20">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-champagne/50">
            <Lock className="h-5 w-5 text-foreground" />
          </span>
          <h1 className="mt-6 font-display text-3xl text-foreground">Área privada</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Introduza a palavra-passe para acessar os briefings.
          </p>
          <form
            className="mt-7"
            onSubmit={(e) => {
              e.preventDefault();
              void load(password);
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
              disabled={loading}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-60"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <p className="eyebrow">Painel interno</p>
          <h1 className="mt-3 font-display text-4xl text-foreground">Briefings recebidos</h1>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => void load(password)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-foreground hover:bg-secondary"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Atualizar
          </button>
          <Link
            to="/admin/contrato"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-primary-foreground"
          >
            <ScrollText className="h-3.5 w-3.5" /> Contratos
          </Link>
        </div>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/50">
            <tr className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              <th className="px-5 py-4">Cliente</th>
              <th className="px-5 py-4">Instagram</th>
              <th className="px-5 py-4">Necessidade</th>
              <th className="px-5 py-4">Orçamento</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4">Data</th>
              <th className="px-5 py-4" />
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                  Ainda não há briefings submetidos.
                </td>
              </tr>
            )}
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-border/60 last:border-0">
                <td className="px-5 py-4">
                  <p className="font-display text-base text-foreground">{l.full_name}</p>
                  <p className="text-xs text-muted-foreground">{l.brand_name || "—"}</p>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{l.instagram_handle || "—"}</td>
                <td className="px-5 py-4 text-muted-foreground">{l.main_need || "—"}</td>
                <td className="px-5 py-4 text-muted-foreground">{l.budget_range || "—"}</td>
                <td className="px-5 py-4">
                  <span
                    className={
                      "inline-flex rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.14em] " +
                      statusTone(l.status)
                    }
                  >
                    {l.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  {new Date(l.created_at).toLocaleDateString("pt-PT")}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => setActive(l)}
                    className="rounded-full border border-primary/20 px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-foreground hover:bg-secondary"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{active.full_name}</DialogTitle>
              </DialogHeader>

              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void changeStatus(active, s)}
                    className={
                      "rounded-full px-3.5 py-2 text-[0.65rem] uppercase tracking-[0.14em] " +
                      (active.status === s
                        ? statusTone(s)
                        : "border border-border text-muted-foreground hover:bg-secondary")
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ["Marca", active.brand_name],
                  ["Nicho", active.niche],
                  ["Contacto", active.contact],
                  ["Necessidade", active.main_need],
                  ["Frequência", active.post_frequency],
                  ["Equipa", active.team_structure],
                  ["Orçamento", `${active.budget_range || "—"} ${active.currency || ""}`],
                  ["Timeline", active.timeline],
                ].map(([k, v]) => (
                  <div key={k as string} className="rounded-lg border border-border px-4 py-3">
                    <dt className="eyebrow">{k}</dt>
                    <dd className="mt-1 break-words text-foreground">{v || "—"}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-2 flex flex-wrap gap-3">
                {active.instagram_handle && (
                  <a
                    href={`https://instagram.com/${active.instagram_handle.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-foreground underline decoration-gold underline-offset-4"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Abrir Instagram
                  </a>
                )}
                {active.website && (
                  <a
                    href={active.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-foreground underline decoration-gold underline-offset-4"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Abrir website
                  </a>
                )}
              </div>

              {active.needs_details && (
                <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm leading-relaxed text-foreground">
                  {active.needs_details}
                </div>
              )}

              {active.reference_links && (
                <div>
                  <p className="eyebrow">Referências</p>
                  <pre className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                    {active.reference_links}
                  </pre>
                </div>
              )}

              {active.signedAudio && (
                <div>
                  <p className="eyebrow">Mensagem de voz</p>
                  <audio controls src={active.signedAudio} className="mt-2 w-full" />
                </div>
              )}

              {active.signedFiles.length > 0 && (
                <div>
                  <p className="eyebrow">Ficheiros</p>
                  <ul className="mt-2 space-y-2">
                    {active.signedFiles.map((f) => (
                      <li
                        key={f.name}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border px-4 py-3"
                      >
                        <span className="truncate text-sm text-foreground">{f.name}</span>
                        {f.url && (
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="inline-flex shrink-0 items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-foreground hover:text-gold"
                          >
                            <Download className="h-3.5 w-3.5" /> Descarregar
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(summary(active));
                    toast.success("Resumo copiado");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.16em] text-foreground hover:bg-secondary"
                >
                  <Copy className="h-3.5 w-3.5" /> Copiar Resumo
                </button>
                <a
                  href={whatsappUrl(summary(active))}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.16em] text-foreground hover:bg-secondary"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Partilhar no WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => toast.info("Exportação para Google Drive: em breve.")}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.16em] text-foreground hover:bg-secondary"
                >
                  <HardDriveUpload className="h-3.5 w-3.5" /> Guardar no Google Drive
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.16em] text-primary-foreground"
                >
                  <FileText className="h-3.5 w-3.5" /> Exportar PDF
                </button>
                <button
                  type="button"
                  onClick={() => exportDoc(active)}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.16em] text-foreground hover:bg-secondary"
                >
                  <Download className="h-3.5 w-3.5" /> Exportar DOCX
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
