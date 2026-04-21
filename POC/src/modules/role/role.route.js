import { Router } from "express";
import { createRoleController, getRolesController } from "./role.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/authRole.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  authorizeRoles("admin"),
  asyncHandler(createRoleController),
);

router.get(
  "/",
  verifyJWT,
  authorizeRoles("admin"),
  asyncHandler(getRolesController),
);

export default router;
