import Navbar from '@/components/Navbar';
import UploadZone from '@/components/UploadZone';

export default function UploadPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F' }}>
      <Navbar />
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '48px 32px' }}>

        <div style={{
          display: 'inline-block',
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: 4,
          padding: '4px 12px',
          fontSize: 11,
          letterSpacing: '0.15em',
          color: '#3B82F6',
          marginBottom: 20,
          fontFamily: "'Courier New', monospace",
        }}>
          STEP 1 — UPLOAD DOCUMENTS
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 400, margin: '0 0 8px', color: '#E8E6E0' }}>
          Upload your PDF
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 32px', lineHeight: 1.6 }}>
          We'll split it into 1000-char chunks, generate 384-dim embeddings with HuggingFace MiniLM, and store them in Supabase pgvector.
        </p>

        <UploadZone />

        <div style={{
          marginTop: 28,
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          fontSize: 13,
          color: '#6B7280',
          lineHeight: 1.7,
          fontFamily: "'Courier New', monospace",
        }}>
          PDF → text → 1000-char chunks (200 overlap) → MiniLM embeddings → pgvector
        </div>

      </div>
    </div>
  );
}