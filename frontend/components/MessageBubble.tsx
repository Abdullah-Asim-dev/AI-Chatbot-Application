"use client";

import { useState } from "react";
import {
  Bot,
  Check,
  Copy,
  RotateCcw,
  UserRound,
} from "lucide-react";
import type { ChatMessage } from "@/lib/api/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  onRegenerate?: () => void;
}

export default function MessageBubble({
  message,
  onRegenerate,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // Clipboard may be unavailable in some browsers/contexts.
    }
  };

  if (isUser) {
    return (
      <div className="flex w-full justify-end">
        <div className="max-w-[85%] sm:max-w-[72%]">
          <div className="rounded-2xl rounded-br-md bg-[#172131] px-4 py-3 text-[14px] leading-6 text-slate-100 ring-1 ring-white/[0.05]">
            <p className="whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>

          <div className="mt-1.5 flex justify-end">
            <span className="flex items-center gap-1 text-[10px] text-slate-700">
              <UserRound size={10} />
              You
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group w-full">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* AI Avatar */}
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.10] via-blue-500/[0.08] to-violet-500/[0.10]">
          <Bot
            size={16}
            strokeWidth={1.7}
            className="text-cyan-300"
          />
        </div>

        {/* Response */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[12px] font-semibold text-slate-300">
              Nexora AI
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-700" />

            <span className="text-[10px] text-slate-600">
              AI response
            </span>
          </div>

          <div className="max-w-none text-[14px] leading-7 text-slate-300">
            {message.content.split("\n").map((line, index) => (
              <p
                key={`${message._id || "message"}-${index}`}
                className={line.trim() ? "min-h-[1.75rem]" : "h-3"}
              >
                {line || "\u00A0"}
              </p>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-3 flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? "Copied" : "Copy"}
              className="flex h-7 items-center gap-1.5 rounded-md px-2 text-[10px] text-slate-600 transition hover:bg-white/[0.05] hover:text-slate-300"
            >
              {copied ? (
                <Check size={13} />
              ) : (
                <Copy size={13} />
              )}

              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                title="Regenerate response"
                className="flex h-7 items-center gap-1.5 rounded-md px-2 text-[10px] text-slate-600 transition hover:bg-white/[0.05] hover:text-slate-300"
              >
                <RotateCcw size={13} />
                <span>Regenerate</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}