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
    .insert({ content, embedding, metadata })
    .select();

  if (error) throw new Error(`Supabase insert error: ${error.message}`);
  return data;
}

export async function similaritySearch(
  queryEmbedding: number[],
  matchCount: number = 5
) {
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_count: matchCount,
  });

  if (error) throw new Error(`Similarity search error: ${error.message}`);
  return data;
}

export async function getAllDocumentNames() {
  const { data, error } = await supabase
    .from('documents')
    .select('metadata')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Fetch error: ${error.message}`);

  // Return unique filenames
  const names = new Set<string>();
  data?.forEach((row: any) => {
    if (row.metadata?.filename) names.add(row.metadata.filename);
  });
  return Array.from(names);
}