const express = require('express');
const flexiBooking = require('./flexiBooking');

const mainRouter = express.Router();

mainRouter('/flexibooking',flexiBooking);









module.exports = mainRouter;