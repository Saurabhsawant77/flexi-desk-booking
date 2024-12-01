const flexiBooking = require("../models/flexiBooking");
const Payemnts = require("../models/payment");

const Joi = require("joi");
const logger = require("../utils/logger");

const bookingSchema = Joi.object({
  booking_type: Joi.string().required(),

  visit_dates: Joi.array().items(Joi.date()).min(1).required(),

  guest_name: Joi.string().required(),

  guest_email: Joi.string().email().required(),

  guest_phone: Joi.number()
    .integer()
    .min(1000000000)
    .max(9999999999)
    .required()
    .messages({
      "number.base": "Phone number must be a number.",
      "number.min": "Phone number must be at least 10 digits.",
      "number.max": "Phone number cannot exceed 10 digits.",
      "any.required": "Phone number is required.",
    }),

  guest_checkin_status: Joi.boolean().default(false).optional(),

  guest_assign_desk: Joi.string().optional(),

  identification_info: Joi.string().required(),

  identification_id: Joi.string().required(),

  company_name: Joi.string().optional(),

  special_request: Joi.string().optional(),

  invitee: Joi.array()
    .items(
      Joi.object({
        invitee_name: Joi.string().optional(),
        invitee_email: Joi.string().email().optional(),
        invitee_checkin_status: Joi.boolean().default(false),
        invitee_assign_desk: Joi.string().optional(),
      })
    )
    .optional()
    .messages({
      "array.base": "Invitee must be an array",
    }),

  isActive: Joi.boolean().default(true),
});

const bookingSchemaValidation = (req, res, next) => {
  try {
    console.log("inside booking validation -- ");
    const { error, value } = bookingSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      logger.error(
        "bookingSchemaValidation ::  user data is invalid",
        error.details
      );
      return res.status(400).send({ message: error.details });
    }
    req.body = value;
    next();
  } catch (error) {
    logger.error("bookingSchemaValidation ::  user data is invalid", error);
    return res.status(500).send({ message: error.message });
  }
};

const bookingUpdateSchema = Joi.object({
  booking_type: Joi.string().optional(),

  visit_dates: Joi.array().items(Joi.date()).min(1).optional(),

  guest_name: Joi.string().optional(),

  guest_email: Joi.string().email().optional(),

  guest_phone: Joi.number()
    .integer()
    .min(1000000000)
    .max(9999999999)
    .optional()
    .messages({
      "number.base": "Phone number must be a number.",
      "number.min": "Phone number must be at least 10 digits.",
      "number.max": "Phone number cannot exceed 10 digits.",
      "any.required": "Phone number is required.",
    }),

  guest_checkin_status: Joi.boolean().default(false).optional(),

  guest_assign_desk: Joi.string().optional(),

  identification_info: Joi.string().optional(),

  identification_id: Joi.string().optional(),

  company_name: Joi.string().optional(),

  special_request: Joi.string().optional(),

  invitee: Joi.array()
    .items(
      Joi.object({
        invitee_name: Joi.string().optional(),
        invitee_email: Joi.string().email().optional(),
        invitee_checkin_status: Joi.boolean().default(false),
        invitee_assign_desk: Joi.string().optional(),
      })
    )
    .optional()
    .messages({
      "array.base": "Invitee must be an array",
    }),

  isActive: Joi.boolean().optional(),
});

const bookingUpdateSchemaValidation = async (req, res, next) => {
  try {
    const { error, value } = bookingUpdateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      logger.error(
        "bookingUpdateSchemaValidation ::  user data is invalid",
        error.details
      );
      return res.status(400).send({ message: error.details });
    }
    req.body = value;
    next();
  } catch (error) {
    logger.error(
      "bookingUpdateSchemaValidation ::  user data is invalid",
      error
    );
    return res.status(500).send({ message: error.message });
  }
};

const createPaymentSchema = Joi.object({
  day_passes: Joi.number().integer().min(1).required(),
  sub_total_cost: Joi.number().positive().required(),
  gst_charges: Joi.number().positive().required(),
  discount: Joi.number().positive().optional(),
  coupon_code: Joi.string().optional(),
  grand_total: Joi.number().positive().required(),
  payment_method: Joi.string().valid("Cash", "Online").required(),
  payment_status: Joi.string().valid("Pending", "Paid", "Fail").required(),
});

const createPaymentSchemaValidation = async (req, res, next) => {
  try {
    const { error, value } = createPaymentSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      logger.error(
        "createPaymentSchemaValidation ::  user data is invalid",
        error.details
      );
      return res.status(400).send({ message: error.details });
    }
    req.body = value;
    next();
  } catch (error) {
    logger.error(
      "createPaymentSchemaValidation ::  user data is invalid",
      error
    );
    return res.status(500).send({ message: error.message });
  }
};

const updatePaymentSchema = Joi.object({
  day_passes: Joi.number().integer().positive().optional(),
  sub_total_cost: Joi.number().positive().optional(),
  gst_charges: Joi.number().positive().optional(),
  discount: Joi.number().positive().optional(),
  coupon_code: Joi.string().optional(),
  grand_total: Joi.number().positive().optional(),
  payment_method: Joi.string().valid("Cash", "Online").optional(),
  payment_status: Joi.string().valid("Pending", "Paid", "Fail").optional(),
});

const updatePaymentSchemaValidation = async (req, res, next) => {
  try {
    const { error, value } = updatePaymentSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      logger.error(
        "updatePaymentSchemaValidation ::  user data is invalid",
        error.details
      );
      return res.status(400).send({ message: error.details });
    }
    req.body = value;
    next();
  } catch (error) {
    logger.error(
      "updatePaymentSchemaValidation ::  user data is invalid",
      error
    );
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  bookingSchemaValidation,
  bookingUpdateSchemaValidation,
  createPaymentSchemaValidation,
  updatePaymentSchemaValidation,
};
