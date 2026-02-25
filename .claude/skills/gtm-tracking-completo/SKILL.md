---
name: gtm-tracking-completo
description: Implementação completa de tracking server-side com GTM Web + Server Container, Supabase, n8n, Google Ads Enhanced Conversions, Meta CAPI, lead scoring automático e retorno de conversões offline via Pipedrive. Use quando precisar implementar rastreamento avançado do primeiro clique até o fechamento do deal.
---

# GTM Tracking Completo — Skill de Implementação

Este skill cobre a implementação end-to-end de rastreamento avançado para landing pages, incluindo:

- GTM Web Container (coleta de dados)
- GTM Server Container (processamento e repasse)
- Supabase (banco de dados de eventos)
- n8n (automação + lead scoring)
- Google Ads Enhanced Conversions
- Meta CAPI (Facebook Conversion API)
- **Offline Conversion Tracking via Pipedrive** (retorno de vendas para Google Ads e Meta Ads)

---

## Visão Geral da Arquitetura

```
TOPO DO FUNIL — COLETA
────────────────────────────────────────────────
Visitante
   ↓
[Landing Page + Script de Tracking]
   ↓ dataLayer events
[GTM Web Container]
   ↓ GA4 events (com parâmetros customizados)
[GTM Server Container]
   ├→ GA4 (analytics)
   ├→ Google Ads (Enhanced Conversions — online)
   ├→ Meta CAPI (Facebook — server-side)
   └→ n8n Webhook
         ↓
      [n8n Workflow]
         ├→ Supabase (salvar evento + lead scoring)
         └→ Pipedrive (criar deal com click IDs + UTMs)

FUNDO DO FUNIL — RETORNO DE CONVERSÃO
────────────────────────────────────────────────
[Pipedrive — Deal fechado]
   ↓ (campos: gclid, gbraid, wbraid, fbclid, session_attributes_encoded, utm_*, Deal ID, valor, data)
[n8n — Schedule Trigger ou Manual]
   ↓ Get many deals (Pipedrive)
   ├→ [Formatar Google Ads]
   │     └→ Google Sheets (banco de dados para importar no Google Ads)
   └→ [Formatar Meta Ads]
         ├→ BM principal — POST graph.facebook.com (Offline Conversions API)
         └→ BM secundária — POST graph.facebook.com (Offline Conversions API)
```

**Por que isso é poderoso:** o click ID capturado no primeiro clique do anúncio é enviado ao Pipedrive junto com o lead. Quando o deal fecha (venda real), o n8n retorna esse click ID para o Google Ads e Meta Ads — permitindo otimizar campanhas para vendas reais, não apenas leads.

---

## PARTE 1 — SUPABASE

### 1.1 Criar Projeto
- Região: sa-east-1 (São Paulo) para menor latência no Brasil
- Anotar: Project ID, API URL, anon key, service_role key

### 1.2 Criar Tabela `events`

```sql
CREATE TABLE events (
  id bigserial PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  
  -- Identificação
  event_name text,
  session_id text,
  client_id text,
  ga_client_id text,
  external_id text,
  event_id text UNIQUE,  -- deduplicação
  
  -- Página
  page_url text,
  page_path text,
  page_hostname text,
  referrer text,
  landing_page text,
  origin_page text,
  ref text,
  
  -- UTMs last-touch
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  
  -- UTMs first-touch
  ft_utm_source text,
  ft_utm_medium text,
  ft_utm_campaign text,
  ft_utm_content text,
  ft_utm_term text,
  
  -- Click IDs
  gclid text,
  fbclid text,
  ttclid text,
  gbraid text,
  wbraid text,
  gad_campaignid text,
  gad_source text,
  msclkid text,
  li_fat_id text,
  twclid text,
  sck text,
  
  -- Cookies
  fbc text,
  fbp text,
  ttp text,
  
  -- Geo
  geo_country text,
  geo_state text,
  geo_city text,
  geo_zip text,
  
  -- Dados do lead
  email text,
  phone text,
  first_name text,
  last_name text,
  
  -- Comportamento
  scroll_depth text,
  time_on_page integer,
  
  -- Lead scoring
  lead_score integer,
  lead_temperature text,
  
  -- Técnico
  user_agent text,
  first_visit text,
  session_attributes_encoded text,
  custom_data jsonb
);
```

### 1.3 Criar View com Fuso Horário Brasileiro

```sql
CREATE VIEW events_br AS
SELECT 
  id,
  (created_at AT TIME ZONE 'America/Bahia') AS created_at,
  event_name, session_id, client_id, ga_client_id, external_id, event_id,
  page_url, page_path, page_hostname, referrer, landing_page, origin_page, ref,
  utm_source, utm_medium, utm_campaign, utm_content, utm_term,
  ft_utm_source, ft_utm_medium, ft_utm_campaign, ft_utm_content, ft_utm_term,
  gclid, fbclid, ttclid, gbraid, wbraid, gad_campaignid, gad_source,
  msclkid, li_fat_id, twclid, sck, fbc, fbp, ttp,
  geo_country, geo_state, geo_city, geo_zip,
  email, phone, first_name, last_name,
  scroll_depth, time_on_page, lead_score, lead_temperature,
  user_agent, first_visit, session_attributes_encoded, custom_data
FROM events;
```

> ⚠️ Ajustar o timezone conforme o estado do cliente:
> - SP/RJ/MG: `America/Sao_Paulo`
> - BA/PE/CE: `America/Bahia`
> - MT/MS: `America/Cuiaba`
> - AM: `America/Manaus`

---

## PARTE 2 — SCRIPT DE TRACKING (Landing Page)

Inserir antes do `</head>` da landing page. O script gerencia:

- Geração de `session_id` único por sessão
- Cookies first-touch UTMs (não sobrescreve na mesma sessão)
- Cookies last-touch UTMs (sempre atualiza)
- Captura de todos os click IDs (gclid, fbclid, ttclid, gbraid, wbraid, etc.)
- Cookie `external_id` (prefixo `lead_` + hash único)
- Evento `custom_page_view` no dataLayer
- Scroll depth tracking (25%, 50%, 75%, 90%)
- Heartbeat time_on_page (a cada 30s)
- Evento `form_submit` com dados do lead

### Script Base

```html
<script>
// ============================================
// CONFIGURAÇÃO — AJUSTAR POR CLIENTE
// ============================================
const COOKIE_DOMAIN = '.dominiocliente.com.br'; // com ponto no início
const SESSION_COOKIE_NAME = 'apex_session_id';
const EXTERNAL_ID_COOKIE = 'apex_external_id';
const HEARTBEAT_INTERVAL = 30; // segundos

// ============================================
// UTILITÁRIOS
// ============================================
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days, domain) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const domainPart = domain ? '; domain=' + domain : '';
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/' + domainPart + '; SameSite=Lax';
}

function getUrlParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

function generateId(prefix) {
  return (prefix || '') + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
}

function hashString(str) {
  // Hash simples para external_id
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).slice(0, 8);
}

// ============================================
// SESSION ID
// ============================================
let sessionId = getCookie(SESSION_COOKIE_NAME);
if (!sessionId) {
  sessionId = generateId();
  // Sessão: expira ao fechar o browser (sem dias = session cookie)
  document.cookie = SESSION_COOKIE_NAME + '=' + encodeURIComponent(sessionId) + '; path=/; SameSite=Lax';
}

// ============================================
// EXTERNAL ID
// ============================================
let externalId = getCookie(EXTERNAL_ID_COOKIE);
if (!externalId) {
  externalId = 'lead_' + hashString(sessionId + Date.now());
  setCookie(EXTERNAL_ID_COOKIE, externalId, 365, COOKIE_DOMAIN);
}

// ============================================
// CLICK IDS DA URL
// ============================================
const urlParams = {
  fbclid: getUrlParam('fbclid'),
  gclid:  getUrlParam('gclid'),
  ttclid: getUrlParam('ttclid'),
  gbraid: getUrlParam('gbraid'),
  wbraid: getUrlParam('wbraid'),
  gad_campaignid: getUrlParam('gad_campaignid'),
  gad_source: getUrlParam('gad_source'),
  msclkid: getUrlParam('msclkid'),
  li_fat_id: getUrlParam('li_fat_id'),
  twclid: getUrlParam('twclid'),
  sck: getUrlParam('sck'),
};

// Salvar click IDs em cookies (30 dias)
Object.entries(urlParams).forEach(([key, val]) => {
  if (val) setCookie(key, val, 30, COOKIE_DOMAIN);
});

// ============================================
// UTMs — FIRST TOUCH (não sobrescreve)
// ============================================
const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
utmKeys.forEach(key => {
  const val = getUrlParam(key);
  if (val && !getCookie('ft_' + key)) {
    setCookie('ft_' + key, val, 365, COOKIE_DOMAIN);
  }
  // Last touch (sempre atualiza)
  if (val) setCookie(key, val, 30, COOKIE_DOMAIN);
});

// ============================================
// LANDING PAGE & ORIGIN PAGE
// ============================================
if (!getCookie('landing_page')) {
  setCookie('landing_page', window.location.href, 30, COOKIE_DOMAIN);
}
setCookie('origin_page', document.referrer || 'direct', 30, COOKIE_DOMAIN);

// First visit
if (!getCookie('first_visit')) {
  setCookie('first_visit', new Date().toISOString(), 365, COOKIE_DOMAIN);
}

// REF parameter
const refParam = getUrlParam('ref');
if (refParam) setCookie('ref', refParam, 30, COOKIE_DOMAIN);

// ============================================
// PAGE VIEW EVENT
// ============================================
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'custom_page_view',
  apex_session_id: sessionId,
  apex_external_id: externalId,
  page_url: window.location.href,
  page_path: window.location.pathname,
  page_hostname: window.location.hostname,
  referrer: document.referrer,
});

// ============================================
// SCROLL DEPTH
// ============================================
const scrollMilestones = [25, 50, 75, 90];
const firedMilestones = new Set();
let scrollTimeOnPage = 0;

function getScrollPercent() {
  const h = document.documentElement;
  const scrollTop = window.pageYOffset || h.scrollTop;
  const scrollHeight = h.scrollHeight - h.clientHeight;
  return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
}

window.addEventListener('scroll', function() {
  const pct = getScrollPercent();
  scrollMilestones.forEach(milestone => {
    if (pct >= milestone && !firedMilestones.has(milestone)) {
      firedMilestones.add(milestone);
      window.dataLayer.push({
        event: 'scroll_depth',
        apex_session_id: sessionId,
        scroll_depth: milestone,
        time_on_page: scrollTimeOnPage,
      });
    }
  });
}, { passive: true });

// ============================================
// TIME ON PAGE HEARTBEAT
// ============================================
let timeOnPage = 0;
setInterval(function() {
  timeOnPage += HEARTBEAT_INTERVAL;
  scrollTimeOnPage = timeOnPage;
  window.dataLayer.push({
    event: 'time_on_page_heartbeat',
    apex_session_id: sessionId,
    time_on_page: timeOnPage,
    heartbeat_count: Math.floor(timeOnPage / HEARTBEAT_INTERVAL),
  });
}, HEARTBEAT_INTERVAL * 1000);

// ============================================
// FORM SUBMIT — ADAPTAR AO SELETOR DO CLIENTE
// ============================================
// document.querySelector('SELETOR_DO_FORMULARIO')
//   .addEventListener('submit', function(e) { ... });
// Ou usar trigger GTM no dataLayer direto
</script>
```

### Evento form_submit (adaptar por cliente)

```javascript
// Disparar ao submeter formulário — ajustar campos por cliente
window.dataLayer.push({
  event: 'form_submit',
  apex_session_id: sessionId,
  lead_name: document.querySelector('#nome').value,
  lead_email: document.querySelector('#email').value,
  lead_phone: document.querySelector('#telefone').value,
  time_on_page_at_submit: timeOnPage,
});
```

---

## PARTE 3 — GTM WEB CONTAINER

### 3.1 Variáveis

| Nome | Tipo | Valor |
|------|------|-------|
| `GA4 - ID` | Constante | G-XXXXXXXXXX do cliente |
| `Pixel META ADS` | Constante | ID do Pixel Facebook |
| `Tag Google ads` | Constante | AW-XXXXXXXXX |
| `00 - API - Server URL` | Constante | URL do server container GTM |
| `jsc - SessionID` | JS Customizado | `function(){ return {{DLV - apex_session_id}} \|\| getCookie('apex_session_id'); }` |
| `jsc - ExternalID` | JS Customizado | `function(){ return getCookie('apex_external_id'); }` |
| `jsc - GA Client ID` | JS Customizado | `function(){ try{ var t=document.cookie.match(/_ga=([^;]+)/); return t?t[1].split('.').slice(-2).join('.'):''; }catch(e){return '';} }` |
| `jsc - lead_email` | JS Customizado | Lê do dataLayer |
| `jsc - lead_phone` | JS Customizado | Lê do dataLayer |
| `jsc - FirstName` | JS Customizado | Lê do dataLayer |
| `jsc - LastName` | JS Customizado | Lê do dataLayer |
| `jsc - UserAgent` | JS Customizado | `function(){ return navigator.userAgent; }` |
| `00 - Event ID` | Variável de Template | Gera ID único por evento |
| `01 - Dados Otimizados Google Ads` | User-Provided Data | Mapeia email/phone/name para Enhanced Conversions |

**Cookies (tipo: Primário):**
- `02 - Cookie FBP` → `_fbp`
- `02 - Cookie FBC` → `_fbc`
- `02 - Cookie fbclid` → `fbclid`
- `02 - Cookie gclid` → `gclid`
- `02 - Cookie ft_utm_source` → `ft_utm_source`
- `02 - Cookie ft_utm_medium` → `ft_utm_medium`
- `02 - Cookie ft_utm_campaign` → `ft_utm_campaign`
- `02 - Cookie ft_utm_content` → `ft_utm_content`
- `02 - Cookie ft_utm_term` → `ft_utm_term`
- `02 - Cookie landing_page` → `landing_page`
- `02 - Cookie origin_page` → `origin_page`
- `02 - Cookie first_visit` → `first_visit`
- `02 - Cookie ref` → `ref`
- `02 - Cookie gbraid` → `gbraid`
- `02 - Cookie wbraid` → `wbraid`
- `02 - Cookie gad_campaignid` → `gad_campaignid`
- `02 - Cookie gad_source` → `gad_source`
- `02 - Cookie msclkid` → `msclkid`
- `02 - Cookie li_fat_id` → `li_fat_id`
- `02 - Cookie twclid` → `twclid`
- `02 - Cookie sck` → `sck`
- `02 - Cookie ttp` → `ttp`
- `02 - Cookie ttclid` → `ttclid`
- `02 - Cookie session_attributes_encoded` → `session_attributes_encoded`

**DataLayer Variables (DLV):**
- `DLV - utm_source` / `utm_medium` / `utm_campaign` / `utm_content` / `utm_term`
- `DLV - scroll_depth`
- `DLV - time_on_page`
- `DLV - time_on_page_at_submit`
- `DLV - heartbeat`
- `01 - DLV - geo_city/state/zip/country`

### 3.2 Triggers

| Nome | Tipo | Configuração |
|------|------|-------------|
| `custom_page_view` | Evento Personalizado | Event name: `custom_page_view` |
| `Evento Formulário -> form_submit` | Evento Personalizado | Event name: `form_submit` |
| `Evento- scroll_depth` | Evento Personalizado | Event name: `scroll_depth` |
| `time_on_page_heartbeat` | Evento Personalizado | Event name: `time_on_page_heartbeat` |
| `Janela carregada` | Janela Carregada | — |

### 3.3 Tags

#### GA4 Configuration
- Tipo: Tag Google
- ID: `{{GA4 - ID}}`
- Server container URL: `{{00 - API - Server URL}}`
- Parâmetros de evento: `apex_session_id` → `{{jsc - SessionID}}`
- Trigger: Janela carregada

#### GA4 PageView
- Tipo: Evento GA4
- Nome do evento: `page_view`
- Parâmetros: session_id, external_id, client_id, ga_client_id, event_id, user_agent, todos os cookies UTMs/click IDs/geo
- Trigger: `custom_page_view`

#### GA4 Generate Lead
- Tipo: Evento GA4
- Nome do evento: `generate_lead`
- Parâmetros: todos do PageView + email, phone, first_name, last_name, time_on_page_at_submit
- Trigger: `form_submit`

#### GA4 Scroll Depth
- Tipo: Evento GA4
- Nome do evento: `scroll_depth`
- Parâmetros: apex_session_id, scroll_depth, time_on_page, event_id
- Trigger: `Evento- scroll_depth`

#### GA4 Time on Page Heartbeat
- Tipo: Evento GA4
- Nome do evento: `time_on_page_heartbeat`
- Parâmetros: apex_session_id, time_on_page, event_id
- Trigger: `time_on_page_heartbeat`

#### Google Ads — Vinculador de Conversões
- Tipo: Vinculador de conversões
- Trigger: Janela carregada

#### Google Ads — Data Event (Enhanced Conversions)
- Tipo: User-Provided Data Event
- Configuração: `{{01 - Dados Otimizados Google Ads}}`
- Trigger: `form_submit`

#### Google Ads — Acompanhamento de Conversão
- Tipo: Conversão Google Ads
- Conversion ID: do cliente
- Trigger: `form_submit`

#### Meta Pixel — Page View
- Tipo: Template Meta Pixel
- Pixel ID: `{{Pixel META ADS}}`
- Evento: PageView
- Trigger: `custom_page_view`

#### Meta Pixel — Lead
- Tipo: Template Meta Pixel
- Pixel ID: `{{Pixel META ADS}}`
- Evento: Lead
- User data: email, phone, fn, ln, external_id, fbp, fbc, country, st
- Trigger: `form_submit`

#### Geolocalização
- Tipo: HTML customizado
- Script que faz fetch da API de geo e popula o dataLayer com `geo_country`, `geo_state`, `geo_city`, `geo_zip`
- Trigger: Janela carregada

---

## PARTE 4 — GTM SERVER CONTAINER

### 4.1 Variáveis (todas tipo Event Data)

Criar variáveis lendo do evento GA4 recebido:

| Nome | Chave no evento |
|------|----------------|
| `srv - event_name` | `event_name` |
| `srv - session_id` | `x-ga-mp2-user_id` ou `apex_session_id` |
| `srv - client_id` | `client_id` |
| `srv - ga_client_id` | `x-ga-mp2-client_id` |
| `srv - external_id` | `external_id` |
| `srv - event_id` | `event_id` |
| `srv - email` | `email` |
| `srv - phone` | `phone` |
| `srv - first_name` | `first_name` |
| `srv - last_name` | `last_name` |
| `srv - page_location` | `page_location` |
| `srv - page_path` | `page_path` |
| `srv - page_hostname` | `page_hostname` |
| `srv - page_referrer` | `page_referrer` |
| `srv - utm_source` | `utm_source` |
| `srv - utm_medium` | `utm_medium` |
| `srv - utm_campaign` | `utm_campaign` |
| `srv - utm_content` | `utm_content` |
| `srv - utm_term` | `utm_term` |
| `srv - ft_utm_source` | `ft_utm_source` |
| `srv - ft_utm_medium` | `ft_utm_medium` |
| `srv - ft_utm_campaign` | `ft_utm_campaign` |
| `srv - ft_utm_content` | `ft_utm_content` |
| `srv - ft_utm_term` | `ft_utm_term` |
| `srv - gclid` | `gclid` |
| `srv - fbclid` | `fbclid` |
| `srv - ttclid` | `ttclid` |
| `srv - gbraid` | `gbraid` |
| `srv - wbraid` | `wbraid` |
| `srv - gad_campaignid` | `gad_campaignid` |
| `srv - gad_source` | `gad_source` |
| `srv - msclkid` | `msclkid` |
| `srv - li_fat_id` | `li_fat_id` |
| `srv - twclid` | `twclid` |
| `srv - sck` | `sck` |
| `srv - fbc` | `fbc` |
| `srv - fbp` | `fbp` |
| `srv - ttp` | `ttp` |
| `srv - geo_country` | `geo_country` |
| `srv - geo_state` | `geo_state` |
| `srv - geo_city` | `geo_city` |
| `srv - geo_zip` | `geo_zip` |
| `srv - scroll_depth` | `scroll_depth` |
| `srv - time_on_page` | `time_on_page` |
| `srv - landing_page` | `landing_page` |
| `srv - origin_page` | `origin_page` |
| `srv - first_visit` | `first_visit` |
| `srv - ref` | `ref` |
| `srv - user_agent` | `user_agent` |
| `srv - session_attributes_encoded` | `session_attributes_encoded` |

**Constantes:**
- `GA4 - ID` → G-XXXXXXXXXX
- `Pixel Facebook` → ID do Pixel
- `Meta token` → Access Token da API de Conversões
- `Tag Google ads` → AW-XXXXXXXXX

### 4.2 Triggers

| Nome | Tipo | Configuração |
|------|------|-------------|
| `Todos eventos` | Sempre | — |
| `GA4 - page_view` | Evento personalizado | `page_view` |
| `GA4 - Generate Lead` | Evento personalizado | `generate_lead` |
| `Exceção - user_engagement` | Evento personalizado (EXCEÇÃO) | `user_engagement\|scroll` (regex) |

### 4.3 Tags

#### GA4 — Todos os Eventos
- Tipo: GA4 (server-side)
- Measurement ID: `{{GA4 - ID}}`
- Trigger: Todos eventos
- Exceção: user_engagement

#### Meta — Todos os Eventos
- Tipo: Facebook Conversion API
- Facebook Pixel ID: `{{Pixel Facebook}}` ← **Atenção: verificar que está sem aspas**
- API Access Token: `{{Meta token}}`
- Event Name Method: inherit (herda nome do evento GA4)
- User data: em, ph, fn, ln, external_id, fbp, fbc, ct, st, zp, country
- Event data: event_id (para deduplicação), action_source: website
- Trigger: GA4 - Generate Lead (ou Todos eventos conforme necessidade)

#### Google Ads — Vinculador de Conversões
- Tipo: Vinculador de conversões (server-side)
- Trigger: Todos eventos

#### Google Ads — Remarketing
- Tipo: Google Ads Remarketing
- Conversion ID: `{{Tag Google ads}}`
- Trigger: GA4 - page_view

#### Google Ads — Acompanhamento de Conversão
- Tipo: Google Ads Conversion Tracking
- Conversion ID + Conversion Label: do cliente
- Trigger: GA4 - Generate Lead

#### Google Ads — DATA Event (Enhanced Conversions)
- Tipo: Google Ads User-Provided Data Event
- Trigger: GA4 - Generate Lead

#### n8n — Eventos GTM
- Tipo: HTTP Request
- URL: `https://SEU-N8N.com/webhook/WEBHOOK-ID`
- Method: POST
- Body: JSON com todos os campos mapeados
- Trigger: Todos eventos
- Exceção: user_engagement

**Body do HTTP Request (JSON):**
```json
{
  "event_name": "{{srv - event_name}}",
  "session_id": "{{srv - session_id}}",
  "client_id": "{{srv - client_id}}",
  "ga_client_id": "{{srv - ga_client_id}}",
  "external_id": "{{srv - external_id}}",
  "event_id": "{{srv - event_id}}",
  "page_url": "{{srv - page_location}}",
  "page_path": "{{srv - page_path}}",
  "page_hostname": "{{srv - page_hostname}}",
  "referrer": "{{srv - page_referrer}}",
  "landing_page": "{{srv - landing_page}}",
  "origin_page": "{{srv - origin_page}}",
  "ref": "{{srv - ref}}",
  "utm_source": "{{srv - utm_source}}",
  "utm_medium": "{{srv - utm_medium}}",
  "utm_campaign": "{{srv - utm_campaign}}",
  "utm_content": "{{srv - utm_content}}",
  "utm_term": "{{srv - utm_term}}",
  "ft_utm_source": "{{srv - ft_utm_source}}",
  "ft_utm_medium": "{{srv - ft_utm_medium}}",
  "ft_utm_campaign": "{{srv - ft_utm_campaign}}",
  "ft_utm_content": "{{srv - ft_utm_content}}",
  "ft_utm_term": "{{srv - ft_utm_term}}",
  "gclid": "{{srv - gclid}}",
  "fbclid": "{{srv - fbclid}}",
  "ttclid": "{{srv - ttclid}}",
  "gbraid": "{{srv - gbraid}}",
  "wbraid": "{{srv - wbraid}}",
  "gad_campaignid": "{{srv - gad_campaignid}}",
  "gad_source": "{{srv - gad_source}}",
  "msclkid": "{{srv - msclkid}}",
  "li_fat_id": "{{srv - li_fat_id}}",
  "twclid": "{{srv - twclid}}",
  "sck": "{{srv - sck}}",
  "fbc": "{{srv - fbc}}",
  "fbp": "{{srv - fbp}}",
  "ttp": "{{srv - ttp}}",
  "geo_country": "{{srv - geo_country}}",
  "geo_state": "{{srv - geo_state}}",
  "geo_city": "{{srv - geo_city}}",
  "geo_zip": "{{srv - geo_zip}}",
  "email": "{{srv - email}}",
  "phone": "{{srv - phone}}",
  "first_name": "{{srv - first_name}}",
  "last_name": "{{srv - last_name}}",
  "scroll_depth": "{{srv - scroll_depth}}",
  "time_on_page": "{{srv - time_on_page}}",
  "user_agent": "{{srv - user_agent}}",
  "first_visit": "{{srv - first_visit}}",
  "session_attributes_encoded": "{{srv - session_attributes_encoded}}"
}
```

---

## PARTE 5 — N8N WORKFLOW

### 5.1 Estrutura do Workflow

```
[Webhook GTM] 
    → [Mapear Campos]
    → [IF: event_name == generate_lead?]
        → TRUE: [HTTP GET Supabase] → [Code: Calcular Score] → [Supabase: Inserir]
        → FALSE: [Supabase: Inserir]
```

### 5.2 Node: Webhook GTM
- Método: POST
- Path: `/webhook/gtm-eventos` (personalizar por cliente)
- Authentication: nenhuma (IP whitelist no n8n se possível)

### 5.3 Node: Mapear Campos (Set)
Mapear todos os campos do body para variáveis organizadas. Principais:

```
event_name     → {{ $json.body.event_name }}
session_id     → {{ $json.body.session_id }}
email          → {{ $json.body.email }}
(... todos os campos)
```

### 5.4 Node: IF
- Condição: `{{ $json.event_name }}` **igual a** `generate_lead`

### 5.5 Node: HTTP GET Supabase (buscar eventos da sessão)
- Method: GET
- URL: `https://SEU-PROJETO.supabase.co/rest/v1/events`
- Query Parameters:
  - `session_id`: `eq.{{ $json.session_id }}`
  - `select`: `event_name,scroll_depth,time_on_page`
- Headers:
  - `apikey`: anon key do Supabase
  - `Authorization`: `Bearer [anon key]`

### 5.6 Node: Code (Calcular Lead Score)

```javascript
const lead = $('If').first().json;
const resposta = $input.first().json;
const eventos = resposta.body || resposta || [];

// Maior scroll depth da sessão
const scrollEvents = eventos.filter(e => e.event_name === 'scroll_depth' && e.scroll_depth);
const maxScroll = scrollEvents.reduce((max, e) => Math.max(max, parseInt(e.scroll_depth) || 0), 0);

// Quantidade de heartbeats
const heartbeats = eventos.filter(e => e.event_name === 'time_on_page_heartbeat').length;

// Tempo na página (do generate_lead ou estimado via heartbeats)
const heartbeatEvents = eventos.filter(e => e.event_name === 'time_on_page_heartbeat' && e.time_on_page);
const estimatedTime = heartbeatEvents.length > 0 
  ? Math.max(...heartbeatEvents.map(e => e.time_on_page || 0))
  : 0;
const timeOnPage = lead.time_on_page || estimatedTime;

// Calcular score
let score = 0;

// Scroll (max 30pts)
if (maxScroll >= 90) score += 30;
else if (maxScroll >= 75) score += 20;
else if (maxScroll >= 50) score += 10;
else if (maxScroll >= 25) score += 5;

// Tempo (max 40pts)
if (timeOnPage >= 300) score += 40;
else if (timeOnPage >= 120) score += 30;
else if (timeOnPage >= 60) score += 20;
else if (timeOnPage >= 30) score += 10;

// Heartbeats (max 30pts)
score += Math.min(heartbeats * 10, 30);

// Temperatura
let temperature;
if (score >= 81) temperature = 'muito quente';
else if (score >= 61) temperature = 'quente';
else if (score >= 31) temperature = 'morno';
else temperature = 'frio';

return [{ json: { ...lead, lead_score: score, lead_temperature: temperature } }];
```

### 5.7 Node: Supabase Inserir (ambas as branches)
- Operação: Insert
- Table: `events`
- Campos: todos os mapeados + lead_score e lead_temperature (quando vierem do Code node)

---

## PARTE 6 — CONFIGURAÇÕES POR CLIENTE

### Checklist de Implementação

**Supabase:**
- [ ] Criar projeto
- [ ] Criar tabela `events` com SQL acima
- [ ] Criar view `events_br` com timezone correto
- [ ] Anotar: Project URL, anon key

**GTM Web:**
- [ ] Criar container web
- [ ] Importar container base OU criar manualmente
- [ ] Atualizar variável `GA4 - ID` com ID do cliente
- [ ] Atualizar variável `Pixel META ADS` com ID do Pixel do cliente
- [ ] Atualizar variável `Tag Google ads` com conta do cliente
- [ ] Atualizar variável `00 - API - Server URL` com URL do server container
- [ ] Atualizar variável `COOKIE_DOMAIN` no script de tracking
- [ ] Adaptar seletor do formulário no script
- [ ] Publicar

**GTM Server:**
- [ ] Criar container server (Google Cloud ou Stape.io)
- [ ] Importar container base OU criar manualmente
- [ ] Atualizar `GA4 - ID`
- [ ] Atualizar `Pixel Facebook` (sem aspas! só o número)
- [ ] Atualizar `Meta token` com Access Token CAPI
- [ ] Atualizar `Tag Google ads`
- [ ] Atualizar URL do webhook n8n na tag HTTP Request
- [ ] Publicar

**n8n:**
- [ ] Criar workflow
- [ ] Configurar webhook URL
- [ ] Atualizar URL do Supabase
- [ ] Atualizar apikey do Supabase
- [ ] Ativar workflow

**Verificação:**
- [ ] Abrir landing page com parâmetros UTM + click IDs
- [ ] Confirmar page_view no Supabase
- [ ] Scrollar até 90% → confirmar scroll_depth no Supabase
- [ ] Aguardar 30s+ → confirmar heartbeats no Supabase
- [ ] Submeter formulário → confirmar generate_lead com lead_score
- [ ] Verificar Tag Assistant: GA4 ✅ | Google Ads ✅ | Meta CAPI ✅
- [ ] Verificar Meta Events Manager (match rate)
- [ ] Verificar Google Ads (Enhanced Conversions)

---

## PARTE 7 — TROUBLESHOOTING

### session_id chegando null
→ Verificar se tag GA4 tem parâmetro `apex_session_id` mapeado para `{{jsc - SessionID}}`
→ Verificar se o script de tracking está disparando antes do GTM

### scroll_depth ou time_on_page null
→ Verificar variável `srv - scroll_depth` lendo chave correta (`scroll_depth`)
→ Verificar variável `srv - time_on_page` lendo chave `time_on_page` (não `time_on_page_at_submit`)

### Meta CAPI falhando
→ Verificar campo `Facebook Pixel ID`: deve ser só o número (ex: `2093848011456885`), sem aspas, sem `{{}}`
→ Verificar Access Token não expirado

### lead_score sempre 0
→ Verificar se HTTP GET está retornando eventos (testar URL no browser)
→ Verificar session_id populado corretamente
→ No Code node, `$('If')` busca dados do node IF, não do Mapear Campos

### user_engagement salvando no Supabase
→ Na tag `n8n - Eventos GTM`, adicionar exceção com trigger `Exceção - user_engagement`
→ Trigger de exceção: Event name `user_engagement|scroll` com regex ativado

### Dois page_views com UTMs diferentes na mesma sessão
→ Normal quando usuário navega de outra página sem UTMs — last-touch UTMs serão da visita sem parâmetros
→ Verificar lógica de first-touch (ft_utm_*) que não deve ser sobrescrita

---

## PARTE 8 — SCORING PERSONALIZADO

O scoring padrão é 0-100pts. Para ajustar por cliente:

```
Scroll depth (max 30pts):
  90% = 30pts | 75% = 20pts | 50% = 10pts | 25% = 5pts

Tempo na página (max 40pts):
  300s+ = 40pts | 120s+ = 30pts | 60s+ = 20pts | 30s+ = 10pts

Heartbeats/engajamento (max 30pts):
  3+ heartbeats = 30pts | 2 = 20pts | 1 = 10pts

Temperatura:
  0-30 = frio | 31-60 = morno | 61-80 = quente | 81-100 = muito quente
```

Para clientes com funis mais longos ou produtos de alto ticket, considerar adicionar:
- Pontos por cliques em elementos específicos (CTA, depoimentos)
- Pontos por número de visitas (sessões anteriores)
- Pontos por origem (branded search > direct > paid > organic)

---

## PARTE 9 — OFFLINE CONVERSION TRACKING (Pipedrive → Google Ads + Meta Ads)

### Conceito

Quando um lead é gerado na landing page, os dados de atribuição (gclid, fbclid, gbraid, wbraid, UTMs, session_attributes_encoded) são enviados ao Pipedrive como campos customizados do deal. Quando o deal fecha (venda confirmada), o n8n busca esses deals periodicamente e envia a conversão com o valor real de volta ao Google Ads e Meta Ads.

Resultado: as campanhas são otimizadas para **receita real**, não apenas leads.

---

### 9.1 Campos Customizados no Pipedrive

Criar os seguintes campos customizados em **Configurações → Campos de dados → Negócios**:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `gclid` | Text | Click ID Google Ads |
| `gbraid` | Text | Click ID Google (app) |
| `wbraid` | Text | Click ID Google (web-to-app) |
| `fbclid` | Text | Click ID Meta Ads |
| `session_attributes_encoded` | Text | Dados de sessão codificados |
| `utm_source` | Text | Fonte last-touch |
| `utm_medium` | Text | Meio last-touch |
| `utm_campaign` | Text | Campanha last-touch |
| `utm_content` | Text | Conteúdo last-touch |
| `utm_term` | Text | Termo last-touch |
| `gad_campaignid` | Text | ID da campanha Google Ads |
| `gad_source` | Text | Fonte Google Ads |
| `lead_score` | Number | Score calculado (0-100) |
| `lead_temperature` | Text | frio / morno / quente / muito quente |

> Após criar os campos, anotar o **ID de cada campo** (ex: `abc123_gclid`) — será necessário no mapeamento do n8n.

---

### 9.2 Envio para o Pipedrive (no fluxo de generate_lead)

No n8n, após salvar o evento no Supabase, adicionar um node para criar o deal no Pipedrive com todos os campos de atribuição:

**Node: Pipedrive — Create Deal**
```
Título: {{ $json.first_name }} {{ $json.last_name }} — {{ $json.utm_campaign }}
Email: {{ $json.email }}
Telefone: {{ $json.phone }}
Empresa: (capturar do formulário se disponível)
Funil: ID do funil correto no Pipedrive

Campos customizados:
  gclid                     → {{ $json.gclid }}
  gbraid                    → {{ $json.gbraid }}
  wbraid                    → {{ $json.wbraid }}
  fbclid                    → {{ $json.fbclid }}
  session_attributes_encoded → {{ $json.session_attributes_encoded }}
  utm_source                → {{ $json.utm_source }}
  utm_medium                → {{ $json.utm_medium }}
  utm_campaign              → {{ $json.utm_campaign }}
  utm_content               → {{ $json.utm_content }}
  utm_term                  → {{ $json.utm_term }}
  gad_campaignid            → {{ $json.gad_campaignid }}
  gad_source                → {{ $json.gad_source }}
  lead_score                → {{ $json.lead_score }}
  lead_temperature          → {{ $json.lead_temperature }}
```

---

### 9.3 Workflow n8n — Retorno de Conversões

**Estrutura:**
```
[Schedule Trigger — diário ou por hora]
    ↓
[Manual Trigger — para testes]
    ↓
[Pipedrive — Get many deals]
  Filtro: status = won (deals ganhos)
  Filtro: data de fechamento = ontem (ou range configurável)
    ↓
[IF: tem gclid OU gbraid OU wbraid?]
  → TRUE: [Formatar Google Ads] → [Google Sheets — Append]
[IF: tem fbclid?]
  → TRUE: [Formatar Meta Ads] → [HTTP POST — Meta Graph API]
              ├→ BM principal
              └→ BM secundária (se houver)
```

---

### 9.4 Node: Pipedrive — Get Many Deals

- **Operation:** Get All
- **Resource:** Deal
- **Filters:**
  - Status: `won`
  - Stage ID: estágio de "ganho" do funil do cliente
- **Additional Fields:**
  - Start: data de ontem (para processar conversões do dia anterior)

```javascript
// Filtro de data no n8n (Set node antes do Pipedrive):
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const dateStr = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD
```

---

### 9.5 Node: Formatar Google Ads

**Code node — transformar deal em linha para o Google Sheets:**

```javascript
const deals = $input.all();
const rows = [];

for (const deal of deals) {
  const d = deal.json;
  
  // Pegar campos customizados (IDs variam por conta Pipedrive)
  const gclid = d['abc123_gclid'] || '';
  const gbraid = d['abc123_gbraid'] || '';
  const wbraid = d['abc123_wbraid'] || '';
  
  // Só processar se tiver click ID Google
  if (!gclid && !gbraid && !wbraid) continue;
  
  rows.push({
    json: {
      'Google Click ID': gclid || gbraid || wbraid,
      'Conversion Name': 'Venda', // nome da conversão no Google Ads
      'Conversion Time': d.won_time || d.close_time || new Date().toISOString(),
      'Conversion Value': d.value || 0,
      'Currency Code': d.currency || 'BRL',
      'Deal ID': d.id,
      'Email': d.person_id?.email?.[0]?.value || '',
    }
  });
}

return rows;
```

**Google Sheets — Append Row:**
- Planilha dedicada por cliente
- Colunas: Google Click ID, Conversion Name, Conversion Time, Conversion Value, Currency Code, Deal ID, Email
- Essa planilha é importada manualmente no Google Ads OU via API (ver seção 9.7)

---

### 9.6 Node: Formatar + Enviar Meta Ads (Offline Conversions API)

**Code node — preparar payload Meta:**

```javascript
const crypto = require('crypto');

function sha256(value) {
  if (!value) return '';
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

const deals = $input.all();
const events = [];

for (const deal of deals) {
  const d = deal.json;
  const fbclid = d['abc123_fbclid'] || '';
  
  if (!fbclid) continue;
  
  const email = d.person_id?.email?.[0]?.value || '';
  const phone = d.person_id?.phone?.[0]?.value || '';
  const wonTime = Math.floor(new Date(d.won_time || d.close_time).getTime() / 1000);
  
  events.push({
    event_name: 'Purchase', // ou 'CompleteRegistration', 'Lead', etc.
    event_time: wonTime,
    action_source: 'website',
    user_data: {
      em: [sha256(email)],
      ph: [sha256(phone)],
      fbc: fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined,
    },
    custom_data: {
      value: d.value || 0,
      currency: d.currency || 'BRL',
      order_id: String(d.id),
    },
  });
}

return [{ json: { data: events } }];
```

**HTTP Request — Meta Graph API:**
- Method: POST
- URL: `https://graph.facebook.com/v18.0/PIXEL_ID/events`
- Query Params:
  - `access_token`: Token da BM
- Body (JSON):
  ```json
  {
    "data": {{ $json.data }},
    "test_event_code": "TEST12345"  // remover em produção
  }
  ```

> Duplicar o HTTP Request node para enviar para a BM secundária quando necessário.

---

### 9.7 Google Ads — Importação via API (avançado)

Para automação completa sem Google Sheets manual, usar a **Google Ads API — Offline Conversion Import**:

```
POST https://googleads.googleapis.com/v14/customers/{customer_id}/offlineUserDataJobs
```

Campos obrigatórios:
- `gclid`: o click ID capturado
- `conversion_action`: resource name da conversão configurada no Google Ads
- `conversion_date_time`: data/hora no formato `YYYY-MM-DD HH:MM:SS+00:00`
- `conversion_value`: valor em moeda local
- `currency_code`: BRL

> ⚠️ A Google Ads API requer OAuth2. Para implementação simplificada, usar o método Google Sheets + importação manual ou via Zapier/Make.

---

### 9.8 Checklist — Offline Conversions por Cliente

**Pipedrive:**
- [ ] Criar campos customizados (gclid, fbclid, gbraid, wbraid, UTMs, session_attributes_encoded)
- [ ] Anotar IDs de cada campo customizado
- [ ] Configurar funil correto e estágio "ganho"

**n8n — Workflow de retorno:**
- [ ] Criar workflow com Schedule Trigger (ex: diário às 8h)
- [ ] Configurar Get many deals com filtro de deals ganhos
- [ ] Mapear campos customizados do Pipedrive pelos IDs corretos
- [ ] Configurar Google Sheets com planilha do cliente
- [ ] Configurar HTTP Request para Meta Graph API com Pixel e token corretos
- [ ] Testar com `test_event_code` antes de ativar em produção
- [ ] Remover `test_event_code` em produção

**Google Ads:**
- [ ] Criar ação de conversão "Venda" (tipo: importar)
- [ ] Configurar importação da planilha Google Sheets (manual ou agendada)
- [ ] Verificar janela de conversão (recomendado: 90 dias)

**Meta Ads:**
- [ ] Verificar pixel e BM com acesso ao dataset de conversões offline
- [ ] Testar no Events Manager com test_event_code
- [ ] Confirmar match rate (ideal: >70%)

---

### 9.9 Campos que fluem do tracking até o Pipedrive

Abaixo o mapa completo dos dados que percorrem toda a jornada:

```
Landing Page → GTM → n8n → Supabase → Pipedrive → n8n → Google/Meta

Campo               | LP Script | Supabase | Pipedrive | Google Ads | Meta Ads
--------------------|-----------|----------|-----------|------------|----------
gclid               |    ✓      |    ✓     |     ✓     |     ✓      |    —
gbraid              |    ✓      |    ✓     |     ✓     |     ✓      |    —
wbraid              |    ✓      |    ✓     |     ✓     |     ✓      |    —
fbclid              |    ✓      |    ✓     |     ✓     |     —      |    ✓
fbc (cookie)        |    ✓      |    ✓     |     —     |     —      |    ✓
fbp (cookie)        |    ✓      |    ✓     |     —     |     —      |    ✓
utm_source          |    ✓      |    ✓     |     ✓     |     —      |    —
utm_campaign        |    ✓      |    ✓     |     ✓     |     —      |    —
email (hash)        |    ✓      |    ✓     |     ✓     |     ✓      |    ✓
phone (hash)        |    ✓      |    ✓     |     ✓     |     ✓      |    ✓
session_encoded     |    ✓      |    ✓     |     ✓     |     —      |    —
deal_value          |    —      |    —     |     ✓     |     ✓      |    ✓
currency_code       |    —      |    —     |     ✓     |     ✓      |    ✓
lead_score          |    —      |    ✓     |     ✓     |     —      |    —
```

---

### 9.10 Troubleshooting — Offline Conversions

**Deals não aparecem no workflow:**
→ Verificar filtro de data no Schedule Trigger
→ Confirmar que o deal está com status `won` no Pipedrive
→ Testar com "When clicking Execute workflow" para rodar manualmente

**gclid / fbclid chegando vazio no Pipedrive:**
→ Verificar se o campo customizado foi criado corretamente no Pipedrive
→ Confirmar que o n8n está mapeando pelo ID correto do campo (não pelo nome)
→ Checar se o script de tracking está salvando o click ID em cookie corretamente

**Meta rejeitando eventos:**
→ Verificar se o `event_time` não está no futuro
→ Confirmar que o token da BM não expirou
→ Verificar se o Pixel ID está correto para a BM usada
→ Match rate baixo: adicionar mais user_data (ph, fn, ln, ct, st, zp)

**Google Ads não processando conversões:**
→ Verificar janela de conversão (gclid expira em 90 dias por padrão)
→ Confirmar formato da data: `YYYY-MM-DD HH:MM:SS+timezone`
→ Verificar se a ação de conversão está configurada como "Importar"
