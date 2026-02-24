interface CallTimerProps {
  duration: number;
}

export const CallTimer = ({ duration }: CallTimerProps) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <div className="text-center">
      <span className="text-[20px] font-light text-foreground tabular-nums">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};
