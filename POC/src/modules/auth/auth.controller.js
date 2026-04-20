import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { cookieOptions } from "../../utils/cookieOption.js";
import { decodedToken } from "../../utils/jwt.js";
import { resUser } from "../../utils/userRes.js";
import {
  changeRole,
  changeStatus,
  forgotPassword,
  getAllUser,
  getMe,
  loginUserService,
  refreshTokenService,
  registerUserService,
  resendOtp,
  resetPassword,
  verifyOtp,
  verifyRestOtp,
} from "./auth.service.js";
import {
  loginValidation,
  registerValidation,
  resendOtpValidation,
  resetPasswordValidation,
  verifyOtpValidation,
} from "./auth.validation.js";

//register
export const registerUserController = async (req, res) => {
  const { error, value } = registerValidation.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const { user } = await registerUserService(value);

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", user));
};

//verify otp
export const verifyOtpController = async (req, res) => {
  const { error, value } = verifyOtpValidation.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  await verifyOtp(value);
  return res
    .status(200)
    .json(new ApiResponse(200, "Email verified successfully", {}));
};

//resend otp
export const resendOtpController = async (req, res) => {
  const { error, value } = resendOtpValidation.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  await resendOtp(value);
  return res
    .status(200)
    .json(new ApiResponse(200, "OTP resent successfully", {}));
};

//login
export const loginUserController = async (req, res) => {
  const { error, value } = loginValidation.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const { user, accessToken, refreshToken } = await loginUserService(value);

  return res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse(200, "Login successful", user));
};

//forgot password
export const forgotPasswordController = async (req, res) => {
  const { error, value } = resendOtpValidation.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  await forgotPassword(value);
  return res.status(200).json(new ApiResponse(200, "OTP sent to email", {}));
};

//verify Otp for password reset
export const verifyResetOtpController = async (req, res) => {
  const { error, value } = verifyOtpValidation.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  await verifyRestOtp(value);
  return res.status(200).json(new ApiResponse(200, "OTP verified", {}));
};

//reset password
export const resetPasswordController = async (req, res) => {
  const { error, value } = resetPasswordValidation.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  await resetPassword(value);
  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successful", {}));
};

//refresh token
export const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "No refresh token provided");
  }
  const decoded = decodedToken(refreshToken, "refresh");
  const { accessToken, newRefreshToken } = await refreshTokenService(
    decoded.id,
    refreshToken,
  );
  return res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse(200, "Token refreshed successfully"));
};

//logout
export const logoutUserController = async (_, res) => {
  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(new ApiResponse(200, "Logged out successfully"));
};

//get-me
export const getMeController = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const me = await getMe(user);
  return res
    .status(200)
    .json(new ApiResponse(200, "User info retrieved successfully", me));
};

//change status
export const changeStatusController = async (req, res) => {
  const user = await changeStatus(req.params);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `User ${user.isActive ? "activated" : "deactivated"}`,
        user,
      ),
    );
};

// change role
export const changeRoleController = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const user = await changeRole({ userId, role });

  return res.status(200).json(new ApiResponse(200, "User role updated", user));
};

// get all
export const getAllUserController = async (req, res) => {
  const { id } = req.user.id;
  const users = await getAllUser(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
};
