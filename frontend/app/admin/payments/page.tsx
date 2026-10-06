"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  CreditCard,
  Loader2,
  RefreshCw,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

interface PaymentUser {
  _id: string;
  name: string;
  email: string;
  plan: string;
}

interface Payment {
  _id: string;
  amount: number;
  receivedAmount: number;
  currency: string;
  provider: string;
  transactionId: string | null;
  status: string;
  createdAt: string;
  user: PaymentUser;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [amounts, setAmounts] =
    useState<Record<string, string>>({});

  const [verifying, setVerifying] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const getAdminSecret = () => {
    return localStorage.getItem(
      "nexora_admin_secret"
    );
  };

  const loadPayments = async () => {
    try {
      setError("");

      const token =
        localStorage.getItem(
          "nexora_token"
        );

      const adminSecret =
        getAdminSecret();

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      if (!adminSecret) {
        throw new Error(
          "Admin secret not found."
        );
      }

      const response = await fetch(
        `${API_URL}/api/payment/admin/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-admin-payment-secret":
              adminSecret,
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to load payments"
        );
      }

      setPayments(
        result.payments || []
      );
    } catch (error) {
      console.error(
        "Admin payment error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load payments"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
  };

  const handleVerify = async (
    payment: Payment
  ) => {
    const receivedAmount =
      Number(amounts[payment._id]);

    if (
      !Number.isFinite(receivedAmount)
    ) {
      setError(
        "Enter the actual received amount."
      );
      return;
    }

    if (receivedAmount < 999) {
      setError(
        "Payment rejected: received amount must be at least Rs. 999."
      );
      return;
    }

    try {
      setVerifying(payment._id);
      setError("");

      const token =
        localStorage.getItem(
          "nexora_token"
        );

      const adminSecret =
        getAdminSecret();

      const response = await fetch(
        `${API_URL}/api/payment/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
            "x-admin-payment-secret":
              adminSecret || "",
          },
          body: JSON.stringify({
            paymentId: payment._id,
            receivedAmount,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Payment verification failed"
        );
      }

      setPayments(
        (current) =>
          current.filter(
            (item) =>
              item._id !== payment._id
          )
      );

      setAmounts(
        (current) => {
          const next = {
            ...current,
          };

          delete next[payment._id];

          return next;
        }
      );
    } catch (error) {
      console.error(
        "Verify payment error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Payment verification failed"
      );
    } finally {
      setVerifying(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#070a0f] text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={18}
                className="text-cyan-300"
              />

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">
                Admin
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Payment Verification
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Review customer payments and
              activate Nexora Pro.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-xs font-medium text-slate-300 transition hover:bg-white/[0.06]"
          >
            <RefreshCw
              size={14}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2
                size={18}
                className="animate-spin"
              />

              Loading payments...
            </div>
          </div>
        ) : payments.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/[0.07] bg-[#0d1117] p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">
              <CheckCircle
                size={22}
                className="text-emerald-400"
              />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              No pending payments
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              All submitted payments have
              been processed.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="rounded-3xl border border-white/[0.07] bg-[#0d1117] p-6"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Customer */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-violet-500/10">
                        <User
                          size={17}
                          className="text-cyan-300"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {payment.user?.name ||
                            "Unknown User"}
                        </p>

                        <p className="truncate text-xs text-slate-600">
                          {payment.user?.email ||
                            "No email"}
                        </p>
                      </div>
                    </div>

                    {/* Payment details */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-700">
                          Expected
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          Rs.{" "}
                          {payment.amount}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-700">
                          Provider
                        </p>

                        <p className="mt-1 text-sm font-medium capitalize text-slate-300">
                          {payment.provider}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-700">
                          Transaction / Reference ID
                        </p>

                        <p className="mt-1 break-all font-mono text-xs text-slate-400">
                          {payment.transactionId ||
                            "Not submitted"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-700">
                          Submitted
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(
                            payment.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Verification */}
                  <div className="w-full lg:max-w-xs">
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <p className="text-xs font-medium text-slate-400">
                        Actual received amount
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-600">
                        Enter the amount you actually
                        received in Easypaisa.
                      </p>

                      <div className="relative mt-4">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">
                          Rs.
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={
                            amounts[
                              payment._id
                            ] || ""
                          }
                          onChange={(event) =>
                            setAmounts(
                              (current) => ({
                                ...current,
                                [payment._id]:
                                  event.target
                                    .value,
                              })
                            )
                          }
                          placeholder="999"
                          className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-600">
                        <CreditCard
                          size={13}
                        />

                        Minimum:
                        <span className="font-semibold text-slate-400">
                          Rs. 999
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleVerify(payment)
                        }
                        disabled={
                          verifying ===
                          payment._id
                        }
                        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {verifying ===
                        payment._id ? (
                          <>
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />

                            Verifying...
                          </>
                        ) : (
                          <>
                            <ShieldCheck
                              size={14}
                            />

                            Verify & Activate Pro
                          </>
                        )}
                      </button>

                      <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-700">
                        <XCircle
                          size={12}
                        />

                        Payments below Rs. 999
                        cannot activate Pro.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}