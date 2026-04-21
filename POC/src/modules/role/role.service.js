import { Role } from "../../models/Role.model.js";
import ApiError from "../../utils/ApiError.js";

export const createRoleService = async (data) => {
  let { name } = data;

  name = name.trim().toLowerCase();
  if (!name) {
    throw new ApiError(400, "Role name is required");
  }

  const existing = await Role.findOne({ name });

  if (existing) {
    throw new ApiError(400, "Role already exists");
  }

  return await Role.create({ name });
};

export const getRolesService = async () => {
  return await Role.find({ name: { $ne: "admin" } });
};
