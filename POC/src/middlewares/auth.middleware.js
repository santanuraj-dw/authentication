import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { decodedToken } from "../utils/jwt.js";

export const verifyJWT = (req, _, next) => {
  const token = req.cookies.accessToken;
  // console.log("Access token", token);
  
  if (!token) throw new ApiError(401, "Access token missing");
  try {
    const decoded = decodedToken(token, "access");
    // console.log("Decoded JWT", decoded);
    req.user = decoded;
    next();
  } catch {
    // console.log(error)
    throw new ApiError(401, "Invalid or expired token");
  }
};
