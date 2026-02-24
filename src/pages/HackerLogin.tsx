import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, Lock, Terminal } from "lucide-react";
import { toast } from "sonner";

const HackerLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const secretPassword = "EVA2024#HACK";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(secretPassword);
      setCopied(true);
      toast.success("Senha copiada!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar");
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (password === secretPassword) {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        navigate("/hacker-loading");
      }, 300);
    } else {
      toast.error("Senha incorreta. Copie a senha acima.");
    }
  }, [password, isTransitioning, navigate]);

  return (
    <div 
      className={`min-h-[100dvh] bg-black flex flex-col items-center justify-center p-6 ${
        isTransitioning ? "animate-fade-out" : ""
      }`}
    >
      <div className="w-full max-w-[360px] flex flex-col items-center">
        {/* Hacker logo */}
        <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-6 animate-pulse">
          <Terminal className="w-10 h-10 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-green-500 text-2xl font-mono font-bold mb-2 text-center">
          ACESSO RESTRITO
        </h1>
        <p className="text-green-500/60 text-sm font-mono mb-8 text-center">
          TikTok Privado - Conteúdo Exclusivo
        </p>

        {/* Password display */}
        <div className="w-full bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
          <p className="text-green-500/60 text-xs font-mono mb-2 uppercase">Senha de acesso:</p>
          <div className="flex items-center justify-between gap-3">
            <code className="text-green-400 text-lg font-mono font-bold tracking-wider">
              {secretPassword}
            </code>
            <button
              onClick={handleCopy}
              className="p-2 bg-green-500/20 rounded-lg transition-all hover:bg-green-500/30 active:scale-95"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-green-400" />
              )}
            </button>
          </div>
        </div>

        {/* Password input */}
        <div className="w-full mb-6">
          <label className="text-green-500/60 text-xs font-mono mb-2 block uppercase">
            Cole a senha abaixo:
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500/50" />
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Cole a senha aqui..."
              className="w-full bg-black border-2 border-green-500/50 rounded-lg py-4 pl-12 pr-4 text-green-400 font-mono placeholder:text-green-500/30 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-black font-mono font-bold text-lg py-4 rounded-lg transition-all hover:bg-green-400 active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <Terminal className="w-5 h-5" />
          ACESSAR SISTEMA
        </button>

        {/* Decorative elements */}
        <div className="mt-8 text-green-500/30 text-xs font-mono text-center">
          <p>{">> SISTEMA CRIPTOGRAFADO <<"}</p>
          <p className="mt-1">v2.0.24 | SECURE CONNECTION</p>
        </div>
      </div>

      {/* Background grid effect */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,255,0,0.1) 50px, rgba(0,255,0,0.1) 51px),
                           repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,255,0,0.1) 50px, rgba(0,255,0,0.1) 51px)`
        }} />
      </div>
    </div>
  );
};

export default HackerLogin;