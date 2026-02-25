# Funil Mascarado — Contexto do Projeto

## O que é

Funil de vendas interativo para a **Evolutto** — uma plataforma de sistema operacional para consultorias. O funil simula experiências imersivas no celular do lead (chamada telefônica, WhatsApp, TikTok, interface hacker) para conduzi-lo até a página de vendas.

A personagem central é a **Eva**, uma "agente" da Evolutto que faz contato com o lead como se estivesse revelando um segredo.

## Stack

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS 3** com classes customizadas (iOS, WhatsApp, Evolutto)
- **shadcn/ui** (48 componentes em `src/components/ui/`)
- **React Router DOM 6** para rotas
- **Lucide React** para ícones
- **Sonner** para toasts
- Projeto originado no **Lovable** (tem `lovable-tagger` no devDependencies)

## Alias de imports

O Vite resolve `@` para `./src`. Sempre use `@/` nos imports:
- `@/components/ui/*` — shadcn/ui
- `@/components/call/*` — componentes da chamada
- `@/components/whatsapp/*` — componentes do WhatsApp
- `@/pages/*` — páginas/rotas
- `@/hooks/*` — custom hooks
- `@/lib/utils` — utilitário `cn()` (clsx + tailwind-merge)
- `@/data/*` — dados estáticos (mensagens, transcrição)

## Fluxo do funil (7 rotas)

```
/ (IncomingCall) → /chamada-ativa → /exp-2-revelacao → /hacker-login → /hacker-loading → /tiktok-privado → /sales
```

1. **`/`** — Tela de ligação recebida (ringtone, vibração, avatar pulsando)
2. **`/chamada-ativa`** — Chamada em andamento com timer e transcrição
3. **`/exp-2-revelacao`** — Chat WhatsApp com Eva (mensagens sequenciais + escolhas)
4. **`/hacker-login`** — Tela estilo terminal com senha para "desbloquear"
5. **`/hacker-loading`** — Loading animado estilo hacker
6. **`/tiktok-privado`** — Interface TikTok com slides de conteúdo + comentários
7. **`/sales`** — Página de vendas final da Evolutto

## Padrões importantes

### Transições entre páginas
Todas as páginas usam `animate-fade-out` + `setTimeout` + `navigate()`:
```tsx
const [isTransitioning, setIsTransitioning] = useState(false);
const handleNext = useCallback(() => {
  if (isTransitioning) return;
  setIsTransitioning(true);
  setTimeout(() => navigate("/proxima-rota"), 300);
}, [navigate, isTransitioning]);
```

### Container mobile-first
Todas as páginas usam max-width de iPhone:
```tsx
<div className="w-full max-w-[390px] h-[100dvh] mx-auto flex flex-col">
```

### Assets estáticos
Ficam em `public/` e são referenciados com path absoluto:
```tsx
const evaAvatar = "/eva-avatar.png";
const audio = new Audio("/ringtone.webm");
```

### Dados do funil
- `src/data/transcriptLines.ts` — Falas da Eva durante a chamada (60 linhas com timing)
- `src/data/whatsappMessages.ts` — Mensagens do WhatsApp (58 mensagens sequenciais)

## Produto vendido

**Evolutto** — Sistema operacional para consultorias. A narrativa do funil é:
- Consultorias usam ferramentas genéricas (CRM, Notion, Slack, planilhas)
- Nenhuma resolve o "todo" — falta um sistema pensado para consultoria
- Eva "revela o protocolo" que é a Evolutto
- O CEO é o gargalo quando não tem sistema — Evolutto liberta o CEO

## Cores customizadas (tailwind.config.ts)

- **iOS**: gray, red (#FF3B30), green (#34C759), blue (#007AFF)
- **WhatsApp**: green (#075E54), bubbleUser (#DCF8C6), gray (#667781)
- **Evolutto**: primary, dark, accent (CSS variables)

---

## Skills de Landing Page (contexto separado)

O projeto também contém skills para **criação de Landing Pages para clientes** — um contexto totalmente separado do Funil Mascarado. Essas skills NÃO modificam o funil.

### landing-page-builder
Skill para gerar LPs completas em HTML + CSS puro (single-file), com tracking integrado, design system próprio e biblioteca de seções reutilizáveis. Inclui references para:
- `design-system.md` — CSS variables, tipografia, componentes, paletas de cores
- `section-library.md` — 16 seções modulares com HTML templates
- `animations.md` — Catálogo de efeitos visuais (scroll reveal, hover, canvas)
- `tracking-integration.md` — Script completo de rastreamento (UTMs, clicks, sessão)
- `base-structure.html` — Esqueleto HTML com placeholders
- `architecture.md` — Arquitetura do LP Builder (Next.js + Claude API + Vercel)

### gtm-tracking-completo
Skill self-contained com toda a stack de tracking: GTM Web + Server Container → Supabase → n8n → Google Ads Enhanced Conversions → Meta CAPI → Pipedrive Offline Conversions. Cobre setup, troubleshooting, lead scoring e configuração por cliente.
