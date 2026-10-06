const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ChatMessage {
  _id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Conversation {
  _id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatUsage {
  plan: "free" | "pro";
  used: number;
  limit: number | null;
  remaining: number | null;
}

export interface ChatResponse {
  success: boolean;
  conversationId: string;
  message: string;
  usage?: ChatUsage;
}

export interface ConversationsResponse {
  success: boolean;
  conversations: Conversation[];
}

export interface ConversationResponse {
  success: boolean;
  conversation: Conversation;
}

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(
    message: string,
    code?: string,
    status?: number
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("nexora_token");
}

async function request(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(
      result.message || "Something went wrong",
      result.code,
      response.status
    );
  }

  return result;
}

export async function getConversations(): Promise<ConversationsResponse> {
  return request("/api/chat");
}

export async function getConversation(
  conversationId: string
): Promise<ConversationResponse> {
  return request(`/api/chat/${conversationId}`);
}

export async function sendChatMessage(
  messages: ChatMessage[],
  conversationId?: string
): Promise<ChatResponse> {
  return request("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      conversationId,
      messages,
    }),
  });
}

export async function deleteConversation(
  conversationId: string
): Promise<{ success: boolean; message: string }> {
  return request(`/api/chat/${conversationId}`, {
    method: "DELETE",
  });
}