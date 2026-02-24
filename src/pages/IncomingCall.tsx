import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StatusBarFake } from "@/components/call/StatusBarFake";
import { Phone, MessageSquare, BellOff } from "lucide-react";

const evaAvatar = "/eva-avatar.png";

const IncomingCall = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isRinging, setIsRinging] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Vibration pattern: vibrate 800ms, pause 400ms (repeating ringtone feel)
  const vibrationPattern = [800, 400, 800, 400, 800, 400, 800, 400, 800, 400, 800, 400, 800, 400, 800, 400, 800, 400, 800, 400];

  const startVibration = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(vibrationPattern);
    }
  }, []);

  // Play ringtone + vibration on mount
  useEffect(() => {
    const audio = new Audio("/audio/ringtone.webm");
    audio.loop = true;
    audioRef.current = audio;

    // Try vibration immediately
    startVibration();

    // Try to play (may require user interaction on some browsers)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was prevented, will play on first user interaction
        const handleInteraction = () => {
          audio.play();
          startVibration();
          document.removeEventListener("click", handleInteraction);
          document.removeEventListener("touchstart", handleInteraction);
        };
        document.addEventListener("click", handleInteraction);
        document.addEventListener("touchstart", handleInteraction);
      });
    }

    return () => {
      audio.pause();
      audio.src = "";
      if ("vibrate" in navigator) {
        navigator.vibrate(0); // Stop vibration
      }
    };
  }, [startVibration]);

  // Pulse animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRinging((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const stopRingtone = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ("vibrate" in navigator) {
      navigator.vibrate(0);
    }
  }, []);

  const handleAccept = useCallback(() => {
    if (isTransitioning) return;
    
    stopRingtone();
    
    // Vibrate if supported
    if ("vibrate" in navigator) {
      navigator.vibrate(100);
    }

    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/chamada-ativa");
    }, 300);
  }, [navigate, isTransitioning, stopRingtone]);

  const handleDecline = useCallback(() => {
    if (isTransitioning) return;
    
    stopRingtone();
    
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    setIsTransitioning(true);
    // Could redirect to a "missed call" or just stay/reload
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, [isTransitioning, stopRingtone]);

  return (
    <div 
      className={`h-[100dvh] w-full overflow-hidden ios-gradient flex flex-col ${
        isTransitioning ? "animate-fade-out" : ""
      }`}
    >
      <div className="w-full max-w-[430px] h-full mx-auto flex flex-col relative overflow-hidden">
        {/* Status Bar */}
        <StatusBarFake />

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-between px-4 pt-[20vh] pb-8 overflow-hidden" style={{ paddingTop: "max(20vh, env(safe-area-inset-top, 0px) + 15vh)" }}>
          {/* Top section: Avatar + Caller Info */}
          <div className="flex flex-col items-center">
          {/* Avatar with pulse/ring animation */}
          <div className="relative flex-shrink-0">
            {/* Outer ring pulse */}
            <div className="absolute inset-0 -m-6 sm:-m-8 rounded-full border-2 border-green-500/30 animate-ping" />
            <div 
              className="absolute inset-0 -m-4 sm:-m-6 rounded-full border-2 border-green-500/20"
              style={{
                animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
                animationDelay: "0.3s"
              }}
            />
            <div 
              className="absolute inset-0 -m-2 sm:-m-4 rounded-full border-2 border-green-500/10"
              style={{
                animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
                animationDelay: "0.6s"
              }}
            />
            
            {/* Glow effect */}
            <div 
              className={`absolute inset-0 -m-1 sm:-m-2 rounded-full transition-all duration-500 ${
                isRinging 
                  ? "bg-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.4)]" 
                  : "bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
              }`}
            />
            
            {/* Avatar container with shake effect */}
            <div 
              className="w-20 h-20 sm:w-[120px] sm:h-[120px] rounded-full overflow-hidden relative z-10"
              style={{
                animation: "shake 0.5s ease-in-out infinite"
              }}
            >
              <img src={evaAvatar} alt="Eva" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Caller Info */}
          <h1 className="text-xl sm:text-[32px] font-semibold text-foreground mt-4 sm:mt-8">Code</h1>
          <p className="text-sm sm:text-[18px] font-normal text-muted-foreground mt-1">mobile</p>
          
          {/* Animated calling indicator */}
          <div className="flex items-center gap-2 mt-2 sm:mt-3">
            <span 
              className="w-2 h-2 rounded-full bg-green-500"
              style={{
                animation: "pulse 1s ease-in-out infinite"
              }}
            />
            <p className="text-xs sm:text-[16px] text-green-400">Ligação recebida...</p>
          </div>
          </div>

          {/* Bottom section: Actions + Buttons */}
          <div className="flex flex-col items-center">
          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 mb-3 sm:mb-6 flex-shrink-0">
            <button
              aria-label="Lembrar"
              className="flex flex-col items-center gap-1"
            >
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-secondary/80 flex items-center justify-center">
                <BellOff className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Lembrar</span>
            </button>
            <button
              aria-label="Mensagem"
              className="flex flex-col items-center gap-1"
            >
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-secondary/80 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Mensagem</span>
            </button>
          </div>

          {/* Accept/Decline Buttons */}
          <div className="flex items-center justify-center gap-10 sm:gap-16 pb-4 sm:pb-8 flex-shrink-0">
            {/* Decline */}
            <button
              onClick={handleDecline}
              aria-label="Recusar chamada"
              className="flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ios-red/50 rounded-full"
            >
              <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full bg-[#FF3B30] flex items-center justify-center transition-transform duration-200 active:scale-95 hover:shadow-[0_0_20px_rgba(255,59,48,0.5)]">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-foreground rotate-[135deg]" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Recusar</span>
            </button>

            {/* Accept with pulse */}
            <button
              onClick={handleAccept}
              aria-label="Aceitar chamada"
              className="flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ios-green/50 rounded-full relative"
            >
              {/* Pulse ring around accept button */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full border-2 border-green-500/50"
                style={{
                  animation: "ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite"
                }}
              />
              <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full bg-[#34C759] flex items-center justify-center transition-transform duration-200 active:scale-95 shadow-[0_0_25px_rgba(52,199,89,0.5)]">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-foreground" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Aceitar</span>
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-1px) rotate(-1deg); }
          20% { transform: translateX(1px) rotate(1deg); }
          30% { transform: translateX(-1px) rotate(0deg); }
          40% { transform: translateX(1px) rotate(1deg); }
          50% { transform: translateX(-1px) rotate(-1deg); }
          60% { transform: translateX(1px) rotate(0deg); }
          70% { transform: translateX(-1px) rotate(-1deg); }
          80% { transform: translateX(1px) rotate(1deg); }
          90% { transform: translateX(-1px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default IncomingCall;
