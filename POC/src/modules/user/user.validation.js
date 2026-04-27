import Joi from "joi";

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required().messages({
    "string.empty": "Old password is required",
    "string.min": "Old password must be at least 6 characters",
  }),

  newPassword: Joi.string().min(6).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 6 characters",
  }),
});