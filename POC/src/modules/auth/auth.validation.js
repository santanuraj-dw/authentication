import joi from "joi";

export const registerValidation = joi.object({
  username: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const loginValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const verifyOtpValidation = joi.object({
  email: joi.string().email().required(),
  otp: joi.string().length(6).pattern(/^[0-9]+$/).required()
});
export const resendOtpValidation = joi.object({
  email: joi.string().email().required(),
});

export const resetPasswordValidation = joi.object({
  email: joi.string().email().required(),
  otp: joi.string().length(6).pattern(/^[0-9]+$/).required(),
  newPassword: joi.string().min(6).required(),
});

