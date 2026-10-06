"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Copy,
  CreditCard,
  Loader2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const EASYPaisa_NUMBER = "0371-6386114";

export default function UpgradePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [submittingTransaction, setSubmittingTransaction] =
    useState(false);

  const [copied, setCopied] = useState(false);
  const [created, setCreated] = useState(false);

  const [paymentId, setPaymentId] =
    useState<string | null>(null);

  const [transactionId, setTransactionId] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] = useState("");

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(
        EASYPaisa_NUMBER
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy number:",
        error
      );
    }
  };

  /*
   * Create payment
   */
  const handleCreatePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("nexora_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            provider: "easypaisa",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to create payment"
        );
      }

      setPaymentId(result.payment.id);
      setCreated(true);
    } catch (error) {
      console.error(
        "Payment creation error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Submit transaction ID
   */
  const handleSubmitTransaction = async () => {
    const trimmedTransactionId =
      transactionId.trim();

    if (!trimmedTransactionId) {
      setError(
        "Please enter your Easypaisa transaction ID."
      );
      return;
    }

    if (!paymentId) {
      setError(
        "Payment session was not created."
      );
      return;
    }

    try {
      setSubmittingTransaction(true);
      setError("");

      const token =
        localStorage.getItem("nexora_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/payment/submit-transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentId,
            transactionId:
              trimmedTransactionId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to submit transaction"
        );
      }

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Transaction submission error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit transaction"
      );
    } finally {
      setSubmittingTransaction(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070a0f] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/[0.05] blur-[130px]" />

        <div className="absolute bottom-[-200px] right-[-100px] h-[400px] w-[400px] rounded-full bg-violet-500/[0.04] blur-[130px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex h-20 items-center justify-between border-b border-white/[0.05] px-5 sm:px-8 lg:px-12">
        <Link
          href="/pricing"
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to pricing
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
      </header>

      <section className="relative z-10 px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Heading */}
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-violet-500/10">
              <CreditCard
                size={21}
                className="text-cyan-300"
              />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Upgrade to Pro
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              Pay Rs. 999 through Easypaisa and
              submit your transaction ID for verification.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-[1fr_1.15fr]">
            {/* Plan */}
            <div className="rounded-3xl border border-white/[0.07] bg-[#0d1117] p-6">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-600">
                Pro plan
              </p>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-semibold">
                  Rs. 999
                </span>

                <span className="pb-1 text-xs text-slate-600">
                  / month
                </span>
              </div>

              <div className="my-6 h-px bg-white/[0.05]" />

              <ul className="space-y-4">
                {[
                  "Unlimited AI conversations",
                  "Advanced AI assistance",
                  "Full chat history",
                  "Priority access",
                  "Future AI tools",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-400"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/10">
                      <Check
                        size={11}
                        className="text-cyan-300"
                      />
                    </span>

                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment */}
            <div className="rounded-3xl border border-cyan-400/10 bg-[#0d1117] p-6 shadow-[0_0_50px_rgba(34,211,238,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                  <Smartphone
                    size={18}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Easypaisa
                  </p>

                  <p className="text-xs text-slate-600">
                    Manual payment verification
                  </p>
                </div>
              </div>

              {/* Payment number */}
              <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                  Send exactly
                </p>

                <p className="mt-1 text-lg font-semibold text-white">
                  Rs. 999
                </p>

                <p className="mt-4 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                  Easypaisa number
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-sm text-white">
                    {EASYPaisa_NUMBER}
                  </span>

                  <button
                    type="button"
                    onClick={copyNumber}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.07] px-2.5 text-[10px] text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    <Copy size={12} />

                    {copied
                      ? "Copied"
                      : "Copy"}
                  </button>
                </div>
              </div>

              {/* Create payment */}
              {!created && (
                <>
                  <div className="mt-5 rounded-xl border border-amber-400/10 bg-amber-400/[0.03] p-3">
                    <p className="text-xs leading-5 text-slate-500">
                      Send exactly{" "}
                      <span className="font-semibold text-slate-300">
                        Rs. 999
                      </span>{" "}
                      through Easypaisa, then click the
                      button below.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreatePayment}
                    disabled={loading}
                    className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                        Creating payment...
                      </>
                    ) : (
                      <>
                        <CreditCard size={14} />
                        I've Sent the Payment
                      </>
                    )}
                  </button>
                </>
              )}

              {/* Transaction ID */}
              {created && !submitted && (
                <div className="mt-6">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-white">
                      Payment sent?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Enter the transaction ID from your
                      Easypaisa payment receipt.
                    </p>
                  </div>

                  <label
                    htmlFor="transactionId"
                    className="mb-2 block text-xs font-medium text-slate-400"
                  >
                    Transaction ID
                  </label>

                  <input
                    id="transactionId"
                    type="text"
                    value={transactionId}
                    onChange={(event) =>
                      setTransactionId(
                        event.target.value
                      )
                    }
                    placeholder="Enter transaction ID"
                    className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 text-sm text-white outline-none placeholder:text-slate-700 transition focus:border-cyan-400/30 focus:bg-white/[0.04]"
                  />

                  <button
                    type="button"
                    onClick={
                      handleSubmitTransaction
                    }
                    disabled={
                      submittingTransaction
                    }
                    className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submittingTransaction ? (
                      <>
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} />
                        Submit for Verification
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Submitted */}
              {submitted && (
                <div className="mt-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      size={18}
                      className="text-emerald-400"
                    />

                    <p className="text-sm font-semibold text-emerald-300">
                      Payment submitted
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Your transaction has been submitted
                    successfully. Pro access will be
                    activated after payment verification.
                  </p>

                  <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-slate-700">
                      Transaction ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-slate-400">
                      {transactionId}
                    </p>
                  </div>

                  <Link
                    href="/chat"
                    className="mt-4 flex h-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    Back to workspace
                  </Link>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-xl border border-red-400/10 bg-red-400/[0.04] px-3 py-2.5 text-xs text-red-300">
                  {error}
                </div>
              )}

              <p className="mt-4 text-center text-[10px] text-slate-700">
                Payment verification is required before
                Pro access is activated.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}