import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, Plus, User, Heart, Share2, Music2, Bookmark, X, MessageCircle, Mail } from "lucide-react";

const evaAvatar = "/eva-avatar.png";

interface VideoSlide {
  id: number;
  title: string;
  content: string[];
  likes: number;
  comments: number;
  shares: number;
}

interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
}

const videoSlides: VideoSlide[] = [
  {
    id: 1,
    title: "O Problema Real",
    content: [
      "O problema nunca foi",
      "falta de esforço.",
      "",
      "Foi falta de um",
      "SISTEMA que funciona."
    ],
    likes: 24300,
    comments: 1200,
    shares: 892
  },
  {
    id: 2,
    title: "Ferramentas Demais",
    content: [
      "CRM, Notion, Slack,",
      "Planilhas, BI...",
      "",
      "Cada uma resolve um pedaço.",
      "Nenhuma resolve o TODO."
    ],
    likes: 18500,
    comments: 890,
    shares: 654
  },
  {
    id: 3,
    title: "A Verdade",
    content: [
      "Consultoria não é",
      "empresa de produto.",
      "",
      "É operação",
      "INTELECTUAL."
    ],
    likes: 31200,
    comments: 2100,
    shares: 1430
  },
  {
    id: 4,
    title: "O Resultado",
    content: [
      "Mais controle aparente.",
      "Menos controle REAL.",
      "",
      "Quem integra tudo",
      "continua sendo VOCÊ."
    ],
    likes: 27800,
    comments: 1560,
    shares: 987
  },
  {
    id: 5,
    title: "A Solução",
    content: [
      "Você precisa de um",
      "SISTEMA OPERACIONAL",
      "",
      "Pensado desde o início",
      "para CONSULTORIA."
    ],
    likes: 42100,
    comments: 3200,
    shares: 2100
  },
  {
    id: 6,
    title: "O Próximo Passo",
    content: [
      "Quando esse sistema existe,",
      "as decisões fluem.",
      "",
      "A empresa começa a",
      "andar SOZINHA."
    ],
    likes: 56400,
    comments: 4500,
    shares: 3200
  }
];

const fakeComments: Comment[] = [
  { id: 1, user: "marcelo.consultor", avatar: "https://i.pravatar.cc/100?img=11", text: "Evolutto mudou minha consultoria! Finalmente tenho controle de tudo em um só lugar 🙌", likes: 342, time: "2h" },
  { id: 2, user: "ana.empreende", avatar: "https://i.pravatar.cc/100?img=5", text: "Já testei várias plataformas, Evolutto é disparado a melhor pra quem trabalha com consultoria", likes: 287, time: "3h" },
  { id: 3, user: "ricardo.ceo", avatar: "https://i.pravatar.cc/100?img=12", text: "Minha equipe toda usa Evolutto. Produtividade aumentou 40% fácil", likes: 521, time: "4h" },
  { id: 4, user: "juliana.coach", avatar: "https://i.pravatar.cc/100?img=9", text: "Simplesmente o melhor investimento que fiz pro meu negócio 💯", likes: 198, time: "5h" },
  { id: 5, user: "pedro.mentor", avatar: "https://i.pravatar.cc/100?img=13", text: "Evolutto é o sistema que toda consultoria deveria usar. Recomendo demais!", likes: 445, time: "6h" },
  { id: 6, user: "carla.business", avatar: "https://i.pravatar.cc/100?img=16", text: "3 meses usando Evolutto e já recuperei o investimento. Incrível! 🚀", likes: 312, time: "7h" },
  { id: 7, user: "fernando.agile", avatar: "https://i.pravatar.cc/100?img=15", text: "Finalmente um sistema pensado pra consultoria de verdade", likes: 267, time: "8h" },
  { id: 8, user: "lucia.gestora", avatar: "https://i.pravatar.cc/100?img=20", text: "Evolutto é game changer! Meus clientes agradecem a organização", likes: 189, time: "9h" },
  { id: 9, user: "thiago.advisor", avatar: "https://i.pravatar.cc/100?img=17", text: "Quem trabalha com consultoria e não usa Evolutto tá perdendo tempo", likes: 534, time: "10h" },
  { id: 10, user: "amanda.scale", avatar: "https://i.pravatar.cc/100?img=23", text: "Escalei minha consultoria de 5 pra 20 clientes com Evolutto. Obrigada! ❤️", likes: 678, time: "12h" },
];

const TikTokPrivado = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<number[]>([]);
  const [showCta, setShowCta] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentVideo = videoSlides[currentIndex];

  // Scroll snap handling
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const itemHeight = scrollContainer.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videoSlides.length) {
        setCurrentIndex(newIndex);
        
        // Show CTA when reaching the last video
        if (newIndex === videoSlides.length - 1) {
          setTimeout(() => setShowCta(true), 1000);
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [currentIndex]);

  const handleLike = useCallback((videoId: number) => {
    setLikedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  }, []);

  const handleNextStep = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/exp-3-visao");
    }, 500);
  }, [navigate, isTransitioning]);

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return (
    <div 
      className={`h-[100dvh] w-full overflow-hidden bg-black flex flex-col ${
        isTransitioning ? "animate-fade-out" : ""
      }`}
      ref={containerRef}
    >
      <div className="w-full max-w-[430px] h-full mx-auto flex flex-col relative">
        {/* Scrollable video container with snap */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          {videoSlides.map((video, index) => {
            const isLiked = likedVideos.includes(video.id);
            
            return (
              <div 
                key={video.id}
                className="h-[calc(100dvh-56px)] w-full snap-start snap-always relative bg-black"
              >
                {/* Video background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-black to-gray-900/50" />
                
                {/* Top bar - TikTok style */}
                <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-12 pb-4">
                  <div className="w-10" />
                  <div className="flex items-center gap-4">
                    <button className="text-white/50 text-[15px] font-medium">Seguindo</button>
                    <div className="w-[1px] h-4 bg-white/20" />
                    <button className="text-white text-[15px] font-semibold relative">
                      Para você
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-white rounded-full" />
                    </button>
                  </div>
                  <Search className="w-6 h-6 text-white" />
                </div>

                {/* Video content - Text slide */}
                <div className="absolute inset-0 flex items-center justify-center px-10">
                  <div className="text-center" key={video.id}>
                    <p className="text-white/50 text-xs font-semibold mb-6 uppercase tracking-[0.2em]">
                      {video.title}
                    </p>
                    {video.content.map((line, lineIndex) => (
                      <p 
                        key={lineIndex} 
                        className={`text-white text-[22px] font-bold leading-[1.4] ${
                          line === "" ? "h-5" : ""
                        } ${line.includes("SISTEMA") || line.includes("TODO") || line.includes("INTELECTUAL") || line.includes("REAL") || line.includes("VOCÊ") || line.includes("CONSULTORIA") || line.includes("SOZINHA") ? "text-[#FE2C55]" : ""}`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Right side actions - TikTok style */}
                <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4">
                  {/* Profile */}
                  <div className="relative mb-2">
                    <div className="w-[46px] h-[46px] rounded-full overflow-hidden border-[2px] border-white">
                      <img src={evaAvatar} alt="Eva" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[22px] h-[22px] bg-[#FE2C55] rounded-full flex items-center justify-center border-[2px] border-black">
                      <Plus className="w-3 h-3 text-white stroke-[3]" />
                    </div>
                  </div>

                  {/* Like */}
                  <button 
                    onClick={() => handleLike(video.id)} 
                    className="flex flex-col items-center"
                  >
                    <div className={`transition-transform duration-200 ${isLiked ? 'scale-110' : ''}`}>
                      <Heart className={`w-[34px] h-[34px] ${isLiked ? 'text-[#FE2C55] fill-[#FE2C55]' : 'text-white'}`} />
                    </div>
                    <span className="text-white text-[11px] font-medium mt-1">
                      {formatCount(isLiked ? video.likes + 1 : video.likes)}
                    </span>
                  </button>

                  {/* Comments */}
                  <button 
                    onClick={() => setShowComments(true)}
                    className="flex flex-col items-center"
                  >
                    <MessageCircle className="w-[34px] h-[34px] text-white" />
                    <span className="text-white text-[11px] font-medium mt-1">{formatCount(video.comments)}</span>
                  </button>

                  {/* Bookmark */}
                  <button className="flex flex-col items-center">
                    <Bookmark className="w-[30px] h-[30px] text-white" />
                    <span className="text-white text-[11px] font-medium mt-1">{formatCount(video.shares)}</span>
                  </button>

                  {/* Share */}
                  <button className="flex flex-col items-center">
                    <Share2 className="w-[30px] h-[30px] text-white" />
                    <span className="text-white text-[11px] font-medium mt-1">Enviar</span>
                  </button>

                  {/* Music disc */}
                  <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-[8px] border-gray-800 flex items-center justify-center animate-spin mt-1" style={{ animationDuration: '3s' }}>
                    <div className="w-[18px] h-[18px] rounded-full overflow-hidden">
                      <img src={evaAvatar} alt="Music" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Bottom info - TikTok style */}
                <div className="absolute left-3 right-[70px] bottom-4">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-bold text-[15px]">@eva.ai</p>
                    <span className="text-white/60 text-xs">· 2d</span>
                  </div>
                  <p className="text-white text-[13px] mb-3 leading-snug">
                    Série: O Sistema que Funciona 🧠 Parte {index + 1}/6 #consultoria #evolutto #negocios
                  </p>
                  <div className="flex items-center gap-2 bg-black/30 rounded-full py-1 px-2 w-fit">
                    <Music2 className="w-3 h-3 text-white" />
                    <div className="overflow-hidden w-[120px]">
                      <p className="text-white text-[11px] whitespace-nowrap animate-marquee">
                        som original - Eva AI • som original - Eva AI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom navigation - TikTok style */}
        <div className="h-14 bg-black flex items-center justify-around px-2">
          <button className="flex flex-col items-center gap-0.5 w-16">
            <Home className="w-6 h-6 text-white fill-white" />
            <span className="text-white text-[10px] font-medium">Início</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 w-16">
            <Search className="w-6 h-6 text-white/50" />
            <span className="text-white/50 text-[10px]">Descobrir</span>
          </button>
          <button className="relative w-14 flex justify-center">
            <div className="w-[52px] h-[30px] relative">
              <div className="absolute left-0 w-[30px] h-[30px] bg-[#25F4EE] rounded-md" />
              <div className="absolute right-0 w-[30px] h-[30px] bg-[#FE2C55] rounded-md" />
              <div className="absolute left-1/2 -translate-x-1/2 w-[32px] h-[30px] bg-white rounded-md flex items-center justify-center">
                <Plus className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
            </div>
          </button>
          <button className="flex flex-col items-center gap-0.5 w-16">
            <Mail className="w-6 h-6 text-white/50" />
            <span className="text-white/50 text-[10px]">Caixa</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 w-16">
            <User className="w-6 h-6 text-white/50" />
            <span className="text-white/50 text-[10px]">Perfil</span>
          </button>
        </div>

        {/* CTA Button */}
        {showCta && (
          <div className="absolute bottom-20 left-4 right-4 animate-fade-in z-30">
            <button
              onClick={handleNextStep}
              className="w-full flex items-center justify-center gap-3 bg-[#FE2C55] text-white font-bold text-base py-4 px-6 rounded-md transition-all duration-200 active:scale-[0.98]"
            >
              Ver como funciona →
            </button>
          </div>
        )}

        {/* Comments Modal */}
        {showComments && (
          <div className="absolute inset-0 z-40 flex flex-col justify-end">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowComments(false)}
            />
            
            {/* Comments panel */}
            <div className="relative bg-[#121212] rounded-t-xl max-h-[70%] flex flex-col animate-slide-up">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <span className="text-white font-semibold text-[15px]">
                  {formatCount(currentVideo.comments)} comentários
                </span>
                <button onClick={() => setShowComments(false)}>
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>
              
              {/* Comments list */}
              <div className="flex-1 overflow-y-auto px-4 py-2">
                {fakeComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 py-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                      <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-[13px] font-medium">{comment.user}</span>
                        <span className="text-white/40 text-[11px]">{comment.time}</span>
                      </div>
                      <p className="text-white text-[14px] mt-0.5 leading-snug">{comment.text}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="flex items-center gap-1 text-white/50 text-[12px]">
                          <Heart className="w-4 h-4" />
                          {comment.likes}
                        </button>
                        <button className="text-white/50 text-[12px]">Responder</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input area */}
              <div className="px-4 py-3 border-t border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm">
                  👤
                </div>
                <div className="flex-1 bg-white/10 rounded-full px-4 py-2">
                  <span className="text-white/40 text-[13px]">Adicione um comentário...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 8s linear infinite;
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TikTokPrivado;
