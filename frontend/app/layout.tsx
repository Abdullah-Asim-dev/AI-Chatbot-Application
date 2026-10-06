import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nexora AI — Intelligent AI Workspace",
    template: "%s | Nexora AI",
  },

  description:
    "Nexora AI is an intelligent AI workspace for conversations, research, writing, coding, analysis, and AI-powered workflows.",

  keywords: [
    "Nexora AI",
    "AI assistant",
    "AI chatbot",
    "AI workspace",
    "AI assistant online",
    "artificial intelligence",
    "AI productivity",
    "AI research",
    "AI coding assistant",
  ],

  applicationName: "Nexora AI",

  authors: [
    {
      name: "Nexora AI",
    },
  ],

  creator: "Nexora AI",

  robots: {
    index: true,
    follow: true,
  },

  viewport: {
    width: "device-width",
    initialScale: 1,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}