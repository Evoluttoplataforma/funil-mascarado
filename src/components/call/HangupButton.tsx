import { Phone } from "lucide-react";

interface HangupButtonProps {
  onHangup: () => void;
}

export const HangupButton = ({ onHangup }: HangupButtonProps) => {
  return (
    <button
      onClick={onHangup}
      aria-label="Desligar chamada"
      className="ios-hangup-button focus:outline-none focus:ring-2 focus:ring-ios-red/50 focus:ring-offset-2 focus:ring-offset-transparent"
    >
      <Phone className="w-8 h-8 text-foreground rotate-[135deg]" />
    </button>
  );
};
