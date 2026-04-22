import { Router } from "express";
import {
  createRoleController,
  getPermissionsController,
  getRolesController,
} from "./role.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/authRole.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import authorizePermissions from "../../middlewares/authPermissions.middleware.js";
import { PERMISSIONS } from "../../constants/permissions.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  authorizeRoles("admin"),
  asyncHandler(createRoleController),
);

router.get(
  "/permissions",
  verifyJWT,
  authorizeRoles("admin"),
  asyncHandler(getPermissionsController),
);

router.get(
  "/",
  verifyJWT,
  // authorizeRoles("admin"),
  authorizePermissions(PERMISSIONS.ROLE_READ),
  asyncHandler(getRolesController),
);

export default router;
