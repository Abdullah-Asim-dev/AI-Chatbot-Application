"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Crown,
  LogOut,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";

import {
  getCurrentUser,
  type AuthUser,
} from "@/lib/api/auth";

const FREE_MESSAGE_LIMIT = 15;

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token =
        localStorage.getItem("nexora_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response =
          await getCurrentUser();

        if (!response.user) {
          router.replace("/login");
          return;
        }

        setUser(response.user);

        localStorage.setItem(
          "nexora_user",
          JSON.stringify(response.user)
        );
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );

        localStorage.removeItem(
          "nexora_token"
        );

        localStorage.removeItem(
          "nexora_user"
        );

        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("nexora_token");
    localStorage.removeItem("nexora_user");

    router.replace("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070a0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500">
            <div className="h-4 w-4 animate-pulse rounded-full bg-white" />
          </div>

          <p className="text-[11px] text-slate-600">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const isPro = user.plan === "pro";

  const initial = user.name
    .trim()
    .charAt(0)
    .toUpperCase();

  const usedMessages = user.messageCount || 0;

  const remainingMessages = Math.max(
    FREE_MESSAGE_LIMIT - usedMessages,
    0
  );

  const subscriptionEnd =
    user.subscriptionEnd
      ? new Date(user.subscriptionEnd)
      : null;

  const formattedSubscriptionEnd =
    subscriptionEnd
      ? subscriptionEnd.toLocaleDateString(
          "en-PK",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      : null;

  return (
    <main className="min-h-screen bg-[#070a0f] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/[0.045] blur-[140px]" />

        <div className="absolute bottom-[-200px] right-[-100px] h-[400px] w-[400px] rounded-full bg-violet-500/[0.035] blur-[130px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.05]">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/chat"
            className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to workspace
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500">
              <span className="text-xs font-bold">
                N
              </span>
            </div>

            <span className="text-sm font-semibold">
              Nexora AI
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="relative z-10 px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-4xl">
          {/* Heading */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your profile
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Manage your Nexora AI account and
              subscription.
            </p>
          </div>

          {/* Profile Card */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0d1117]">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-violet-500/20 text-2xl font-semibold text-cyan-200 ring-1 ring-white/[0.08]">
                  {initial}
                </div>

                {/* User */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-white">
                      {user.name}
                    </h2>

                    {isPro ? (
                      <span className="flex items-center gap-1.5 rounded-lg bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
                        <Crown size={11} />
                        Pro
                      </span>
                    ) : (
                      <span className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Free
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={14} />
                    <span className="truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="border-t border-white/[0.06]">
              <div className="grid sm:grid-cols-2">
                <div className="border-b border-white/[0.06] p-6 sm:border-r">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <User size={14} />
                    Account
                  </div>

                  <p className="mt-2 text-sm font-medium text-slate-300">
                    {user.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-700">
                    Personal workspace
                  </p>
                </div>

                <div className="border-b border-white/[0.06] p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <CreditCard size={14} />
                    Current plan
                  </div>

                  <p className="mt-2 text-sm font-medium text-slate-300">
                    {isPro
                      ? "Nexora Pro"
                      : "Nexora Free"}
                  </p>

                  <p className="mt-1 text-xs text-slate-700">
                    {isPro
                      ? "Unlimited AI conversations"
                      : "15 lifetime AI messages"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage / Subscription */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* Usage */}
            <div className="rounded-3xl border border-white/[0.07] bg-[#0d1117] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    AI usage
                  </p>

                  <p className="mt-1 text-lg font-semibold text-white">
                    {isPro
                      ? "Unlimited"
                      : `${usedMessages} / ${FREE_MESSAGE_LIMIT}`}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                  <MessageSquare
                    size={17}
                    className="text-cyan-300"
                  />
                </div>
              </div>

              {!isPro && (
                <>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all"
                      style={{
                        width: `${Math.min(
                          (usedMessages /
                            FREE_MESSAGE_LIMIT) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-600">
                    {remainingMessages} free{" "}
                    {remainingMessages === 1
                      ? "message"
                      : "messages"}{" "}
                    remaining
                  </p>
                </>
              )}
            </div>

            {/* Subscription */}
            <div className="rounded-3xl border border-white/[0.07] bg-[#0d1117] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Subscription
                  </p>

                  <p className="mt-1 text-lg font-semibold text-white">
                    {isPro
                      ? "Active"
                      : "Free plan"}
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isPro
                      ? "bg-cyan-400/10"
                      : "bg-white/[0.04]"
                  }`}
                >
                  {isPro ? (
                    <Check
                      size={17}
                      className="text-cyan-300"
                    />
                  ) : (
                    <CreditCard
                      size={17}
                      className="text-slate-600"
                    />
                  )}
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-600">
                {isPro &&
                formattedSubscriptionEnd
                  ? `Renews until ${formattedSubscriptionEnd}`
                  : "Upgrade to unlock unlimited AI conversations."}
              </p>
            </div>
          </div>

          {/* Plan Action */}
          <div className="mt-5 rounded-3xl border border-cyan-400/10 bg-[#0d1117] p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {isPro
                    ? "You're on Nexora Pro"
                    : "Get more with Nexora Pro"}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {isPro
                    ? "Enjoy unlimited AI conversations and your active Pro subscription."
                    : "Upgrade for unlimited AI conversations and advanced AI features."}
                </p>
              </div>

              {!isPro && (
                <Link
                  href="/pricing"
                  className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 text-xs font-semibold text-white transition hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(59,130,246,0.18)]"
                >
                  <Crown size={14} />
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/10 bg-red-400/[0.025] py-3 text-xs font-medium text-red-300 transition hover:bg-red-400/[0.06]"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}