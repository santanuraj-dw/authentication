import { PERMISSIONS } from "../../constants/permissions.js";
import { Role } from "../../models/Role.model.js";
import ApiError from "../../utils/ApiError.js";

//create role
export const createRoleService = async (data) => {
  let { name, permissions } = data;

  name = name.trim().toLowerCase();

  if (!name) {
    throw new ApiError(400, "Role name is required");
  }

  if (permissions.includes(PERMISSIONS.ALL)) {
    throw new ApiError(403, "Not allowed");
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

// update role
export const updateRole = async (roleId, data) => {
  const { name, permissions } = data;

  const role = await Role.findById(roleId);
  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  if (name) {
    const existing = await Role.findOne({
      name: name.toLowerCase(),
      _id: { $ne: roleId },
    });

    if (existing) {
      throw new ApiError(400, "Role already exists");
    }

    role.name = name.toLowerCase();
  }
  if (permissions) {
    role.permissions = permissions;
  }

  await role.save();

  return role;
};

export const changeStatus = async (roleId) => {
  const role = await Role.findById(roleId);

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  role.isActive = !role.isActive;

  await role.save();
  
  return role;
};

//get roles
export const getRolesService = async () => {
  return await Role.find({ name: { $ne: "admin" } });
};
