---
name: componentes-ui
description: >
  Criar e editar componentes React do Funil Mascarado seguindo os padrões do projeto.
  Use esta skill sempre que precisar criar um componente novo, modificar um existente,
  adicionar elementos de UI, trabalhar com componentes shadcn/ui, ou estruturar
  componentes reutilizáveis. Também use quando discutir layout, responsividade,
  animações CSS, ou organização de componentes dentro do projeto.
---

# Componentes UI — Padrões e Criação

## Organização de componentes

```
src/components/
├── ui/          → shadcn/ui (não editar manualmente — usar CLI do shadcn)
├── call/        → Componentes da experiência de chamada telefônica
├── whatsapp/    → Componentes da experiência WhatsApp
└── NavLink.tsx  → Componentes soltos (navegação, etc.)
```

Ao criar um novo componente, coloque-o na subpasta temática correta. Se for um componente genérico que não pertence a nenhuma experiência específica, coloque direto em `src/components/`.

## Padrão de componente

Componentes do projeto seguem este estilo consistente:

```tsx
import { ComponentProps } from "react";

interface MeuComponenteProps {
  label: string;
  onClick?: () => void;
  visible?: boolean;
  className?: string;
}

export const MeuComponente = ({ label, onClick, visible = true, className = "" }: MeuComponenteProps) => {
  if (!visible) return null;

  return (
    <div className={`base-classes ${className}`}>
      {/* conteúdo */}
    </div>
  );
};
```

### Convenções

- **Named exports** para componentes reutilizáveis (`export const NomeComponente`)
- **Default export** apenas para páginas (`export default NomePagina`)
- Props tipadas com `interface` (não `type`)
- Desestruturar props no parâmetro da função
- Valores default inline: `visible = true`
- Aceitar `className` para customização externa

## Componentes existentes

### Call (`src/components/call/`)

| Componente | Função | Props principais |
|-----------|--------|-----------------|
| `StatusBarFake` | Barra de status iOS fake (hora, wifi, bateria) | — |
| `CallerHeader` | Avatar + nome + label do caller | `name`, `label`, `avatar` |
| `CallTimer` | Timer mm:ss da chamada | `duration` (seconds) |
| `ActionGrid` | Grid 3x2 de ações (mute, keypad, speaker...) | — |
| `HangupButton` | Botão vermelho de desligar | `onHangup` |
| `TranscriptOverlay` | Overlay com transcrição ao vivo | `lines`, `currentTime` |
| `OpenWhatsAppCTA` | CTA slide-up para abrir WhatsApp | `onClick`, `visible` |
| `TikTokIcon` | Ícone SVG do TikTok | `className` |

### WhatsApp (`src/components/whatsapp/`)

| Componente | Função | Props principais |
|-----------|--------|-----------------|
| `WhatsAppHeader` | Header verde com avatar, nome e status | `name`, `status`, `avatar` |
| `MessageBubble` | Bolha de mensagem (user ou eva) | `text`, `sender`, `delivered`, `read` |
| `TypingIndicator` | Animação "digitando..." | — |
| `QuickReplyButtons` | Botões de resposta rápida | `choices`, `onSelect`, `visible` |
| `WhatsAppInput` | Input de mensagem (desabilitado neste funil) | `value`, `onChange`, `onSend`, `disabled` |

## Estilização

### Tailwind-first
Sem CSS modules ou styled-components. Tudo via classes Tailwind diretamente no JSX.

### Utilitário `cn()`
Para merge condicional de classes, usar `cn()` de `@/lib/utils`:
```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)} />
```

### Responsividade mobile-first
O funil é pensado para mobile com breakpoint `sm:` para ajustes desktop:
```tsx
<div className="w-14 h-14 sm:w-[72px] sm:h-[72px]">
<span className="text-xs sm:text-sm">
```

### Animações inline
Para animações específicas, usar `<style>` tag dentro do componente (padrão do projeto):
```tsx
<style>{`
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
  }
`}</style>
```

## shadcn/ui

O projeto usa 48 componentes shadcn/ui em `src/components/ui/`. Para adicionar um novo:

```bash
npx shadcn@latest add nome-do-componente
```

Os componentes shadcn seguem a config de `components.json`:
- Estilo: `default`
- Aliases: `@/components`, `@/lib/utils`, `@/components/ui`, `@/hooks`

## Ícones

Usar **Lucide React** para todos os ícones:
```tsx
import { Phone, MessageSquare, Heart } from "lucide-react";
<Phone className="w-6 h-6 text-foreground" />
```

Para ícones customizados (como TikTok), criar componente SVG em `src/components/call/` ou pasta relevante.
