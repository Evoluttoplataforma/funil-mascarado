import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { WhatsAppHeader } from "@/components/whatsapp/WhatsAppHeader";
import { MessageBubble } from "@/components/whatsapp/MessageBubble";
import { TypingIndicator } from "@/components/whatsapp/TypingIndicator";
import { WhatsAppInput } from "@/components/whatsapp/WhatsAppInput";
import { AudioBubble } from "@/components/whatsapp/AudioBubble";
import { QuickReplyButtons } from "@/components/whatsapp/QuickReplyButtons";
import { userChoices, WhatsAppMessage } from "@/data/whatsappMessages";
import { TikTokIcon } from "@/components/call/TikTokIcon";
import { EncryptionOverlay } from "@/components/whatsapp/EncryptionOverlay";

const evaAvatar = "/eva-avatar.png";

const Exp2Revelacao = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [initialMessages, setInitialMessages] = useState<WhatsAppMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showChoices, setShowChoices] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTrustCheck, setShowTrustCheck] = useState(true);

  // Audio states
  const [showAudio1, setShowAudio1] = useState(false);
  const [audio1Finished, setAudio1Finished] = useState(false);
  const [showEncryption, setShowEncryption] = useState(false);
  const [encryptionDone, setEncryptionDone] = useState(false);
  const [showAudio2, setShowAudio2] = useState(false);
  const [audio2Finished, setAudio2Finished] = useState(false);
  const [showAudio3, setShowAudio3] = useState(false);
  const [audio3Finished, setAudio3Finished] = useState(false);
  const [showAudio4, setShowAudio4] = useState(false);
  const [audio4Finished, setAudio4Finished] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [initialMessages, isTyping, showAudio1, showAudio2, showAudio3, showAudio4, showEncryption, showChoices, showCta, scrollToBottom]);

  // Show trust message on mount
  useEffect(() => {
    if (showTrustCheck) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const trustMessage: WhatsAppMessage = {
            id: 0,
            text: "antes de continuar... preciso saber se posso confiar em você",
            sender: "eva",
          };
          setInitialMessages([trustMessage]);
        }, 1500);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showTrustCheck]);

  const handleTrustConfirm = useCallback(() => {
    const userReply: WhatsAppMessage = {
      id: 1,
      text: "pode confiar",
      sender: "user",
    };
    setInitialMessages((prev) => [...prev, userReply]);
    setShowTrustCheck(false);

    // Show audio 1 after a brief pause
    setTimeout(() => {
      setShowAudio1(true);
    }, 800);
  }, []);

  // Audio 1 ends → show encryption
  const handleAudio1Ended = useCallback(() => {
    setAudio1Finished(true);
    setShowEncryption(true);
  }, []);

  // Encryption done → show audio 2
  const handleEncryptionComplete = useCallback(() => {
    setEncryptionDone(true);
    setTimeout(() => {
      setShowAudio2(true);
    }, 500);
  }, []);

  // Audio 2 ends → show audio 3
  const handleAudio2Ended = useCallback(() => {
    setAudio2Finished(true);
    setTimeout(() => {
      setShowAudio3(true);
    }, 500);
  }, []);

  // Audio 3 ends → show audio 4
  const handleAudio3Ended = useCallback(() => {
    setAudio3Finished(true);
    setTimeout(() => {
      setShowAudio4(true);
    }, 500);
  }, []);

  // Audio 4 ends → show choices
  const handleAudio4Ended = useCallback(() => {
    setAudio4Finished(true);
    setTimeout(() => {
      setShowChoices(true);
    }, 500);
  }, []);

  const handleChoiceSelect = useCallback((choice: { id: string; text: string }) => {
    setShowChoices(false);

    const userMessage: WhatsAppMessage = {
      id: 100,
      text: choice.text,
      sender: "user",
    };
    setInitialMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      setShowCta(true);
    }, 1000);
  }, []);

  const handleNextStep = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/hacker-login");
    }, 500);
  }, [navigate, isTransitioning]);

  const status = isTyping ? "Gravando áudio..." : "Online";

  return (
    <div
      className={`h-[100dvh] w-full overflow-hidden bg-[#ECE5DD] flex flex-col ${
        isTransitioning ? "animate-fade-out" : ""
      }`}
    >
      <div className="w-full max-w-[430px] h-full mx-auto flex flex-col">
        {/* Header */}
        <WhatsAppHeader name="Titia Eva" status={status} avatar={evaAvatar} />

        {/* Chat area */}
        <div className="flex-1 bg-[#ECE5DD] overflow-y-auto px-3 py-4 flex flex-col gap-1 no-scrollbar">
          {/* 1. Mensagens iniciais (trust + reply + user choice) */}
          {initialMessages.map((msg) => (
            <MessageBubble
              key={`init-${msg.id}`}
              text={msg.text}
              sender={msg.sender}
              delivered={msg.delivered}
              read={msg.read}
            />
          ))}

          {/* 2. Botão "pode confiar" */}
          {showTrustCheck && initialMessages.length > 0 && !isTyping && (
            <div className="flex justify-end mt-3 animate-fade-in">
              <button
                onClick={handleTrustConfirm}
                className="relative bg-[#25D366] text-white font-semibold text-sm py-3 px-6 rounded-full shadow-lg transition-all duration-200 active:scale-[0.96] animate-pulse"
              >
                <span className="absolute -top-2 -right-2 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-[#25D366] items-center justify-center">
                    <span className="text-white text-[10px]">👆</span>
                  </span>
                </span>
                pode confiar
              </button>
            </div>
          )}

          {/* 3. Áudio 1 */}
          {showAudio1 && (
            <AudioBubble
              src="/audio/whatsapp-parte1.mp4"
              sender="eva"
              avatar={evaAvatar}
              autoPlay
              onEnded={handleAudio1Ended}
            />
          )}

          {/* 4. Animação de criptografia */}
          {showEncryption && !encryptionDone && (
            <EncryptionOverlay onComplete={handleEncryptionComplete} />
          )}

          {/* 5. Áudio 2 */}
          {showAudio2 && (
            <AudioBubble
              src="/audio/whatsapp-parte2.mp4"
              sender="eva"
              avatar={evaAvatar}
              autoPlay
              onEnded={handleAudio2Ended}
            />
          )}

          {/* 6. Áudio 3 */}
          {showAudio3 && (
            <AudioBubble
              src="/audio/whatsapp-parte3.mp4"
              sender="eva"
              avatar={evaAvatar}
              autoPlay
              onEnded={handleAudio3Ended}
            />
          )}

          {/* 7. Áudio 4 */}
          {showAudio4 && (
            <AudioBubble
              src="/audio/whatsapp-parte4.mp4"
              sender="eva"
              avatar={evaAvatar}
              autoPlay
              onEnded={handleAudio4Ended}
            />
          )}

          {isTyping && <TypingIndicator />}

          <QuickReplyButtons
            choices={userChoices}
            onSelect={handleChoiceSelect}
            visible={showChoices}
          />

          <div ref={messagesEndRef} />
        </div>

        {/* Input area or CTA */}
        {showCta ? (
          <div className="p-3 bg-[#F0F0F0] border-t border-gray-300" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}>
            <button
              onClick={handleNextStep}
              className="w-full flex items-center justify-center gap-3 bg-black text-white font-semibold text-base py-3 px-6 rounded-full min-h-[44px] transition-all duration-200 active:scale-[0.98]"
            >
              <TikTokIcon className="w-5 h-5" />
              Abrir TikTok privado
            </button>
          </div>
        ) : (
          <WhatsAppInput
            value={inputValue}
            onChange={setInputValue}
            onSend={() => {}}
            disabled={true}
          />
        )}
      </div>
    </div>
  );
};

export default Exp2Revelacao;
