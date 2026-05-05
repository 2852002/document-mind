
VERCEL APP LINK: 
`https://document-mind-livid.vercel.app/`

# 🧠 DocuMind — AI-Powered Document Q&A Engine

**Upload any PDF → Ask any question → Get grounded answers with sources cited**

## 🎯 About The Project

**DocuMind** is a full-stack Retrieval-Augmented Generation (RAG) application that lets users upload PDF documents and ask natural language questions about them.

The project demonstrates a complete RAG pipeline from scratch — document ingestion, vector embeddings, semantic search, and LLM-powered response generation — built entirely with **free-tier tools** (zero cloud cost).

**Why I built this:** To demonstrate end-to-end AI engineering skills across the full RAG stack — not just calling an OpenAI wrapper, but implementing chunking strategy, vector similarity search, prompt engineering, and a production-quality UI.

---

## 🏗️ RAG Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INDEXING PIPELINE                        │
│                   (happens on upload)                       │
│                                                             │
│  PDF File ──► pdf-parse ──► Text Extraction                 │
│                                  │                          │
│                                  ▼                          │
│                         chunker.ts splits                   │
│                      1000 chars / 200 overlap               │
│                                  │                          │
│                                  ▼                          │
│                       embeddings.ts converts                │
│                      each chunk → 384-dim vector            │
│                                  │                          │
│                                  ▼                          │
│                   Supabase stores { content, embedding }    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    QUERYING PIPELINE                        │
│                  (happens on each question)                 │
│                                                             │
│  User Question ──► embed question ──► 384-dim vector        │
│                                           │                 │
│                                           ▼                 │
│                          cosine similarity search           │
│                        over all stored embeddings           │
│                                           │                 │
│                                           ▼                 │
│                         Top 5 most relevant chunks          │
│                                           │                 │
│                                           ▼                 │
│              RAG Prompt: "Answer ONLY from this context"    │
│                                           │                 │
│                                           ▼                 │
│                    Groq LLaMA 3 (llama3-8b-8192)            │
│                                           │                 │
│                                           ▼                 │
│                      Answer + Sources returned to UI        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) | Server components, API routes in one framework |
| **Language** | TypeScript | Type safety across the full stack |
| **Styling** | Tailwind CSS | Utility-first, fast to build |
| **LLM** | Groq API (LLaMA 3 8B) | Fastest free inference — 10x faster than OpenAI free tier |
| **Vector DB** | Supabase + pgvector | Collocated with relational data, no extra service needed |
| **Embeddings** | Custom hash-based (384-dim) | Zero cost, no API key — swappable with Cohere/OpenAI |
| **PDF Parsing** | pdf-parse | Lightweight, runs server-side |
| **Deployment** | Vercel | Git push → live in 2 minutes |


## 📁 Folder Structure

```
documind/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, metadata)
│   ├── globals.css               # Global styles + animations
│   ├── page.tsx                  # Home page with pipeline overview
│   │
│   ├── upload/
│   │   └── page.tsx              # PDF upload UI with live progress steps
│   │
│   ├── chat/
│   │   └── page.tsx              # Chat interface with sources panel
│   │
│   └── api/
│       ├── upload/
│       │   └── route.ts          # POST — PDF → chunks → embed → store
│       ├── query/
│       │   └── route.ts          # POST — question → retrieve → LLM → answer
│       └── documents/
│           └── route.ts          # GET list / DELETE document
│
├── lib/
│   ├── supabase.ts               # Supabase client (anon + service role)
│   ├── embeddings.ts             # Vector generation + cosine similarity
│   ├── chunker.ts                # Text splitter (size + overlap strategy)
│   └── groq.ts                   # Groq client + RAG prompt builder
│
├── types/
│   └── index.ts                  # Shared TypeScript interfaces
│
├── supabase-setup.sql            # One-time DB setup — run in SQL Editor
├── .env.local                    # API keys (never commit!)
├── .env.example                  # Safe template to share
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

