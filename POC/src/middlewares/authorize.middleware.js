import ApiError from "../utils/ApiError.js";

const authorize = (requiredPermissions = []) => {
  return (req, _, next) => {
    if (!req.user || !req.user.roles) {
      throw new ApiError(401, "Unauthorized");
    }

    const roles = req.user.roles.map((r) =>
      typeof r === "string"
        ? { name: r, permissions: [], isActive: true }
        : r
    );

    // console.log("roles", roles)

    const activeRoles = roles.filter((r) => r.isActive);
    // console.log("activeRoles", activeRoles)

    if (activeRoles.length === 0) {
      throw new ApiError(403, "All roles are inactive");
    }

    const isAdmin = activeRoles.some((r) => r.name === "admin");
    // console.log("isAdmin", isAdmin)
    if (isAdmin) {
      return next();
    }

    const userPermissions = activeRoles.flatMap(
      (r) => r.permissions || []
    );
    
    // console.log("userPermissions", userPermissions)

    const uniquePermissions = [...new Set(userPermissions)];

    if (requiredPermissions.length === 0) {
      return next();
    }

    const hasPermission = requiredPermissions.every((perm) =>
      uniquePermissions.includes(perm)
    );

    if (!hasPermission) {
      throw new ApiError(403, "Permission denied");
    }

    next();
  };
};

export default authorize;