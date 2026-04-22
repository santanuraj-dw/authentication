import { PERMISSIONS } from "../constants/permissions";
import ApiError from "../utils/ApiError";

const authorizePermissions = (...requiredPermissions) => {
  return (req, _, next) => {
    const userPermissions = req.user.roles.flatMap((r) => r.permissions);

    if (userPermissions.includes(PERMISSIONS.ALL)) {
      return next();
    }
    const hasPermission = requiredPermissions.every((p) =>
      userPermissions.includes(p),
    );

    if (!hasPermission) {
      throw new ApiError(403, "Access denied");
    }

    next();
  };
};

export default authorizePermissions;
