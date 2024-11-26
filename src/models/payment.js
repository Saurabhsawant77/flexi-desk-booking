const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    day_passes: { type: Number, required: true },
    sub_total_cost: { type: Number, required: true },
    gst_charges: { type: Number, required: true },
    discount: { type: Number, required: false },
    coupon_code: { type: String, required: false },
    grand_total: { type: Number, required: true },
    payment_method: { type: String, enum: ["Cash", "Online"], required: true },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Fail"],
      required: true,
    },

    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
