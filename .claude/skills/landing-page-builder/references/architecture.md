# Architecture — LP Builder System

> Documentação completa da arquitetura técnica do sistema.

---

## Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | Next.js (React) | SSR, API Routes, deploy fácil no Vercel |
| Chat UI | React + custom components | Controle total sobre UX do chat |
| AI Engine | Claude API (Anthropic) | Gera HTML das LPs com contexto rico |
| Preview | iframe sandbox | Renderiza HTML em tempo real, isolado |
| Deploy | Vercel API | Deploy automático, CDN global, domínios |
| Notificações | Webhook (n8n) | Avisar admin quando LP é aprovada/publicada |

---

## Estrutura do Projeto Next.js

```
lp-builder/
├── app/
│   ├── layout.tsx                    ← Layout raiz
│   ├── page.tsx                      ← Página principal (chat + preview)
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts             ← API: processa mensagens do chat via Claude
│   │   └── deploy/
│   │       └── route.ts             ← API: faz deploy no Vercel
│   └── globals.css
│
├── components/
│   ├── chat/
│   │   ├── ChatContainer.tsx         ← Container principal do chat
│   │   ├── MessageBubble.tsx         ← Bolha de mensagem (user/assistant)
│   │   ├── BrandSelector.tsx         ← Seletor de empresa (Templum/Evolutto/Orbit)
│   │   ├── QuickOptions.tsx          ← Botões de resposta rápida
│   │   └── ChatInput.tsx             ← Input de texto + botão enviar
│   ├── preview/
│   │   ├── PreviewPanel.tsx          ← Painel de preview da LP
│   │   ├── PreviewFrame.tsx          ← iframe que renderiza o HTML
│   │   └── ApprovalBar.tsx           ← Barra com botão "Aprovar" + "Pedir ajuste"
│   └── ui/
│       ├── LoadingDots.tsx           ← Indicador de "digitando..."
│       └── StatusBadge.tsx           ← Badge de status (gerando, preview, aprovado)
│
├── lib/
│   ├── claude.ts                     ← Client da Claude API (buildPrompt + sendMessage)
│   ├── brands.ts                     ← Carrega configs de marca
│   ├── deploy.ts                     ← Client da Vercel API
│   ├── session.ts                    ← Gerenciamento de sessão/estado
│   └── types.ts                      ← TypeScript types (Briefing, Message, etc.)
│
├── context/                          ← Contexto de engenharia (skills)
│   ├── brands/
│   │   ├── templum.md
│   │   ├── evolutto.md
│   │   └── orbit.md
│   ├── references/
│   │   ├── design-system.md
│   │   ├── tracking-integration.md
│   │   └── animations.md
│   └── prompts/
│       ├── system-prompt.md
│       ├── conversation-flow.md
│       └── generation-rules.md
│
├── public/
│   ├── logos/
│   │   ├── templum.svg
│   │   ├── evolutto.svg
│   │   └── orbit.svg
│   └── favicon.ico
│
├── .env.local                        ← Chaves de API (Claude, Vercel)
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Fluxo de Dados Detalhado

### 1. Inicialização

```
[Usuário acessa /]
    ↓
[Next.js SSR renderiza página]
    ↓
[React monta: ChatContainer + PreviewPanel]
    ↓
[ChatContainer exibe BrandSelector]
    ↓
[Usuário clica em empresa]
    ↓
[Frontend: setState({ brand: 'templum' })]
[Frontend: envia POST /api/chat com { brand, message: '__init__' }]
    ↓
[Backend: buildSystemPrompt('templum')]
  → Lê brands/templum.md
  → Lê prompts/system-prompt.md
  → Monta system prompt completo
    ↓
[Backend: Claude API call com system prompt]
    ↓
[Claude retorna mensagem de boas-vindas + primeira pergunta]
    ↓
[Frontend exibe no chat]
```

### 2. Coleta de Briefing

```
[Cada mensagem do usuário]
    ↓
[POST /api/chat]
  → body: { brand, messages: [...history], session_id }
    ↓
[Backend monta chamada Claude API]
  → system: system prompt completo (com brand context)
  → messages: histórico da conversa
    ↓
[Claude responde com próxima pergunta ou confirmação]
    ↓
[Frontend exibe resposta no chat]
```

### 3. Geração da LP

```
[Usuário confirma briefing]
    ↓
[Claude gera HTML completo na resposta]
    ↓
[Backend extrai HTML da resposta (regex: ```html ... ```)]
    ↓
[Frontend recebe { message, html }]
    ↓
[PreviewPanel renderiza HTML no iframe]
[Chat exibe mensagem de "pronta"]
[ApprovalBar aparece com opções]
```

### 4. Ajustes

```
[Usuário pede ajuste no chat]
    ↓
[POST /api/chat com histórico + pedido de ajuste]
    ↓
[Claude gera HTML atualizado completo]
    ↓
[Frontend atualiza preview]
```

### 5. Deploy

```
[Usuário clica "Aprovar" ou diz "aprovado"]
    ↓
[Frontend: POST /api/deploy]
  → body: { empresa, html, titulo, session_id }
    ↓
[Backend: Vercel API create deployment]
    ↓
[Backend: aguarda READY state]
    ↓
[Backend: notifica admin via webhook]
    ↓
[Frontend: exibe URL final no chat]
```

---

## API Routes — Especificação

### POST /api/chat

**Request:**
```typescript
{
  brand: 'templum' | 'evolutto' | 'orbit';
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  session_id: string;
}
```

**Response:**
```typescript
{
  message: string;          // Texto da resposta do assistente
  html?: string;            // HTML da LP (quando gerado/atualizado)
  status: 'briefing' | 'generated' | 'reviewing';
  briefing_progress?: {     // Progresso do briefing
    completed: string[];    // Etapas completadas
    next: string;           // Próxima etapa
    total: number;
  };
}
```

**Lógica do backend:**
1. Carrega system prompt + brand context
2. Se `html` no histórico anterior, inclui como contexto
3. Chama Claude API (streaming para UX)
4. Parseia resposta para extrair HTML se presente
5. Retorna mensagem + HTML separados

### POST /api/deploy

**Request:**
```typescript
{
  empresa: 'templum' | 'evolutto' | 'orbit';
  html: string;
  titulo: string;
  session_id: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  url: string;              // URL final (custom domain ou vercel)
  vercel_url: string;       // URL do Vercel
  deployment_id: string;
}
```

---

## Gerenciamento de Estado (Frontend)

```typescript
interface AppState {
  // Brand
  brand: 'templum' | 'evolutto' | 'orbit' | null;

  // Chat
  messages: Message[];
  isLoading: boolean;

  // LP
  currentHtml: string | null;
  lpVersion: number;

  // Status
  phase: 'select_brand' | 'briefing' | 'generating' | 'reviewing' | 'approved' | 'deploying' | 'deployed';

  // Deploy
  deployUrl: string | null;
  deploymentId: string | null;

  // Session
  sessionId: string;
}
```

Usar `useReducer` para gerenciar (mais previsível que múltiplos `useState`).

---

## Claude API — Configuração

```typescript
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function chat(systemPrompt: string, messages: Message[]) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250514',  // Bom custo-benefício para geração
    max_tokens: 16000,                     // HTML completo pode ser grande
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  });

  return response.content[0].text;
}
```

**Notas sobre modelo:**
- **Claude Sonnet 4.5**: Recomendado para produção (rápido, bom em HTML/CSS)
- **Claude Opus 4**: Para geração de copy mais elaborada (mais caro, mais criativo)
- **Max tokens 16000**: HTML completo de LP com tracking fica entre 8k-15k tokens

---

## Segurança

1. **API Keys**: Todas em `.env.local`, nunca no frontend
2. **Rate Limiting**: Implementar no `/api/chat` (ex: 20 req/min por session)
3. **Session Validation**: Validar session_id em cada request
4. **HTML Sanitization**: O HTML é gerado pela Claude, não pelo usuário — mas validar antes do deploy
5. **CORS**: Configurar para aceitar apenas o domínio da aplicação

---

## Custos Estimados

| Componente | Custo/mês (estimativa) |
|-----------|----------------------|
| Claude API (Sonnet) | ~$30-50 (100 LPs/mês, ~5 msgs cada) |
| Vercel (Pro) | $20 |
| Domínios | Já existentes |
| **Total** | **~$50-70/mês** |

---

## Próximos Passos (Roadmap)

### MVP (Fase 1)
- [ ] Chat funcional com coleta de briefing
- [ ] Geração de LP via Claude API
- [ ] Preview em iframe
- [ ] Deploy manual (botão gera HTML, admin faz deploy)

### V1 (Fase 2)
- [ ] Deploy automático Vercel
- [ ] 3 empresas configuradas com brand guides completos
- [ ] Notificação ao admin
- [ ] Histórico de LPs geradas

### V2 (Fase 3)
- [ ] Autenticação (login por empresa)
- [ ] Dashboard admin com todas as LPs
- [ ] Edição visual (drag & drop de seções)
- [ ] Templates pré-prontos por empresa
- [ ] A/B testing integrado
