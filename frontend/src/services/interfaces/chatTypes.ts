export type MessageType = 'CHAT' | 'JOIN' | 'LEAVE';

export interface ChatMessage {
  type: MessageType;
  content?: string;
  sender: string;
  timestamp?: number;
}
