// // src/chat/useChat.ts
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { ChatTransport } from '../services/chat/chatTransport';
// import { fetchLast50 } from '../services/chat/chatService';
// import { ChatMessageDto, MessageType } from '../services/interfaces/chatTypes';
// import { useAppSelector } from './hooks';
// import { getUserId } from '../redux/slice/accountSlice';

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

// export function useChat(conversationId: string | undefined) {
//   const [connecting, setConnecting] = useState(false);
//   const [connected, setConnected] = useState(false);
//   const [messages, setMessages] = useState<ChatMessageDto[]>([]);
//   const transportRef = useRef<ChatTransport | null>(null);

//   const transport = useMemo(() => new ChatTransport(BACKEND_URL), []);

//   const senderId = useAppSelector(getUserId);

//   useEffect(() => {
//     if (!conversationId) return;
//     transportRef.current = transport;
//     setConnecting(true);

//     transport.activate(
//       () => {
//         setConnected(true);
//         setConnecting(false);
//         transport.subscribeConversation(conversationId, (msg: any) => {
//           setMessages((prev) => {
//             if (msg.clientMsgId) {
//               const i = prev.findIndex(
//                 (p) => p.clientMsgId === msg.clientMsgId,
//               );
//               if (i >= 0) {
//                 const next = prev.slice();
//                 next[i] = { ...prev[i], ...msg };
//                 return next;
//               }
//             }
//             return [...prev, msg];
//           });
//         });
//       },
//       () => {
//         setConnected(false);
//         setConnecting(false);
//       },
//     );

//     return () => {
//       transport.unsubscribeConversation(conversationId);
//       transport.deactivate().catch(() => {});
//     };
//   }, [transport, conversationId]);

//   useEffect(() => {
//     if (!conversationId) return;
//     fetchLast50(conversationId)
//       .then((rows) =>
//         setMessages(
//           rows.sort(
//             (a, b) =>
//               new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime(),
//           ),
//         ),
//       )
//       .catch((e) => console.error('history failed', e));
//   }, [conversationId]);

//   const send = useCallback(
//     (content: string, recipientId: string) => {
//       if (!conversationId) return;
//       const clientMsgId = crypto.randomUUID();
//       const optimistic: ChatMessageDto = {
//         id: clientMsgId,
//         clientMsgId,
//         conversationId,
//         senderId,
//         recipientId,
//         content,
//         type: MessageType.CHAT,
//         timeStamp: new Date().toISOString(),
//       };
//       setMessages((prev) => [...prev, optimistic]);
//       transportRef.current?.sendMessage(conversationId, {
//         clientMsgId,
//         conversationId,
//         recipientId,
//         content,
//       });
//     },
//     [conversationId],
//   );

//   return { connecting, connected, messages, send };
// }
