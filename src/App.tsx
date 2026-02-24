import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IncomingCall from "./pages/IncomingCall";
import ChamadaAtiva from "./pages/ChamadaAtiva";
import Discar from "./pages/Discar";
import ChamadaAtiva2 from "./pages/ChamadaAtiva2";
import Exp2Revelacao from "./pages/Exp2Revelacao";
import HackerLogin from "./pages/HackerLogin";
import HackerLoading from "./pages/HackerLoading";
import TikTokPrivado from "./pages/TikTokPrivado";
import SalesPage from "./pages/SalesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IncomingCall />} />
          <Route path="/chamada-ativa" element={<ChamadaAtiva />} />
          <Route path="/discar" element={<Discar />} />
          <Route path="/chamada-ativa-2" element={<ChamadaAtiva2 />} />
          <Route path="/exp-2-revelacao" element={<Exp2Revelacao />} />
          <Route path="/hacker-login" element={<HackerLogin />} />
          <Route path="/hacker-loading" element={<HackerLoading />} />
          <Route path="/tiktok-privado" element={<TikTokPrivado />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
