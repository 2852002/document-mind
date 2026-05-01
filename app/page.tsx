import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F' }}>
      <Navbar />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>

        <div style={{
          display: 'inline-block',
          background: 'rgba(0,200,150,0.1)',
          border: '1px solid rgba(0,200,150,0.3)',
          borderRadius: 4,
          padding: '4px 14px',
          fontSize: 11,
          letterSpacing: '0.15em',
          color: '#00C896',
          marginBottom: 24,
          fontFamily: "'Courier New', monospace",
        }}>
          RAG-POWERED DOCUMENT Q&A
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 52px)',
          fontWeight: 400,
          margin: '0 0 16px',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: '#E8E6E0',
        }}>
          Ask anything about<br />
          <span style={{ color: '#00C896' }}>your documents</span>
        </h1>

        <p style={{
          fontSize: 17,
          color: '#6B7280',
          margin: '0 0 48px',
          lineHeight: 1.7,
          fontStyle: 'italic',
        }}>
          Upload PDFs. Ask questions. Get grounded answers with sources —<br />
          powered by LLaMA 3 and pgvector.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/upload" style={{
            padding: '14px 28px',
            background: '#00C896',
            color: '#0A0A0F',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'Courier New', monospace",
          }}>
            Upload PDF →
          </Link>
          <Link href="/chat" style={{
            padding: '14px 28px',
            background: 'rgba(255,255,255,0.04)',
            color: '#E8E6E0',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 14,
            fontFamily: "'Courier New', monospace",
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            Start Chatting
          </Link>
        </div>

        <div style={{
          marginTop: 72,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          textAlign: 'left',
        }}>
          {[
            { icon: '📄', title: 'Upload PDFs', desc: 'Drag & drop. We chunk and embed it automatically using HuggingFace MiniLM.' },
            { icon: '🔍', title: 'Semantic Search', desc: 'pgvector cosine similarity finds the most relevant chunks for your question.' },
            { icon: '💬', title: 'Grounded Answers', desc: 'LLaMA 3 answers ONLY from your documents — no hallucinations.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
              padding: '20px',
            }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#E8E6E0', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}