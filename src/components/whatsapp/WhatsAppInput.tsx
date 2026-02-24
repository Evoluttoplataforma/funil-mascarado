import { Plus, Camera, Mic, Send } from "lucide-react";

interface WhatsAppInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const WhatsAppInput = ({
  value,
  onChange,
  onSend,
  disabled = false,
}: WhatsAppInputProps) => {
  return (
    <div className="h-[60px] bg-whatsapp-input flex items-center px-2 gap-2">
      <button
        aria-label="Adicionar"
        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
        disabled={disabled}
      >
        <Plus className="w-6 h-6 text-whatsapp-gray" />
      </button>

      <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2">
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex-1 bg-transparent text-[15px] text-gray-900 placeholder:text-whatsapp-gray outline-none"
        />
        <button
          aria-label="Câmera"
          className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
          disabled={disabled}
        >
          <Camera className="w-5 h-5 text-whatsapp-gray" />
        </button>
      </div>

      <button
        onClick={onSend}
        aria-label={value ? "Enviar" : "Gravar áudio"}
        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-whatsapp-green"
        disabled={disabled}
      >
        {value ? (
          <Send className="w-5 h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
};
