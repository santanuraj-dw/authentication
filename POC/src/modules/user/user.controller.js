import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  changePassword,
  changeUsername,
  sendEmailOtp,
  verifyChangeEmail,
} from "./user.service.js";
import {
  changePasswordSchema,
  changeUsernameSchema,
  sendEmailOtpSchema,
  verifyChangeEmailSchema,
} from "./user.validation.js";

//change password
export const changePasswordController = async (req, res) => {
  const { error } = changePasswordSchema.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const userId = req.user.id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  await changePassword(userId, oldPassword, newPassword, confirmPassword);

  return res
    .status(200)
    .json(new ApiResponse(200, "Password updated successfully", {}));
};

//send email otp
export const sendEmailOtpController = async (req, res) => {
  const { error } = sendEmailOtpSchema.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const userId = req.user.id;
  const { email } = req.body;

  await sendEmailOtp(userId, email);

  return res
    .status(200)
    .json(new ApiResponse(200, "OTP sent successfully", {}));
};

//verify and change email
export const verifyChangeEmailController = async (req, res) => {
  const { error } = verifyChangeEmailSchema.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const userId = req.user.id;
  const { email, otp } = req.body;

  const user = await verifyChangeEmail(userId, email, otp);

  return res
    .status(200)
    .json(new ApiResponse(200, "Email updated successfully", user));
};

//change username
export const changeUsernameController = async (req, res) => {
  const { error } = changeUsernameSchema.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const userId = req.user.id;
  const { username } = req.body;

  const user = await changeUsername(userId, username);

  return res
    .status(200)
    .json(new ApiResponse(200, "Username updated successfully", user));
};
