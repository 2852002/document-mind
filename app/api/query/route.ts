import { NextRequest, NextResponse } from 'next/server';
import { similaritySearch } from '@/lib/supabase';
import { getEmbedding } from '@/lib/embeddings';
import { ChatGroq } from '@langchain/groq';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export async function POST(request: NextRequest) {
  try {
    const { question, chatHistory = [] } = await request.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: 'No question provided' }, { status: 400 });
    }

    // Embed the question
    const queryEmbedding = await getEmbedding(question);

    // Find relevant chunks
    const chunks = await similaritySearch(queryEmbedding, 5);

    if (!chunks || chunks.length === 0) {
      return NextResponse.json({
        answer: "I couldn't find relevant information. Please upload a PDF document first, then ask your question.",
        sources: [],
      });
    }

    // Build context
    const context = chunks
      .map((c: any, i: number) =>
        `[Source ${i + 1} — ${c.metadata?.filename ?? 'Document'}]\n${c.content}`
      )
      .join('\n\n---\n\n');

    // Build conversation history
    const history = chatHistory
      .slice(-6)
      .map((m: any) => `${m.role === 'user' ? 'Human' : 'Assistant'}: ${m.content}`)
      .join('\n');

    // Call Groq
    const llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      maxTokens: 1024,
    });

    const system = `You are DocuMind, an AI that answers questions ONLY from the provided document context.

Rules:
1. Use ONLY the context below to answer.
2. If context lacks the answer, say: "I don't have enough information in the documents to answer this."
3. Cite which Source number your information comes from.
4. Never fabricate information.

${history ? `Previous conversation:\n${history}\n` : ''}
DOCUMENT CONTEXT:
${context}`;

    const response = await llm.invoke([
      new SystemMessage(system),
      new HumanMessage(question),
    ]);

    return NextResponse.json({
      answer: response.content,
      sources: chunks,
    });
  } catch (err: any) {
    console.error('[query error]', err);
    return NextResponse.json({ error: err.message || 'Query failed' }, { status: 500 });
  }
}