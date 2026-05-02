import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function storeDocumentChunk(
  content: string,
  embedding: number[],
  metadata: object
) {
  const { data, error } = await supabase
    .from('documents')
    .insert({ content, embedding: JSON.stringify(embedding), metadata })
    .select();

  if (error) throw new Error(`Supabase insert error: ${error.message}`);
  return data;
}

export async function similaritySearch(
  queryEmbedding: number[],
  matchCount: number = 5
) {
  const { data: withEmbeddings, error } = await supabase
    .from('documents')
    .select('id, content, metadata, embedding');

  if (error) throw new Error(`Search error: ${error.message}`);
  if (!withEmbeddings || withEmbeddings.length === 0) return [];

  console.log('[similaritySearch] total docs in DB:', withEmbeddings.length);

  const scored = withEmbeddings.map((doc: any) => {
    // Parse embedding if it's a string
    let docVec: number[];
    if (typeof doc.embedding === 'string') {
      docVec = JSON.parse(doc.embedding);
    } else if (Array.isArray(doc.embedding)) {
      docVec = doc.embedding;
    } else {
      return { id: doc.id, content: doc.content, metadata: doc.metadata, similarity: 0 };
    }

    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < queryEmbedding.length; i++) {
      dot += queryEmbedding[i] * docVec[i];
      normA += queryEmbedding[i] * queryEmbedding[i];
      normB += docVec[i] * docVec[i];
    }
    const similarity = dot / (Math.sqrt(normA) * Math.sqrt(normB));
    return { id: doc.id, content: doc.content, metadata: doc.metadata, similarity };
  });

  scored.sort((a: any, b: any) => b.similarity - a.similarity);

  console.log('[similaritySearch] top 5 scores:', scored.slice(0, 5).map(s => ({
    similarity: s.similarity.toFixed(4),
    filename: s.metadata?.filename,
  })));

  const threshold = 0.3;
  const relevant = scored.filter(s => s.similarity > threshold);
  console.log('[similaritySearch] above threshold:', relevant.length);

  return relevant.slice(0, matchCount);
}

export async function getAllDocumentNames() {
  const { data, error } = await supabase
    .from('documents')
    .select('metadata')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Fetch error: ${error.message}`);

  const names = new Set<string>();
  data?.forEach((row: any) => {
    if (row.metadata?.filename) names.add(row.metadata.filename);
  });
  return Array.from(names);
}