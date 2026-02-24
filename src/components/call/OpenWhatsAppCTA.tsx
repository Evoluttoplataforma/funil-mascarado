import { MessageCircle } from "lucide-react";

interface OpenWhatsAppCTAProps {
  onClick: () => void;
  visible: boolean;
}

export const OpenWhatsAppCTA = ({ onClick, visible }: OpenWhatsAppCTAProps) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 safe-area-inset-bottom animate-slide-up">
      <button
        onClick={onClick}
        className="w-full max-w-[390px] mx-auto flex items-center justify-center gap-3 bg-ios-green text-foreground font-semibold text-lg py-4 px-6 rounded-2xl min-h-[44px] transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ios-green/50"
      >
        <MessageCircle className="w-6 h-6" />
        Abrir WhatsApp
      </button>
    </div>
  );
};
