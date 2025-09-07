// src/chat/chatTransport.ts
import {
  Client,
  IMessage,
  StompHeaders,
  StompSubscription,
} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getToken } from '../api';
import { AppDispatch } from '../../redux/store';
import {
  connectionChanged,
  messageReceived,
} from '../../redux/slice/chatSlice';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export class ChatTransport {
  private client: Client | null = null;
  private subs = new Map<string, StompSubscription>();
  private dispatch?: AppDispatch;

  init(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  activate(onConnect?: () => void, onDisconnect?: () => void) {
    if (this.client?.active) return;

    const sockFactory = () => new SockJS(`${BACKEND_URL}/ws`);
    this.client = new Client({
      webSocketFactory: sockFactory,
      reconnectDelay: 4000,
      debug: (s) => console.debug('[STOMP]', s),
      connectHeaders: {},
      beforeConnect: () => {
        const t = getToken();
        const headers: StompHeaders = {};
        if (t) headers.Authorization = `Bearer ${t}`;
        this.client!.connectHeaders = headers;
      },
      onConnect: () => this.dispatch?.(connectionChanged(true)),
      onWebSocketClose: () => this.dispatch?.(connectionChanged(false)),
      onStompError: (f) =>
        console.error('Broker error', f.headers['message'], f.body),
    });

    this.client.activate();
  }

  async deactivate() {
    if (!this.client) return;
    this.subs.forEach((s) => s.unsubscribe());
    this.subs.clear();
    await this.client.deactivate();
    this.client = null;
  }

  subscribeConversation(conversationId: string) {
    if (!this.client) throw new Error('Client not active');
    if (this.subs.has(conversationId)) return;

    const dest = `/user/queue/chat.conv.${conversationId}`;
    const sub = this.client.subscribe(dest, (frame: IMessage) => {
      try {
        const msg = JSON.parse(frame.body);
        this.dispatch?.(messageReceived({ conversationId, msg }));
      } catch (e) {
        console.error(e);
      }
    });
    this.subs.set(conversationId, sub);
  }

  unsubscribeConversation(conversationId: string) {
    const s = this.subs.get(conversationId);
    if (s) {
      s.unsubscribe();
      this.subs.delete(conversationId);
    }
  }

  sendMessage(conversationId: string, body: any) {
    if (!this.client) throw new Error('Client not active');
    this.client.publish({
      destination: `/app/chat/${conversationId}/send`,
      body: JSON.stringify(body),
    });
  }
}

export const chatTransport = new ChatTransport();
