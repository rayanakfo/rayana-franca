import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  Copy,
  CreditCard,
  Landmark,
  QrCode,
  Smartphone,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CONTACT } from "@/lib/site";

export const Route = createFileRoute("/pagamentos")({
  head: () => ({
    meta: [
      { title: "Pagamentos & Dados Bancários | Rayana Oliveira" },
      {
        name: "description",
        content:
          "Formas de pagamento para clientes na Europa e no Brasil: MB WAY, transferência IBAN, SEPA, cartão, Pix e PayPal.",
      },
      { property: "og:title", content: "Pagamentos & Dados Bancários | Rayana Oliveira" },
      {
        property: "og:description",
        content: "Hub transparente de pagamentos para clientes de gestão de redes sociais.",
      },
    ],
  }),
  component: Pagamentos,
});

function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          toast.success(`${label} copiado`);
          setTimeout(() => setDone(false), 2000);
        } catch {
          toast.error("Não foi possível copiar");
        }
      }}
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-secondary"
    >
      {done ? <Check className="h-3.5 w-3.5 text-gold" /> : <Copy className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}

function Row({
  title,
  value,
  copyLabel,
  copyValue,
}: {
  title: string;
  value: string;
  copyLabel?: string;
  copyValue?: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-background px-5 py-4">
      <div className="min-w-0">
        <p className="eyebrow">{title}</p>
        <p className="mt-1 break-words font-display text-lg text-foreground">{value}</p>
      </div>
      {copyLabel && copyValue ? <CopyButton label={copyLabel} value={copyValue} /> : null}
    </div>
  );
}

function Pagamentos() {
  const [installments, setInstallments] = useState(3);
  const [amount, setAmount] = useState(1200);
  const perMonth = (amount / installments).toFixed(2);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
      <p className="eyebrow">Pagamentos & Dados</p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-foreground lg:text-5xl">
        Formas de pagamento — Europa e Brasil
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Transparência total nos dados de faturação. Após confirmação do pagamento, envie o
        comprovativo por WhatsApp para ativarmos o mês de gestão.
      </p>

      <section className="surface-panel mt-10 rounded-2xl p-7 shadow-soft">
        <div className="flex items-start gap-4">
          <BadgeCheck className="mt-1 h-6 w-6 shrink-0 text-gold" />
          <div className="min-w-0">
            <h2 className="font-display text-2xl text-foreground">
              Rayana Oliveira — Social Media Services
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Prestação de serviços de gestão de redes sociais · {CONTACT.location} · Contacto:{" "}
              {CONTACT.phoneDisplay} · {CONTACT.email}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center gap-3">
          <Landmark className="h-5 w-5 text-gold" />
          <h2 className="font-display text-2xl text-foreground">Europa / Portugal</h2>
        </div>
        <div className="gold-rule mt-4" />
        <div className="mt-6 grid gap-4">
          <Row
            title="MB WAY (transferência imediata)"
            value={CONTACT.mbway}
            copyLabel="Copiar Número"
            copyValue={CONTACT.phoneRaw}
          />
          <Row
            title="Transferência bancária europeia (IBAN)"
            value={CONTACT.iban}
            copyLabel="Copiar IBAN"
            copyValue={CONTACT.iban.replace(/\s/g, "")}
          />
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-gold" />
              <p className="eyebrow">Cartão de crédito/débito & Débito Direto SEPA</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <input
                disabled
                placeholder="Número do cartão · 4242 4242 4242 4242"
                className="rounded-lg border border-input bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
              />
              <input
                disabled
                placeholder="MM / AA · CVC"
                className="rounded-lg border border-input bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
              />
              <input
                disabled
                placeholder="IBAN para Débito Direto SEPA"
                className="rounded-lg border border-input bg-muted/50 px-4 py-3 text-sm text-muted-foreground sm:col-span-2"
              />
            </div>
            <button
              type="button"
              onClick={() => toast.info("Checkout seguro em ativação. Use MB WAY ou IBAN por agora.")}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.18em] text-primary-foreground"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Pagar com cartão / SEPA
            </button>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-center gap-3">
          <Smartphone className="h-5 w-5 text-gold" />
          <h2 className="font-display text-2xl text-foreground">Brasil / Internacional</h2>
        </div>
        <div className="gold-rule mt-4" />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <QrCode className="h-4 w-4 text-gold" />
              <p className="eyebrow">Pix</p>
            </div>
            <div className="mt-5 grid place-items-center rounded-xl border border-dashed border-gold/50 bg-muted/40 py-10">
              <QrCode className="h-20 w-20 text-muted-foreground" />
              <p className="mt-3 text-xs text-muted-foreground">QR Code Pix (placeholder)</p>
            </div>
            <p className="mt-5 break-words font-display text-lg text-foreground">
              {CONTACT.pixKey}
            </p>
            <div className="mt-4">
              <CopyButton label="Copiar chave Pix" value={CONTACT.pixKey} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-gold" />
              <p className="eyebrow">Cartão internacional · simulação de parcelas</p>
            </div>
            <label className="mt-5 block text-sm text-muted-foreground">
              Valor total
              <input
                type="number"
                min={100}
                step={50}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground"
              />
            </label>
            <label className="mt-4 block text-sm text-muted-foreground">
              Parcelas
              <select
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground"
              >
                {[1, 2, 3, 6, 10, 12].map((i) => (
                  <option key={i} value={i}>
                    {i}x
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-5 rounded-lg bg-champagne/40 px-4 py-3 text-sm text-foreground">
              {installments}x de <strong>{perMonth}</strong> (sem juros simulados)
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => toast.info("Checkout PayPal em ativação.")}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-primary/20 px-5 py-3 text-xs uppercase tracking-[0.18em] text-foreground hover:bg-secondary"
              >
                PayPal
              </button>
              <button
                type="button"
                onClick={() => toast.info("Checkout Stripe em ativação.")}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.18em] text-primary-foreground"
              >
                Stripe Checkout
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
