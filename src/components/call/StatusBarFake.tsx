import { Signal, Wifi, Battery } from "lucide-react";
import { useState, useEffect } from "react";

export const StatusBarFake = () => {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return {
      hours: now.getHours().toString().padStart(2, "0"),
      minutes: now.getMinutes().toString().padStart(2, "0"),
    };
  });

  // Update time every second to stay synced with device
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime({
        hours: now.getHours().toString().padStart(2, "0"),
        minutes: now.getMinutes().toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-11 px-6 flex items-center justify-between text-foreground">
      <span className="text-sm font-semibold tabular-nums">
        {time.hours}:{time.minutes}
      </span>
      <div className="absolute left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-b-3xl" />
      <div className="flex items-center gap-1">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Battery className="w-5 h-5" />
      </div>
    </div>
  );
};
