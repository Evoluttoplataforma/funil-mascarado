import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";

interface AudioBubbleProps {
  src: string;
  sender: "eva" | "user";
  avatar?: string;
  onEnded?: () => void;
  autoPlay?: boolean;
}

export const AudioBubble = ({
  src,
  sender,
  avatar,
  onEnded,
  autoPlay = false,
}: AudioBubbleProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const isUser = sender === "user";

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(100);
      onEnded?.();
    });

    if (autoPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            const handleInteraction = () => {
              audio.play().then(() => setIsPlaying(true));
              document.removeEventListener("click", handleInteraction);
              document.removeEventListener("touchstart", handleInteraction);
            };
            document.addEventListener("click", handleInteraction);
            document.addEventListener("touchstart", handleInteraction);
          });
      }
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src, autoPlay, onEnded]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}>
      <div
        className={`flex items-center gap-2 px-2 py-2 rounded-lg max-w-[280px] ${
          isUser
            ? "bg-[#DCF8C6] rounded-tr-none"
            : "bg-white rounded-tl-none"
        }`}
      >
        {/* Play indicator (no pause allowed) */}
        <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
          {isPlaying ? (
            <div className="flex items-center gap-[3px]">
              <span className="w-[3px] h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-[3px] h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-[3px] h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          ) : (
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          )}
        </div>

        {/* Waveform + time */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          {/* Waveform bar */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-[#25D366] rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Time */}
          <span className="text-[11px] text-gray-500">
            {isPlaying || currentTime > 0
              ? `${formatTime(currentTime)} / ${formatTime(duration)}`
              : duration > 0
              ? formatTime(duration)
              : "0:00"}
          </span>
        </div>

        {/* Avatar */}
        {avatar && (
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img src={avatar} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};
