
import { changePassword } from "./user.service.js";
import { changePasswordSchema } from "./user.validation.js";

export const changePasswordController = async (req, res) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    await changePassword(userId, oldPassword, newPassword);

    return res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
};