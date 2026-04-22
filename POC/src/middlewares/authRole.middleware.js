import ApiError from "../utils/ApiError.js";

const authorizeRoles = (...allowedRoles) => {
  return (req, _, next) => {
    if (!req.user || !req.user.roles) {
      throw new ApiError(401, "Unauthorized");
    }
    // console.log("role check",req.user.roles)
    const userRoles = req?.user?.roles?.map((r) => r);

    // console.log(userRoles); //["Admin"]
    // console.log(allowedRoles)

    const hasRole = userRoles.some((role) => allowedRoles.includes(role));
    // console.log(hasRole)
    if (!hasRole) {
      throw new ApiError(403, "Access denied");
    }
    // console.log("work well");
    next();
  };
};

export default authorizeRoles;
