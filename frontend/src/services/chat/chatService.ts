import api from '../api';
import { ChatMessageDto } from '../interfaces/chatTypes';

const BASE = 'api/chat';

export async function fetchLast50(conversationId: string) {
  const res = await api.get<ChatMessageDto[]>(
    `${BASE}/conversations/${conversationId}/messages`,
  );
  return res;
}
type FindOrCreateRes = { conversationId: string };
export async function findOrCreateConversation(user1: string, user2: string) {
  const res = await api.post<FindOrCreateRes>(
    `${BASE}/conversations/find-or-create`,
    {
      user1,
      user2,
    },
  );
  return res.conversationId;
}
