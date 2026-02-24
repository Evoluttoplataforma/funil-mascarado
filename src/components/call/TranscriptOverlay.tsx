import { useEffect, useRef } from "react";

interface TranscriptLine {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
}

interface TranscriptOverlayProps {
  lines: TranscriptLine[];
  currentTime: number;
}

export const TranscriptOverlay = ({ lines, currentTime }: TranscriptOverlayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleLines = lines.filter(
    (line) => currentTime >= line.startTime && currentTime <= line.endTime + 3
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines.length]);

  if (visibleLines.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute left-1/2 -translate-x-1/2 bottom-[280px] w-full max-w-[320px] px-4 flex flex-col gap-2 max-h-[200px] overflow-y-auto no-scrollbar"
    >
      {visibleLines.map((line) => (
        <div
          key={line.id}
          className="transcript-card text-center"
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};
