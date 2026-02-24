import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, Shield, Database, Lock, Wifi, CheckCircle2 } from "lucide-react";

const hackingSteps = [
  { icon: Wifi, text: "Conectando ao servidor...", duration: 1500 },
  { icon: Shield, text: "Quebrando firewall...", duration: 2000 },
  { icon: Lock, text: "Descriptografando dados...", duration: 1800 },
  { icon: Database, text: "Acessando banco de dados...", duration: 1500 },
  { icon: Terminal, text: "Extraindo vídeos privados...", duration: 2000 },
  { icon: CheckCircle2, text: "Acesso concedido!", duration: 1000 },
];

const HackerLoading = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (currentStep >= hackingSteps.length) {
      // All steps completed
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          navigate("/tiktok-privado");
        }, 500);
      }, 500);
      return;
    }

    const step = hackingSteps[currentStep];
    const progressInterval = step.duration / 100;
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 1;
      const totalProgress = ((currentStep * 100) + currentProgress) / hackingSteps.length;
      setProgress(totalProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setCurrentStep(prev => prev + 1);
      }
    }, progressInterval);

    return () => clearInterval(interval);
  }, [currentStep, navigate]);

  const CurrentIcon = currentStep < hackingSteps.length 
    ? hackingSteps[currentStep].icon 
    : CheckCircle2;

  return (
    <div 
      className={`min-h-[100dvh] bg-black flex flex-col items-center justify-center p-6 ${
        isTransitioning ? "animate-fade-out" : ""
      }`}
    >
      <div className="w-full max-w-[360px] flex flex-col items-center">
        {/* Animated icon */}
        <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-8 relative">
          <CurrentIcon className="w-12 h-12 text-green-500 animate-pulse" />
          {/* Rotating ring */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-500"
            style={{ animation: "spin 1s linear infinite" }}
          />
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-green-500/20 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress percentage */}
        <p className="text-green-500 font-mono text-2xl font-bold mb-6">
          {Math.round(progress)}%
        </p>

        {/* Steps list */}
        <div className="w-full space-y-3">
          {hackingSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div 
                key={index}
                className={`flex items-center gap-3 font-mono text-sm transition-all duration-300 ${
                  isCompleted 
                    ? "text-green-400" 
                    : isCurrent 
                      ? "text-green-500" 
                      : "text-green-500/30"
                }`}
              >
                <StepIcon className={`w-4 h-4 ${isCurrent ? "animate-pulse" : ""}`} />
                <span>{step.text}</span>
                {isCompleted && <CheckCircle2 className="w-4 h-4 ml-auto" />}
              </div>
            );
          })}
        </div>

        {/* Terminal output effect */}
        <div className="w-full mt-8 p-4 bg-green-500/5 border border-green-500/20 rounded-lg font-mono text-xs text-green-500/60">
          <p>{">"} Iniciando protocolo de acesso...</p>
          <p className="animate-pulse">{">"} _</p>
        </div>
      </div>

      {/* Background grid effect */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,255,0,0.1) 50px, rgba(0,255,0,0.1) 51px),
                           repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,255,0,0.1) 50px, rgba(0,255,0,0.1) 51px)`
        }} />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HackerLoading;