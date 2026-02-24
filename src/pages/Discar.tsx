import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { StatusBarFake } from "@/components/call/StatusBarFake";
import { Phone, Delete } from "lucide-react";

const Discar = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const numero = "61100";

  const handleCall = useCallback(() => {
    if (isTransitioning) return;

    if ("vibrate" in navigator) {
      navigator.vibrate(100);
    }

    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/chamada-ativa-2");
    }, 300);
  }, [navigate, isTransitioning]);

  return (
    <div
      className={`min-h-[100dvh] max-w-[100vw] overflow-hidden bg-black flex flex-col ${
        isTransitioning ? "animate-fade-out" : ""
      }`}
    >
      <div className="w-full max-w-[390px] h-[100dvh] mx-auto flex flex-col relative overflow-hidden">
        <StatusBarFake />

        <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-4">
          {/* Instrução */}
          <p className="text-gray-400 text-sm animate-fade-in mb-6">
            A ligação caiu. Eva pediu para você ligar de volta.
          </p>

          {/* Número */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 mb-2">
              {numero.split("").map((digit, i) => (
                <span
                  key={i}
                  className="text-white text-5xl font-light tracking-[0.15em] animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {digit}
                </span>
              ))}
            </div>

            {/* Label */}
            <p className="text-green-400 text-sm mt-3 animate-fade-in" style={{ animationDelay: "600ms" }}>
              Toque para ligar
            </p>
          </div>

          {/* Teclado numérico decorativo */}
          <div className="grid grid-cols-3 gap-y-4 gap-x-6 mb-8 opacity-30">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
              (key) => (
                <div
                  key={key}
                  className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center"
                >
                  <span className="text-white text-xl font-light">{key}</span>
                </div>
              )
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex items-center justify-center gap-16 pb-8">
            {/* Delete decorativo */}
            <div className="w-14 h-14 rounded-full flex items-center justify-center opacity-30">
              <Delete className="w-6 h-6 text-white" />
            </div>

            {/* Botão de ligar */}
            <button
              onClick={handleCall}
              aria-label="Ligar"
              className="relative flex items-center justify-center focus:outline-none"
            >
              <div
                className="absolute w-[72px] h-[72px] rounded-full border-2 border-green-500/50"
                style={{
                  animation: "ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite",
                }}
              />
              <div className="w-[72px] h-[72px] rounded-full bg-[#34C759] flex items-center justify-center transition-transform duration-200 active:scale-95 shadow-[0_0_25px_rgba(52,199,89,0.5)]">
                <Phone className="w-8 h-8 text-white" />
              </div>
            </button>

            {/* Espaço vazio para centralizar */}
            <div className="w-14 h-14" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discar;
