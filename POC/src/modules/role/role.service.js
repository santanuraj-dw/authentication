import { PERMISSIONS } from "../../constants/permissions.js";
import { Permission } from "../../models/Permission.model.js";
import { Role } from "../../models/Role.model.js";
import ApiError from "../../utils/ApiError.js";
import { validatePermissionDependencies } from "../../utils/permissionDependences.js";

export const createRoleService = async (data) => {
  let { name, permissions } = data;
  // console.log("hello")

  name = name.trim().toLowerCase();

  if (!name) {
    throw new ApiError(400, "Role name is required");
  }

  if (!Array.isArray(permissions) || permissions.length === 0) {
    throw new ApiError(400, "Permissions are required");
  }

  const existing = await Role.findOne({ name });
  if (existing) {
    throw new ApiError(400, "Role already exists");
  }

  const validPermissions = await Permission.find({
    _id: { $in: permissions },
  }).select("_id");

  if (validPermissions.length !== permissions.length) {
    throw new ApiError(400, "Some permissions are invalid");
  }

  validatePermissionDependencies(validPermissions);

  return await Role.create({
    name,
    permissions,
  });
};

// update role
export const updateRole = async (roleId, data) => {
  const { name, permissions } = data;

  const permissionDocs = await Permission.find({
    _id: { $in: permissions },
  });

  validatePermissionDependencies(permissionDocs);

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
export const getRolesService = async (query) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    order = "desc",
    isActive,
  } = query;

  page = parseInt(page);
  limit = parseInt(limit);

  const filter = {
    name: { $ne: "admin" },
  };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const sortOrder = order === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  const roles = await Role.find(filter)
    .populate("permissions", "name")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Role.countDocuments(filter);

  return {
    roles,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
