const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ai-chatbot-application-nam9.onrender.com";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;

  plan: "free" | "pro";
  messageCount: number;

  subscriptionStatus:
    | "inactive"
    | "active"
    | "expired";

  subscriptionStart?: string;
  subscriptionEnd?: string;

  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

export async function registerUser(
  data: RegisterData
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Registration failed"
    );
  }

  return result;
}

export async function loginUser(
  data: LoginData
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Login failed"
    );
  }

  return result;
}

// =========================
// GET CURRENT USER
// =========================
export async function getCurrentUser(): Promise<AuthResponse> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("nexora_token")
      : null;

  const response = await fetch(
    `${API_URL}/api/auth/me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch current user"
    );
  }

  return result;
}