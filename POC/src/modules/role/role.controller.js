import { PERMISSIONS } from "../../constants/permissions.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  changeStatus,
  createRoleService,
  getRolesService,
  updateRole,
} from "./role.service.js";
import { createRoleValidation } from "./role.validation.js";

// create role
export const createRoleController = async (req, res) => {
  const { error, value } = createRoleValidation.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const role = await createRoleService(value);

  res
    .status(201)
    .json(new ApiResponse(201, "Role created successfully", role.name));
};

// update role
export const updateRoleController = async (req, res) => {
  const { roleId } = req.params;
  const data = req.body;

  const role = await updateRole(roleId, data);

  return res
    .status(200)
    .json(new ApiResponse(200, "Role updated successfully", role));
};

//get all role permissions
export const getPermissionsController = (req, res) => {
  const permissions = Object.values(PERMISSIONS).filter((p) => p !== "all");
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Get role permissions successfully", permissions),
    );
};

//get all roles
export const getRolesController = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req?.query?.search?.trim() || "";
  const allowedSort = ["name", "isActive", "createdAt"];
  const sortBy = allowedSort.includes(req.query.sortBy)
    ? req.query.sortBy
    : "createdAt";
  const order = req.query.order === "asc" ? "asc" : "desc";
  const isActive = req.query.isActive;

  const roles = await getRolesService({
    page,
    limit,
    search,
    sortBy,
    order,
    isActive,
  });

  res.status(200).json(
    new ApiResponse(200, "Get role successfully", roles)
  );
};

// active/inactive role
export const changeStatusController = async (req, res) => {
  const { roleId } = req.params;
  const role = await changeStatus(roleId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Role status successfully", role));
};
