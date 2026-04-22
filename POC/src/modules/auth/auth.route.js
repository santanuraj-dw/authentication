import { Router } from "express";
import {
  changeRoleController,
  changeStatusController,
  forgotPasswordController,
  getAllUserController,
  getMeController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
  resendOtpController,
  resetPasswordController,
  verifyOtpController,
  verifyResetOtpController,
} from "./auth.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { authLimiter } from "../../middlewares/ratelimiter.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/authRole.middleware.js";
import { sendEmail } from "../../utils/sendMail.js";
import authorizePermissions from "../../middlewares/authPermissions.middleware.js";
import { PERMISSIONS } from "../../constants/permissions.js";

const router = Router();

router.post("/register", asyncHandler(registerUserController));
router.post("/verify-otp", asyncHandler(verifyOtpController));
router.post("/resend-otp", asyncHandler(resendOtpController));
router.post("/login", authLimiter, asyncHandler(loginUserController));
router.post("/forgot-password", asyncHandler(forgotPasswordController));
router.post("/verify-reset-otp", asyncHandler(verifyResetOtpController));
router.post("/reset-password", asyncHandler(resetPasswordController));
router.post("/refresh", asyncHandler(refreshTokenController));
router.post("/logout", verifyJWT, asyncHandler(logoutUserController));

router.get("/me", verifyJWT, asyncHandler(getMeController));
router.patch(
  "/admin/status-change/:userId",
  verifyJWT,
  // authorizeRoles("admin"),
  authorizePermissions(PERMISSIONS.USER_UPDATE),
  asyncHandler(changeStatusController),
);
router.patch(
  "/admin/change-role/:userId",
  verifyJWT,
  // authorizeRoles("admin"),
  authorizePermissions(PERMISSIONS.USER_UPDATE),
  asyncHandler(changeRoleController),
);

router.get(
  "/users",
  verifyJWT,
  // authorizeRoles("admin"),
  authorizePermissions(PERMISSIONS.USER_READ),
  asyncHandler(getAllUserController),
);


// router.get("/mail", async (req, res) => {
//   await sendEmail("santanu.raj@defineway.in", "123456");
//   res.send("send message")
// });

export default router;
