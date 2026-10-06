"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  FileSearch,
  Lightbulb,
  PenLine,
  Sparkles,
} from "lucide-react";

interface WelcomeScreenProps {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  {
    icon: FileSearch,
    title: "Research",
    description: "Explore a topic and organize the key insights.",
    prompt:
      "Research this topic and give me the most important insights, explained clearly.",
  },
  {
    icon: PenLine,
    title: "Write",
    description: "Draft, improve, or structure your ideas.",
    prompt:
      "Help me write a professional piece of content with a clear structure and natural tone.",
  },
  {
    icon: Code2,
    title: "Build",
    description: "Solve coding problems and design better solutions.",
    prompt:
      "Help me solve a coding problem and explain the best implementation step by step.",
  },
  {
    icon: Lightbulb,
    title: "Think",
    description: "Break down difficult ideas into simple steps.",
    prompt:
      "Break down a difficult concept for me and explain it with practical examples.",
  },
];

export default function WelcomeScreen({
  onSuggestion,
}: WelcomeScreenProps) {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center px-4 py-12 sm:px-6">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-[22%] h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/[0.035] blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative flex max-w-2xl flex-col items-center text-center"
      >
        {/* Logo Mark */}
        <div className="relative mb-7">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-gradient-to-br from-cyan-400/[0.12] via-blue-500/[0.10] to-violet-500/[0.12] shadow-[0_0_45px_rgba(34,211,238,0.08)]">
            <Sparkles
              size={25}
              strokeWidth={1.5}
              className="text-cyan-300"
            />
          </div>

          <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
          What are you{" "}
          <span className="gradient-text">working on?</span>
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px]">
          Ask Nexora AI to research, write, build, analyze,
          or help you turn an idea into something real.
        </p>

        {/* Suggestions */}
        <div className="mt-9 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;

            return (
              <motion.button
                key={suggestion.title}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.08 * index,
                }}
                onClick={() => onSuggestion(suggestion.prompt)}
                className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] p-4 text-left transition-all duration-200 hover:border-cyan-400/15 hover:bg-white/[0.035]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] transition group-hover:border-cyan-400/15 group-hover:bg-cyan-400/[0.06]">
                  <Icon
                    size={17}
                    strokeWidth={1.7}
                    className="text-slate-500 transition group-hover:text-cyan-300"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-medium text-slate-200">
                      {suggestion.title}
                    </span>

                    <ArrowUpRight
                      size={14}
                      className="text-slate-700 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-400"
                    />
                  </div>

                  <p className="mt-1 text-[11px] leading-5 text-slate-600">
                    {suggestion.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Future Capabilities */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.12em] text-slate-700">
          <span>Conversations</span>
          <span className="h-1 w-1 rounded-full bg-slate-800" />
          <span>Research</span>
          <span className="h-1 w-1 rounded-full bg-slate-800" />
          <span>Code</span>
          <span className="h-1 w-1 rounded-full bg-slate-800" />
          <span>Files</span>
        </div>
      </motion.div>
    </div>
  );
}