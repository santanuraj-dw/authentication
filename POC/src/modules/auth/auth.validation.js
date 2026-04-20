import joi from "joi";

// reusable password schema
const passwordSchema = joi
  .string()
  .min(8)
  .pattern(new RegExp("^(?=.*[a-z])"))
  .pattern(new RegExp("^(?=.*[A-Z])")) 
  .pattern(new RegExp("^(?=.*[0-9])"))
  .pattern(new RegExp("^(?=.*[!@#$%^&*])")) 
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters",
    "string.pattern.base":
      "Password must include uppercase, lowercase, number, and special character",
  });

export const registerValidation = joi.object({
  username: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: passwordSchema,
  confirmPassword: joi
    .string()
    .valid(joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
    }),
});

export const loginValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const verifyOtpValidation = joi.object({
  email: joi.string().email().required(),
  otp: joi.string().length(6).pattern(/^[0-9]+$/).required(),
});

export const resendOtpValidation = joi.object({
  email: joi.string().email().required(),
});

export const resetPasswordValidation = joi.object({
  email: joi.string().email().required(),
  otp: joi.string().length(6).pattern(/^[0-9]+$/).required(),
  newPassword: passwordSchema,
});