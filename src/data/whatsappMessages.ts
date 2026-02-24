export interface WhatsAppMessage {
  id: number;
  text: string;
  sender: "eva" | "user";
  timestamp?: string;
  delivered?: boolean;
  read?: boolean;
}

// Mensagens antes do segundo áudio
export const messagesBeforeAudio2: WhatsAppMessage[] = [
  { id: 1, text: "ok", sender: "eva" },
  { id: 2, text: "agora dá pra falar com mais calma", sender: "eva" },
];

// Mensagens após o segundo áudio
export const whatsappMessages: WhatsAppMessage[] = [
  { id: 3, text: "se você chegou até aqui", sender: "eva" },
  { id: 4, text: "é porque alguma coisa encaixou", sender: "eva" },
  { id: 5, text: "então deixa eu organizar isso pra você", sender: "eva" },
  { id: 6, text: "de forma simples", sender: "eva" },
  { id: 7, text: "o problema nunca foi", sender: "eva" },
  { id: 8, text: "falta de esforço", sender: "eva" },
  { id: 9, text: "nem falta de ferramenta", sender: "eva" },
  { id: 10, text: "na verdade", sender: "eva" },
  { id: 11, text: "você provavelmente tentou até demais", sender: "eva" },
  { id: 12, text: "CRM", sender: "eva" },
  { id: 13, text: "gestor de tarefas", sender: "eva" },
  { id: 14, text: "planilha", sender: "eva" },
  { id: 15, text: "BI", sender: "eva" },
  { id: 16, text: "Slack", sender: "eva" },
  { id: 17, text: "Notion", sender: "eva" },
  { id: 18, text: "cada uma resolve um pedaço", sender: "eva" },
  { id: 19, text: "mas nenhuma resolve o todo", sender: "eva" },
  { id: 20, text: "e é aqui que a maioria das consultorias trava", sender: "eva" },
  { id: 21, text: "sem perceber", sender: "eva" },
  { id: 22, text: "porque consultoria", sender: "eva" },
  { id: 23, text: "não é empresa de produto", sender: "eva" },
  { id: 24, text: "nem fábrica", sender: "eva" },
  { id: 25, text: "nem agência", sender: "eva" },
  { id: 26, text: "consultoria é operação intelectual", sender: "eva" },
  { id: 27, text: "decisão", sender: "eva" },
  { id: 28, text: "contexto", sender: "eva" },
  { id: 29, text: "responsabilidade", sender: "eva" },
  { id: 30, text: "quando você usa ferramentas genéricas", sender: "eva" },
  { id: 31, text: "você força sua consultoria", sender: "eva" },
  { id: 32, text: "a caber numa lógica que não é dela", sender: "eva" },
  { id: 33, text: "o resultado?", sender: "eva" },
  { id: 34, text: "mais controle aparente", sender: "eva" },
  { id: 35, text: "menos controle real", sender: "eva" },
  { id: 36, text: "porque no fim", sender: "eva" },
  { id: 37, text: "quem integra tudo", sender: "eva" },
  { id: 38, text: "continua sendo você", sender: "eva" },
  { id: 39, text: "é por isso que você sente", sender: "eva" },
  { id: 40, text: "que trabalha mais", sender: "eva" },
  { id: 41, text: "e anda menos", sender: "eva" },
  { id: 42, text: "o nome disso", sender: "eva" },
  { id: 43, text: "não é desorganização", sender: "eva" },
  { id: 44, text: "é ausência de um sistema operacional", sender: "eva" },
  { id: 45, text: "um sistema pensado", sender: "eva" },
  { id: 46, text: "desde o início", sender: "eva" },
  { id: 47, text: "para a realidade de uma consultoria", sender: "eva" },
  { id: 48, text: "quando esse sistema existe", sender: "eva" },
  { id: 49, text: "as decisões não ficam presas em você", sender: "eva" },
  { id: 50, text: "os processos deixam de ser implícitos", sender: "eva" },
  { id: 51, text: "e a empresa começa a andar sozinha", sender: "eva" },
  { id: 52, text: "na próxima etapa", sender: "eva" },
  { id: 53, text: "eu vou te mostrar", sender: "eva" },
  { id: 54, text: "como isso se parece na prática", sender: "eva" },
  { id: 55, text: "não como promessa", sender: "eva" },
  { id: 56, text: "mas como estrutura", sender: "eva" },
  { id: 57, text: "segue", sender: "eva" },
  { id: 58, text: "e olha com atenção", sender: "eva" },
];

export const userChoices = [
  { id: "choice1", text: "Ok, mostra." },
  { id: "choice2", text: "E se meu negócio for complexo?" },
];
