import { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '../hooks/useChat';
// import { ChatMessage } from '../types';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  TypingIndicator,
  Avatar,
} from '@chatscope/chat-ui-kit-react';

export default function ChatRoom() {
  const { connected, connecting, messages, join, send } = useChat();
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [draft, setDraft] = useState('');

  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const chatItems = useMemo(
    () =>
      messages.map((m, i) => {
        if (m.type !== 'CHAT') {
          const text = `${m.sender} ${m.type === 'JOIN' ? 'joined' : 'left'} the chat`;
          return (
            <Message
              key={`sys-${i}`}
              model={{
                type: 'custom',
                message: text,
                direction: 'incoming',
                position: 'single',
              }}
            />
          );
        }
        const mine = m.sender === username;
        return (
          <Message
            key={i}
            model={{
              message: m.content ?? '',
              direction: mine ? 'outgoing' : 'incoming',
              sender: mine ? 'You' : m.sender,
              sentTime: m.timestamp
                ? new Date(m.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : undefined,
              position: 'single',
            }}
          />
        );
      }),
    [messages, username],
  );

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim();
    if (!u) return;
    join(u);
    setJoined(true);
  };

  const handleSend = (text: string) => {
    const t = text.trim();
    if (!t) return;
    send(t);
    setDraft('');
  };

  if (!joined) {
    return (
      <div
        style={{
          maxWidth: 420,
          margin: '60px auto',
          padding: 20,
          background: '#111827',
          borderRadius: 12,
          border: '1px solid #1f2937',
          color: '#e2e8f0',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Join the chat</h2>
        <p style={{ opacity: 0.8 }}>
          Backend: <code>{import.meta.env.VITE_BACKEND_URL}/ws</code>
        </p>
        <form onSubmit={handleJoin} style={{ display: 'grid', gap: 10 }}>
          <input
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              height: 44,
              borderRadius: 10,
              border: '1px solid #1f2937',
              background: '#0b1220',
              color: '#e2e8f0',
              padding: '0 12px',
            }}
          />
          <button
            disabled={!connected || !username.trim()}
            style={{
              height: 44,
              borderRadius: 10,
              border: 'none',
              background: '#2563eb',
              color: 'white',
              fontWeight: 600,
            }}
          >
            {connecting
              ? 'Connecting…'
              : connected
                ? 'Enter room'
                : 'Waiting for server…'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ height: '85vh', maxWidth: 900, margin: '0 auto' }}>
      <MainContainer style={{ height: '100%' }}>
        <ChatContainer>
          <ConversationHeader>
            <Avatar name="Public Room" />
            <ConversationHeader.Content
              userName="Public Room"
              info={connected ? 'Connected · /topic/public' : 'Reconnecting…'}
            />
          </ConversationHeader>

          <MessageList ref={listRef as any}>{chatItems}</MessageList>

          <MessageInput
            placeholder="Write a message…"
            value={draft}
            onChange={setDraft}
            onSend={handleSend}
            attachButton={false}
            disabled={!connected}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
