"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  ChevronDown,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
  X,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Conversation } from "@/lib/api/chat";
import type { AuthUser } from "@/lib/api/auth";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  mobileOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  user: AuthUser | null;
}

export default function ChatSidebar({
  conversations,
  activeConversationId,
  mobileOpen,
  onClose,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  user,
}: ChatSidebarProps) {
  const router = useRouter();

  const [accountOpen, setAccountOpen] = useState(false);

  const handleNewChat = () => {
    onNewChat();
    onClose();
  };

  const handleSelectConversation = (
    conversationId: string
  ) => {
    onSelectConversation(conversationId);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("nexora_token");
    localStorage.removeItem("nexora_user");

    router.replace("/login");
  };

  const userName = user?.name || "Nexora User";

  const userInitial = userName
    .trim()
    .charAt(0)
    .toUpperCase();

  const isPro = user?.plan === "pro";

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            aria-label="Close sidebar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col
          border-r border-white/[0.07] bg-[#090d13]
          transition-transform duration-300 ease-out
          lg:relative lg:z-auto lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-[68px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_25px_rgba(34,211,238,0.15)]">
              <Bot
                size={19}
                strokeWidth={1.8}
                className="text-white"
              />

              <div className="absolute inset-0 bg-white/10" />
            </div>

            <div>
              <div className="text-[14px] font-semibold tracking-tight text-white">
                Nexora AI
              </div>

              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                Workspace
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-3 pb-4">
          <button
            type="button"
            onClick={handleNewChat}
            className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-3 text-left transition-all duration-200 hover:border-cyan-400/20 hover:bg-white/[0.055]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300 transition group-hover:from-cyan-400/30 group-hover:to-blue-500/30">
              <Plus size={17} />
            </span>

            <span className="flex-1 text-[13px] font-medium text-slate-200">
              New chat
            </span>

            <span className="text-[10px] text-slate-600">
              Ctrl K
            </span>
          </button>
        </div>

        {/* Navigation */}
        <div className="px-3">
          <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            Workspace
          </div>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg bg-white/[0.045] px-3 py-2.5 text-left text-[13px] font-medium text-slate-200"
          >
            <MessageSquare
              size={16}
              className="text-cyan-400"
            />
            Chats
          </button>

          <button
            type="button"
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300"
          >
            <Search size={16} />
            Search
          </button>
        </div>

        {/* Conversation Header */}
        <div className="mt-7 flex items-center justify-between px-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            Recent chats
          </span>

          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-600 transition hover:bg-white/[0.05] hover:text-slate-300"
          >
            <MoreHorizontal size={15} />
          </button>
        </div>

        {/* Conversations */}
        <div className="mt-2 flex-1 overflow-y-auto px-3 pb-4">
          {conversations.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
                <MessageSquare
                  size={16}
                  className="text-slate-600"
                />
              </div>

              <p className="text-[12px] text-slate-600">
                No conversations yet
              </p>

              <p className="mt-1 text-[11px] text-slate-700">
                Start a new chat to begin
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {conversations.map((conversation) => {
                const isActive =
                  activeConversationId ===
                  conversation._id;

                return (
                  <div
                    key={conversation._id}
                    className={`
                      group relative flex items-center rounded-lg
                      transition-colors duration-150
                      ${
                        isActive
                          ? "bg-white/[0.07]"
                          : "hover:bg-white/[0.035]"
                      }
                    `}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectConversation(
                          conversation._id
                        )
                      }
                      className="min-w-0 flex-1 px-3 py-2.5 text-left"
                    >
                      <div
                        className={`
                          truncate text-[12.5px] font-medium
                          ${
                            isActive
                              ? "text-slate-100"
                              : "text-slate-400 group-hover:text-slate-200"
                          }
                        `}
                      >
                        {conversation.title ||
                          "New Chat"}
                      </div>
                    </button>

                    <button
                      type="button"
                      aria-label="Delete conversation"
                      onClick={() =>
                        onDeleteConversation(
                          conversation._id
                        )
                      }
                      className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Account Area */}
        <div className="relative border-t border-white/[0.06] p-3">
          {/* Account Menu */}
          <AnimatePresence>
            {accountOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 8,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.16,
                }}
                className="absolute bottom-[76px] left-3 right-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1117] p-1.5 shadow-2xl shadow-black/30"
              >
                <div className="border-b border-white/[0.06] px-3 py-3">
                  <p className="truncate text-xs font-medium text-white">
                    {userName}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-slate-600">
                    {user?.email || "Personal workspace"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen(false);
                    router.push("/profile");
                  }}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <User size={15} />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen(false);
                    router.push(
                      isPro
                        ? "/pricing"
                        : "/pricing"
                    );
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <CreditCard size={15} />
                  {isPro
                    ? "Manage plan"
                    : "Upgrade to Pro"}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-slate-400 transition hover:bg-red-500/[0.06] hover:text-red-300"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Account Button */}
          <button
            type="button"
            onClick={() =>
              setAccountOpen(
                (current) => !current
              )
            }
            className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-white/[0.04]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 text-[11px] font-semibold text-blue-200 ring-1 ring-white/[0.08]">
              {userInitial}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <div className="truncate text-[12px] font-medium text-slate-300">
                  {userName}
                </div>

                {isPro ? (
                  <span className="shrink-0 rounded-md bg-cyan-400/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-cyan-300">
                    Pro
                  </span>
                ) : (
                  <span className="shrink-0 rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-600">
                    Free
                  </span>
                )}
              </div>

              <div className="mt-0.5 text-[10px] text-slate-600">
                {isPro
                  ? "Pro workspace"
                  : `${user?.messageCount ?? 0}/15 messages`}
              </div>
            </div>

            <ChevronDown
              size={15}
              className={`text-slate-600 transition-transform ${
                accountOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}