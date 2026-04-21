import Joi from "joi";

export const createRoleValidation = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(30)
    .required()
    .messages({
      "string.empty": "Role name is required",
      "string.min": "Role must be at least 2 characters",
    }),
});