import { useState, useEffect } from "react";
import { ShieldCheck, Lock, ShieldAlert, Wifi } from "lucide-react";

interface EncryptionOverlayProps {
  onComplete: () => void;
}

const steps = [
  { icon: ShieldAlert, text: "Ameaça detectada...", color: "text-red-500" },
  { icon: Wifi, text: "Interceptando conexão...", color: "text-yellow-500" },
  { icon: Lock, text: "Ativando criptografia de ponta a ponta...", color: "text-yellow-500" },
  { icon: Lock, text: "Criptografando mensagens anteriores...", color: "text-green-400" },
  { icon: ShieldCheck, text: "Conversa protegida.", color: "text-green-500" },
];

export const EncryptionOverlay = ({ onComplete }: EncryptionOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);

  // Matrix rain characters
  useEffect(() => {
    const chars = "01アイウエオカキクケコ█▓▒░".split("");
    const interval = setInterval(() => {
      setMatrixChars(
        Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)])
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Step progression
  useEffect(() => {
    if (currentStep >= steps.length) {
      setTimeout(onComplete, 600);
      return;
    }

    const delay = currentStep === steps.length - 1 ? 1200 : 1400;
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  // Progress bar
  useEffect(() => {
    const target = ((currentStep + 1) / steps.length) * 100;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= target) {
          clearInterval(interval);
          return target;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="my-3 animate-fade-in">
      {/* Banner estilo WhatsApp system message */}
      <div className="relative bg-black/90 rounded-xl overflow-hidden border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
        {/* Matrix background */}
        <div className="absolute inset-0 opacity-[0.06] font-mono text-green-500 text-[10px] leading-3 overflow-hidden select-none pointer-events-none break-all">
          {matrixChars.join(" ")}
        </div>

        <div className="relative px-4 py-4 flex flex-col gap-3">
          {/* Steps */}
          {steps.slice(0, currentStep + 1).map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            return (
              <div
                key={i}
                className={`flex items-center gap-2 transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-40"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${step.color} ${isActive ? "animate-pulse" : ""}`} />
                <span className={`text-xs font-mono ${step.color}`}>
                  {step.text}
                  {isActive && currentStep < steps.length - 1 && (
                    <span className="animate-pulse"> _</span>
                  )}
                </span>
              </div>
            );
          })}

          {/* Progress bar */}
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
