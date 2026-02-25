---
name: landing-page-builder
description: Cria landing pages bonitas, modernas e responsivas em HTML + CSS puro com tracking profissional integrado (UTMs ocultas, click IDs, scroll depth, time on page, form tracking via dataLayer). Use sempre que o usuário pedir para criar landing page, LP, página de captura, página de vendas, squeeze page, página de conversão, ou qualquer página com formulário de lead. Também use quando pedir para criar página com tracking, página com UTMs, ou landing page com formulário. A skill gera arquivo HTML único pronto para hospedar em qualquer servidor. Funciona para qualquer cliente — o domínio do cookie, webhook e cores são configuráveis.
---

# Landing Page Builder

Cria landing pages profissionais em HTML + CSS puro (arquivo único) com tracking completo integrado. Funciona para qualquer cliente — todos os parâmetros (cores, domínio, webhook, textos) são configuráveis no briefing.

## Índice

1. [Fluxo de Trabalho](#fluxo-de-trabalho)
2. [Briefing Obrigatório](#briefing-obrigatório)
3. [Estrutura do HTML](#estrutura-do-html)
4. [Tracking Integrado](#tracking-integrado)
5. [Formulário com UTMs Ocultas](#formulário-com-utms-ocultas)
6. [Checklist Final](#checklist-final)

---

## Fluxo de Trabalho

Antes de escrever qualquer código, siga estes passos na ordem:

### Passo 1 — Coletar Briefing

Pergunte ao usuário TUDO que precisa. Use a ferramenta AskUserQuestion para coletar de forma organizada. Nunca comece a criar sem ter as respostas.

**Perguntas obrigatórias:**

1. **Objetivo da página** — Captura de lead? Venda? Lista de espera? Evento? Webinar? Download de material?
2. **Estrutura de seções** — Quais seções a página deve ter? (Hero, benefícios, depoimentos, FAQ, formulário, números/stats, etc.)
3. **Texto/copy** — O usuário vai fornecer o texto pronto, ou quer que gere sugestões? Se vai fornecer, pedir agora.
4. **Cores** — Cor primária, secundária, cor de fundo. Se o cliente tem marca, pedir as cores hex. Se não tem, sugerir paletas do design-system.
5. **Imagens** — Vai usar imagens? Se sim: URLs das imagens, ou quer usar placeholders que substituirá depois?
6. **Formulário** — Quais campos? (Nome, email, telefone/WhatsApp são os mais comuns). Qual a ação do botão (texto do CTA)?
7. **Webhook URL** — URL do webhook (n8n, Zapier, Make, API custom) para onde o formulário envia os dados. Se não tiver ainda, usar placeholder.
8. **Domínio do cookie** — Domínio com ponto no início (ex: `.dominiocliente.com.br`) para os cookies de tracking. Se a LP será em subdomínio, usar o domínio raiz.
9. **Tom/estilo** — Minimalista? Corporativo? Bold/impactante? Tech? Orgânico? Elegante?
10. **Tem logo?** — URL da imagem do logo ou base64

### Passo 2 — Ler Referências

Antes de escrever o HTML, leia os arquivos de referência da skill:

- `references/tracking-integration.md` — Código completo de tracking + padrão do formulário com hidden inputs + envio via fetch
- `references/design-system.md` — Padrões de design, tipografia, componentes reutilizáveis, paletas de cores, fontes

Leia AMBOS antes de começar. Eles contêm o código exato que deve ser inserido na página.

### Passo 3 — Gerar o HTML

Crie um único arquivo HTML com tudo embutido (CSS no `<style>`, JS no `<script>`). Salve com nome descritivo (ex: `lp-nome-do-cliente.html` ou `lp-lista-espera.html`).

### Passo 4 — Revisar e Iterar

Após gerar, ofereça para o usuário:
- Ajustar cores, espaçamentos, textos
- Adicionar/remover seções
- Trocar imagens
- Ajustar campos do formulário
- Mudar estilo visual

---

## Briefing Obrigatório

Nunca gere uma landing page sem ter respostas para pelo menos:
- Objetivo (captura/venda/evento)
- Seções desejadas
- Texto principal OU tema para gerar
- Cores (mínimo: primária + fundo)
- Campos do formulário
- Cookie domain para tracking

Se o usuário não forneceu algo, pergunte. É melhor perguntar demais do que gerar algo genérico.

---

## Estrutura do HTML

Toda landing page segue esta anatomia:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[TÍTULO DA PÁGINA]</title>
  <meta name="description" content="[META DESCRIPTION]">

  <!-- Favicon (se fornecido) -->

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=[FONTE]&display=swap" rel="stylesheet">

  <!-- CSS completo inline -->
  <style>
    /* Reset + variáveis CSS + estilos completos — ver references/design-system.md */
  </style>
</head>
<body>
  <!-- SEÇÕES DA PÁGINA -->

  <!-- FORMULÁRIO (com hidden inputs de UTMs — ver seção abaixo) -->

  <!-- SCRIPT DE TRACKING (antes do </body>) — ver references/tracking-integration.md -->
  <script>
    /* Script completo de tracking */
  </script>
</body>
</html>
```

### Regras de estrutura

1. **Arquivo único** — Todo CSS no `<style>`, todo JS no `<script>`. Nenhum arquivo externo além de Google Fonts e imagens.
2. **Mobile-first** — CSS começa com layout mobile, usa `@media (min-width: ...)` para desktop.
3. **Sem frameworks** — Nenhum Bootstrap, Tailwind, ou biblioteca CSS. CSS puro, limpo, moderno.
4. **Performance** — Fontes via `display=swap`, imagens com `loading="lazy"`, CSS otimizado.
5. **Semântica** — Usar `<header>`, `<main>`, `<section>`, `<footer>` corretamente.
6. **Acessibilidade** — Contraste adequado, `alt` em imagens, `label` nos inputs, `aria-label` onde necessário.

---

## Tracking Integrado

Consulte `references/tracking-integration.md` para o código completo. O tracking é inserido **antes do `</body>`** e cobre:

1. **Gerenciamento de Cookies** — UTMs first-touch e last-touch, click IDs (gclid, fbclid, ttclid, msclkid, etc.)
2. **Session ID** — Via sessionStorage, único por sessão
3. **Referrer Mapping** — Detecta origem (google, instagram, facebook, chatgpt, etc.) mesmo sem UTMs
4. **DataLayer Events** — `custom_page_view`, `scroll_depth`, `time_on_page_heartbeat`, `form_submit`
5. **Scroll Depth** — 25%, 50%, 75%, 90% com time_on_page no contexto
6. **Time on Page** — Heartbeat a cada 30s + captura no submit
7. **Session Attributes Encoded** — Base64 com todos os dados de atribuição
8. **Preenchimento automático de hidden inputs** — UTMs e click IDs nos campos ocultos do form
9. **Cookie domain configurável** — Ajustar por cliente

### Importante sobre GTM

O script de tracking NÃO inclui o snippet do GTM — isso é adicionado separadamente pelo cliente/usuário. O script gera eventos no `dataLayer` que o GTM Web Container consome.

Informar ao usuário que precisa adicionar o snippet do GTM separadamente no `<head>`:
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXXX');</script>
<!-- End Google Tag Manager -->
```

---

## Formulário com UTMs Ocultas

Todo formulário deve ter campos hidden para captura de tracking. O padrão completo está em `references/tracking-integration.md`, mas o resumo é:

### Campos hidden obrigatórios no form

```html
<form id="lead-form" method="POST">
  <!-- Campos visíveis (configuráveis por briefing) -->
  <input type="text" name="name" placeholder="Seu nome" required>
  <input type="email" name="email" placeholder="Seu e-mail" required>
  <input type="tel" name="phone" placeholder="Seu WhatsApp" required>

  <!-- UTMs ocultas -->
  <input type="hidden" name="utm_source" data-field-id="utm_source">
  <input type="hidden" name="utm_medium" data-field-id="utm_medium">
  <input type="hidden" name="utm_campaign" data-field-id="utm_campaign">
  <input type="hidden" name="utm_content" data-field-id="utm_content">
  <input type="hidden" name="utm_term" data-field-id="utm_term">

  <!-- Click IDs ocultos -->
  <input type="hidden" name="gclid" data-field-id="gclid">
  <input type="hidden" name="fbclid" data-field-id="fbclid">
  <input type="hidden" name="gbraid" data-field-id="gbraid">
  <input type="hidden" name="wbraid" data-field-id="wbraid">
  <input type="hidden" name="ttclid" data-field-id="ttclid">
  <input type="hidden" name="msclkid" data-field-id="msclkid">
  <input type="hidden" name="li_fat_id" data-field-id="li_fat_id">
  <input type="hidden" name="sck" data-field-id="sck">
  <input type="hidden" name="gad_campaignid" data-field-id="gad_campaignid">
  <input type="hidden" name="gad_source" data-field-id="gad_source">

  <!-- Dados de sessão -->
  <input type="hidden" name="session_id" id="hidden_session_id">
  <input type="hidden" name="landing_page" data-field-id="landing_page">
  <input type="hidden" name="origin_page" data-field-id="origin_page">
  <input type="hidden" name="session_attributes_encoded" data-field-id="session_attributes_encoded">

  <button type="submit">TEXTO DO CTA</button>
</form>
```

O script de tracking preenche automaticamente esses campos hidden com os valores dos cookies. O envio é feito via `fetch()` POST JSON para o webhook configurado, com feedback visual de loading/sucesso/erro. Tudo isso está detalhado em `references/tracking-integration.md`.

---

## Checklist Final

Antes de entregar a landing page, verificar:

### Design
- [ ] Responsivo (testar mentalmente em 375px, 768px, 1280px)
- [ ] Cores consistentes com a marca do cliente
- [ ] Tipografia com hierarquia clara (h1 > h2 > h3 > p)
- [ ] Espaçamento generoso entre seções (mínimo 80px mobile, 120px desktop)
- [ ] Botões com hover/active states
- [ ] Imagens com loading="lazy" e alt text

### Formulário
- [ ] Campos visíveis conforme briefing, com placeholder e labels
- [ ] Todos os hidden inputs de UTMs presentes (5 campos)
- [ ] Hidden inputs de click IDs presentes (10 campos)
- [ ] Hidden inputs de sessão presentes (session_id, landing_page, origin_page, session_attributes_encoded)
- [ ] Validação HTML5 (required, type=email, type=tel)
- [ ] Máscara de telefone brasileiro (se aplicável)
- [ ] Feedback visual de envio (loading → sucesso/erro)
- [ ] Webhook URL configurada (ou placeholder claro)

### Tracking
- [ ] Script de tracking presente antes de `</body>`
- [ ] `COOKIE_DOMAIN` configurado para o domínio do cliente
- [ ] `WEBHOOK_URL` configurado
- [ ] `dataLayer` declarado
- [ ] Evento `custom_page_view` disparando
- [ ] Scroll depth tracking (25/50/75/90%)
- [ ] Time on page heartbeat (30s)
- [ ] Evento `form_submit` no submit com dados do lead
- [ ] Session ID via sessionStorage
- [ ] Referrer mapping funcionando
- [ ] Preenchimento automático de hidden inputs
- [ ] Session attributes encoded sendo gerado

### SEO & Performance
- [ ] `<title>` descritivo
- [ ] `<meta name="description">` presente
- [ ] Fontes com `display=swap`
- [ ] Sem dependências externas pesadas
- [ ] HTML semântico

### Entrega
- [ ] Arquivo HTML único salvo com nome descritivo
- [ ] Informar ao usuário que precisa adicionar o snippet do GTM separadamente
- [ ] Informar o cookie domain usado
- [ ] Informar a webhook URL usada (ou que está como placeholder)
