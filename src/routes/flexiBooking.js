const express = require('express');
const { handleAddBooking, handleGetAllBookings, handleAddPayment, handleGetPaymentBookingsById,handleUpdateBookingById,handleUpdatePaymentByBookingId,handleDeleteBookingById,handleDeletePaymentByBookingId,handleFilterBookings,handleGetBookingsByGuestName } = require('../controllers/flexiBooking');

const flexiBooking = express.Router();


flexiBooking.get('/',handleGetAllBookings);
flexiBooking.get("/get-booking/:booking_id",handleGetPaymentBookingsById)
flexiBooking.post('/add-guest',handleAddBooking);
flexiBooking.put('/update-booking/:booking_id',handleUpdateBookingById);
flexiBooking.put('/update-payment/:booking_id',handleUpdatePaymentByBookingId);
flexiBooking.post('/payment/:booking_id',handleAddPayment);
flexiBooking.delete('/delete-booking/:booking_id',handleDeleteBookingById);
flexiBooking.delete('/delete-payment/:booking_id',handleDeletePaymentByBookingId);
flexiBooking.get('/filter-bookings',handleFilterBookings);
flexiBooking.get('/search-by-guest-name/',handleGetBookingsByGuestName)

// flexiBooking.post('/generate-invoice',handleGenerateInvoice);




module.exports = flexiBooking;