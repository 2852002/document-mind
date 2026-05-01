export interface Chunk {
  content: string;
  index: number;
}

export function splitTextIntoChunks(
  text: string,
  chunkSize = 1000,
  overlap = 200
): Chunk[] {
  const chunks: Chunk[] = [];
  const clean = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  if (clean.length <= chunkSize) {
    return [{ content: clean, index: 0 }];
  }

  let start = 0;
  let index = 0;

  while (start < clean.length) {
    let end = Math.min(start + chunkSize, clean.length);

    if (end < clean.length) {
      const slice = clean.slice(start, end);
      const lastBreak = Math.max(
        slice.lastIndexOf('. '),
        slice.lastIndexOf('.\n'),
        slice.lastIndexOf('! '),
        slice.lastIndexOf('? ')
      );
      if (lastBreak > chunkSize * 0.5) end = start + lastBreak + 1;
    }

    const chunk = clean.slice(start, end).trim();
    if (chunk.length > 0) chunks.push({ content: chunk, index });

    if (end >= clean.length) break;
    start = end - overlap;
    index++;
  }

  return chunks;
}