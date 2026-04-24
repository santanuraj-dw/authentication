import { Router } from "express";
import authorize from "../../middlewares/authorize.middleware.js";
import {
  changePermissionStatus,
  getAllPermissions,
  updatePermission,
} from "./permission.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/",
  verifyJWT,
  authorize(["permission_read"]),
  asyncHandler(getAllPermissions),
);
router.patch(
  "/:id",
  verifyJWT,
  authorize(["permission_update"]),
  asyncHandler(updatePermission),
);
router.patch(
  "/status/:id",
  verifyJWT,
  authorize(["permission_update"]),
  asyncHandler(changePermissionStatus),
);

export default router;
