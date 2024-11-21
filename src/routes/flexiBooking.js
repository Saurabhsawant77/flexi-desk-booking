const express = require('express');
const { handleAddBooking,handleUpdateBookingById,handleUpdatePaymentByBookingId, handleGetAllBookings, handleAddPayment, handleGetPaymentBookingsById,handleDeleteBookingById,handleDeletePaymentByBookingId } = require('../controllers/flexiBooking');

const flexiBooking = express.Router();


flexiBooking.get('/',handleGetAllBookings);
flexiBooking.get("/get-booking/:booking_id",handleGetPaymentBookingsById)
flexiBooking.post('/add-guest',handleAddBooking);
flexiBooking.put('/update-booking/:booking_id',handleUpdateBookingById);
flexiBooking.put('/update-payment/:booking_id',handleUpdatePaymentByBookingId);
flexiBooking.post('/payment/:booking_id',handleAddPayment);
flexiBooking.delete('/delete-booking/:booking_id',handleDeleteBookingById);
flexiBooking.delete('/delete-payment/:booking_id',handleDeletePaymentByBookingId);

// flexiBooking.post('/generate-invoice',handleGenerateInvoice);




module.exports = flexiBooking;