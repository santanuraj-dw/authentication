import ApiError from "../utils/ApiError.js";

const authorizeRoles = (...allowedRoles) => {
  return (req, _, next) => {
    const user = req.user;
    // console.log(user)
    if (!user || !allowedRoles.includes(user.role)) {
      throw new ApiError(403, "Access denied");
    }

    next();
  };
};

export default authorizeRoles;