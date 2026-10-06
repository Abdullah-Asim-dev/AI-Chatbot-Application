import Link from "next/link";
import {
  ArrowRight,
  Code2,
  FileSearch,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const capabilities = [
  {
    icon: MessageSquare,
    label: "Conversations",
  },
  {
    icon: FileSearch,
    label: "Research",
  },
  {
    icon: Code2,
    label: "Coding",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a0f] text-white">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/[0.045] blur-[120px]" />

        <div className="absolute bottom-[-220px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-500/[0.035] blur-[120px]" />

        <div className="absolute left-[-160px] top-[45%] h-[320px] w-[320px] rounded-full bg-blue-500/[0.025] blur-[110px]" />
      </div>

      {/* Subtle Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex h-[72px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_25px_rgba(34,211,238,0.12)] transition-transform duration-200 group-hover:scale-105">
            <span className="text-sm font-bold text-white">
              N
            </span>
          </div>

          <span className="text-[14px] font-semibold tracking-tight text-white">
            Nexora AI
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-[12px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white sm:px-4"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-[12px] font-medium text-slate-200 transition hover:border-cyan-400/20 hover:bg-white/[0.07] sm:px-4"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[calc(100vh-72px)] items-center justify-center px-5 pb-16 pt-10 sm:px-6 lg:pb-24">
        <div className="w-full max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3.5 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
              Intelligent AI Workspace
            </span>
          </div>

          {/* Logo */}
          <div className="mx-auto mb-7 flex h-[72px] w-[72px] items-center justify-center rounded-[22px] border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.10] via-blue-500/[0.08] to-violet-500/[0.10] shadow-[0_0_60px_rgba(34,211,238,0.08)]">
            <Sparkles
              size={30}
              strokeWidth={1.5}
              className="text-cyan-300"
            />
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-[68px] lg:leading-[1.05]">
            Think better.
            <br />
            <span className="gradient-text">
              Build with AI.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-500 sm:text-[15px]">
            Nexora AI brings conversations, research, coding,
            and intelligent workflows into one focused
            workspace.
          </p>

          {/* Actions */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[13px] font-semibold text-[#070a0f] transition-all duration-200 hover:bg-slate-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
            >
              Start with Nexora
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/login"
              className="flex h-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] px-6 text-[13px] font-medium text-slate-300 transition-all duration-200 hover:border-cyan-400/20 hover:bg-white/[0.05] hover:text-white"
            >
              Sign in
            </Link>
          </div>

          {/* Capabilities */}
          <div className="mx-auto mt-14 flex max-w-xl flex-wrap items-center justify-center gap-2.5">
            {capabilities.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.018] px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600"
                >
                  <Icon size={13} />
                  {item.label}
                </div>
              );
            })}
          </div>

          {/* Bottom Statement */}
          <p className="mt-8 text-[10px] text-slate-700">
            One workspace. Multiple ways to think, create,
            and build.
          </p>
        </div>
      </section>
    </main>
  );
}