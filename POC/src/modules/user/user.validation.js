import Joi from "joi";

const passwordSchema = Joi.string()
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

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Old password is required",
  }),

  newPassword: passwordSchema,

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
      "string.empty": "Confirm password is required",
    }),
});

export const sendEmailOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
});

export const verifyChangeEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),

  otp: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.pattern.base": "OTP must be exactly 6 digits",
    }),
});

export const changeUsernameSchema = Joi.object({
  username: Joi.string().min(3).max(20).trim().required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be less than 20 characters",
  }),
});
