import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StatusBarFake } from "@/components/call/StatusBarFake";
import { CallerHeader } from "@/components/call/CallerHeader";
import { CallTimer } from "@/components/call/CallTimer";
import { ActionGrid } from "@/components/call/ActionGrid";
import { HangupButton } from "@/components/call/HangupButton";

const evaAvatar = "/eva-avatar.png";

const ChamadaAtiva2 = () => {
  const navigate = useNavigate();
  const [callDuration, setCallDuration] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play call audio when component mounts
  useEffect(() => {
    const audio = new Audio("/audio/chamada-parte2.mp3");
    audioRef.current = audio;

    audio.addEventListener("ended", () => {
      setIsActive(false);
      setIsTransitioning(true);
      setTimeout(() => {
        navigate("/exp-2-revelacao");
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
      setCallDuration((prev) => prev + 1);
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

  return (
    <div
      className={`h-[100dvh] w-full overflow-hidden ios-gradient flex flex-col ${
        isTransitioning ? "animate-fade-out" : ""
      }`}
    >
      <div className="w-full max-w-[430px] h-full mx-auto flex flex-col relative overflow-hidden">
        <StatusBarFake />

        <div className="flex-1 flex flex-col items-center px-4 pb-4 overflow-hidden">
          <CallerHeader name="Titia Eva" label="61100" avatar={evaAvatar} />

          <div className="mt-2 sm:mt-4">
            <CallTimer duration={callDuration} />
          </div>

          <div className="flex-1 min-h-2" />

          <div className="mb-3 sm:mb-6 flex-shrink-0">
            <ActionGrid />
          </div>

          <div className="pb-4 sm:pb-8 flex-shrink-0">
            <HangupButton onHangup={handleHangup} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChamadaAtiva2;
