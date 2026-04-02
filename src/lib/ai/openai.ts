import "server-only";

import OpenAI from "openai";
import { aiEnv } from "./env";

export const openai = new OpenAI({
  apiKey: aiEnv.OPENAI_API_KEY,
});

export const EMBEDDING_MODEL = "text-embedding-3-large";
// Pinned to 1536 dims — pgvector ivfflat/hnsw max is 2000;
// 1536 matches ada-002 and is still high quality via OpenAI's Matryoshka reduction.
export const EMBEDDING_DIMENSIONS = 1536;
export const CHAT_MODEL = "gpt-4.1-mini";
