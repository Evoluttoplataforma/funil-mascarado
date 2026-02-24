---
name: estrutura-funil
description: >
  Arquitetura completa do Funil Mascarado — fluxo de etapas, decisões técnicas,
  dependências e mapa de arquivos. Use esta skill sempre que precisar entender como
  o projeto está organizado, planejar mudanças estruturais, debugar problemas de
  navegação, adicionar ou remover etapas, ou quando um novo desenvolvedor/IA precisar
  de contexto completo do projeto. Também use para decisões sobre deploy, Git, ou
  configuração do build.
---

# Estrutura do Funil Mascarado

## Visão geral da arquitetura

```
funil-mascarado/
├── public/                          # Assets estáticos (servidos pela raiz)
│   ├── eva-avatar.png               # Avatar da Eva (2.2MB — considerar otimizar)
│   └── ringtone.webm                # Som de toque (187KB)
├── src/
│   ├── App.tsx                      # Router principal (todas as rotas)
│   ├── App.css                      # Estilos globais (ios-gradient, etc.)
│   ├── main.tsx                     # Entry point React
│   ├── index.css                    # Tailwind base + CSS variables
│   ├── vite-env.d.ts                # Tipos Vite
│   ├── pages/                       # Uma página por etapa do funil
│   │   ├── IncomingCall.tsx          # Etapa 1: Ligação recebida
│   │   ├── ChamadaAtiva.tsx          # Etapa 2: Chamada em andamento
│   │   ├── Exp2Revelacao.tsx         # Etapa 3: Chat WhatsApp com Eva
│   │   ├── HackerLogin.tsx           # Etapa 4: Login estilo terminal
│   │   ├── HackerLoading.tsx         # Etapa 5: Loading hacker
│   │   ├── TikTokPrivado.tsx         # Etapa 6: TikTok com slides
│   │   ├── SalesPage.tsx             # Etapa 7: Página de vendas
│   │   └── NotFound.tsx              # 404
│   ├── components/
│   │   ├── ui/                       # 48 componentes shadcn/ui
│   │   ├── call/                     # 8 componentes da experiência de chamada
│   │   ├── whatsapp/                 # 5 componentes da experiência WhatsApp
│   │   └── NavLink.tsx               # Componente de navegação
│   ├── hooks/
│   │   ├── use-mobile.tsx            # Detecção de mobile via media query
│   │   └── use-toast.ts             # Hook de toast (shadcn)
│   ├── lib/
│   │   └── utils.ts                 # cn() — clsx + tailwind-merge
│   └── data/
│       ├── transcriptLines.ts        # 61 linhas de transcrição da chamada
│       └── whatsappMessages.ts       # 58 mensagens + 2 choices
├── .claude/                          # Contexto e skills para IA
│   ├── CLAUDE.md                     # Contexto geral do projeto
│   ├── settings.json                 # Permissões
│   └── skills/                       # Skills customizadas
├── index.html                        # HTML entry (aponta para /src/main.tsx)
├── package.json                      # Dependências e scripts
├── vite.config.ts                    # Config Vite (alias @, porta 8080)
├── tailwind.config.ts                # Cores custom (iOS, WhatsApp, Evolutto)
├── tsconfig.json                     # TypeScript config
├── components.json                   # Config shadcn/ui
├── .gitignore                        # Ignora node_modules, dist, etc.
└── README.md                         # Documentação Lovable
```

## Mapa de rotas e dependências

```
Rota                  Página              Depende de                          Vai para
─────────────────────────────────────────────────────────────────────────────────────────
/                     IncomingCall        StatusBarFake, ringtone.webm        /chamada-ativa
/chamada-ativa        ChamadaAtiva        StatusBarFake, CallerHeader,        /exp-2-revelacao
                                          CallTimer, ActionGrid, HangupButton,
                                          OpenWhatsAppCTA, transcriptLines
/exp-2-revelacao      Exp2Revelacao       WhatsAppHeader, MessageBubble,      /hacker-login
                                          TypingIndicator, WhatsAppInput,
                                          QuickReplyButtons, TikTokIcon,
                                          whatsappMessages
/hacker-login         HackerLogin         (nenhum componente custom)          /hacker-loading
/hacker-loading       HackerLoading       (nenhum componente custom)          /tiktok-privado
/tiktok-privado       TikTokPrivado       (dados inline no componente)        /sales
/sales                SalesPage           (self-contained, 26KB)              evolutto.com
```

## Dependências externas principais

| Pacote | Uso | Versão |
|--------|-----|--------|
| react-router-dom | Navegação entre etapas | ^6.30 |
| lucide-react | Ícones em todo o projeto | ^0.462 |
| sonner | Toast notifications | ^1.7 |
| @tanstack/react-query | Query client (setup, pouco usado) | ^5.83 |
| tailwindcss-animate | Animações Tailwind | ^1.0 |
| lovable-tagger | DevDependency do Lovable (pode remover) | ^1.1 |

## Scripts disponíveis

```bash
npm run dev        # Dev server (porta 8080)
npm run build      # Build de produção
npm run build:dev  # Build de desenvolvimento
npm run lint       # ESLint
npm run preview    # Preview do build
```

## Decisões técnicas

### Por que tudo é client-side?
O funil é estático — não precisa de API, banco, ou server. Cada etapa é uma página React que roda inteiramente no browser. Isso simplifica o deploy (qualquer CDN serve) e mantém a experiência rápida.

### Por que max-w-[390px]?
O funil é pensado para mobile. 390px é a largura do iPhone 14/15. No desktop, ele centraliza numa coluna estreita que simula a tela de um celular.

### Por que dados hardcoded em /data/?
As mensagens da Eva e a transcrição da chamada são conteúdo estático. Não precisam vir de API — são parte do funil. Se quiser A/B testar variações, basta criar arquivos alternativos.

### Sobre o eva-avatar.png (2.2MB)
O arquivo é grande. Para produção, considere:
- Converter para WebP (~70% menor)
- Redimensionar para o tamanho máximo de exibição (120x120px = ~10KB)
- Usar `loading="lazy"` no `<img>`

## Fluxo Git recomendado

```bash
# Branch por feature
git checkout -b feat/nova-etapa

# Commits semânticos
git commit -m "feat(pages): add nova etapa do funil"
git commit -m "fix(whatsapp): corrige timing das mensagens"
git commit -m "style(sales): ajusta cores do CTA"

# Prefixos: feat, fix, style, refactor, docs, chore
```

## Deploy

O projeto é um SPA estático. Opções:
- **Vercel** — `npm run build` + deploy automático
- **Netlify** — Mesma coisa
- **GitHub Pages** — Precisa configurar base URL no vite.config

Para deploy, lembrar de redirecionar todas as rotas para `index.html` (SPA fallback).
Exemplo para Vercel (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Referências

Para detalhes adicionais, consultar:
- `references/fluxo-detalhado.md` — Descrição narrativa de cada etapa com timing
