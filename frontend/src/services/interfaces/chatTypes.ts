export interface ChatMessage {
  type: MessageType;
  content?: string;
  sender: string;
  timestamp?: number;
}

export type Contact = {
  id: string;
  name: string;
  avatarUrl?: string;
};

// services/chatApi.ts
export enum MessageType {
  CHAT = 'CHAT',
  READ = 'READ',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
}
export interface ChatMessageDto {
  id: string;
  clientMsgId?: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: MessageType;
  timeStamp: string;
}
