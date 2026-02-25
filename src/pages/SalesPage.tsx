import { useState, useCallback, useEffect, useRef, FormEvent } from "react";
import {
  Check,
  ArrowRight,
  X,
  Shield,
  Loader2,
  Zap,
  Eye,
  GitBranch,
  Layers,
  Users,
  Target,
  BarChart3,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Tracking configuration placeholders
// ---------------------------------------------------------------------------
const COOKIE_DOMAIN = ".evolutto.com";
const WEBHOOK_URL = "https://WEBHOOK_URL_PLACEHOLDER";

// ---------------------------------------------------------------------------
// IntersectionObserver hook for scroll-reveal animations
// ---------------------------------------------------------------------------
const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

// ---------------------------------------------------------------------------
// Reusable animated wrapper — fade-up on scroll
// ---------------------------------------------------------------------------
const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const { ref, isInView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Gradient divider between sections
// ---------------------------------------------------------------------------
const SectionDivider = () => (
  <div className="relative h-px w-full max-w-5xl mx-auto">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />
  </div>
);

// ---------------------------------------------------------------------------
// Phone mask for Brazilian format (XX) XXXXX-XXXX
// ---------------------------------------------------------------------------
const applyPhoneMask = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const match = digits.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
  if (!match) return value;
  return !match[2]
    ? match[1]
    : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`;
};

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------
const SalesPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [phone, setPhone] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // -----------------------------------------------------------------------
  // Scroll to form helper
  // -----------------------------------------------------------------------
  const scrollToForm = useCallback(() => {
    const formSection = document.getElementById("cta-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // -----------------------------------------------------------------------
  // TRACKING SCRIPT — runs once on mount
  // Adapted from tracking-integration.md into a React useEffect
  // -----------------------------------------------------------------------
  useEffect(() => {
    try {
      const DOMAIN = COOKIE_DOMAIN;
      const MAX_AGE = 63072000; // 2 years

      const utms = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
      ];
      const clicks = [
        "gclid",
        "gbraid",
        "wbraid",
        "fbclid",
        "ttclid",
        "gad_campaignid",
        "gad_source",
        "msclkid",
        "li_fat_id",
        "twclid",
        "sck",
      ];

      // Helpers
      function getCookie(name: string): string | null {
        const match = document.cookie.match(
          new RegExp("(^| )" + name + "=([^;]+)")
        );
        return match ? decodeURIComponent(match[2]) : null;
      }

      function setCookie(name: string, value: string) {
        document.cookie =
          name +
          "=" +
          encodeURIComponent(value) +
          ";max-age=" +
          MAX_AGE +
          ";path=/;domain=" +
          DOMAIN +
          ";SameSite=None;Secure";
      }

      function setCookieFirstTouch(name: string, value: string) {
        if (getCookie(name)) return;
        setCookie(name, value);
      }

      function getParam(name: string): string | null {
        return new URLSearchParams(window.location.search).get(name);
      }

      function isInternalReferrer(referrer: string): boolean {
        if (!referrer) return false;
        try {
          const ref = new URL(referrer).hostname;
          const cur = window.location.hostname;
          return (
            ref === cur ||
            ref.endsWith("." + cur.replace("www.", "")) ||
            cur.endsWith("." + ref.replace("www.", ""))
          );
        } catch {
          return false;
        }
      }

      // Session ID
      const sessionId = (() => {
        try {
          const key = "lp_session_id";
          let s = sessionStorage.getItem(key);
          if (!s) {
            s =
              Date.now() +
              "_" +
              Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem(key, s);
          }
          return s;
        } catch {
          return (
            Date.now() +
            "_" +
            Math.random().toString(36).substr(2, 9)
          );
        }
      })();

      // Referrer mapping
      const referrerMap: Record<
        string,
        { utm_source: string; utm_medium: string; [k: string]: string }
      > = {
        "google.com": { utm_source: "google", utm_medium: "organic" },
        "bing.com": { utm_source: "bing", utm_medium: "organic" },
        "yahoo.com": { utm_source: "yahoo", utm_medium: "organic" },
        "duckduckgo.com": {
          utm_source: "duckduckgo",
          utm_medium: "organic",
        },
        "instagram.com": {
          utm_source: "instagram",
          utm_medium: "organic",
        },
        "youtube.com": { utm_source: "youtube", utm_medium: "organic" },
        "facebook.com": {
          utm_source: "facebook",
          utm_medium: "organic",
        },
        "twitter.com": { utm_source: "twitter", utm_medium: "organic" },
        "x.com": { utm_source: "twitter", utm_medium: "organic" },
        "linkedin.com": {
          utm_source: "linkedin",
          utm_medium: "organic",
        },
        "tiktok.com": { utm_source: "tiktok", utm_medium: "organic" },
        "whatsapp.com": {
          utm_source: "whatsapp",
          utm_medium: "organic",
        },
        "chat.openai.com": { utm_source: "chatgpt", utm_medium: "ai" },
        "chatgpt.com": { utm_source: "chatgpt", utm_medium: "ai" },
        "claude.ai": { utm_source: "claude", utm_medium: "ai" },
      };

      // 1. UTMs from URL — first touch
      const hasUtmInUrl = utms.some((p) => !!getParam(p));
      if (hasUtmInUrl) {
        utms.forEach((p) => {
          setCookieFirstTouch(p, getParam(p) || "");
        });
      } else {
        const referrer = document.referrer || "";
        if (referrer && !isInternalReferrer(referrer)) {
          for (const domain in referrerMap) {
            if (referrer.indexOf(domain) !== -1) {
              const map = referrerMap[domain];
              utms.forEach((p) => {
                setCookieFirstTouch(p, map[p] || "");
              });
              break;
            }
          }
        }
      }

      // 2. Click params — first touch
      clicks.forEach((p) => {
        const val = getParam(p);
        if (val) setCookieFirstTouch(p, val);
      });

      // 3. Generate _fbc if fbclid present
      const fbclid = getParam("fbclid");
      if (fbclid && !getCookie("_fbc")) {
        setCookie("_fbc", "fb.1." + Date.now() + "." + fbclid);
      }

      // 4. First visit, landing page, origin page
      if (!getCookie("first_visit")) {
        setCookie("first_visit", new Date().toISOString());
      }
      if (!getCookie("landing_page")) {
        setCookie("landing_page", window.location.href);
      }
      if (!getCookie("origin_page")) {
        const originRef = document.referrer || "";
        if (originRef && !isInternalReferrer(originRef)) {
          setCookie("origin_page", originRef);
        }
      }

      // 5. Ref param
      const refParam = getParam("ref");
      if (refParam && !getCookie("ref")) {
        setCookie("ref", refParam);
      }

      // 6. User agent
      setCookie("user_agent", navigator.userAgent);

      // 7. Session attributes encoded
      const sessionAttrs: Record<string, string> = {
        utm_source: getCookie("utm_source") || "",
        utm_medium: getCookie("utm_medium") || "",
        utm_campaign: getCookie("utm_campaign") || "",
        utm_content: getCookie("utm_content") || "",
        utm_term: getCookie("utm_term") || "",
        gclid: getCookie("gclid") || "",
        fbclid: getCookie("fbclid") || "",
        ttclid: getCookie("ttclid") || "",
        msclkid: getCookie("msclkid") || "",
        landing_page: getCookie("landing_page") || "",
        origin_page: getCookie("origin_page") || "",
        first_visit: getCookie("first_visit") || "",
        ref: getCookie("ref") || "",
      };
      try {
        setCookie(
          "session_attributes_encoded",
          btoa(JSON.stringify(sessionAttrs))
        );
      } catch {
        /* ignore */
      }

      // 8. Fill hidden inputs
      utms.concat(clicks).forEach((p) => {
        const val = getCookie(p);
        if (!val) return;
        document
          .querySelectorAll<HTMLInputElement>(
            `input[name="${p}"], input[data-field-id="${p}"]`
          )
          .forEach((f) => {
            f.value = val;
          });
      });

      const sessionIdInput = document.getElementById(
        "hidden_session_id"
      ) as HTMLInputElement | null;
      if (sessionIdInput) sessionIdInput.value = sessionId;

      const lpInput = document.querySelector<HTMLInputElement>(
        'input[data-field-id="landing_page"]'
      );
      if (lpInput)
        lpInput.value = getCookie("landing_page") || window.location.href;

      const opInput = document.querySelector<HTMLInputElement>(
        'input[data-field-id="origin_page"]'
      );
      if (opInput)
        opInput.value =
          getCookie("origin_page") || document.referrer || "";

      const saeInput = document.querySelector<HTMLInputElement>(
        'input[data-field-id="session_attributes_encoded"]'
      );
      if (saeInput)
        saeInput.value =
          getCookie("session_attributes_encoded") || "";

      // 9. DataLayer
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).dataLayer = (window as any).dataLayer || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dl: Record<string, any> = {};

      utms.concat(clicks).forEach((p) => {
        const val = getCookie(p);
        if (val) dl["ft_" + p] = val;
      });

      utms.forEach((p) => {
        const fromUrl = getParam(p);
        if (fromUrl) {
          dl[p] = fromUrl;
        } else {
          const ref = document.referrer;
          let detected: (typeof referrerMap)[string] | null = null;
          if (ref) {
            for (const d in referrerMap) {
              if (ref.indexOf(d) !== -1) {
                detected = referrerMap[d];
                break;
              }
            }
          }
          if (detected && p === "utm_source")
            dl[p] = detected.utm_source;
          else if (detected && p === "utm_medium")
            dl[p] = detected.utm_medium;
          else dl[p] = getCookie(p) || "";
        }
      });

      clicks.forEach((p) => {
        const fromUrl = getParam(p);
        dl[p] = fromUrl || getCookie(p) || "";
      });

      dl.session_id = sessionId;
      dl.landing_page = getCookie("landing_page") || "";
      dl.origin_page = getCookie("origin_page") || "";
      dl.first_visit = getCookie("first_visit") || "";
      dl.ref = getCookie("ref") || "";
      dl.user_agent = navigator.userAgent;
      dl.session_attributes_encoded =
        getCookie("session_attributes_encoded") || "";

      if (Object.keys(dl).length)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).dataLayer.push(dl);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).dataLayer.push({
        event: "custom_page_view",
        session_id: sessionId,
        page_url: window.location.href,
        page_path: window.location.pathname,
        page_hostname: window.location.hostname,
        referrer: document.referrer || "",
      });

      // 10. Scroll Depth
      const milestones = [25, 50, 75, 90];
      const reached: Record<number, boolean> = {};
      const pageStart = Date.now();

      const handleScroll = () => {
        const doc = document.documentElement;
        const body = document.body;
        const scrollTop = doc.scrollTop || body.scrollTop;
        const scrollHeight =
          Math.max(doc.scrollHeight, body.scrollHeight) -
          doc.clientHeight;
        if (scrollHeight <= 0) return;
        const pct = Math.round((scrollTop / scrollHeight) * 100);
        milestones.forEach((m) => {
          if (!reached[m] && pct >= m) {
            reached[m] = true;
            const timeOnPage = Math.round(
              (Date.now() - pageStart) / 1000
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).dataLayer.push({
              event: "scroll_depth",
              session_id: sessionId,
              scroll_depth: m,
              time_on_page: timeOnPage,
              page_path: window.location.pathname,
            });
          }
        });
      };
      window.addEventListener("scroll", handleScroll, { passive: true });

      // 11. Time on page heartbeat
      let heartbeatCount = 0;
      const hb = setInterval(() => {
        heartbeatCount++;
        const timeOnPage = Math.round(
          (Date.now() - pageStart) / 1000
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).dataLayer.push({
          event: "time_on_page_heartbeat",
          session_id: sessionId,
          time_on_page: timeOnPage,
          heartbeat: heartbeatCount,
          page_path: window.location.pathname,
        });
        if (heartbeatCount >= 20) clearInterval(hb);
      }, 30000);

      // Cleanup
      return () => {
        window.removeEventListener("scroll", handleScroll);
        clearInterval(hb);
      };
    } catch (err) {
      console.error("[Tracking] Init error:", err);
    }
  }, []);

  // -----------------------------------------------------------------------
  // Form submission handler
  // -----------------------------------------------------------------------
  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      setFormError("");

      try {
        const form = formRef.current;
        if (!form) return;

        const formData = new FormData(form);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: Record<string, any> = {};
        formData.forEach((value, key) => {
          if (!value) return;
          // Collect multiple checkbox values as array
          if (key === "company_type") {
            if (!payload[key]) payload[key] = [];
            (payload[key] as string[]).push(value as string);
          } else {
            payload[key] = value;
          }
        });

        // Clean phone digits
        const rawPhone = (payload.phone || "").replace(/\D/g, "");
        payload.phone = rawPhone;

        // Name splitting
        const leadName = (payload.name || "").trim();
        const nameParts = leadName.split(" ");
        payload.first_name = nameParts[0] || "";
        payload.last_name = nameParts.slice(1).join(" ") || "";

        // Session
        let sessionId = "";
        try {
          sessionId = sessionStorage.getItem("lp_session_id") || "";
        } catch {
          /* ignore */
        }
        payload.session_id = sessionId;
        payload.page_url = window.location.href;
        payload.page_path = window.location.pathname;
        payload.referrer = document.referrer || "";
        payload.submitted_at = new Date().toISOString();

        // DataLayer form_submit event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).dataLayer = (window as any).dataLayer || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).dataLayer.push({
          event: "form_submit",
          session_id: sessionId,
          lead_name: leadName,
          lead_email: payload.email || "",
          lead_phone: rawPhone,
          lead_first_name: payload.first_name,
          lead_last_name: payload.last_name,
          lead_role: payload.role || "",
          lead_company_type: payload.company_type || "",
          lead_team_size: payload.team_size || "",
        });

        // POST to webhook
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setFormSuccess(true);
        } else {
          throw new Error("Erro no envio");
        }
      } catch (err) {
        console.error("[Form] Erro:", err);
        setFormError("Erro ao enviar. Tente novamente.");
        setTimeout(() => setFormError(""), 5000);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting]
  );

  // -----------------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden selection:bg-emerald-500/30 selection:text-white">
      {/* ── Google Fonts ─────────────────────────────────────────────── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* ── Global background decorations ────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large emerald orb top-left */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-emerald-500/[0.07] rounded-full blur-[150px]" />
        {/* Secondary orb bottom-right */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/[0.05] rounded-full blur-[130px]" />
        {/* Subtle mid orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/[0.03] rounded-full blur-[160px]" />
        {/* Dot-grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ================================================================
          SECTION 1 — HERO
          The protocol has been revealed. Massive impact.
      ================================================================ */}
      <section className="relative z-10 px-5 pt-20 pb-24 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-10 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              Protocolo revelado
            </div>

            {/* Main headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Sua consultoria não precisa de
              <br className="hidden sm:block" /> mais uma ferramenta.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                Precisa de um sistema.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
              A <span className="text-white font-semibold">Evolutto</span> é o
              sistema operacional que liberta consultorias da
              dependência do dono — para escalar com
              método, controle e previsibilidade.
            </p>

            {/* CTA Button */}
            <button
              onClick={scrollToForm}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-2xl text-lg font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-1 active:scale-[0.97]"
            >
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-2xl animate-ping bg-emerald-500/20 pointer-events-none" style={{ animationDuration: "2s" }} />
              <span className="relative flex items-center gap-3">
                Quero estruturar minha consultoria
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </button>

            {/* Trust micro-text */}
            <p className="mt-6 text-gray-500 text-sm flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Consultoria de implementação inclusa · Garantia de 30 dias
            </p>
          </AnimatedSection>

          {/* Hero image placeholder */}
          <AnimatedSection delay={250} className="mt-20">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm aspect-video flex items-center justify-center group hover:border-emerald-500/20 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-60" />
              <div className="relative flex flex-col items-center gap-4 text-gray-500">
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Layers className="w-8 h-8 text-emerald-500/50" />
                </div>
                <p className="text-sm font-medium">Imagem hero</p>
              </div>
              {/* Corner decoration */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <SectionDivider />

      {/* ================================================================
          SECTION 2 — THE PROBLEM (pain mirror)
          Connects to what Eva said in WhatsApp and calls.
      ================================================================ */}
      <section className="relative z-10 px-5 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
                <X className="w-3.5 h-3.5" />
                O problema real
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Sua consultoria cresceu.
                <br />
                <span className="text-gray-500">Sua estrutura, não.</span>
              </h2>
              <p className="mt-6 text-gray-400 text-lg max-w-xl mx-auto">
                Você sabe que algo não escala. Reconhece nesses
                sinais?
              </p>
            </div>
          </AnimatedSection>

          {/* Pain cards */}
          <div className="grid sm:grid-cols-2 gap-5 mb-14">
            {[
              {
                icon: Target,
                pain: "Você é o gargalo",
                detail:
                  "Toda decisão importante passa por você. A empresa para quando você para. O time espera, os clientes esperam, e você é o único ponto de falha.",
              },
              {
                icon: Layers,
                pain: "Ferramentas demais, controle de menos",
                detail:
                  "CRM, Notion, Slack, planilhas, BI — cada uma resolve um pedaço. Nenhuma foi pensada para consultoria. O dado se perde entre 5 abas.",
              },
              {
                icon: BarChart3,
                pain: "Crescimento desorganizado",
                detail:
                  "Mais clientes deveria significar mais margem. Mas significa mais caos, retrabalho e uma equipe cada vez mais perdida.",
              },
              {
                icon: Users,
                pain: "Gestão artesanal",
                detail:
                  "Processos vivem na cabeça de quem faz. Quando a pessoa sai, o método vai junto. Cada consultor entrega de um jeito diferente.",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 80}>
                <div className="h-full p-6 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-all duration-500 hover:-translate-y-1 group">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/15 transition-colors">
                      <item.icon className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg mb-2">
                        {item.pain}
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Conclusion statement */}
          <AnimatedSection delay={350}>
            <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent border border-white/5 text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
              <p className="text-lg sm:text-xl text-gray-300 mb-3">
                O nome disso não é desorganização.
              </p>
              <p className="text-xl sm:text-2xl text-white font-bold">
                É ausência de um{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  sistema operacional
                </span>{" "}
                pensado para consultoria.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <SectionDivider />

      {/* ================================================================
          SECTION 3 — THE SOLUTION (Evolutto)
          Three pillars, stats, team photos, social proof.
      ================================================================ */}
      <section className="relative z-10 px-5 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                <Zap className="w-3.5 h-3.5" />
                A solução
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Conheça a{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Evolutto
                </span>
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                O ecossistema para consultorias que já vendem e precisam
                governar a escala com método, controle e previsibilidade.
                Não é ferramenta. Não é curso.
                É infraestrutura.
              </p>
            </div>
          </AnimatedSection>

          {/* 3 Pillars — glassmorphism cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              {
                number: "01",
                icon: GitBranch,
                title: "Método como ativo",
                description:
                  "Seu conhecimento se transforma em processo replicável. A entrega acontece com padrão, independente de quem executa. O método é da empresa, não do consultor.",
                highlight: "Transformação disponível e replicável",
              },
              {
                number: "02",
                icon: Eye,
                title: "Operação sem o dono",
                description:
                  "Projetos, fases, responsáveis e critérios claros. O sistema decide o que pode rodar sem você. A equipe executa com autonomia e você ganha liberdade.",
                highlight: "Libertação da dependência do dono",
              },
              {
                number: "03",
                icon: BarChart3,
                title: "Escala com controle",
                description:
                  "Visibilidade total da operação em tempo real. Você enxerga a empresa funcionando sem perguntar, cobrar ou conferir. Dados, não achismos.",
                highlight: "Crescimento previsível e com margem",
              },
            ].map((pillar, i) => (
              <AnimatedSection key={pillar.number} delay={i * 120}>
                <div className="h-full relative p-7 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.07] hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/[0.05] group overflow-hidden">
                  {/* Top gradient line on hover */}
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/0 group-hover:via-emerald-500/40 to-transparent transition-all duration-500" />

                  {/* Number watermark */}
                  <span className="absolute -top-2 -right-2 text-7xl font-black text-emerald-500/[0.06] select-none">
                    {pillar.number}
                  </span>

                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mb-5 group-hover:bg-emerald-500/15 transition-colors">
                      <pillar.icon className="w-6 h-6 text-emerald-400" />
                    </div>

                    <span className="text-emerald-500/40 text-xs font-bold tracking-widest uppercase mb-2 block">
                      Pilar {pillar.number}
                    </span>
                    <h3
                      className="text-xl sm:text-2xl font-bold text-white mb-4"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {pillar.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                      {pillar.description}
                    </p>
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                      <Check className="w-4 h-4" />
                      <span>{pillar.highlight}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Stats row */}
          <AnimatedSection>
            <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-950/50 to-emerald-900/20 border border-emerald-800/25 overflow-hidden">
              {/* Decorative orb */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px]" />
              <div className="relative grid grid-cols-3 gap-6 sm:gap-10">
                {[
                  {
                    number: "200+",
                    label: "Consultorias ativas na plataforma",
                  },
                  {
                    number: "90 dias",
                    label: "Para clareza operacional completa",
                  },
                  {
                    number: "40%",
                    label: "Menos dependência do CEO",
                  },
                ].map((stat, i) => (
                  <AnimatedSection key={stat.label} delay={i * 100}>
                    <div className="text-center">
                      <p
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-400 mb-2"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {stat.number}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm leading-snug">
                        {stat.label}
                      </p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Team photo placeholders */}
          <AnimatedSection delay={100} className="mt-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl overflow-hidden border border-white/[0.07] bg-gradient-to-br from-white/[0.03] to-transparent flex items-center justify-center group hover:border-emerald-500/20 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-600">
                    <Users className="w-6 h-6 opacity-30" />
                    <p className="text-xs font-medium opacity-50">
                      Foto mascarada {i}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Testimonial / social proof */}
          <AnimatedSection delay={200} className="mt-12">
            <div className="relative p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
              <div className="absolute top-6 left-8 text-6xl text-emerald-500/10 font-serif select-none leading-none">
                &ldquo;
              </div>
              <p className="relative text-lg sm:text-xl text-gray-300 italic leading-relaxed max-w-2xl mx-auto mb-6">

                "Antes da Evolutto, eu era o único que sabia como
                tudo funcionava. Hoje minha equipe executa com autonomia e
                eu finalmente tenho visibilidade real da
                operação."
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold">
                    CEO de Consultoria
                  </p>
                  <p className="text-gray-500 text-xs">
                    Consultoria de gestão — 12 consultores
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <SectionDivider />

      {/* ================================================================
          SECTION 4 — CTA FINAL (conversion with lead capture)
          Form + guarantees + powerful closing.
      ================================================================ */}
      <section
        id="cta-section"
        className="relative z-10 px-5 py-24 sm:py-32 pb-40 sm:pb-44"
      >
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Chega de improvisar.
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Hora de estruturar.
                </span>
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
                Você construiu algo real. Agora precisa de um sistema que
                sustente o crescimento sem depender de você no centro de
                tudo.
              </p>
              <p className="mt-4 text-gray-500 text-base">
                A Evolutto não é para quem busca atalhos.
                <br />
                É para quem quer{" "}
                <span className="text-white font-semibold">
                  controle real.
                </span>
              </p>
            </div>
          </AnimatedSection>

          {/* Form card */}
          <AnimatedSection delay={100}>
            <div className="relative max-w-lg mx-auto p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-950/50 via-emerald-900/20 to-[#030712] border border-emerald-800/25 overflow-hidden">
              {/* Decorative orbs */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-[80px]" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-[60px]" />

              {formSuccess ? (
                /* ── Success State ──────────────────────── */
                <div className="relative text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3
                    className="text-2xl font-bold text-white mb-3"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Recebemos seus dados!
                  </h3>
                  <p className="text-gray-400 text-base">
                    Entraremos em contato em breve para dar os
                    próximos passos.
                  </p>
                </div>
              ) : (
                /* ── Form ──────────────────────────────── */
                <form
                  ref={formRef}
                  id="lead-form"
                  onSubmit={handleFormSubmit}
                  className="relative space-y-5"
                >
                  <div className="text-center mb-8">
                    <h3
                      className="text-xl sm:text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Fale com um especialista
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Preencha abaixo e receba um
                      diagnóstico gratuito da sua operação.
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Nome completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Seu nome completo"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-base"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-base"
                    />
                  </div>

                  {/* Phone with mask */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      autoComplete="tel"
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={(e) =>
                        setPhone(applyPhoneMask(e.target.value))
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-base"
                    />
                  </div>

                  {/* Eu sou? */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Eu sou? <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-base appearance-none"
                      defaultValue=""
                    >
                      <option value="" disabled className="bg-[#0a0f1a] text-gray-500">
                        Selecione
                      </option>
                      <option value="ainda-nao-consultor" className="bg-[#0a0f1a]">Ainda não sou consultor</option>
                      <option value="iniciando" className="bg-[#0a0f1a]">Iniciando minha consultoria</option>
                      <option value="autonomo" className="bg-[#0a0f1a]">Consultor autônomo</option>
                      <option value="funcionario" className="bg-[#0a0f1a]">Funcionário de uma empresa de consultoria</option>
                      <option value="socio-proprietario" className="bg-[#0a0f1a]">Sócio/proprietário de uma empresa de consultoria</option>
                    </select>
                  </div>

                  {/* Minha empresa */}
                  <fieldset>
                    <legend className="block text-sm font-medium text-gray-300 mb-3">
                      Minha empresa: <span className="text-red-400">*</span>
                    </legend>
                    <div className="space-y-3">
                      {[
                        { value: "terceiriza", label: "Terceiriza o serviço para o meu cliente" },
                        { value: "assessoria", label: "Assessoria, faço pelo meu cliente" },
                        { value: "consultoria", label: "Consultoria, meu cliente tem um cronograma" },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            name="company_type"
                            value={opt.value}
                            className="w-4.5 h-4.5 rounded border-white/20 bg-white/[0.05] text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 accent-emerald-500"
                          />
                          <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                            {opt.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Quantos consultores */}
                  <div>
                    <label
                      htmlFor="team_size"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Quantos consultores você tem no time? <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="team_size"
                      name="team_size"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-base appearance-none"
                      defaultValue=""
                    >
                      <option value="" disabled className="bg-[#0a0f1a] text-gray-500">
                        Selecione
                      </option>
                      <option value="somente-eu" className="bg-[#0a0f1a]">Somente eu</option>
                      <option value="2-3" className="bg-[#0a0f1a]">2 a 3 consultores</option>
                      <option value="4-5" className="bg-[#0a0f1a]">4 a 5 consultores</option>
                      <option value="6-9" className="bg-[#0a0f1a]">6 a 9 consultores</option>
                      <option value="10-15" className="bg-[#0a0f1a]">10 a 15 consultores</option>
                      <option value="15+" className="bg-[#0a0f1a]">Mais de 15 consultores</option>
                    </select>
                  </div>

                  {/* ===== HIDDEN UTM INPUTS ===== */}
                  <input
                    type="hidden"
                    name="utm_source"
                    data-field-id="utm_source"
                  />
                  <input
                    type="hidden"
                    name="utm_medium"
                    data-field-id="utm_medium"
                  />
                  <input
                    type="hidden"
                    name="utm_campaign"
                    data-field-id="utm_campaign"
                  />
                  <input
                    type="hidden"
                    name="utm_content"
                    data-field-id="utm_content"
                  />
                  <input
                    type="hidden"
                    name="utm_term"
                    data-field-id="utm_term"
                  />

                  {/* ===== HIDDEN CLICK IDS ===== */}
                  <input
                    type="hidden"
                    name="gclid"
                    data-field-id="gclid"
                  />
                  <input
                    type="hidden"
                    name="fbclid"
                    data-field-id="fbclid"
                  />
                  <input
                    type="hidden"
                    name="gbraid"
                    data-field-id="gbraid"
                  />
                  <input
                    type="hidden"
                    name="wbraid"
                    data-field-id="wbraid"
                  />
                  <input
                    type="hidden"
                    name="ttclid"
                    data-field-id="ttclid"
                  />
                  <input
                    type="hidden"
                    name="gad_campaignid"
                    data-field-id="gad_campaignid"
                  />
                  <input
                    type="hidden"
                    name="gad_source"
                    data-field-id="gad_source"
                  />
                  <input
                    type="hidden"
                    name="msclkid"
                    data-field-id="msclkid"
                  />
                  <input
                    type="hidden"
                    name="li_fat_id"
                    data-field-id="li_fat_id"
                  />
                  <input
                    type="hidden"
                    name="sck"
                    data-field-id="sck"
                  />

                  {/* ===== HIDDEN SESSION DATA ===== */}
                  <input
                    type="hidden"
                    name="session_id"
                    id="hidden_session_id"
                  />
                  <input
                    type="hidden"
                    name="landing_page"
                    data-field-id="landing_page"
                  />
                  <input
                    type="hidden"
                    name="origin_page"
                    data-field-id="origin_page"
                  />
                  <input
                    type="hidden"
                    name="session_attributes_encoded"
                    data-field-id="session_attributes_encoded"
                  />

                  {/* Error message */}
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                      {formError}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full flex items-center justify-center gap-3 px-8 py-4.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl text-lg font-bold transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Quero estruturar minha consultoria
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>

          {/* Guarantees */}
          <AnimatedSection delay={200} className="mt-10">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                {
                  icon: Shield,
                  text: "Consultoria de implementa\u00e7\u00e3o inclusa",
                },
                {
                  icon: Check,
                  text: "Garantia de 30 dias",
                },
                {
                  icon: Users,
                  text: "Feito por consultores, para consultores",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-emerald-500/[0.06] border border-emerald-500/15 backdrop-blur-sm"
                >
                  <item.icon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-300 text-sm font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Footer */}
          <div className="text-center mt-20 space-y-2">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/10" />
              <Zap className="w-4 h-4 text-emerald-500/40" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/10" />
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Evolutto. Todos os
              direitos reservados.
            </p>
            <p className="text-gray-600 text-xs">
              Sistema operacional para consultorias em escala.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sticky mobile CTA bar ──────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 bg-[#030712]/95 backdrop-blur-xl border-t border-white/5 sm:hidden z-50"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        }}
      >
        <button
          onClick={scrollToForm}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-[0.97] shadow-lg shadow-emerald-500/20"
        >
          Quero estruturar minha consultoria
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SalesPage;
