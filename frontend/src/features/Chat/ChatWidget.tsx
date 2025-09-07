// src/components/chat/ChatWidget.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  closeWidget,
  openWidget,
  sendMessageOptimistic,
  startChatWith,
  type Contact,
} from '../../redux/slice/chatSlice';
import { getUserId } from '../../redux/slice/accountSlice';

export default function ChatWidget() {
  const dispatch = useAppDispatch();
  const {
    open,
    connected,
    contacts,
    activeContactId,
    conversationId,
    messages,
  } = useAppSelector((s) => s.chat);

  const meId = useAppSelector(getUserId);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const activeContact =
    contacts.find((c: Contact) => c.id === activeContactId) || null;

  // focus input when panel is open and a contact is selected
  useEffect(() => {
    if (open && activeContactId) inputRef.current?.focus();
  }, [open, activeContactId]);

  // ESC closes widget
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(closeWidget());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);

  // Only show messages for the current conversation (state already scoped that way)
  const activeMessages = useMemo(() => messages, [messages]);

  const onClickContact = (c: Contact) => {
    // Reuse the existing thunk to open+subscribe+load history for that contact
    void dispatch(startChatWith(c));
  };

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !conversationId || !activeContact) return;
    dispatch(
      sendMessageOptimistic({
        conversationId,
        recipientId: activeContact.id,
        content: draft.trim(),
        senderId: meId,
      }),
    );
    setDraft('');
  };

  return (
    <>
      {/* Launcher Button */}
      {!open && (
        <button
          aria-label="Open chat"
          onClick={() => dispatch(openWidget())}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-indigo-600 px-5 py-3 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Chat
        </button>
      )}

      {/* Chat Panel */}
      <div
        className={[
          'fixed bottom-6 right-6 z-50 h-[520px] w-[860px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5',
          'transition-all duration-300 ease-out',
          open
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0',
          'sm:w-[420px] md:w-[720px] lg:w-[860px]',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label="Chat widget"
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl border-b bg-gradient-to-r from-indigo-50 to-white px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                connected ? 'bg-green-500' : 'bg-slate-300'
              }`}
            />
            <span className="text-sm font-medium text-indigo-700">Chat</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(closeWidget())}
              className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>

        {/* Body: Left (Contacts) | Right (Chat) */}
        <div className="flex h-[calc(520px-3rem)]">
          {/* Contacts column */}
          <aside className="hidden w-64 shrink-0 border-r bg-slate-50/60 p-2 md:block">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Contacts
            </div>
            <ul className="space-y-1 overflow-y-auto pr-1">
              {contacts.map((c: Contact) => {
                const selected = c.id === activeContactId;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => onClickContact(c)}
                      className={[
                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left',
                        selected
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'hover:bg-slate-100',
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200 text-sm font-semibold text-indigo-700">
                          {initials(c.name)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{c.name}</div>
                          <div className="text-xs text-slate-500">
                            Tap to open chat
                          </div>
                        </div>
                      </div>
                      {/* Example unread badge if you track it in slice later */}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Chat column */}
          <section className="flex min-w-0 flex-1 flex-col">
            {!activeContact ? (
              <EmptyState contacts={contacts} onPick={onClickContact} />
            ) : (
              <>
                {/* Chat header (contact info) */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-200 text-sm font-semibold text-indigo-700">
                      {initials(activeContact.name)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {activeContact.name}
                      </div>
                      <div className="text-xs text-emerald-600">
                        {connected ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">Secure chat</div>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-3 overflow-y-auto bg-white px-4 py-3">
                  {activeMessages.length === 0 ? (
                    <div className="mt-6 text-center text-sm text-slate-500">
                      No messages yet. Say hello 👋
                    </div>
                  ) : (
                    activeMessages.map((m: any) => {
                      const mine = m.senderId === meId;
                      return (
                        <div
                          key={m.id}
                          className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={[
                              'max-w-[72%] rounded-2xl px-3 py-2 text-sm shadow-sm',
                              mine
                                ? 'rounded-br-md bg-indigo-600 text-white'
                                : 'rounded-bl-md bg-slate-100 text-slate-800',
                            ].join(' ')}
                          >
                            <div>{m.content}</div>
                            <div
                              className={`mt-1 text-[10px] ${
                                mine ? 'text-indigo-100' : 'text-slate-500'
                              }`}
                            >
                              {new Date(m.timeStamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Composer */}
                <div className="border-t px-3 py-2">
                  <form onSubmit={onSend} className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type a message…"
                      className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}

function EmptyState({
  contacts,
  onPick,
}: {
  contacts: Contact[];
  onPick: (c: Contact) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
      <div className="rounded-2xl bg-slate-100 px-4 py-2 text-slate-600">
        Select a contact to start chatting
      </div>
      <div className="mt-3 w-full px-4 md:hidden">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Contacts
        </div>
        <div className="grid grid-cols-2 gap-2">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => onPick(c)}
              className="rounded-lg border bg-white px-3 py-2 text-left hover:bg-slate-50"
            >
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-slate-500">Open chat</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
