import Joi from "joi";

export const validateGetPermissions = (query) => {
  const schema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    search: Joi.string().allow("").default(""),
    sortBy: Joi.string()
      .valid("name", "group", "createdAt")
      .default("createdAt"),
    order: Joi.string().valid("asc", "desc").default("desc"),
  });

  return schema.validate(query);
};

export const validateUpdatePermission = (body) => {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(/^[a-z]+:[a-z]+$/)
      .optional(),
    group: Joi.string().optional(),
  });

  return schema.validate(body);
};