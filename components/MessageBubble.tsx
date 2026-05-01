'use client';
import { Message } from '@/types';

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 16,
    }}>
      <div style={{ maxWidth: '80%' }}>
        <div style={{
          fontSize: 10,
          color: '#4B5563',
          marginBottom: 5,
          fontFamily: "'Courier New', monospace",
          letterSpacing: '0.1em',
          textAlign: isUser ? 'right' : 'left',
        }}>
          {isUser ? 'YOU' : 'DOCUMIND'}
        </div>

        <div style={{
          padding: '13px 17px',
          borderRadius: isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
          background: isUser ? 'rgba(0,200,150,0.1)' : 'rgba(255,255,255,0.04)',
          border: isUser ? '1px solid rgba(0,200,150,0.2)' : '1px solid rgba(255,255,255,0.07)',
          fontSize: 14,
          color: '#E8E6E0',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
        }}>
          {message.content}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{
              fontSize: 10,
              color: '#4B5563',
              fontFamily: "'Courier New', monospace",
              letterSpacing: '0.1em',
              marginBottom: 5,
            }}>
              SOURCES
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {message.sources.slice(0, 3).map((s, i) => (
                <span key={i} style={{
                  padding: '3px 10px',
                  background: 'rgba(59,130,246,0.08)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: 4,
                  fontSize: 11,
                  color: '#3B82F6',
                  fontFamily: "'Courier New', monospace",
                }}>
                  {(s as any).metadata?.filename ?? `Source ${i + 1}`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}