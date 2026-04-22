import { PERMISSIONS } from "../../constants/permissions.js";
import { Role } from "../../models/Role.model.js";
import ApiError from "../../utils/ApiError.js";

export const createRoleService = async (data) => {
  let { name, permissions } = data;

  name = name.trim().toLowerCase();

  if (!name) {
    throw new ApiError(400, "Role name is required");
  }

  const existing = await Role.findOne({ name });
  if (existing) {
    throw new ApiError(400, "Role already exists");
  }

  const validPermissions = Object.values(PERMISSIONS);

  const isValid = permissions.every((p) => validPermissions.includes(p));
  if (!isValid) throw new ApiError(400, "Invalid permissions");

  return await Role.create({ name, permissions });
};

export const getRolesService = async () => {
  return await Role.find({ name: { $ne: "admin" } });
};
