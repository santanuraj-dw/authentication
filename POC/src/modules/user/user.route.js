import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { changePasswordController } from "./user.controller.js";

const router = Router();

router.patch("/change-password", verifyJWT, asyncHandler(changePasswordController))

export default router;
