const express = require("express");

const {
  createPayment,
  submitTransaction,
  getPendingPayments,
  verifyPayment,
  getPaymentHistory,
} = require("../controllers/payment.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

// User payment
router.post("/create", createPayment);

router.post(
  "/submit-transaction",
  submitTransaction
);

// User payment history
router.get(
  "/history",
  getPaymentHistory
);

// Admin payment dashboard
router.get(
  "/admin/pending",
  getPendingPayments
);

// Admin verify
router.post(
  "/verify",
  verifyPayment
);

module.exports = router;