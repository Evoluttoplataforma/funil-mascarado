import { useState, useCallback, useEffect, useRef } from "react";
import { Check, ArrowRight, Loader2, Shield, X } from "lucide-react";

// Hook para animação on scroll
const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

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
        transform: isInView ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const SalesPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCta = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      window.open("https://evolutto.com", "_blank");
      setIsSubmitting(false);
    }, 700);
  }, [isSubmitting]);

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px]" />
      </div>

      {/* =============================================
          SEÇÃO 1 — HERO
          Conexão direta com o funil. O lead acabou de
          passar por chamadas, WhatsApp, hacker e TikTok.
          Agora é a revelação final.
      ============================================= */}
      <section className="relative z-10 px-5 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Protocolo revelado
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] mb-6 tracking-tight">
              Você não precisa de
              <br />
              mais uma ferramenta.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                Precisa de um sistema.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              A Evolutto é o sistema operacional que liberta consultorias
              da dependência do dono — para que a empresa funcione
              com método, controle e previsibilidade.
            </p>

            <button
              onClick={handleCta}
              disabled={isSubmitting}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-2xl text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  Quero conhecer a Evolutto
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </AnimatedSection>

          {/* Placeholder para imagem mascarada hero */}
          <AnimatedSection delay={200} className="mt-16">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] aspect-video flex items-center justify-center">
              {/* TODO: Substituir por imagem real da galera mascarada */}
              <img
                src="/eva-avatar.png"
                alt="Evolutto"
                className="w-24 h-24 rounded-full opacity-30"
              />
              <p className="absolute bottom-4 text-gray-600 text-sm">
                Imagem da equipe mascarada
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* =============================================
          SEÇÃO 2 — O PROBLEMA
          Espelhamento da dor do ICP. Conecta com o que
          a Eva falou no WhatsApp e nos áudios.
      ============================================= */}
      <section className="relative z-10 px-5 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4">
                O problema real
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                Sua consultoria cresceu.
                <br />
                <span className="text-gray-500">Sua estrutura, não.</span>
              </h2>
            </div>
          </AnimatedSection>

          {/* Dores do ICP */}
          <AnimatedSection delay={100}>
            <div className="space-y-4 mb-12">
              {[
                {
                  pain: "Você é o gargalo",
                  detail:
                    "Toda decisão importante passa por você. A empresa para quando você para.",
                },
                {
                  pain: "Ferramentas demais, controle de menos",
                  detail:
                    "CRM, Notion, Slack, planilhas, BI — cada uma resolve um pedaço, nenhuma resolve o todo.",
                },
                {
                  pain: "Crescimento desorganizado",
                  detail:
                    "Mais clientes = mais caos. Retrabalho, perda de margem, equipe perdida.",
                },
                {
                  pain: "Gestão artesanal",
                  detail:
                    "Processos vivem na cabeça de quem faz. Quando a pessoa sai, o método vai junto.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">{item.pain}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="p-6 rounded-2xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 text-center">
              <p className="text-lg text-gray-300">
                O nome disso não é desorganização.
              </p>
              <p className="text-xl text-white font-bold mt-2">
                É ausência de um{" "}
                <span className="text-emerald-400">sistema operacional</span>{" "}
                pensado para consultoria.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* =============================================
          SEÇÃO 3 — A SOLUÇÃO (EVOLUTTO)
          Apresentação do produto com os 3 pilares.
          Conecta com a narrativa da Eva.
      ============================================= */}
      <section className="relative z-10 px-5 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
                A solução
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Conheça a{" "}
                <span className="text-emerald-400">Evolutto</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                O ecossistema para consultorias que já vendem e precisam
                governar a escala com método, controle e previsibilidade.
              </p>
            </div>
          </AnimatedSection>

          {/* 3 Pilares */}
          <div className="grid sm:grid-cols-3 gap-5 mb-14">
            {[
              {
                number: "01",
                title: "Método como ativo",
                description:
                  "Seu conhecimento vira processo replicável. A entrega acontece com padrão, sem depender de quem executa.",
                highlight: "Transformação disponível e replicável",
              },
              {
                number: "02",
                title: "Operação sem o dono",
                description:
                  "Projetos, fases, responsáveis e critérios claros. O sistema decide o que pode rodar sem você.",
                highlight: "Libertação da dependência do dono",
              },
              {
                number: "03",
                title: "Escala com controle",
                description:
                  "Visibilidade total da operação. Você enxerga a empresa funcionando sem perguntar, cobrar ou conferir.",
                highlight: "Crescimento previsível e com margem",
              },
            ].map((pillar, i) => (
              <AnimatedSection key={pillar.number} delay={i * 100}>
                <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 hover:border-emerald-500/30 transition-all duration-500">
                  <span className="text-4xl font-bold text-emerald-500/15">
                    {pillar.number}
                  </span>
                  <h3 className="text-xl font-semibold text-white mt-3 mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {pillar.description}
                  </p>
                  <p className="text-emerald-400 text-sm font-medium">
                    {pillar.highlight}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Prova social resumida */}
          <AnimatedSection>
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/40 border border-emerald-800/30">
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                {[
                  { number: "200+", label: "Consultorias ativas" },
                  { number: "90 dias", label: "Para clareza operacional" },
                  { number: "40%", label: "Menos dependência do CEO" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl font-bold text-emerald-400">
                      {stat.number}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Placeholder para imagens mascaradas */}
          <AnimatedSection delay={100} className="mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] flex items-center justify-center"
                >
                  {/* TODO: Substituir por fotos reais da galera mascarada */}
                  <p className="text-gray-600 text-xs text-center px-2">
                    Foto mascarada {i}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* =============================================
          SEÇÃO 4 — CTA FINAL
          Decisão madura. Sem hype. Estrutura > promessa.
          Alinhado com o posicionamento Evolutto.
      ============================================= */}
      <section className="relative z-10 px-5 py-20 sm:py-28 pb-32">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-emerald-900/30 border border-emerald-700/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-[100px]" />

              <div className="relative text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                  Chega de improvisar.
                  <br />
                  <span className="text-emerald-400">
                    Hora de estruturar.
                  </span>
                </h2>

                <p className="text-gray-300 text-lg max-w-xl mx-auto mb-4">
                  Você construiu algo real. Agora precisa de um sistema
                  que sustente o crescimento sem depender de você no
                  centro de tudo.
                </p>

                <p className="text-gray-500 mb-10">
                  A Evolutto não é para quem busca atalhos.
                  <br />É para quem quer{" "}
                  <span className="text-white">controle real.</span>
                </p>

                {/* Garantias */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                  {[
                    "Consultoria de implementação inclusa",
                    "Garantia de 30 dias",
                    "Feito por consultores, para consultores",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 text-sm font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCta}
                  disabled={isSubmitting}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-white hover:bg-gray-100 text-gray-900 rounded-2xl text-xl font-bold transition-all duration-300 hover:shadow-xl hover:shadow-white/10 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      Quero estruturar minha consultoria
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Satisfação garantida ou cancele em 30 dias</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Footer */}
          <div className="text-center mt-16 text-gray-600 text-sm">
            <p>
              © {new Date().getFullYear()} Evolutto. Todos os direitos
              reservados.
            </p>
            <p className="mt-1">Sistema operacional para consultorias.</p>
          </div>
        </div>
      </section>

      {/* Sticky CTA mobile */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 bg-[#030712]/95 backdrop-blur-xl border-t border-white/5 sm:hidden z-50"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        }}
      >
        <button
          onClick={handleCta}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Carregando...
            </>
          ) : (
            <>
              Quero estruturar minha consultoria
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SalesPage;
