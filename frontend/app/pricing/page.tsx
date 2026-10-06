"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Sparkles,
  Zap,
} from "lucide-react";

const freeFeatures = [
  "15 AI messages",
  "AI conversations",
  "Conversation history",
  "Basic AI assistance",
];

const proFeatures = [
  "Unlimited AI conversations",
  "Advanced AI assistance",
  "Full conversation history",
  "Priority AI access",
  "Future AI tools",
  "Future file & research features",
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#070a0f] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[130px]" />

        <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-500/[0.045] blur-[130px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex h-20 items-center justify-between border-b border-white/[0.05] px-5 sm:px-8 lg:px-12">
        <Link
          href="/chat"
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to workspace
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500">
            <span className="text-xs font-bold text-white">
              N
            </span>
          </div>

          <span className="text-sm font-semibold">
            Nexora AI
          </span>
        </div>
      </header>

      {/* Content */}
      <section className="relative z-10 px-5 pb-20 pt-16 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-5xl">
          {/* Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/[0.04] px-3.5 py-1.5">
              <Sparkles
                size={12}
                className="text-cyan-300"
              />

              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-300/70">
                Upgrade Nexora
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Choose your{" "}
              <span className="gradient-text">
                AI workspace
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
              Start free with 15 AI messages or unlock
              the full Nexora AI experience with Pro.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-3xl border border-white/[0.07] bg-[#0d1117] p-7">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Free
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Explore Nexora AI
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025]">
                  <Zap
                    size={16}
                    className="text-slate-400"
                  />
                </div>
              </div>

              <div className="mt-7 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight">
                  Rs. 0
                </span>

                <span className="pb-1 text-xs text-slate-600">
                  forever
                </span>
              </div>

              <div className="my-7 h-px bg-white/[0.05]" />

              <ul className="space-y-4">
                {freeFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-slate-400"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                      <Check
                        size={11}
                        className="text-slate-500"
                      />
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/chat"
                className="mt-8 flex h-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                Continue with Free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-3xl border border-cyan-400/20 bg-[#0d1117] p-7 shadow-[0_0_60px_rgba(34,211,238,0.06)]">
              {/* Popular */}
              <div className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                Recommended
              </div>

              <div className="flex items-start justify-between pr-28">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Pro
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Unlock the full workspace
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-violet-500/10">
                  <Sparkles
                    size={16}
                    className="text-cyan-300"
                  />
                </div>
              </div>

              <div className="mt-7 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight">
                  Rs. 999
                </span>

                <span className="pb-1 text-xs text-slate-600">
                  / month
                </span>
              </div>

              <div className="my-7 h-px bg-white/[0.05]" />

              <ul className="space-y-4">
                {proFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10">
                      <Check
                        size={11}
                        className="text-cyan-300"
                      />
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/upgrade"
                className="mt-8 flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-xs font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.12)] transition hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(59,130,246,0.18)]"
              >
                <CreditCard size={14} />
                Upgrade to Pro
              </Link>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-8 text-center text-[11px] text-slate-700">
            Secure payment verification • Cancel anytime
          </p>
        </div>
      </section>
    </main>
  );
}