---
name: funil-pages
description: >
  Criar e editar páginas (etapas) do Funil Mascarado. Use esta skill sempre que precisar
  adicionar uma nova etapa ao funil, modificar uma página existente, ajustar copy de uma
  tela, mudar o fluxo de navegação entre etapas, ou trabalhar com transições e animações
  das páginas. Também use quando o contexto envolver rotas, navegação, ou qualquer
  referência a telas específicas do funil (IncomingCall, ChamadaAtiva, WhatsApp, Hacker,
  TikTok, SalesPage).
---

# Funil Pages — Criação e Edição de Etapas

## Contexto

O Funil Mascarado é um funil de vendas interativo com 7 etapas sequenciais. Cada etapa é uma página React que simula uma experiência mobile imersiva (chamada, WhatsApp, TikTok, etc.). A personagem central é a **Eva** — ela conduz o lead pelo funil.

## Fluxo atual

```
/ (IncomingCall) → /chamada-ativa → /exp-2-revelacao → /hacker-login → /hacker-loading → /tiktok-privado → /sales
```

Cada página é um componente em `src/pages/` e a rota é definida em `src/App.tsx`.

## Como criar uma nova página

### 1. Criar o componente em `src/pages/NomeDaPagina.tsx`

Seguir este esqueleto — ele já contém todos os padrões do projeto:

```tsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const NomeDaPagina = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/proxima-rota");
    }, 300);
  }, [navigate, isTransitioning]);

  return (
    <div
      className={`min-h-[100dvh] max-w-[100vw] overflow-hidden flex flex-col ${
        isTransitioning ? "animate-fade-out" : ""
      }`}
    >
      <div className="w-full max-w-[390px] h-[100dvh] mx-auto flex flex-col relative overflow-hidden">
        {/* Conteúdo aqui */}
      </div>
    </div>
  );
};

export default NomeDaPagina;
```

### 2. Registrar a rota em `src/App.tsx`

```tsx
import NomeDaPagina from "./pages/NomeDaPagina";
// ...
<Route path="/nova-rota" element={<NomeDaPagina />} />
```

### 3. Conectar no fluxo

Atualizar o `navigate()` da página anterior para apontar para a nova rota, e o da nova página para apontar para a próxima.

## Padrões obrigatórios

### Container mobile-first
Todas as páginas usam `max-w-[390px]` (largura de iPhone) com `h-[100dvh]` e centralizado com `mx-auto`. Isso garante que a experiência pareça um celular real, inclusive no desktop.

### Sistema de transição
Toda navegação entre páginas usa este padrão para evitar cliques duplos e fazer fade-out suave:

```tsx
const [isTransitioning, setIsTransitioning] = useState(false);

const handleNext = useCallback(() => {
  if (isTransitioning) return; // Previne clique duplo
  if ("vibrate" in navigator) navigator.vibrate(100); // Feedback tátil
  setIsTransitioning(true);
  setTimeout(() => navigate("/destino"), 300);
}, [navigate, isTransitioning]);
```

O container raiz da página deve incluir `isTransitioning ? "animate-fade-out" : ""`.

### Animações disponíveis (definidas no tailwind.config.ts)
- `animate-fade-in` — entrada suave (opacity 0→1, 0.3s)
- `animate-fade-out` — saída suave (opacity 1→0, 0.5s)
- `animate-slide-up` — entrada de baixo (translateY + opacity)
- `animate-accordion-down/up` — para accordions

### Assets
Assets estáticos ficam em `public/` e são referenciados com path absoluto:
```tsx
const evaAvatar = "/eva-avatar.png";
```

### Imports
Sempre usar o alias `@/`:
```tsx
import { StatusBarFake } from "@/components/call/StatusBarFake";
import { transcriptLines } from "@/data/transcriptLines";
```

## Temas visuais por tipo de experiência

Cada tipo de tela tem uma paleta diferente:

| Tipo | Background | Cor principal | Referência |
|------|-----------|--------------|------------|
| Chamada iOS | `ios-gradient` (CSS) | green #34C759 / red #FF3B30 | IncomingCall, ChamadaAtiva |
| WhatsApp | `bg-[#ECE5DD]` (chat) / `bg-white` | green #075E54 / #25D366 | Exp2Revelacao |
| Hacker | `bg-black` | green-500 (#22C55E) | HackerLogin, HackerLoading |
| TikTok | `bg-black` | white + rosa/azul TikTok | TikTokPrivado |
| Sales | `bg-[#030712]` | emerald-500 | SalesPage |

## Dados dinâmicos

Se a nova página precisar de dados sequenciais (como mensagens ou falas), crie o arquivo em `src/data/`:
- Use interface TypedScript com tipos explícitos
- Exporte tanto os dados quanto constantes relevantes (como `CALL_END_TIME`)
- Padrão: array de objetos com `id`, `text`, e campos contextuais
