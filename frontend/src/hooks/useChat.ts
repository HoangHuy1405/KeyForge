import { useEffect, useMemo, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../services/interfaces/chatTypes';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export function useChat() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const clientRef = useRef<Client | null>(null);
  const usernameRef = useRef<string>('');

  const client = useMemo(() => {
    const sockFactory = () => new SockJS(`${BACKEND_URL}/ws`);
    return new Client({
      webSocketFactory: sockFactory,
      reconnectDelay: 5000,
      debug: (s) => console.debug('[STOMP]', s),
    });
  }, []);

  useEffect(() => {
    clientRef.current = client;
    setConnecting(true);
    client.onConnect = () => {
      setConnected(true);
      setConnecting(false);
      client.subscribe('/topic/public', (frame: IMessage) => {
        try {
          const msg: ChatMessage = JSON.parse(frame.body);
          setMessages((prev) => [
            ...prev,
            { ...msg, timestamp: msg.timestamp ?? Date.now() },
          ]);
        } catch (e) {
          console.error('Bad message payload:', e);
        }
      });
    };
    client.onStompError = (f) =>
      console.error('Broker error', f.headers['message'], f.body);
    client.onWebSocketClose = () => {
      setConnected(false);
      setConnecting(false);
    };

    client.activate();
    return () => {
      void client.deactivate();
    };
  }, [client]);

  const join = (username: string) => {
    usernameRef.current = username;
    const joinMsg: ChatMessage = { type: 'JOIN', sender: username };
    clientRef.current?.publish({
      destination: '/app/chat.addUser',
      body: JSON.stringify(joinMsg),
    });
  };

  const send = (text: string) => {
    if (!usernameRef.current) return;
    const chatMsg: ChatMessage = {
      type: 'CHAT',
      sender: usernameRef.current,
      content: text,
      timestamp: Date.now(),
    };
    clientRef.current?.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chatMsg),
    });
    // optimistic display
    setMessages((prev) => [...prev, chatMsg]);
  };

  return { connected, connecting, messages, join, send };
}
