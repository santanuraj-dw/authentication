import { Router } from "express";
import {
  changeStatusController,
  createRoleController,
  getPermissionsController,
  getRolesController,
  updateRoleController,
} from "./role.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/authRole.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import authorizePermissions from "../../middlewares/authPermissions.middleware.js";
import { PERMISSIONS } from "../../constants/permissions.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  // authorizeRoles("admin"),
  authorize([PERMISSIONS.ROLE_CREATE]),
  asyncHandler(createRoleController),
);

// router.get(
//   "/permissions",
//   // verifyJWT,
//   // authorizeRoles("admin"),
//   authorize([PERMISSIONS.PERMISSIONS_READ]),
//   asyncHandler(getPermissionsController),
// );

router.get(
  "/",
  verifyJWT,
  // authorizeRoles("admin"),
  // authorizePermissions(PERMISSIONS.ROLE_READ),
  authorize([PERMISSIONS.ROLE_READ]),
  asyncHandler(getRolesController),
);

router.patch(
  "/:roleId",
  verifyJWT,
  // authorizeRoles("admin"),
  authorize([PERMISSIONS.ROLE_UPDATE]),
  asyncHandler(updateRoleController),
);

router.patch(
  "/status/:roleId",
  verifyJWT,
  // authorizeRoles("admin"),
  authorize([PERMISSIONS.ROLE_DELETE]),
  asyncHandler(changeStatusController),
);

export default router;
