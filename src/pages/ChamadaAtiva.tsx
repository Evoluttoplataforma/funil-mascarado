import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StatusBarFake } from "@/components/call/StatusBarFake";
import { CallerHeader } from "@/components/call/CallerHeader";
import { CallTimer } from "@/components/call/CallTimer";
import { ActionGrid } from "@/components/call/ActionGrid";
import { HangupButton } from "@/components/call/HangupButton";
import { OpenWhatsAppCTA } from "@/components/call/OpenWhatsAppCTA";
import { CALL_END_TIME } from "@/data/transcriptLines";

const evaAvatar = "/eva-avatar.png";

const ChamadaAtiva = () => {
  const navigate = useNavigate();
  const [callDuration, setCallDuration] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [showCta, setShowCta] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play call audio when component mounts
  useEffect(() => {
    // Stop any lingering audio first
    document.querySelectorAll('audio').forEach(a => {
      a.pause();
      a.currentTime = 0;
    });

    const audio = new Audio("/audio/chamada-parte1.mp3");
    audioRef.current = audio;

    audio.addEventListener("ended", () => {
      setIsActive(false);
      setIsTransitioning(true);
      setTimeout(() => {
        navigate("/discar");
      }, 500);
    });

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const handleInteraction = () => {
          audio.play();
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
    };
  }, [navigate]);

  // Timer effect
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCallDuration((prev) => {
        const next = prev + 1;
        if (next >= CALL_END_TIME) {
          setShowCta(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const handleHangup = useCallback(() => {
    // Não faz nada — o lead precisa ouvir o áudio até o final
  }, []);

  const handleOpenWhatsApp = useCallback(() => {
    if (isTransitioning) return;

    stopAudio();
    setIsTransitioning(true);

    setTimeout(() => {
      navigate("/exp-2-revelacao");
    }, 500);
  }, [navigate, isTransitioning, stopAudio]);

  return (
    <div 
      className={`min-h-[100dvh] max-w-[100vw] overflow-hidden ios-gradient flex flex-col ${
        isTransitioning ? "animate-fade-out" : ""
      }`}
    >
      {/* iPhone frame simulation for desktop */}
      <div className="w-full max-w-[390px] h-[100dvh] mx-auto flex flex-col relative overflow-hidden">
        {/* Status Bar */}
        <StatusBarFake />

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center px-4 pb-4 overflow-hidden">
          {/* Caller Info */}
          <CallerHeader name="Code" label="mobile" avatar={evaAvatar} />

          {/* Timer */}
          <div className="mt-2 sm:mt-4">
            <CallTimer duration={callDuration} />
          </div>

          {/* Spacer */}
          <div className="flex-1 min-h-2" />

          {/* Action Grid */}
          <div className="mb-3 sm:mb-6 flex-shrink-0">
            <ActionGrid />
          </div>

          {/* Hangup Button */}
          <div className="pb-4 sm:pb-8 flex-shrink-0">
            <HangupButton onHangup={handleHangup} />
          </div>
        </div>

        {/* WhatsApp CTA */}
        <OpenWhatsAppCTA onClick={handleOpenWhatsApp} visible={showCta} />
      </div>
    </div>
  );
};

export default ChamadaAtiva;
