"use client";

import {
  ChevronDown,
  Menu,
  Sparkles,
} from "lucide-react";

interface ChatHeaderProps {
  onMenuClick: () => void;
}

export default function ChatHeader({
  onMenuClick,
}: ChatHeaderProps) {
  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/[0.06] px-4 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
        >
          <Menu size={19} />
        </button>

        {/* Model Selector */}
        <button
          type="button"
          className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/[0.04]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/15 via-blue-500/15 to-violet-500/15 ring-1 ring-white/[0.06]">
            <Sparkles
              size={14}
              className="text-cyan-300"
            />
          </div>

          <div className="hidden text-left sm:block">
            <div className="text-[12px] font-medium text-slate-200">
              Nexora AI
            </div>

            <div className="text-[10px] text-slate-600">
              Intelligent model
            </div>
          </div>

          <ChevronDown
            size={14}
            className="text-slate-600 transition group-hover:text-slate-400"
          />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </span>

          <span className="text-[10px] font-medium text-slate-500">
            AI Workspace
          </span>
        </div>
      </div>
    </header>
  );
}