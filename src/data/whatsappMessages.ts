export interface WhatsAppMessage {
  id: number;
  text: string;
  sender: "eva" | "user";
  timestamp?: string;
  delivered?: boolean;
  read?: boolean;
}

export const userChoices = [
  { id: "choice1", text: "Ok, mostra." },
];
