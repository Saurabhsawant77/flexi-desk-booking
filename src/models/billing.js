const mongoose = require("mongoose");

function generate5DigitNumber() {
  return Math.floor(Math.random() * 90000) + 10000;
}
const now = new Date();

const pdfSchema = new mongoose.Schema(
  {
    pdfData: { type: Buffer, required: false },
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    bookingData: {},
    paymentData: {},
    invoice_no: {
      type: Number,
      required: false,
      default: generate5DigitNumber(),
    },
    invoice_date: {
      type: String,
      required: false,
      default: now.toLocaleDateString(),
    },
  },
  {
    timestamps: true,
  }
);
const BILLING = mongoose.model("BILLING", pdfSchema);

module.exports = BILLING;
