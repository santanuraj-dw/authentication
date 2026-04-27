import { Router } from "express";
import authorize from "../../middlewares/authorize.middleware.js";
import {
  changePermissionStatus,
  getAllPermissions,
  updatePermission,
} from "./permission.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { PERMISSIONS } from "../../constants/permissions.js";

const router = Router();

router.get(
  "/",
  verifyJWT,
  // authorize([PERMISSIONS.PERMISSIONS_READ]),
  asyncHandler(getAllPermissions),
);
router.patch(
  "/:id",
  verifyJWT,
  authorize([PERMISSIONS.PERMISSIONS_UPDATE]),
  asyncHandler(updatePermission),
);
router.patch(
  "/status/:id",
  verifyJWT,
  authorize([PERMISSIONS.PERMISSIONS_UPDATE]),
  asyncHandler(changePermissionStatus),
);

export default router;
