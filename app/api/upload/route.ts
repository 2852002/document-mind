import { NextRequest, NextResponse } from 'next/server';
import { storeDocumentChunk } from '@/lib/supabase';
import { getEmbedding } from '@/lib/embeddings';
import { splitTextIntoChunks } from '@/lib/chunker';

const pdfParse = require('pdf-parse/lib/pdf-parse.js');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    // const buffer = Buffer.from(await file.arrayBuffer());
    // const pdf = await pdfParse(buffer);
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdf = await pdfParse(buffer, { max: 0 });

    if (!pdf.text?.trim()) {
      return NextResponse.json({ error: 'No text found in PDF' }, { status: 400 });
    }

    const chunks = splitTextIntoChunks(pdf.text, 1000, 200);
    console.log(`[upload] "${file.name}" → ${chunks.length} chunks`);

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await getEmbedding(chunks[i].content);
      await storeDocumentChunk(chunks[i].content, embedding, {
        filename: file.name,
        chunk_index: i,
        total_chunks: chunks.length,
      });
      console.log(`[upload] stored ${i + 1}/${chunks.length}`);
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      chunks: chunks.length,
      message: `Processed "${file.name}" → ${chunks.length} chunks stored`,
    });

  } catch (err: any) {
    console.error('[upload error]', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}