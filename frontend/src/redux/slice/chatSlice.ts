// src/chat/chatSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getToken } from '../../services/api';
import {
  ChatMessageDto,
  MessageType,
} from '../../services/interfaces/chatTypes';
import {
  fetchLast50,
  findOrCreateConversation,
} from '../../services/chat/chatService';
import { chatTransport } from '../../services/chat/chatTransport';
import { useAppSelector } from '../../hooks/hooks';
import { getUserId } from './accountSlice';

export type Contact = { id: string; name: string; avatarUrl?: string };

type ChatState = {
  open: boolean;
  connecting: boolean;
  connected: boolean;
  contacts: Contact[];
  activeContactId?: string;
  conversationId?: string;
  messages: ChatMessageDto[]; // current conversation messages
};

const initialState: ChatState = {
  open: false,
  connecting: false,
  connected: false,
  contacts: [],
  messages: [],
};

export const startChatWith = createAsyncThunk<
  { conversationId: string; contact: Contact },
  Contact
>('chat/startChatWith', async (contact, { getState, dispatch }) => {
  const token = getToken();
  const me = getUserId(getState());
  if (!token || !me) throw new Error('missing session');

  // connect transport (idempotent)
  chatTransport.activate();

  // create/find conversation
  const conversationId = await findOrCreateConversation(me, contact.id);

  // subscribe to WS and load history
  chatTransport.subscribeConversation(conversationId);

  dispatch(loadHistory(conversationId));

  return { conversationId, contact };
});

export const loadHistory = createAsyncThunk<ChatMessageDto[], string>(
  'chat/loadHistory',
  async (conversationId) => {
    const token = getToken();
    if (!token) throw new Error('missing token');
    const rows = await fetchLast50(conversationId);
    // sort ascending
    return rows.sort(
      (a, b) =>
        new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime(),
    );
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    connectionChanged(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
      state.connecting = !action.payload && state.open;
    },
    openWidget(state) {
      state.open = true;
    },
    closeWidget(state) {
      state.open = false;
    },
    messageReceived(
      state,
      action: PayloadAction<{ conversationId: string; msg: ChatMessageDto }>,
    ) {
      const { msg } = action.payload;
      if (msg.clientMsgId) {
        const i = state.messages.findIndex(
          (m) => m.clientMsgId && m.clientMsgId === msg.clientMsgId,
        );
        if (i >= 0) {
          state.messages[i] = { ...state.messages[i], ...msg };
          return;
        }
      }
      state.messages.push(msg);
    },
    sendMessageOptimistic(
      state,
      action: PayloadAction<{
        conversationId: string;
        recipientId: string;
        content: string;
        senderId: string;
      }>,
    ) {
      const clientMsgId = crypto.randomUUID(); // created from client side to check duplicate
      const now = new Date().toISOString();
      const optimistic: ChatMessageDto = {
        id: clientMsgId,
        clientMsgId,
        conversationId: action.payload.conversationId,
        senderId: action.payload.senderId,
        recipientId: action.payload.recipientId,
        content: action.payload.content,
        type: MessageType.CHAT,
        timeStamp: now,
      };
      state.messages.push(optimistic);

      // actually send via transport
      chatTransport.sendMessage(action.payload.conversationId, {
        clientMsgId,
        conversationId: action.payload.conversationId,
        recipientId: action.payload.recipientId,
        content: action.payload.content,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startChatWith.pending, (state) => {
        state.connecting = true;
        state.open = true;
      })
      .addCase(startChatWith.fulfilled, (state, { payload }) => {
        // add contact if not exists
        if (!state.contacts.some((c) => c.id === payload.contact.id)) {
          state.contacts.unshift(payload.contact);
        }
        state.activeContactId = payload.contact.id;
        state.conversationId = payload.conversationId;
        state.connecting = false;
      })
      .addCase(startChatWith.rejected, (state) => {
        state.connecting = false;
      })
      .addCase(loadHistory.fulfilled, (state, { payload }) => {
        state.messages = payload;
      });
  },
});

export const {
  connectionChanged,
  openWidget,
  closeWidget,
  messageReceived,
  sendMessageOptimistic,
} = chatSlice.actions;

export default chatSlice.reducer;
