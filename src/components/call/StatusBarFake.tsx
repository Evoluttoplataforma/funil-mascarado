import { Signal, Wifi } from "lucide-react";
import { useState, useEffect } from "react";

export const StatusBarFake = () => {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return {
      hours: now.getHours().toString().padStart(2, "0"),
      minutes: now.getMinutes().toString().padStart(2, "0"),
    };
  });

  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);

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

  // Get real battery level
  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<{ level: number; charging: boolean; addEventListener: (type: string, listener: () => void) => void; removeEventListener: (type: string, listener: () => void) => void }> };
    if (!nav.getBattery) return;

    let battery: { level: number; charging: boolean; addEventListener: (type: string, listener: () => void) => void; removeEventListener: (type: string, listener: () => void) => void } | null = null;

    const updateBattery = () => {
      if (battery) {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
      }
    };

    nav.getBattery().then((b) => {
      battery = b;
      updateBattery();
      b.addEventListener("levelchange", updateBattery);
      b.addEventListener("chargingchange", updateBattery);
    });

    return () => {
      if (battery) {
        battery.removeEventListener("levelchange", updateBattery);
        battery.removeEventListener("chargingchange", updateBattery);
      }
    };
  }, []);

  // Battery icon color
  const batteryColor = batteryLevel <= 20 ? "#FF3B30" : batteryLevel <= 50 ? "#FFD60A" : "currentColor";

  return (
    <div className="h-11 px-6 flex items-center justify-between text-foreground">
      <span className="text-sm font-semibold tabular-nums">
        {time.hours}:{time.minutes}
      </span>
      <div className="absolute left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-b-3xl" />
      <div className="flex items-center gap-1.5">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        {/* Battery with real level */}
        <div className="flex items-center gap-0.5">
          <div className="relative w-[22px] h-[11px] border border-current rounded-[2px] flex items-center p-[1.5px]">
            <div
              className="h-full rounded-[1px] transition-all duration-500"
              style={{
                width: `${batteryLevel}%`,
                backgroundColor: batteryColor,
              }}
            />
            {isCharging && (
              <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold" style={{ color: batteryLevel > 50 ? "#000" : "#fff" }}>⚡</span>
            )}
          </div>
          <div className="w-[1.5px] h-[5px] bg-current rounded-r-sm" />
        </div>
      </div>
    </div>
  );
};
