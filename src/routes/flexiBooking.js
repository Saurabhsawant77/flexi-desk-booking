const express = require("express");
const {
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
} = require("../controllers/flexiBooking");
const { bookingSchemaValidation, bookingUpdateSchemaValidation, createPaymentSchemaValidation, updatePaymentSchemaValidation } = require("../middlewares/joiValidations");

const flexiBooking = express.Router();

flexiBooking.get('/',handleGetAllBookings);
flexiBooking.get("/get-booking/:booking_id", handleGetPaymentBookingsById)
flexiBooking.post('/add-booking',bookingSchemaValidation, handleAddBooking);
flexiBooking.put('/update-booking/:booking_id',bookingUpdateSchemaValidation , handleUpdateBookingById);
flexiBooking.post('/payment/:booking_id',createPaymentSchemaValidation, handleAddPayment);
flexiBooking.put('/update-payment/:booking_id',updatePaymentSchemaValidation, handleUpdatePaymentByBookingId);
flexiBooking.delete('/delete-booking/:booking_id', handleDeleteBookingById);
flexiBooking.delete('/delete-payment/:booking_id', handleDeletePaymentByBookingId);
flexiBooking.get('/filter-bookings', handleFilterBookings);
flexiBooking.get('/search-by-guest-name/:guestName', handleGetBookingsByGuestName)

flexiBooking.post(
  "/generate-invoice-pdf/:booking_id",
  handleGenerateInvoicePDF
);
flexiBooking.get("/get-invoice-pdf/:booking_id", handleGetInvoicePDF);

// flexiBooking.post('/generate-invoice',handleGenerateInvoice);

module.exports = flexiBooking;
