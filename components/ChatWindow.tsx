'use client';
import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import MessageBubble from './MessageBubble';

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: "Hello! I'm DocuMind. Upload a PDF first (/upload), then ask me anything about it. I'll answer only from your documents.",
  timestamp: new Date(),
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg.content,
          chatHistory: messages.slice(-6),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        timestamp: new Date(),
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message}`,
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>
      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        maxWidth: 720,
        width: '100%',
        margin: '0 auto',
      }}>
        {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}

        {loading && (
          <div style={{ display: 'flex', gap: 6, padding: '8px 0', marginLeft: 4 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 7, height: 7,
                borderRadius: '50%',
                background: '#00C896',
                opacity: 0.7,
                animation: `bounce 1s ease infinite ${i * 0.15}s`,
              }} />
            ))}
            <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 24px',
        background: '#0D0D14',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 10 }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything about your uploaded documents..."
            rows={1}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '12px 16px',
              color: '#E8E6E0',
              fontSize: 14,
              resize: 'none',
              outline: 'none',
              fontFamily: 'Georgia, serif',
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '0 20px',
              background: loading || !input.trim() ? 'rgba(0,200,150,0.3)' : '#00C896',
              color: '#0A0A0F',
              border: 'none',
              borderRadius: 8,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'Courier New', monospace",
              minWidth: 70,
            }}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
        <div style={{
          maxWidth: 720, margin: '6px auto 0',
          fontSize: 11, color: '#374151',
          fontFamily: "'Courier New', monospace",
        }}>
          ENTER to send • SHIFT+ENTER for new line
        </div>
      </div>
    </div>
  );
}