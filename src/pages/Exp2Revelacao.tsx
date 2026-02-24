import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { WhatsAppHeader } from "@/components/whatsapp/WhatsAppHeader";
import { MessageBubble } from "@/components/whatsapp/MessageBubble";
import { TypingIndicator } from "@/components/whatsapp/TypingIndicator";
import { WhatsAppInput } from "@/components/whatsapp/WhatsAppInput";
import { AudioBubble } from "@/components/whatsapp/AudioBubble";
import { QuickReplyButtons } from "@/components/whatsapp/QuickReplyButtons";
import { messagesBeforeAudio2, whatsappMessages, userChoices, WhatsAppMessage } from "@/data/whatsappMessages";
import { TikTokIcon } from "@/components/call/TikTokIcon";
import { EncryptionOverlay } from "@/components/whatsapp/EncryptionOverlay";

const evaAvatar = "/eva-avatar.png";

const Exp2Revelacao = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [initialMessages, setInitialMessages] = useState<WhatsAppMessage[]>([]);
  const [preAudio2Messages, setPreAudio2Messages] = useState<WhatsAppMessage[]>([]);
  const [sequenceMessages, setSequenceMessages] = useState<WhatsAppMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [preAudio2Step, setPreAudio2Step] = useState(0);
  const [preAudio2Done, setPreAudio2Done] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [showChoices, setShowChoices] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTrustCheck, setShowTrustCheck] = useState(true);
  const [showAudio, setShowAudio] = useState(false);
  const [audioFinished, setAudioFinished] = useState(false);
  const [showEncryption, setShowEncryption] = useState(false);
  const [encryptionDone, setEncryptionDone] = useState(false);
  const [showAudio2, setShowAudio2] = useState(false);
  const [audio2Finished, setAudio2Finished] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [initialMessages, preAudio2Messages, sequenceMessages, isTyping, showAudio, showAudio2, showEncryption, scrollToBottom]);

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
    // Add user reply
    const userReply: WhatsAppMessage = {
      id: 1,
      text: "pode confiar",
      sender: "user",
    };
    setInitialMessages((prev) => [...prev, userReply]);
    setShowTrustCheck(false);

    // Eva starts "recording" then sends audio
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setShowAudio(true);
      }, 1500);
    }, 500);
  }, []);

  const handleAudioEnded = useCallback(() => {
    setAudioFinished(true);
    setShowEncryption(true);
  }, []);

  const handleEncryptionComplete = useCallback(() => {
    setEncryptionDone(true);
  }, []);

  // Messages before audio 2 ("ok", "agora dá pra falar com mais calma")
  useEffect(() => {
    if (!encryptionDone || preAudio2Done) return;
    if (preAudio2Step >= messagesBeforeAudio2.length) {
      setPreAudio2Done(true);
      setTimeout(() => {
        setShowAudio2(true);
      }, 500);
      return;
    }

    const typingDelay = Math.random() * 800 + 800;
    const messageDelay = Math.random() * 600 + 700;

    const typingTimer = setTimeout(() => {
      setIsTyping(true);
    }, 100);

    const messageTimer = setTimeout(() => {
      setIsTyping(false);
      setPreAudio2Messages((prev) => [...prev, messagesBeforeAudio2[preAudio2Step]]);
      setPreAudio2Step((prev) => prev + 1);
    }, typingDelay + messageDelay);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(messageTimer);
    };
  }, [preAudio2Step, encryptionDone, preAudio2Done]);

  const handleAudio2Ended = useCallback(() => {
    setAudio2Finished(true);
  }, []);

  // Message sequence — starts after second audio finishes
  useEffect(() => {
    if (!audio2Finished) return;
    if (currentStep >= whatsappMessages.length) {
      setShowChoices(true);
      return;
    }

    const typingDelay = Math.random() * 1000 + 1100;
    const messageDelay = Math.random() * 800 + 900;

    const typingTimer = setTimeout(() => {
      setIsTyping(true);
    }, 100);

    const messageTimer = setTimeout(() => {
      setIsTyping(false);
      setSequenceMessages((prev) => [...prev, whatsappMessages[currentStep]]);
      setCurrentStep((prev) => prev + 1);
    }, typingDelay + messageDelay);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(messageTimer);
    };
  }, [currentStep, audio2Finished]);

  const handleChoiceSelect = useCallback((choice: { id: string; text: string }) => {
    setShowChoices(false);

    const userMessage: WhatsAppMessage = {
      id: sequenceMessages.length + 100,
      text: choice.text,
      sender: "user",
    };
    setSequenceMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      setShowCta(true);
    }, 1000);
  }, [sequenceMessages.length]);

  const handleNextStep = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/hacker-login");
    }, 500);
  }, [navigate, isTransitioning]);

  const status = isTyping
    ? showAudio && !audioFinished
      ? "Gravando áudio..."
      : "Digitando..."
    : "Online";

  return (
    <div
      className={`min-h-screen max-w-[100vw] overflow-x-hidden bg-white flex flex-col ${
        isTransitioning ? "animate-fade-out" : ""
      }`}
    >
      <div className="w-full max-w-[390px] h-[100dvh] mx-auto flex flex-col">
        {/* Header */}
        <WhatsAppHeader name="Titia Eva" status={status} avatar={evaAvatar} />

        {/* Chat area — tudo rola junto */}
        <div className="flex-1 bg-[#ECE5DD] overflow-y-auto px-3 py-4 flex flex-col gap-1 no-scrollbar">
          {/* 1. Mensagens iniciais (trust + reply) */}
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

          {/* 3. Áudio (aparece após confirmar) */}
          {showAudio && (
            <AudioBubble
              src="/audio/whatsapp-parte3a.mp3"
              sender="eva"
              avatar={evaAvatar}
              autoPlay
              onEnded={handleAudioEnded}
            />
          )}

          {/* 4. Animação de criptografia — some após completar */}
          {showEncryption && !encryptionDone && (
            <EncryptionOverlay onComplete={handleEncryptionComplete} />
          )}

          {/* 5. Mensagens antes do segundo áudio ("ok", "agora dá pra falar...") */}
          {preAudio2Messages.map((msg) => (
            <MessageBubble
              key={`pre2-${msg.id}`}
              text={msg.text}
              sender={msg.sender}
              delivered={msg.delivered}
              read={msg.read}
            />
          ))}

          {/* 6. Segundo áudio (após mensagens 1-2) */}
          {showAudio2 && (
            <AudioBubble
              src="/audio/whatsapp-parte3b.mp3"
              sender="eva"
              avatar={evaAvatar}
              autoPlay
              onEnded={handleAudio2Ended}
            />
          )}

          {/* 6. Mensagens da sequência (aparecem após segundo áudio) */}
          {sequenceMessages.map((msg) => (
            <MessageBubble
              key={`seq-${msg.id}`}
              text={msg.text}
              sender={msg.sender}
              delivered={msg.delivered}
              read={msg.read}
            />
          ))}

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
          <div className="p-3 bg-[#F0F0F0] border-t border-gray-300">
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
