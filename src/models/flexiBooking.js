const mongoose = require('mongoose');


const BookingSchema = new mongoose.Schema({
  booking_type: {
     type: String, 
     required: true 
    },
  visit_dates: { 
    type: [Date], 
    required: true 
    },
  guest_name: { 
    type: String, 
    required: true 
},
  guest_email: { 
    type: String, 
    required: true 
},
  guest_phone: { 
    type: Number, 
    required: true 
},
  guest_checkin_status: { 
    type: Boolean, 
    default: false 
},
  guest_assign_desk: { 
    type: String, 
    required: false 
},
  identification_info: { 
    type: String, 
    required: false 
},
  identification_id: { 
    type: String, 
    required: false 
},
  company_name: { 
    type: String, 
    required: false 
},
  invitee:[
    {
      invitee_name: { type: String, required: false },
      invitee_email: { type: String, required: false },
      invitee_checkin_status: { type: Boolean, default: false },
      invitee_assign_desk: { type: String, required: false },
    },
  ],
  payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: false },
  isActive: { type: Boolean, default: false },
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', BookingSchema);
