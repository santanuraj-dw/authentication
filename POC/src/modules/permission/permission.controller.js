import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  changePermissionStatusService,
  getAllPermissionsService,
  updatePermissionService,
} from "./permission.service.js";
import {
  validateGetPermissions,
  validateUpdatePermission,
} from "./permission.validation.js";

//get all permissions
export const getAllPermissions = async (req, res) => {
  const { error, value } = validateGetPermissions(req.query);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const result = await getAllPermissionsService(value);

  return res
    .status(200)
    .json(new ApiResponse(200, "Permissions fetched successfully", result));
};

// update permissions
export const updatePermission = async (req, res) => {
  const { error, value } = validateUpdatePermission(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  if (!req.params.id) {
    throw new ApiError(400, "Permission ID is required");
  }

  const updated = await updatePermissionService(req.params.id, value);

  return res
    .status(200)
    .json(new ApiResponse(200, "Permission updated successfully", updated));
};

//change permissions status
export const changePermissionStatus = async (req, res) => {
  if (!req.params.id) {
    throw new ApiError(400, "Permission ID is required");
  }

  const updated = await changePermissionStatusService(req.params.id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Permission status updated successfully", updated),
    );
};
