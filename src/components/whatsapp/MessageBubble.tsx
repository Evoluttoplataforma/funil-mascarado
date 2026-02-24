import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  text: string;
  sender: "eva" | "user";
  timestamp?: string;
  delivered?: boolean;
  read?: boolean;
}

export const MessageBubble = ({
  text,
  sender,
  timestamp = "agora",
  delivered = true,
  read = true,
}: MessageBubbleProps) => {
  const isUser = sender === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}
    >
      <div
        className={isUser ? "whatsapp-bubble-right" : "whatsapp-bubble-left"}
      >
        <p className="text-[15px] text-gray-900 break-words hyphens-auto">
          {text}
        </p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[11px] text-whatsapp-gray">{timestamp}</span>
          {isUser && (
            <span className={read ? "text-whatsapp-blue" : "text-whatsapp-gray"}>
              {delivered ? (
                <CheckCheck className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
