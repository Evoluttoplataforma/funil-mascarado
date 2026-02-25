# Section Library — Biblioteca de Seções Reutilizáveis

> Catálogo de todas as seções que podem ser incluídas numa LP.
> A Claude API seleciona e personaliza com base no briefing do cliente.

---

## Seções Disponíveis

| ID | Nome | Descrição | Prioridade |
|----|------|-----------|-----------|
| `hero` | Hero Section | Título principal + CTA + imagem/background | Obrigatória |
| `hero-split` | Hero com Form | Hero lado a lado: texto + formulário | Alternativa |
| `social-proof` | Social Proof | Logos de clientes ou badge de confiança | Alta |
| `stats` | Números/Estatísticas | Contadores animados com métricas | Alta |
| `benefits` | Benefícios | Grid de cards com ícone + título + descrição | Alta |
| `pain-points` | Problemas/Dores | Lista de problemas que o público enfrenta | Média |
| `solution` | Solução | Como o produto/serviço resolve os problemas | Média |
| `how-it-works` | Como Funciona | 3-4 passos sequenciais | Média |
| `testimonials` | Depoimentos | Cards com foto + nome + texto + cargo | Alta |
| `faq` | FAQ Accordion | Perguntas frequentes com expand/collapse | Alta |
| `cta-form` | CTA + Formulário | Seção final com formulário de captura | Obrigatória |
| `cta-simple` | CTA Simples | Texto + botão (sem formulário) | Alternativa |
| `pricing` | Preços | Tabela de planos ou preço único | Opcional |
| `features` | Features Detalhadas | Blocos maiores com imagem + texto alternado | Opcional |
| `guarantee` | Garantia | Badge/banner com garantia ou selo | Opcional |
| `about` | Sobre a Empresa | Breve descrição + diferenciais | Opcional |
| `footer` | Footer | Copyright + links legais | Obrigatória |

---

## Layouts Padrão por Objetivo

### Captura de Leads (padrão)
```
hero → social-proof → benefits → testimonials → cta-form → faq → footer
```

### Vendas
```
hero → pain-points → solution → benefits → stats → testimonials → pricing → guarantee → cta-form → faq → footer
```

### Lista de Espera
```
hero-split → stats → benefits → how-it-works → cta-simple → footer
```

### Evento/Webinar
```
hero → about → benefits → how-it-works → testimonials → cta-form → faq → footer
```

### Download de Material
```
hero-split → benefits → social-proof → cta-simple → footer
```

---

## Especificação de Cada Seção

### hero

**Estrutura HTML:**
```html
<section class="hero">
  <div class="container">
    <span class="eyebrow">{BADGE_TEXT}</span>
    <h1>{HEADLINE}</h1>
    <p class="text-large">{SUBHEADLINE}</p>
    <a href="#form" class="btn btn-primary btn-large">{CTA_TEXT}</a>
  </div>
</section>
```

**Variantes:**
- `hero-gradient` — fundo com gradiente sutil
- `hero-image` — fundo com imagem + overlay
- `hero-dark` — fundo escuro com text light

### hero-split

**Estrutura HTML:**
```html
<section class="hero">
  <div class="container hero-split">
    <div class="hero-content">
      <span class="eyebrow">{BADGE_TEXT}</span>
      <h1>{HEADLINE}</h1>
      <p class="text-large">{SUBHEADLINE}</p>
    </div>
    <div class="hero-form">
      <div class="form-card">
        <h3>{FORM_TITLE}</h3>
        <form id="lead-form">
          <!-- campos + hidden inputs -->
        </form>
      </div>
    </div>
  </div>
</section>
```

### social-proof

```html
<section class="social-proof fade-in">
  <div class="container">
    <p class="text-muted text-center">{TRUSTED_BY_TEXT}</p>
    <div class="trust-bar">
      <img src="{LOGO_1}" alt="{ALT_1}" loading="lazy">
      <img src="{LOGO_2}" alt="{ALT_2}" loading="lazy">
      <!-- ... -->
    </div>
  </div>
</section>
```

### stats

```html
<section class="stats fade-in">
  <div class="container">
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-number" data-target="{NUMBER_1}">{PREFIX}{NUMBER_1}{SUFFIX}</div>
        <div class="stat-label">{LABEL_1}</div>
      </div>
      <!-- repetir para cada stat -->
    </div>
  </div>
</section>
```

### benefits

```html
<section class="features fade-in">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow">{SECTION_BADGE}</span>
      <h2>{SECTION_TITLE}</h2>
      <p>{SECTION_DESCRIPTION}</p>
    </div>
    <div class="features-grid">
      <div class="feature-card fade-in fade-in-delay-1">
        <div class="feature-icon">{ICON_1}</div>
        <h3>{TITLE_1}</h3>
        <p>{DESC_1}</p>
      </div>
      <!-- repetir para cada benefício -->
    </div>
  </div>
</section>
```

### testimonials

```html
<section class="testimonials fade-in">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow">Depoimentos</span>
      <h2>{SECTION_TITLE}</h2>
    </div>
    <div class="testimonials-grid">
      <div class="testimonial-card fade-in fade-in-delay-1">
        <div class="testimonial-text">{QUOTE_1}</div>
        <div class="testimonial-author">
          <img class="testimonial-avatar" src="{PHOTO_1}" alt="{NAME_1}" loading="lazy">
          <div>
            <div class="testimonial-name">{NAME_1}</div>
            <div class="testimonial-role">{ROLE_1}</div>
          </div>
        </div>
      </div>
      <!-- repetir -->
    </div>
  </div>
</section>
```

### faq

```html
<section class="faq fade-in">
  <div class="container">
    <div class="section-header">
      <h2>Perguntas Frequentes</h2>
    </div>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-question">{QUESTION_1}</button>
        <div class="faq-answer">
          <div class="faq-answer-inner">{ANSWER_1}</div>
        </div>
      </div>
      <!-- repetir -->
    </div>
  </div>
</section>
```

### cta-form

```html
<section class="cta-section fade-in" id="form">
  <div class="container container-narrow">
    <div class="section-header">
      <h2>{CTA_TITLE}</h2>
      <p>{CTA_SUBTITLE}</p>
    </div>
    <div class="form-card">
      <form id="lead-form">
        <!-- Campos visíveis (conforme briefing) -->
        <!-- 19 hidden inputs (UTMs + clicks + sessão) -->
        <button type="submit" class="btn-submit">{CTA_BUTTON_TEXT}</button>
      </form>
    </div>
  </div>
</section>
```

---

## Regras de Combinação

1. **Toda LP tem pelo menos:** `hero` + `cta-form` + `footer`
2. **Máximo recomendado:** 8 seções (além de hero e footer)
3. **Ordem lógica:** Problema → Solução → Benefícios → Prova → Ação
4. **Não repetir:** Nunca 2 seções de `testimonials` ou 2 de `benefits`
5. **Formulário:** Aparece no `hero-split` OU no `cta-form`, nunca nos dois
6. **FAQ:** Sempre penúltima seção (antes do footer)
