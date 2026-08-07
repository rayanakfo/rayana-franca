# Rayana's Social Studio

Create a high-end, multi-page web platform and briefing system for a Social Media Specialist (Rayana Oliveira - Social Media & Instagram Management).

BRANDING & DESIGN SYSTEM:
- Style: Ultra-modern, elegant, minimalist, and authoritative creative studio aesthetic.
- Color Palette: Soft Nude / Champagne Rose accent (#E8C5B8), Warm Off-White (#FDFBF7), Deep Charcoal/Dark Slate text (#1A1A1A), and Brushed Gold highlights (#D4AF37).
- Navigation Style: STRICT MULTI-PAGE APPLICATION (NOT a single-page scrolling site). Every major feature must live on its own dedicated route (`/`, `/briefing`, `/pagamentos`, `/sobre`, `/admin`).

NAVIGATION BAR & HEADER:
- Desktop: Logo ("Rayana | Social Media Specialist"), Links ("Início", "Questionário / Briefing", "Pagamentos & Dados", "Sobre / Método"), CTA Button ("Iniciar Briefing").
- Mobile: Clean Hamburger Drawer menu with instant route switching.

PAGES & ROUTING STRUCTURE:

1. HOME PAGE (`/`):
- Hero Split Section:
  * Left Column: High-converting headline ("Eleve a presença e as vendas do seu negócio no Instagram com gestão estratégica de conteúdos."), subheadline, and direct CTA buttons ("Preencher Questionário de Diagnóstico" and "Falar no WhatsApp +351 916013962").
  * Right Column: Elegant portrait container/card for Rayana Oliveira with verified badge ("Especialista em Gestão de Redes Sociais").
- Highlight Cards: 3 core pillar cards (Estratégia de Conteúdo, Identidade Visual & Reels, Posicionamento de Marca).
- Process Preview: Step-by-step indicator (1. Diagnostic Briefing -> 2. Tailored Proposal & Contract -> 3. Onboarding & Growth).

2. SMART BRIEFING & DIAGNOSTIC QUESTIONNAIRE PAGE (`/briefing`):
Interactive multi-step form to analyze prospective clients, extract exact scope, and calculate custom pricing:
- Step 1: Client Profile (Name, Brand/Business Name, Instagram Handle `@username`, Website/Page Link, Niche/Industry).
- Step 2: Objectives & Current Situation (Predefined radio options + long text area):
  * "O que mais precisa hoje?" (Ex: Aumentar vendas, Melhorar estética, Criar Reels virais, Falta de tempo).
  * Current posting frequency & team structure.
- Step 3: References & Media Uploads:
  * Input for Instagram page references or competitor links.
  * File Upload Component (allows uploading sample photos, logo, or short video examples).
  * Audio Message Input: Native browser audio recorder component (or audio file uploader) so the client can record an explanation in their own voice.
- Step 4: Budget Bracket & Timeline (Expectation range in € or R$).
- Action: "Submeter Diagnóstico" -> Saves all data, audio, links, and uploaded files directly into Supabase and redirects client to a confirmation screen with a "Avisar Rayana no WhatsApp +351 916013962" button.

3. PAYMENT & BANKING INFORMATION PAGE (`/pagamentos`):
Dedicated transparent payment hub for active and onboarding clients with Europe & Brazil payment options:
- Professional Details Card: Rayana Oliveira Social Media Services.
- Europe / Portugal Payment Options:
  * MB WAY: Direct transfer to phone number (+351 916 013 962). Includes a "Copiar Número" button.
  * European Bank Transfer (IBAN): PT50 3560 0001 9001 8253 7185 8 (Includes "Copiar IBAN" button).
  * Credit/Debit Cards & SEPA Direct Debit mock interface.
- Brazil / International Payment Options:
  * Pix (with QR Code placeholder & Copy-Paste Pix key).
  * Credit Card (International & Brazilian cards installment simulation).
  * PayPal & Stripe Checkout UI Integration buttons.

4. PROTECTED ADMIN DASHBOARD (`/admin`):
- Login Screen: Simple password authentication for Rayana (senha - Deusefiel1234).
- Lead & Briefing Management System:
  * Table view listing submitted client briefings with status badge (Novo, Em Análise, Proposta Enviada, Fechado).
  * Detailed View Modal: Shows all answers, playable audio player for client voice notes, clickable Instagram/Page links, and downloadable image/video files.
  * Action Bar per Lead:
    - Button: "Copiar Resumo" (Copies clean text formatted for notes).
    - Button: "Partilhar no WhatsApp" (Formats briefing summary directly to WhatsApp Web).
    - Button: "Subir / Guardar no Google Drive" (Mock trigger/export option).
    - Button: "Exportar PDF / DOCX".
- Contract & Proposal Generator (`/admin/contrato`):
  * Dynamic contract template tailored for Social Media Services in Portugal/Europe.
  * Editable fields: Client Name, NIF/CPF, Monthly Investment (€/R$), Deliverables (e.g., "12 Reels + 20 Stories + Gestão de Comentários"), Contract Duration (3, 6, 12 months).
  * "Gerar Contrato Pronto a Assinar" button (Exports clean formatted PDF or shareable link).

TECHNICAL SPECIFICATIONS:
- Framework: React + Vite + Tailwind CSS + Lucide Icons.
- Database: Supabase for storing lead briefings, uploaded media files/audio blobs, and contract settings.
- Responsiveness: Mobile-first responsive layout with clean tab bar/hamburger drawer.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://rayana-franca.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a8a88ef7-1ab4-46fd-93ee-f0d126a25427).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
