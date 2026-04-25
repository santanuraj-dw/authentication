import mongoose from "mongoose";
import redis from "../../config/redis.js";
import { Role } from "../../models/Role.model.js";
import { User } from "../../models/User.model.js";
import ApiError from "../../utils/ApiError.js";
import { generateOTP } from "../../utils/GenerateOtp.js";
import { generateTokensAndSave } from "../../utils/jwt.js";
import { sendEmail } from "../../utils/sendMail.js";
import { resUser } from "../../utils/userRes.js";

//register
export const registerUserService = async (userData) => {
  const { username, email, password, confirmPassword } = userData;

  if (password !== confirmPassword) {
    throw new ApiError(400, "password do not match");
  }

  const existingUser = await User.findOne({
    email,
  });
  if (existingUser) {
    throw new ApiError(400, "Email already in use");
  }

  const defaultRole = await Role.findOne({ name: "user" });

  if (!defaultRole) {
    throw new ApiError(500, "Default role not found");
  }

  const otp = await generateOTP();
  await redis.set(`otp:${email}`, otp, "EX", 300);

  const user = await User.create({
    username,
    email,
    password,
    roles: [defaultRole._id],
  });

  // const { accessToken, refreshToken } = await generateTokensAndSave(user);

  // console.log("send otp");
  await sendEmail(email, otp);
  return {
    user: resUser(user),
  };
};

//verifyOtp
export const verifyOtp = async (data) => {
  const { email, otp } = data;
  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User not found");

  const storedOtp = await redis.get(`otp:${email}`);

  if (!storedOtp || storedOtp !== otp) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  user.isVerified = true;
  await user.save();
  await redis.del(`otp:${email}`);
};

//resend otp
export const resendOtp = async (data) => {
  const { email } = data;
  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User not found");

  if (user.isVerified) {
    throw new ApiError(400, "user already verified");
  }

  const otp = await generateOTP();
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await sendEmail(email, otp);
};

//login
export const loginUserService = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ email }).populate({
    path: "roles",
    select: "name permissions isActive",
    populate: {
      path: "permissions",
      select: "name isActive",
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid user");
  }
  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateTokensAndSave(user);

  return {
    user: resUser(user),
    accessToken,
    refreshToken,
  };
};

//forgot password
export const forgotPassword = async (data) => {
  const { email } = data;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const otp = await generateOTP();
  await redis.set(`resetOtp:${email}`, otp, "EX", 300);

  await sendEmail(email, otp);
};

//verify OTP
export const verifyRestOtp = async (data) => {
  const { email, otp } = data;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "Invalid email");

  const storedOtp = await redis.get(`resetOtp:${email}`);
  if (!storedOtp || storedOtp !== otp) {
    throw new ApiError(400, "Invalid or expired OTP");
  }
};

//reset password
export const resetPassword = async (data) => {
  const { email, otp, newPassword } = data;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "Invalid email");

  const storedOtp = await redis.get(`resetOtp:${email}`);

  if (!storedOtp || storedOtp !== otp) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  user.password = newPassword;
  await user.save();
  await redis.del(`resetOtp:${email}`);
};

//refresh token
export const refreshTokenService = async (userId, oldRefreshToken) => {
  const key = `refreshToken:${userId}`;
  const storedRefreshToken = await redis.get(key);

  if (!storedRefreshToken || storedRefreshToken !== oldRefreshToken) {
    const keys = await redis.keys(`refreshToken:${userId}`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(userId).populate({
    path: "roles",
    select: "name permissions isActive",
    populate: {
      path: "permissions",
      select: "name isActive",
    },
  });
  
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const { accessToken, refreshToken } = await generateTokensAndSave(user);

  return {
    accessToken,
    newRefreshToken: refreshToken,
  };
};

// change status
export const changeStatus = async (data) => {
  const { userId } = data;
  // console.log(userId);
  const user = await User.findById(userId)
    .select("-password")
    .populate("roles", "name");
  if (!user) throw new ApiError(404, "User not found");

  user.isActive = !user.isActive;
  await user.save();
  return user;
};

//change Role
export const changeRole = async ({ userId, roles }) => {
  const isValidIds = roles.every((id) => mongoose.Types.ObjectId.isValid(id));

  if (!isValidIds) {
    throw new ApiError(400, "Invalid role IDs");
  }

  const validRoles = await Role.find({ _id: { $in: roles } });

  if (validRoles.length !== roles.length) {
    throw new ApiError(400, "Invalid roles provided");
  }

  const roleNames = validRoles.map((r) => r.name.toLowerCase());

  if (roleNames.includes("admin")) {
    throw new ApiError(403, "You are not allowed to assign admin role");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { roles },
    { new: true, select: "-password" },
  ).populate("roles", "name");

  if (!user) throw new ApiError(404, "User not found");

  return user;
};

//get all users
export const getAllUser = async ({
  id,
  page,
  limit,
  search,
  sortBy,
  order,
}) => {
  const skip = (page - 1) * limit;

  const searchQuery = search
    ? {
        $or: [
          { username: { $regex: search, $options: "i" } },
          // { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const query = {
    _id: { $ne: id },
    ...searchQuery,
  };

  const sortOptions = {
    name: "username",
    status: "isActive",
    verified: "isVerified",
    createdAt: "createdAt",
  };

  const sortField = sortOptions[sortBy] || "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;

  const users = await User.find(query)
    .populate("roles", "name")
    .select("-password")
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getMe = async ({ id }) => {
  const user = await User.findById(id)
    .select("-password")
    .populate({
      path: "roles",
      select: "name permissions isActive",
      populate: {
        path: "permissions",
        select: "name isActive",
      },
    });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
