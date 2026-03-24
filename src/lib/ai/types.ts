export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface AiRequestBody {
  message: string;
  pageUrl?: string;
  history?: ChatMessage[];
}

export interface RetrievedDocChunk {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
}
