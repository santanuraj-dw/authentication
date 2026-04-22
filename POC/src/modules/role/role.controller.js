import { PERMISSIONS } from "../../constants/permissions.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { createRoleService, getRolesService } from "./role.service.js";
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
  const roles = await getRolesService();

  res.status(200).json(new ApiResponse(200, "Get role successfully", roles));
};
