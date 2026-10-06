"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import WelcomeScreen from "@/components/WelcomeScreen";
import MessageList from "@/components/MessageList";
import ChatComposer from "@/components/ChatComposer";

import {
  ApiError,
  deleteConversation,
  getConversation,
  getConversations,
  sendChatMessage,
  type ChatMessage,
  type Conversation,
} from "@/lib/api/chat";

import {
  getCurrentUser,
  type AuthUser,
} from "@/lib/api/auth";

const FREE_MESSAGE_LIMIT = 15;

export default function ChatPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [
    activeConversationId,
    setActiveConversationId,
  ] = useState<string | null>(null);

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] =
    useState(true);

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  const [limitReached, setLimitReached] =
    useState(false);

  /*
   * Redirect user to login
   */
  const handleAuthenticationFailure = useCallback(() => {
    localStorage.removeItem("nexora_token");
    localStorage.removeItem("nexora_user");

    router.replace("/login");
  }, [router]);

  /*
   * Load current authenticated user
   */
  const loadCurrentUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();

      if (!response.user) {
        throw new Error("User information not found");
      }

      const currentUser = response.user;

      setUser(currentUser);

      /*
       * Automatically lock the chat if
       * Free user has already used all messages.
       *
       * Pro users are never locked here.
       */
      if (
        currentUser.plan === "free" &&
        currentUser.messageCount >=
          FREE_MESSAGE_LIMIT
      ) {
        setLimitReached(true);
      } else {
        setLimitReached(false);
      }

      /*
       * Keep localStorage user data updated
       */
      localStorage.setItem(
        "nexora_user",
        JSON.stringify(currentUser)
      );

      return currentUser;
    } catch (error) {
      console.error(
        "Failed to load current user:",
        error
      );

      const message =
        error instanceof Error
          ? error.message.toLowerCase()
          : "";

      if (
        message.includes("authentication") ||
        message.includes("token") ||
        message.includes("expired") ||
        message.includes("unauthorized")
      ) {
        handleAuthenticationFailure();
      }

      throw error;
    }
  }, [handleAuthenticationFailure]);

  /*
   * Load conversation history
   */
  const loadConversations = useCallback(async () => {
    try {
      const response =
        await getConversations();

      setConversations(
        response.conversations
      );
    } catch (error) {
      console.error(
        "Failed to load conversations:",
        error
      );

      const message =
        error instanceof Error
          ? error.message.toLowerCase()
          : "";

      if (
        message.includes("authentication") ||
        message.includes("token") ||
        message.includes("expired") ||
        message.includes("unauthorized")
      ) {
        handleAuthenticationFailure();
      }
    }
  }, [handleAuthenticationFailure]);

  /*
   * Authentication + initial data
   */
  useEffect(() => {
    const token =
      localStorage.getItem("nexora_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const initialize = async () => {
      try {
        await Promise.all([
          loadCurrentUser(),
          loadConversations(),
        ]);
      } catch (error) {
        console.error(
          "Nexora initialization error:",
          error
        );
      } finally {
        setInitialLoading(false);
      }
    };

    initialize();
  }, [
    router,
    loadCurrentUser,
    loadConversations,
  ]);

  /*
   * Start a new chat
   */
  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setInput("");
    setMobileSidebarOpen(false);
  };

  /*
   * Open existing conversation
   */
  const handleSelectConversation = async (
    conversationId: string
  ) => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await getConversation(
          conversationId
        );

      setActiveConversationId(
        conversationId
      );

      setMessages(
        response.conversation.messages
      );

      setInput("");
    } catch (error) {
      console.error(
        "Failed to load conversation:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Send message
   */
  const handleSend = async () => {
    const content = input.trim();

    /*
     * Don't send if:
     * - empty
     * - already loading
     * - Free limit reached
     */
    if (
      !content ||
      loading ||
      limitReached
    ) {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response =
        await sendChatMessage(
          updatedMessages,
          activeConversationId ||
            undefined
        );

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.message,
      };

      setMessages(
        (currentMessages) => [
          ...currentMessages,
          assistantMessage,
        ]
      );

      setActiveConversationId(
        response.conversationId
      );

      /*
       * Refresh conversations
       */
      await loadConversations();

      /*
       * Refresh user usage/plan
       *
       * This updates:
       * - messageCount
       * - plan
       * - subscription status
       */
      await loadCurrentUser();
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );

      /*
       * Free plan limit reached
       */
      if (
        error instanceof ApiError &&
        error.code ===
          "FREE_LIMIT_REACHED"
      ) {
        setLimitReached(true);

        /*
         * Remove the user message because
         * the backend did not process it.
         */
        setMessages(
          (currentMessages) =>
            currentMessages.slice(0, -1)
        );

        return;
      }

      /*
       * Authentication failure
       */
      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        handleAuthenticationFailure();
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while generating the response.";

      setMessages(
        (currentMessages) => [
          ...currentMessages,
          {
            role: "assistant",
            content: `I couldn't process that request.\n\n${errorMessage}`,
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Suggestion from welcome screen
   */
  const handleSuggestion = (
    text: string
  ) => {
    if (limitReached) {
      return;
    }

    setInput(text);
  };

  /*
   * Delete conversation
   */
  const handleDeleteConversation = async (
    conversationId: string
  ) => {
    try {
      await deleteConversation(
        conversationId
      );

      setConversations(
        (current) =>
          current.filter(
            (conversation) =>
              conversation._id !==
              conversationId
          )
      );

      if (
        activeConversationId ===
        conversationId
      ) {
        setActiveConversationId(null);
        setMessages([]);
        setInput("");
      }
    } catch (error) {
      console.error(
        "Failed to delete conversation:",
        error
      );
    }
  };

  /*
   * Loading screen
   */
  if (initialLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070a0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
            <div className="h-4 w-4 animate-pulse rounded-full bg-white/90" />
          </div>

          <p className="text-[11px] tracking-wide text-slate-600">
            Loading Nexora AI...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen overflow-hidden bg-[#070a0f] text-slate-100">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={
          activeConversationId
        }
        mobileOpen={mobileSidebarOpen}
        onClose={() =>
          setMobileSidebarOpen(false)
        }
        onNewChat={handleNewChat}
        onSelectConversation={
          handleSelectConversation
        }
        onDeleteConversation={
          handleDeleteConversation
        }
        user={user}
      />

      {/* Main Workspace */}
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <ChatHeader
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        {/* Conversation Area */}
        <div className="relative flex min-h-0 flex-1 flex-col">
          {messages.length === 0 ? (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <WelcomeScreen
                onSuggestion={
                  handleSuggestion
                }
              />
            </div>
          ) : (
            <MessageList
              messages={messages}
              loading={loading}
            />
          )}

          {/* Free Limit Upgrade Banner */}
          {limitReached && (
            <div className="mx-auto mb-3 w-full max-w-3xl px-4">
              <div className="flex flex-col gap-4 rounded-2xl border border-cyan-400/10 bg-[#0d1117] p-4 shadow-[0_0_30px_rgba(34,211,238,0.04)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    You've reached your free limit
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    You've used all 15 free AI
                    messages. Upgrade to Pro
                    to continue chatting with
                    Nexora AI.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/pricing"
                    )
                  }
                  className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(59,130,246,0.18)]"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          )}

          {/* Composer */}
          <ChatComposer
            value={input}
            onChange={setInput}
            onSend={handleSend}
            loading={
              loading || limitReached
            }
          />
        </div>
      </section>
    </main>
  );
}