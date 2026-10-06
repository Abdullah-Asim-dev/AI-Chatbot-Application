const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: String,
      enum: ["pro"],
      default: "pro",
    },

    amount: {
      type: Number,
      required: true,
      default: 999,
    },

    receivedAmount: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "PKR",
    },

    provider: {
      type: String,
      enum: ["easypaisa", "payoneer"],
      required: true,
    },

    transactionId: {
      type: String,
      default: null,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "cancelled",
      ],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

module.exports = Payment;