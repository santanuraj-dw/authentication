import { User } from "../../models/User.model.js";
import ApiError from "../../utils/ApiError.js";
import redis from "../../config/redis.js";
import { sendEmail } from "../../utils/sendMail.js";

export const changePassword = async (userId, oldPassword, newPassword, confirmPassword) => {
  if(newPassword !== confirmPassword){
    throw new ApiError(400, "Password and ConfirmPassword do not match")
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.isPasswordCorrect(oldPassword);

  if (!isMatch) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;

  await user.save();

  return true;
};

export const sendEmailOtp = async (userId, newEmail) => {
  console.log(":hwllo", userId)
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const existing = await User.findOne({ email: newEmail });
  if (existing) {
    throw new ApiError(400, "Email already in use");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(`email-change:otp:${userId}`, otp, "EX", 300);
  await redis.set(`email-change:email:${userId}`, newEmail, "EX", 300);

  console.log("OTP:", otp);
  await sendEmail(newEmail, otp);

  return true;
};

export const verifyChangeEmail = async (userId, newEmail, otp) => {
  const storedOtp = await redis.get(`email-change:otp:${userId}`);

  if (!storedOtp || !newEmail) {
    throw new ApiError(400, "OTP expired or not found");
  }

  if (storedOtp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.email = newEmail;
  await user.save();

  await redis.del(`email-change:otp:${userId}`);
  await redis.del(`email-change:email:${userId}`);

  return user;
};


export const changeUsername = async (userId, newUsername) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.username === newUsername) {
    throw new ApiError(400, "New username must be different");
  }

  const existing = await User.findOne({ username: newUsername });
  if (existing) {
    throw new ApiError(400, "Username already taken");
  }

  user.username = newUsername;
  await user.save();

  return user;
};
