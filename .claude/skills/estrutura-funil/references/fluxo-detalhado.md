# Fluxo Detalhado do Funil Mascarado

## Etapa 1: IncomingCall (`/`)

**Experiência:** O lead abre o link e vê uma tela de ligação recebida no celular.

**O que acontece:**
1. Tela de chamada estilo iOS aparece com avatar da Eva pulsando
2. Ringtone toca em loop (`ringtone.webm`)
3. Avatar tem animação de shake + pulse rings verdes
4. Dois botões: "Recusar" (vermelho) e "Aceitar" (verde com pulse)
5. Botões secundários: "Lembrar" e "Mensagem" (decorativos)

**Gatilhos:**
- Aceitar → fade-out → navega para `/chamada-ativa`
- Recusar → fade-out → recarrega a página (volta ao início)

**Duração estimada:** 3-10 segundos

---

## Etapa 2: ChamadaAtiva (`/chamada-ativa`)

**Experiência:** A "ligação" foi aceita. Timer conta os segundos enquanto Eva "fala".

**O que acontece:**
1. Tela de chamada ativa com avatar, nome "Eva", timer rodando
2. TranscriptOverlay mostra as falas da Eva sincronizadas com o timer
3. Grid de ações iOS fake (mute, keypad, speaker — decorativos)
4. Após `CALL_END_TIME` (345 segundos / ~5:45 min), aparece CTA "Abrir WhatsApp"
5. Botão vermelho "Desligar" sempre disponível

**Dados:** `src/data/transcriptLines.ts` — 61 falas com `startTime` e `endTime`

**Gatilhos:**
- Desligar → fade-out → `/exp-2-revelacao`
- Abrir WhatsApp (após timer) → fade-out → `/exp-2-revelacao`

**Duração estimada:** 30 seg a 5:45 min (depende se o lead espera ou desliga)

---

## Etapa 3: Exp2Revelacao (`/exp-2-revelacao`)

**Experiência:** Chat WhatsApp com Eva. Ela manda mensagens uma a uma com delay.

**O que acontece:**
1. Interface WhatsApp com header verde (Eva, "Online")
2. Eva manda: "antes de continuar... preciso saber se posso confiar em você"
3. Lead clica "pode confiar" → sequência de 58 mensagens começa
4. Mensagens aparecem com delay randômico (1-2 seg) + indicator "digitando..."
5. Ao final, aparecem 2 quick replies: "Ok, mostra." / "E se meu negócio for complexo?"
6. Lead escolhe → aparece CTA "Abrir TikTok privado"

**Dados:** `src/data/whatsappMessages.ts` — 58 mensagens + 2 choices

**Gatilhos:**
- "Abrir TikTok privado" → fade-out → `/hacker-login`

**Duração estimada:** 2-4 minutos (depende da velocidade de leitura)

---

## Etapa 4: HackerLogin (`/hacker-login`)

**Experiência:** Tela terminal preta com senha visível para o lead copiar e colar.

**O que acontece:**
1. Logo terminal com pulse, título "ACESSO RESTRITO"
2. Senha `EVA2024#HACK` exibida com botão de copiar
3. Input para colar a senha
4. Botão "ACESSAR SISTEMA"

**Propósito:** Criar sensação de exclusividade e engajamento ativo (o lead precisa fazer algo).

**Gatilhos:**
- Senha correta → fade-out → `/hacker-loading`
- Senha errada → toast de erro

**Duração estimada:** 10-30 segundos

---

## Etapa 5: HackerLoading (`/hacker-loading`)

**Experiência:** Loading animado estilo hacker com barras de progresso e textos técnicos.

**Gatilhos:**
- Auto-navega para `/tiktok-privado` após loading completo

**Duração estimada:** 5-15 segundos

---

## Etapa 6: TikTokPrivado (`/tiktok-privado`)

**Experiência:** Interface TikTok com slides de conteúdo verticais.

**O que acontece:**
1. Tela preta estilo TikTok com navegação por swipe vertical
2. Cada "vídeo" é um slide com texto formatado (não é vídeo real)
3. Sidebar com botões de like, comentário, share, bookmark
4. Seção de comentários simulados com respostas
5. Bottom nav fake do TikTok

**Slides cobrem:** O problema → Ferramentas demais → A verdade → A solução → CTA

**Gatilhos:**
- CTA no último slide → navega para `/sales`

**Duração estimada:** 2-5 minutos

---

## Etapa 7: SalesPage (`/sales`)

**Experiência:** Página de vendas dark/premium da Evolutto.

**O que acontece:**
1. Background escuro com gradientes emerald sutis
2. Seções animadas com IntersectionObserver (aparecem ao scroll)
3. Argumentos de venda, features, FAQ com accordion
4. CTA final que abre `evolutto.com`

**Gatilhos:**
- CTA → abre evolutto.com em nova aba

**Duração estimada:** 3-10 minutos de leitura

---

## Tempo total estimado do funil

**Rápido (lead impaciente):** ~5 minutos
**Médio (engajado):** ~12-15 minutos
**Completo (lê tudo):** ~20-25 minutos
