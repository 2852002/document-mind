'use client';
import { useState, useRef } from 'react';

interface Result {
  filename: string;
  chunks: number;
}

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setStatusText('Parsing PDF and generating embeddings...');
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setResult({ filename: data.filename, chunks: data.chunks });
      setStatus('done');
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
    setStatusText('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? '#00C896' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: 12,
          padding: '52px 32px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? 'rgba(0,200,150,0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.2s',
        }}
      >
        <input
          type="file"
          accept=".pdf"
          ref={fileRef}
          style={{ display: 'none' }}
          onChange={e => e.target.files?.[0] && processFile(e.target.files[0])}
        />
        <div style={{ fontSize: 40, marginBottom: 16 }}>📄</div>
        <div style={{ fontSize: 16, color: '#E8E6E0', marginBottom: 6 }}>Drop your PDF here</div>
        <div style={{ fontSize: 13, color: '#6B7280' }}>or click to browse</div>
      </div>

      {/* Processing */}
      {status === 'processing' && (
        <div style={{
          marginTop: 20, padding: '16px 20px',
          background: 'rgba(0,200,150,0.05)',
          border: '1px solid rgba(0,200,150,0.2)',
          borderRadius: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 16, height: 16,
              border: '2px solid rgba(0,200,150,0.3)',
              borderTop: '2px solid #00C896',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <span style={{ fontSize: 13, color: '#00C896', fontFamily: "'Courier New', monospace" }}>
              {statusText}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#4B5563', marginTop: 8, fontFamily: "'Courier New', monospace" }}>
            This takes 30–90 seconds for large PDFs...
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Success */}
      {status === 'done' && result && (
        <div style={{
          marginTop: 20, padding: '20px',
          background: 'rgba(0,200,150,0.05)',
          border: '1px solid rgba(0,200,150,0.3)',
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 12, color: '#00C896', marginBottom: 10, fontFamily: "'Courier New', monospace", letterSpacing: '0.1em' }}>
            ✓ PROCESSED SUCCESSFULLY
          </div>
          <div style={{ fontSize: 15, color: '#E8E6E0' }}>{result.filename}</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
            {result.chunks} chunks stored in Supabase pgvector
          </div>
          <div style={{ marginTop: 14 }}>
            <a href="/chat" style={{
              display: 'inline-block',
              padding: '9px 18px',
              background: '#00C896',
              color: '#0A0A0F',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Courier New', monospace",
            }}>
              Start Chatting →
            </a>
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div style={{
          marginTop: 20, padding: '16px 20px',
          background: 'rgba(239,68,68,0.05)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 8,
          fontSize: 13,
          color: '#EF4444',
          fontFamily: "'Courier New', monospace",
        }}>
          ✗ {error}
        </div>
      )}
    </div>
  );
}