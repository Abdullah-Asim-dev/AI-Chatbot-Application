"use client";

import {
  Paperclip,
  Send,
  Sparkles,
  X,
  FileText,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function ChatComposer({
  value,
  onChange,
  onSend,
  loading = false,
  disabled = false,
}: ChatComposerProps) {
  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const canSend =
    (value.trim().length > 0 || selectedFile !== null) &&
    !loading &&
    !disabled;

  const resizeTextarea = () => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    const nextHeight = Math.min(
      textarea.scrollHeight,
      180
    );

    textarea.style.height = `${nextHeight}px`;
  };

  useEffect(() => {
    resizeTextarea();
  }, [value]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (canSend) {
        onSend();
      }
    }
  };

  const handleSend = () => {
    if (!canSend) {
      return;
    }

    /*
     * File upload backend integration
     * will be connected separately.
     *
     * For now, prevent sending a file
     * without a text message.
     */
    if (selectedFile && !value.trim()) {
      return;
    }

    onSend();

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height =
          "auto";
      }
    });
  };

  const handleAttachClick = () => {
    if (disabled || loading) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);

    /*
     * Allow selecting the same file again
     * after removing it.
     */
    event.target.value = "";
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="shrink-0 px-3 pb-3 pt-2 sm:px-6 sm:pb-5">
      <div className="mx-auto w-full max-w-3xl">

        {/* Composer */}
        <div
          className="
            relative overflow-hidden rounded-2xl
            border border-white/[0.08]
            bg-[#0d1219]/95
            shadow-[0_12px_45px_rgba(0,0,0,0.28)]
            backdrop-blur-xl
            transition-all duration-200
            focus-within:border-cyan-400/20
            focus-within:shadow-[0_12px_50px_rgba(0,0,0,0.35),0_0_30px_rgba(34,211,238,0.04)]
          "
        >
          {/* Subtle top accent */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.txt,.doc,.docx,.csv,.json,.js,.jsx,.ts,.tsx,.html,.css,.py,.md"
          />

          {/* Selected File */}
          {selectedFile && (
            <div className="px-4 pt-3 sm:px-5">
              <div className="flex max-w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/[0.08]">
                  <FileText
                    size={15}
                    className="text-cyan-300"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-300">
                    {selectedFile.name}
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-600">
                    {(
                      selectedFile.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={
                    disabled || loading
                  }
                  aria-label="Remove file"
                  className="
                    flex h-7 w-7 shrink-0
                    items-center justify-center
                    rounded-lg
                    text-slate-600
                    transition
                    hover:bg-white/[0.05]
                    hover:text-slate-300
                    disabled:pointer-events-none
                  "
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) =>
              onChange(event.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={
              disabled || loading
            }
            rows={1}
            placeholder={
              loading
                ? "Nexora is thinking..."
                : "Message Nexora AI..."
            }
            className="
              block max-h-[180px] min-h-[54px] w-full
              resize-none overflow-y-auto
              bg-transparent
              px-4 pb-2 pt-4
              text-[14px] leading-6
              text-slate-200
              outline-none
              placeholder:text-slate-600
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:px-5
            "
          />

          {/* Bottom Controls */}
          <div className="flex items-center justify-between px-3 pb-3 sm:px-4">

            {/* Left Controls */}
            <div className="flex items-center gap-1">

              {/* Attach */}
              <button
                type="button"
                onClick={
                  handleAttachClick
                }
                disabled={
                  disabled || loading
                }
                aria-label="Attach file"
                className="
                  flex h-8 w-8 items-center
                  justify-center rounded-lg
                  text-slate-600
                  transition
                  hover:bg-white/[0.05]
                  hover:text-slate-300
                  disabled:pointer-events-none
                  disabled:opacity-40
                "
              >
                <Paperclip size={16} />
              </button>

              {/* AI Tools */}
              <button
                type="button"
                disabled={
                  disabled || loading
                }
                aria-label="AI capabilities"
                className="
                  hidden h-8 items-center gap-1.5
                  rounded-lg px-2
                  text-[10px] font-medium
                  text-slate-600
                  transition
                  hover:bg-white/[0.05]
                  hover:text-slate-300
                  sm:flex
                "
              >
                <Sparkles size={13} />
                AI Tools
              </button>
            </div>

            {/* Send */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send message"
              className={`
                flex h-8 w-8 items-center
                justify-center rounded-lg
                transition-all duration-200
                ${
                  canSend
                    ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(34,211,238,0.22)]"
                    : "bg-white/[0.05] text-slate-700"
                }
              `}
            >
              {loading ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-600 border-t-slate-300" />
              ) : (
                <Send size={15} />
              )}
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-2 text-center text-[9px] text-slate-700">
          Nexora AI can make mistakes. Verify important
          information.
        </p>
      </div>
    </div>
  );
}