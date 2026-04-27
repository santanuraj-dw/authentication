import { User } from "../../models/User.model.js";
import ApiError from "../../utils/ApiError.js";


export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  const isMatch = await user.isPasswordCorrect(oldPassword);

  if (!isMatch) {
    throw new ApiError(400, "Old password is incorrect")
  }

  user.password = newPassword;

  await user.save();

  return true;
};