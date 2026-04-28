import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  changePasswordController,
  changeUsernameController,
  sendEmailOtpController,
  verifyChangeEmailController,
} from "./user.controller.js";

const router = Router();

router.patch(
  "/change-password",
  verifyJWT,
  asyncHandler(changePasswordController),
);
router.post("/send-email-otp", verifyJWT, asyncHandler(sendEmailOtpController));
router.patch(
  "/verify-change-email",
  verifyJWT,
  asyncHandler(verifyChangeEmailController),
);

router.patch(
  "/change-username",
  verifyJWT,
  asyncHandler(changeUsernameController),
);

export default router;
