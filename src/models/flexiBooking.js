const { optional } = require('joi');
const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence')(mongoose);


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
// bookingId : {
//   type: Number,
//   required: true,
//   unique : true
// },
  invitee:[
    {
      invitee_name: { type: String, required: false },
      invitee_email: { type: String, required: false },
      invitee_checkin_status: { type: Boolean, default: false },
      invitee_assign_desk: { type: String, required: false },
    },
  ],
  payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: false },
  special_request : {type: String, required: false},
  day_passes: { type: Number, required: true },
  sub_total_cost: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
},
  {
    timestamps: true
  }
);

BookingSchema.plugin(mongooseSequence,{inc_field : 'bookingId',start_seq: 10000})

module.exports = mongoose.model('Booking', BookingSchema);