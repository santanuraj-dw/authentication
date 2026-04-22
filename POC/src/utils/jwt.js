import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import ApiError from "./ApiError.js";
import redis from "../config/redis.js";

//token generation
export const generateTokensAndSave = async (user) => {
  const roles = user.roles.map(r=>({name: r.name, permissions: r.permissions, isActive: r.isActive}));
  console.log("jwt",roles)
  const expiryInSeconds = 7 * 24 * 60 * 60;
  if (!user) {
    throw new ApiError(400, "User data is required for token generation");
  }
  const accessToken = jwt.sign(
    { id: user._id, username: user.username, roles },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
  const refreshToken = jwt.sign(
    { id: user._id, roles },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate tokens");
  }

  const redisKey = `refreshToken:${user._id}`;
  await redis.set(redisKey, refreshToken, "EX", expiryInSeconds);

  return { accessToken, refreshToken };
};

//token decode
export const decodedToken = (token, type) => {
  // console.log("here",process.env.JWT_ACCESS_SECRET)
  try {
    const decoded = jwt.verify(
      token,
      type === "access"
        ? process.env.JWT_ACCESS_SECRET
        : process.env.JWT_REFRESH_SECRET,
    );
    // console.log(decoded);
    return decoded;
  } catch (error) {
    // console.log(error)
    throw new ApiError(401, "Invalid token");
  }
};
