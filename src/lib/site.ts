export const CONTACT = {
  name: "Rayana Oliveira",
  role: "Social Media Specialist",
  phoneDisplay: "+351 916 013 962",
  phoneRaw: "+351916013962",
  whatsappDigits: "351916013962",
  email: "rayana.socialmedia@gmail.com",
  iban: "PT50 3560 0001 9001 8253 7185 8",
  mbway: "+351 916 013 962",
  pixKey: "rayana.socialmedia@gmail.com",
  location: "Lisboa, Portugal",
};

export function whatsappUrl(message: string) {
  return `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { to: "/", label: "Início" },
  { to: "/briefing", label: "Questionário / Briefing" },
  { to: "/pagamentos", label: "Pagamentos & Dados" },
  { to: "/sobre", label: "Sobre / Método" },
] as const;

export const STATUSES = ["Novo", "Em Análise", "Proposta Enviada", "Fechado"] as const;
export type LeadStatus = (typeof STATUSES)[number];
