const { rejections } = require("winston");
const flexiBooking = require("../models/flexiBooking");
const Payment = require("../models/payment");

const addBooking = async (req, res) => {
  try {
    const {
      booking_type,
      visit_dates,
      guest_name,
      guest_email,
      guest_phone,
      guest_checkin_status,
      guest_assign_desk,
      identification_info,
      identification_id,
      company_name,
      special_request,
      invitee,
      isActive,
    } = req.body;

    const booking = await flexiBooking.create({
      booking_type,
      visit_dates,
      guest_name,
      guest_email,
      guest_phone,
      guest_checkin_status,
      guest_assign_desk,
      identification_info,
      identification_id,
      company_name,
      special_request,
      invitee,
      isActive,
    });

    if (!booking) {
      return res.status(400).json({ message: "Failed to create booking" });
    }
    return booking;
  } catch (error) {
    return error;
  }
};

const getAllBookings = async (req, res) => {
  const allBookings = await flexiBooking.find({}).populate("payment_id");
  if (!allBookings) {
    return res.status(404).json({ message: "No bookings found" });
  }
  return allBookings;
};

const addPayment = async (req, res) => {
  try {
    const { booking_id } = req.params;
    console.log(booking_id);
    const checkBooking = await Payment.find({ booking_id: booking_id });
    if (checkBooking.length > 0) {
      return false;
    }
    const {
      day_passes,
      sub_total_cost,
      gst_charges,
      discount,
      coupon_code,
      grand_total,
      payment_method,
      payment_status,
    } = req.body;

    const createPayment = await Payment.create({
      day_passes,
      sub_total_cost,
      gst_charges,
      discount,
      coupon_code,
      grand_total,
      payment_method,
      payment_status,
      booking_id: booking_id,
    });
    // console.log(createPayment);

    await createPayment.save();

    await flexiBooking.findByIdAndUpdate(
      booking_id,
      { payment_id: createPayment._id },
      { new: true, runValidators: true }
    );

    if (!createPayment) {
      return res.status(404).json({ message: "Payment not created" });
    }

    return createPayment;
  } catch (error) {
    throw error;
  }
};

const getPaymentBookingsById = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const booking = await flexiBooking
      .findOne({ _id: booking_id })
      .populate("payment_id");
    if (!booking) {
      return res.status(404).json({ message: "No bookings found" });
    }
    return booking;
  } catch (error) {
    return error;
  }
};

const updateBookingById = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const booking = flexiBooking.findById({ _id: booking_id });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const updateBooking = await flexiBooking.findByIdAndUpdate(
      booking_id,
      req.body,
      { new: true }
    );
    if (!updateBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return updateBooking;
  } catch (error) {
    return error;
  }
};

const updatePaymentByBookingId = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const payment = await Payment.findOne({ booking_id: booking_id });
    if (!payment) {
      return res.status(404).json({ message: "Booking not found" });
    }
    console.log(req.body);
    const updatedPayment = await Payment.findOneAndUpdate(
      { booking_id: booking_id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ message: "No payment found" });
    }

    return updatedPayment;
  } catch (error) {
    return error;
  }
};

const deleteBookingById = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const booking = await flexiBooking.findById({ _id: booking_id });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const deletedBooking = await flexiBooking.findByIdAndDelete({
      _id: booking_id,
    });
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return deletedBooking;
  } catch (error) {
    return error;
  }
};

const deletePaymentByBookingId = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const payment = await Payment.findOne({ booking_id: booking_id });
    // console.log(payment);
    if (!payment) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const deletedPayment = await Payment.findOneAndDelete({
      booking_id: booking_id,
    });

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    return deletedPayment;
  } catch (error) {
    return error;
  }
};

const filterBookings = async (req, res, visitDatesArray) => {
  try {
    const filterBooking = await flexiBooking.find({
      visit_dates: { $in: visitDatesArray },
    });
    if (!filterBooking) {
      return res.status(404).json({ message: "No bookings found" });
    }
    return filterBooking;
  } catch (error) {
    return error;
  }
};

// const getBookingsByGuestName = async (req, res, guestName) => {
//   try {
//     const guestBookings = await flexiBooking.find({ guest_name: guestName });
//     if (!guestBookings) {
//       return res.status(404).json({ message: "No bookings found" });
//     }
//     return guestBookings;
//   } catch (error) {
//     return error;
//   }
// };

const getBookingsByGuestName = async (req, res, guestName) => {
    try {
        console.log(guestName);
        const guestBookings = await flexiBooking.find(
            {
                "$or" : [{guest_name : { $regex: guestName ,$options: "i" }} ]
          }
        );
          console.log(guestBookings);
      if (!guestBookings) {
        return res.status(404).json({ message: "No bookings found" });
      }
      return guestBookings;
    } catch (error) {
      return error;
    }
  };
  
// handleAddBooking, handleGetAllBookings, handleAddPayment, handleGetPaymentBookingsById,handleUpdateBookingById,handleUpdatePaymentByBookingId,handleDeleteBookingById,handleDeletePaymentByBookingId,handleFilterBookings,handleGetBookingsByGuestName

module.exports = {
  addBooking,
  getAllBookings,
  addPayment,
  getPaymentBookingsById,
  updateBookingById,
  updatePaymentByBookingId,
  deleteBookingById,
  filterBookings,
  getBookingsByGuestName,
};
