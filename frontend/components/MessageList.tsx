"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/api/chat";
import MessageBubble from "@/components/MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  loading?: boolean;
}

export default function MessageList({
  messages,
  loading = false,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="space-y-8">
          {messages.map((message, index) => (
            <MessageBubble
              key={
                message._id ||
                `${message.role}-${index}-${message.content.slice(
                  0,
                  20
                )}`
              }
              message={message}
            />
          ))}

          {/* AI Loading State */}
          {loading && (
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.10] via-blue-500/[0.08] to-violet-500/[0.10]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
              </div>

              <div className="pt-1">
                <div className="mb-2 text-[12px] font-semibold text-slate-300">
                  Nexora AI
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-600 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-600 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-600" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}