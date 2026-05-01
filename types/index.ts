export interface DocumentChunk {
  id: number;
  content: string;
  metadata: {
    filename: string;
    chunk_index: number;
    total_chunks: number;
  };
  similarity?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: DocumentChunk[];
  timestamp: Date;
}

export interface UploadResponse {
  success: boolean;
  filename: string;
  chunks: number;
  message: string;
}