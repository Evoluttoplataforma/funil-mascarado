import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronDown, Check, Shield, ArrowRight, Layers, Eye, GitBranch, Loader2 } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    id: "faq1",
    question: '"Minha consultoria é complexa demais."',
    answer: "É exatamente para isso que a Evolutto existe.",
  },
  {
    id: "faq2",
    question: '"Já tentei outras ferramentas."',
    answer: "Ferramentas não são sistema operacional.",
  },
  {
    id: "faq3",
    question: '"Não tenho tempo para implementar."',
    answer: "Você já está pagando esse custo todos os dias.",
  },
  {
    id: "faq4",
    question: '"Isso substitui minha equipe?"',
    answer: "Não. Torna a equipe funcional sem você no centro.",
  },
];

const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, isInView } = useInView(0.1);
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const SalesPage = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCta = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      window.open("https://evolutto.com", "_blank");
      setIsSubmitting(false);
    }, 700);
  }, [isSubmitting]);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden bg-[#030712] text-white">
      {/* Gradient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#030712]/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">Evolutto</span>
          </div>
          <button
            onClick={handleCta}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            Começar agora
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 pb-32">
        {/* Hero Section */}
        <AnimatedSection className="text-center mb-24 sm:mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Sistema Operacional para Consultorias
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
            Sua consultoria cresceu.
            <br />
            <span className="bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
              O problema é que a estrutura não cresceu junto.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Quando o crescimento acontece sem um sistema operacional próprio, o CEO vira o gargalo — mesmo sendo o mais competente da sala.
          </p>
          <button
            onClick={handleCta}
            disabled={isSubmitting}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-2xl text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                Estruturar minha consultoria
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </AnimatedSection>

        {/* Espelhamento Section */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-emerald-500/50 to-transparent rounded-full" />
            <div className="pl-8 sm:pl-12 space-y-6 text-gray-300 text-lg sm:text-xl leading-relaxed">
              <p className="text-white text-2xl sm:text-3xl font-semibold">Você construiu algo real.</p>
              <p>
                Clientes pagam. A empresa fatura. A equipe existe.
                <br className="hidden sm:block" />
                Mas, em algum ponto do caminho, <span className="text-white">o controle começou a escapar.</span>
              </p>
              <p className="text-gray-400">
                Mais decisões passam por você. Mais exceções. Mais urgências.
                <br className="hidden sm:block" />
                Mais gente esperando você destravar algo para seguir.
              </p>
              <p>
                Você tentou organizar. Ferramentas novas. Reuniões melhores. Delegação.
              </p>
              <p className="text-white font-medium text-xl sm:text-2xl">
                E, mesmo assim, a sensação persiste:
                <br />
                quanto mais a consultoria cresce, mais ela depende de você.
              </p>
              <div className="pt-4">
                <p className="inline-block px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-medium">
                  É um problema estrutural — e quase ninguém te explicou isso antes.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Origem do Problema */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Crescimento <span className="text-emerald-400">Sem Sistema</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Consultorias não quebram por falta de demanda. Elas quebram por complexidade mal organizada.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {["CRM", "Gestor de tarefas", "Planilhas", "BI"].map((tool, i) => (
              <div
                key={tool}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                  <span className="text-red-400 text-lg">✕</span>
                </div>
                <p className="text-white font-medium">{tool}</p>
                <p className="text-gray-500 text-sm mt-1">Resolve um pedaço</p>
              </div>
            ))}
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5">
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              O CEO vira o <span className="text-white font-medium">integrador humano</span> do sistema.
              Tudo passa por você. E a empresa só anda quando você empurra.
            </p>
            <p className="mt-6 text-emerald-400 font-medium text-lg">
              O vilão é um modelo de gestão sem um sistema operacional próprio para consultorias.
            </p>
          </div>
        </AnimatedSection>

        {/* Plot Twist */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/50 to-emerald-900/20 border border-emerald-800/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
            <div className="relative">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                O Plot Twist
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                A Revelação
              </h2>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed max-w-2xl">
                <p>
                  Consultorias não escalam como agências. Nem como empresas de produto. Nem como fábricas.
                </p>
                <p className="text-white font-medium text-xl">
                  Elas operam sobre decisão, contexto e responsabilidade.
                </p>
                <p className="text-gray-400">
                  Quando você tenta forçar esse tipo de negócio dentro de ferramentas genéricas, o controle parece aumentar… mas, na prática, ele se concentra cada vez mais no CEO.
                </p>
              </div>
              <div className="mt-8 p-6 rounded-2xl bg-black/30 border border-emerald-500/20">
                <p className="text-emerald-400 font-semibold text-xl mb-2">O insight é simples — e desconfortável:</p>
                <p className="text-white text-lg">
                  O problema nunca foi esforço. Foi a ausência de um sistema operacional feito para consultorias.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Solução - 3 Pilares */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
              A Solução
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Apresentando a <span className="text-emerald-400">Evolutto</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Não é mais uma ferramenta. É um Sistema Operacional de Consultoria.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Layers,
                title: "Operação",
                number: "01",
                description: "Projetos, fases, responsáveis e critérios claros. Nada fica implícito. Nada depende de memória.",
              },
              {
                icon: GitBranch,
                title: "Decisão",
                number: "02",
                description: "O sistema define o que pode ser decidido sem você — e o que realmente precisa escalar.",
              },
              {
                icon: Eye,
                title: "Visibilidade",
                number: "03",
                description: "Você enxerga a empresa funcionando sem precisar perguntar, cobrar ou conferir.",
              },
            ].map((pillar, i) => (
              <div
                key={pillar.title}
                className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-emerald-500/30 transition-all duration-500"
              >
                <div className="absolute top-6 right-6 text-5xl font-bold text-white/[0.03] group-hover:text-emerald-500/10 transition-colors">
                  {pillar.number}
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <pillar.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Pilar — {pillar.title}</h3>
                <p className="text-gray-400 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xl text-white font-medium">
              Resultado: <span className="text-emerald-400">O controle sai da sua cabeça e passa para o sistema.</span>
            </p>
          </div>
        </AnimatedSection>

        {/* Timeline - 3 Fases */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Como Funciona <span className="text-emerald-400">Na Prática</span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent" />
            
            <div className="space-y-8 md:space-y-0">
              {[
                {
                  phase: "Fase 1",
                  title: "Mapeamento",
                  days: "Dias 1–30",
                  description: "Sua operação é traduzida para uma estrutura clara. Processos deixam de ser informais.",
                  result: "Clareza operacional real.",
                },
                {
                  phase: "Fase 2",
                  title: "Centralização",
                  days: "Dias 31–60",
                  description: "Projetos, entregas e responsabilidades passam a viver no sistema — não em pessoas.",
                  result: "Menos dependência do CEO.",
                },
                {
                  phase: "Fase 3",
                  title: "Delegação Sustentável",
                  days: "Dias 61–90",
                  description: "A empresa começa a operar com critérios claros, mesmo sem sua intervenção constante.",
                  result: "Escala com controle.",
                },
              ].map((phase, i) => (
                <div key={phase.phase} className={`relative md:flex items-center ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                  <div className={`md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all duration-300">
                      <div className={`flex items-center gap-3 mb-3 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                          {phase.phase}
                        </span>
                        <span className="text-gray-500 text-sm">{phase.days}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{phase.title}</h3>
                      <p className="text-gray-400 mb-4">{phase.description}</p>
                      <p className="text-emerald-400 font-medium text-sm">→ {phase.result}</p>
                    </div>
                  </div>
                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#030712]" />
                  <div className="md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Prova Social */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Autoridade, <span className="text-gray-500">Não Hype</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">A Evolutto é usada por consultorias que:</p>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {[
                "Cresceram sem perder margem",
                "Reduziram dependência do sócio fundador",
                "Ganharam previsibilidade operacional",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-lg">
              Não vendemos promessa. <span className="text-white">Vendemos estrutura aplicada.</span>
            </p>
          </div>
        </AnimatedSection>

        {/* Oferta */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/80 to-emerald-900/40 border border-emerald-700/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px]" />
            <div className="relative">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
                Plataforma Evolutto
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Sistema Operacional para Consultorias</h2>
              
              <div className="flex items-baseline gap-2 my-8">
                <span className="text-5xl sm:text-6xl font-bold text-white">R$ 1.500</span>
                <span className="text-gray-400 text-xl">/ mês</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="space-y-3">
                  <p className="text-gray-400 font-medium">Compare com o custo real de:</p>
                  {["Decisões erradas", "Retrabalho", "Dependência excessiva do CEO", "Margem corroída pelo caos"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400/50" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex items-center">
                  <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-400 font-semibold mb-1">Garantia de 30 dias</p>
                        <p className="text-gray-400 text-sm">
                          Se você não enxergar clareza operacional real, você pode sair.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCta}
                disabled={isSubmitting}
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-2xl text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-white/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Quero estruturar minha consultoria
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* FAQ */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">Perguntas Frequentes</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10"
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleFaq(item.id);
                    }
                  }}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-inset"
                  aria-expanded={openFaq === item.id}
                  aria-controls={`faq-content-${item.id}`}
                >
                  <span className="font-medium text-white pr-4">{item.question}</span>
                  <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openFaq === item.id ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                <div
                  id={`faq-content-${item.id}`}
                  className={`overflow-hidden transition-all duration-300 ${openFaq === item.id ? "max-h-40 pb-5" : "max-h-0"}`}
                >
                  <p className="px-5 text-gray-400">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* CTA Final */}
        <AnimatedSection className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Decisão Madura
          </h2>
          <div className="max-w-2xl mx-auto space-y-4 text-lg text-gray-300 mb-10">
            <p className="text-white text-xl font-medium">Você tem duas opções.</p>
            <p>
              Continuar crescendo com você no centro — e pagar o preço disso em margem, energia e liberdade.
            </p>
            <p>
              Ou estruturar a consultoria para funcionar <span className="text-emerald-400">com você</span>, não apesar de você.
            </p>
            <p className="text-gray-500">
              A Evolutto não é para quem quer atalhos. É para quem quer controle real.
            </p>
          </div>
          <button
            onClick={handleCta}
            disabled={isSubmitting}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-2xl text-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <Check className="w-6 h-6" />
                Estruturar minha consultoria agora
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          <p className="mt-8 text-gray-500">
            P.S.: Crescer sem sistema custa mais caro do que você imagina.
          </p>
        </AnimatedSection>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <span className="text-sm text-gray-600">© {new Date().getFullYear()} Evolutto. Todos os direitos reservados.</span>
        </div>
      </footer>

      {/* Sticky CTA mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#030712]/95 backdrop-blur-xl border-t border-white/5 safe-area-inset-bottom sm:hidden z-50">
        <button
          onClick={handleCta}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Carregando...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Estruturar minha consultoria
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SalesPage;
