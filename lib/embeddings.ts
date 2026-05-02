export async function getEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  const response = await fetch(
    'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        options: { wait_for_model: true },
      }),
    }
  );

  console.log('[embeddings] status:', response.status);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HuggingFace embedding error: ${err}`);
  }

  const data = await response.json();
  console.log('[embeddings] data preview:', JSON.stringify(data).slice(0, 100));

  if (Array.isArray(data) && Array.isArray(data[0]) && Array.isArray(data[0][0])) {
    return data[0][0] as number[];
  }
  if (Array.isArray(data) && Array.isArray(data[0])) {
    return data[0] as number[];
  }
  if (Array.isArray(data) && typeof data[0] === 'number') {
    return data as number[];
  }

  throw new Error(`Unexpected format: ${JSON.stringify(data).slice(0, 200)}`);
}