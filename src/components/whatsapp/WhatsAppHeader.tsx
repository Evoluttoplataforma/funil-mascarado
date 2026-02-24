import { ChevronLeft, Phone, Video, MoreVertical, User } from "lucide-react";

interface WhatsAppHeaderProps {
  name: string;
  status: string;
  avatar?: string;
  onBack?: () => void;
}

export const WhatsAppHeader = ({ name, status, avatar, onBack }: WhatsAppHeaderProps) => {
  return (
    <div className="h-[60px] whatsapp-gradient flex items-center px-2 gap-2">
      <button
        onClick={onBack}
        aria-label="Voltar"
        className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      <div className="flex-1 ml-1">
        <h1 className="text-[17px] font-semibold text-white">{name}</h1>
        <p className="text-[13px] text-white/80">{status}</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          aria-label="Ligar"
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <Video className="w-5 h-5 text-white" />
        </button>
        <button
          aria-label="Videochamada"
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <Phone className="w-5 h-5 text-white" />
        </button>
        <button
          aria-label="Mais opções"
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <MoreVertical className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};
