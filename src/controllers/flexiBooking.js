const BILLING = require("../models/billing");
const flexiBooking = require("../models/flexiBooking");
const Payment = require("../models/payment");
const generateInvoice = require("../services/billing");

const {
  addBooking,
  getAllBookings,
  addPayment,
  getPaymentBookingsById,
  updateBookingById,
  updatePaymentByBookingId,
  deleteBookingById,
  filterBookings,
  getBookingsByGuestName,
} = require("../services/flexiBooking");
const logger = require("../utils/logger");
const sendEmail = require("../utils/sendEmail");

const handleAddBooking = async (req, res) => {
  try {
    console.log(req.body);

    const newBooking = await addBooking(req);
    console.log(newBooking, "saurabh sawant");

    if (!newBooking) {
      return res.status(400).json({ message: "Failed to add booking" });
    }   
    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    logger.error("Error occurred in handleAddBooking", error);
    // console.log(error)
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

const handleGetAllBookings = async (req, res) => {
  try {
    const bookings = await getAllBookings(req);
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    logger.error("Error occurred in handleGetAllBookings", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

const handleGetPaymentBookingsById = async (req, res) => {
  try {
    const booking = await getPaymentBookingsById(req, res);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ booking: booking });
  } catch (error) {
    logger.error("Internal server error", error);
    return res.json({ message: "Internal server error", error: error });
  }
};

const handleAddPayment = async (req, res) => {
  try {
    const createPayment = await addPayment(req, res);
    // console.log("Saurabh",createPayment);

    if (!createPayment) {
      return res.status(404).json({ message: "Payment not created" });
    }

    await createPayment.populate("booking_id");
    return res.status(201).json({
      message: "Payment created successfully",
      payment: createPayment,
    });
  } catch (error) {
    logger.error("Internal server error ", error);
    return res.json({ message: "Internal server error", error: error });
  }
};

const handleUpdateBookingById = async (req, res) => {
  try {
    const updatedBooking = await updateBookingById(req, res);
    // console.log(updatedBooking);

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    logger.error("Internal server error ", error);
    return res.json({ message: "Internal server error", error: error });
  }
};

const handleUpdatePaymentByBookingId = async (req, res) => {
  try {
    const updatedPayemnt = await updatePaymentByBookingId(req, res);
    if (!updatedPayemnt) {
      return res.status(404).json({ message: "Payment not found" });
    }
    console.log(updatedPayemnt);
    return res.status(200).json({
      message: "Booking updated successfully",
      payment: updatedPayemnt,
    });
  } catch (error) {
    // console.log(error);
    logger.error("Internal server error ", error);
    return res.json({ message: "Internal server error", error: error });
  }
};

const handleDeleteBookingById = async (req, res) => {
  try {
    const deletedBooking = await deleteBookingById(req, res);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({
      message: "Booking deleted successfully",
      booking: deletedBooking,
    });
  } catch (error) {
    logger.error("Internal server error ", error);
    return res.json({ message: "Internal server error", error: error });
  }
};

const handleDeletePaymentByBookingId = async (req, res) => {
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
    return res.status(200).json({
      message: "Payemnt Cancelled Successfully deleted successfully",
      paymentDeleted: deletedPayment,
    });
  } catch (error) {
    logger.error("Internal server error ", error);
    return res.json({ message: "Internal server error", error: error });
  }
};

const handleFilterBookings = async (req, res) => {
  try {
    const { visitDates } = req.query;
    console.log(visitDates);
    const visitDatesArray = visitDates
      ? visitDates.split(",").map((date) => new Date(date))
      : [];
    console.log(visitDatesArray);
    // const dateOfBooking = bookingDate ? new Date(bookingDate) : null;

    if (visitDatesArray.length <= 0) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const bookings = await filterBookings(req, res, visitDatesArray);
    if (!bookings || bookings.length <= 0) {
      logger.error("handleFilterBookings :: No bookings found");
      return res
        .status(404)
        .json({ message: "handleFilterBookings :: No bookings found" });
    }
    return res
      .status(200)
      .json({ message: "Bookings found", bookings: bookings });
  } catch (error) {
    logger.error("handleFilterBookings :: Internal server error ", error);
    return res.json({
      message: "handleFilterBookings :: Internal server error",
      error: error,
    });
  }
};

const handleGetBookingsByGuestName = async (req, res) => {
  try {
    const { guestName } = req.params;
    console.log(guestName);
    if (!guestName) {
      logger.error("handleGetBookingsByGuestName :: Invalid Guest Name");
      return res.status(400).json({
        message: "handleGetBookingsByGuestName :: Invalid guest name",
      });
    }
    const bookings = await getBookingsByGuestName(req, res, guestName);
    if (!bookings || bookings.length <= 0) {
      logger.error("handleGetBookingsByGuestName :: No bookings found");
      return res
        .status(404)
        .json({ message: "handleGetBookingsByGuestName :: No bookings found" });
    }
    return res
      .status(200)
      .json({ message: "Bookings found", bookings: bookings });
  } catch (error) {
    logger.error(
      "handleGetBookingsByGuestName :: Internal server error ",
      error
    );
    return res.json({
      message: "handleGetBookingsByGuestName :: Internal server error",
      error: error,
    });
  }
};

const handleGenerateInvoicePDF = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const bookingData = await flexiBooking.findOne({
      _id: booking_id,
    });

    const paymentData = await Payment.findOne({
      booking_id: booking_id,
    });

    const pdf = await BILLING.create({
      booking_id: booking_id,
      bookingData: bookingData,
      paymentData: paymentData,
    });
    await pdf.save();

    const pdfData = await BILLING.findOne({ booking_id: booking_id });
    console.log(pdfData);

    await generateInvoice(pdfData);

    return res.status(201).json({
      message: "PDF invoice has been generated successfully",
    });
  } catch (error) {
    console.error("Error Generate Invoice PDF:", error);
    return res.status(500).send("Error Generate Invoice PDF:");
  }
};

const handleGetInvoicePDF = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const pdf = await BILLING.findOne({ booking_id: booking_id });

    if (!pdf) {
      return res.status(404).send("PDF not found");
    }

    res.contentType("application/pdf");
    res.send(pdf.pdfData);
  } catch (error) {
    console.error("Error Get Invoice PDF:", error);
    res.status(500).send("Error Get Invoice PDF");
  }
};

const handleInvoiceEmail = async (req, res) => {
  const { booking_id } = req.params;
  try {
    const booking = await flexiBooking.findOne({ _id: booking_id });

    //send email
    await sendEmail(booking);

    return res.status(201).json({ message: "Invoice send successfully" });
  } catch (error) {
    console.error("Error Get Invoice PDF:", error);
    return res.status(500).send("Error Get Invoice PDF");
  }
};

const handleGetFlexiBookingsFilterSearch = async (req, res) => {
  try {
    const { visit_dates, guest_name } = req.query;
    console.log("Hello Saurabh");

    let queryConditions = [];

    if (visit_dates) {
      const visitDatesArray = visit_dates
        .split(",")
        .map((date) => new Date(date.trim()));

      if (visitDatesArray.some((date) => isNaN(date))) {
        return res
          .status(400)
          .json({ message: "Invalid date format in visitDates" });
      }

      queryConditions.push({ visit_dates: { $in: visitDatesArray } });
    }

    if (guest_name) {
      queryConditions.push({
        guest_name: { $regex: guest_name, $options: "i" },
      });
    }

    const finalQuery =
      queryConditions.length > 0 ? { $or: queryConditions } : {};

    console.log(finalQuery);
    const bookings = await getAllBookings(req, res, finalQuery);

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    logger.error("handleGetFlexiBookingsFilterSearch :: Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  handleAddBooking,
  handleGetAllBookings,
  handleAddPayment,
  handleGetPaymentBookingsById,
  handleUpdateBookingById,
  handleUpdatePaymentByBookingId,
  handleDeleteBookingById,
  handleDeletePaymentByBookingId,
  handleFilterBookings,
  handleGetBookingsByGuestName,
  handleGetInvoicePDF,
  handleGenerateInvoicePDF,
  handleInvoiceEmail,
  handleGetFlexiBookingsFilterSearch,
};
