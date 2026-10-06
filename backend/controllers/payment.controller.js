const Payment = require("../models/Payment");
const User = require("../models/User");

const PRO_PRICE = 999;
const PRO_DURATION_DAYS = 30;

// =========================
// CREATE PAYMENT
// =========================
const createPayment = async (req, res) => {
  try {
    const { provider } = req.body;

    if (!["easypaisa", "payoneer"].includes(provider)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment provider",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.plan === "pro") {
      return res.status(400).json({
        success: false,
        message: "You already have a Pro plan",
      });
    }

    const payment = await Payment.create({
      user: user._id,
      plan: "pro",
      amount: PRO_PRICE,
      currency: "PKR",
      provider,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment: {
        id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        provider: payment.provider,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("Create Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment",
    });
  }
};

// =========================
// SUBMIT TRANSACTION
// =========================
const submitTransaction = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;

    if (!paymentId || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and transaction ID are required",
      });
    }

    const payment = await Payment.findOne({
      _id: paymentId,
      user: req.user.userId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This payment cannot be updated",
      });
    }

    payment.transactionId = transactionId.trim();

    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Transaction submitted for verification",
      payment: {
        id: payment._id,
        status: payment.status,
        transactionId: payment.transactionId,
      },
    });
  } catch (error) {
    console.error("Submit Transaction Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit transaction",
    });
  }
};

// =========================
// ADMIN — GET PENDING PAYMENTS
// =========================
const getPendingPayments = async (req, res) => {
  try {
    const adminSecret =
      req.headers["x-admin-payment-secret"];

    if (
      !adminSecret ||
      adminSecret !== process.env.ADMIN_PAYMENT_SECRET
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payments = await Payment.find({
      status: "pending",
    })
      .populate("user", "name email plan")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error(
      "Get Pending Payments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch pending payments",
    });
  }
};

// =========================
// ADMIN — VERIFY PAYMENT
// =========================
const verifyPayment = async (req, res) => {
  try {
    const adminSecret =
      req.headers["x-admin-payment-secret"];

    if (
      !adminSecret ||
      adminSecret !== process.env.ADMIN_PAYMENT_SECRET
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized payment verification",
      });
    }

    const {
      paymentId,
      receivedAmount,
    } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    const numericReceivedAmount =
      Number(receivedAmount);

    if (
      !Number.isFinite(numericReceivedAmount) ||
      numericReceivedAmount < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid received amount",
      });
    }

    // =========================
    // MINIMUM PAYMENT CHECK
    // =========================
    if (numericReceivedAmount < PRO_PRICE) {
      return res.status(400).json({
        success: false,
        code: "INSUFFICIENT_PAYMENT",
        message:
          `Payment rejected. Minimum payment is Rs. ${PRO_PRICE}.`,
        requiredAmount: PRO_PRICE,
        receivedAmount: numericReceivedAmount,
      });
    }

    const payment = await Payment.findById(
      paymentId
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (!payment.transactionId) {
      return res.status(400).json({
        success: false,
        message:
          "Transaction ID has not been submitted",
      });
    }

    if (payment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment is already verified",
      });
    }

    const user = await User.findById(
      payment.user
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const subscriptionStart = new Date();

    const subscriptionEnd = new Date(
      subscriptionStart
    );

    subscriptionEnd.setDate(
      subscriptionEnd.getDate() +
        PRO_DURATION_DAYS
    );

    payment.status = "paid";
    payment.paidAt = new Date();

    // Store actual received amount
    payment.receivedAmount =
      numericReceivedAmount;

    user.plan = "pro";
    user.subscriptionStatus = "active";
    user.subscriptionStart =
      subscriptionStart;
    user.subscriptionEnd =
      subscriptionEnd;

    await payment.save();
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Payment verified and Pro activated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        subscriptionStatus:
          user.subscriptionStatus,
        subscriptionStart:
          user.subscriptionStart,
        subscriptionEnd:
          user.subscriptionEnd,
      },
    });
  } catch (error) {
    console.error(
      "Verify Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify payment",
    });
  }
};

// =========================
// PAYMENT HISTORY
// =========================
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error(
      "Payment History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch payment history",
    });
  }
};

module.exports = {
  createPayment,
  submitTransaction,
  getPendingPayments,
  verifyPayment,
  getPaymentHistory,
};