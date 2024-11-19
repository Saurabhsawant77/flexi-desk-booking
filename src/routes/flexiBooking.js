const express = require('express');

const flexiBooking = express.Router();


flexiBooking.post('/add-user',handleAddAllUser);
flexiBooking.post('/generate-invoice',handleGenerateInvoice);
flexiBooking.put('/update-user/:id',handleUpdateUserById);
flexiBooking.get('/',handleGetAllUser);
flexiBooking.get('/:id',handleGetAllUserById);



module.exports = flexiBooking;