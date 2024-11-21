const flexiBooking = require("../models/flexiBooking");
const Payment = require("../models/payment");
const { addBooking,getAllBookings,addPayment,getPaymentBookingsById, updateBookingById, updatePaymentByBookingId,deleteBookingById } = require("../services/flexiBooking");
const logger = require("../utils/logger");


const handleAddBooking = async (req, res) => {
    try {
        console.log(req.body);
        
        const newBooking = await addBooking(req); 
        console.log("Saurabh",newBooking);
        if(!newBooking){
            return res.status(400).json({ message: "Failed to add booking" });
        }
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });

    } catch (error) {
        logger.error("Error occurred in handleAddBooking", error);
        // console.log(error)
        return res.status(500).json({
            message: "Internal server error",error: error});
    }
};


const handleGetAllBookings = async (req, res) => {
    try {
        const bookings = await getAllBookings(req); 
        if(!bookings || bookings.length === 0){
            return res.status(404).json({ message: "No bookings found" });
        }
        res.status(200).json(bookings);

    } catch (error) {
        logger.error("Error occurred in handleGetAllBookings", error);
        return res.status(500).json({message: "Internal server error",error: error});
    }
}

const handleGetPaymentBookingsById = async (req, res) => {
    try {
        
        const booking = await getPaymentBookingsById(req,res);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json({ booking : booking });

    } catch (error) {
        logger.error("Internal server error",error);
        return res.json({message: "Internal server error",error:error})
    }
}

const handleAddPayment = async (req, res) => {
    try {

        const createPayment = await addPayment(req,res);
        // console.log("Saurabh",createPayment);

        if(!createPayment){
            return res.status(404).json({ message: "Payment not created" });
        }

        await createPayment.populate('booking_id')
        return res.status(201).json({ message: "Payment created successfully", payment: createPayment })

    } catch (error) {
        logger.error("Internal server error ",error);
        return res.json({message: "Internal server error",error:error})

    }

}

const handleUpdateBookingById =async (req,res)=>{
        try {
            const updatedBooking = await updateBookingById(req,res); 
            // console.log(updatedBooking);

            if(!updatedBooking){
                return res.status(404).json({ message: "Booking not found" });
            }

            return res.status(200).json({ message: "Booking updated successfully", booking: updatedBooking})

        } catch (error) {
            logger.error("Internal server error ",error);
            return res.json({message: "Internal server error",error:error}) 
        }
}

const handleUpdatePaymentByBookingId =async (req,res)=>{
    try {
        const updatedPayemnt = await updatePaymentByBookingId(req,res);
        if(!updatedPayemnt){
            return res.status(404).json({ message: "Payment not found" });
        }
        console.log(updatedPayemnt);
        return res.status(200).json({ message: "Booking updated successfully", payment: updatedPayemnt})

    } catch (error) {
        // console.log(error);
        logger.error("Internal server error ",error);
        return res.json({message: "Internal server error",error:error}) 
    }
}


const handleDeleteBookingById =async (req,res)=> {
    try {
        const deletedBooking = await deleteBookingById(req,res);
        if(!deletedBooking){
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json({ message: "Booking deleted successfully", booking: deletedBooking});
    } catch (error) {
        logger.error("Internal server error ",error);
        return res.json({message: "Internal server error",error:error})
    }
}


const handleDeletePaymentByBookingId =async (req,res)=> {
    try {
        const {booking_id} = req.params;
        const payment = await Payment.findOne({ booking_id: booking_id })
        // console.log(payment);
        if (!payment) {
            return res.status(404).json({ message: "Booking not found" })
            }
        const deletedPayment = await Payment.findOneAndDelete({booking_id: booking_id});
        return res.status(200).json({ message: "Payemnt Cancelled Successfully deleted successfully", paymentDeleted: deletedPayment});
    } catch (error) {
        logger.error("Internal server error ",error);
        return res.json({message: "Internal server error",error:error})
    }
}

module.exports = { handleAddBooking, handleGetAllBookings, handleAddPayment, handleGetPaymentBookingsById,handleUpdateBookingById,handleUpdatePaymentByBookingId,handleDeleteBookingById,handleDeletePaymentByBookingId }

