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

    const activeRoles = roles.filter((r) => r.isActive);

    if (activeRoles.length === 0) {
      throw new ApiError(403, "All roles are inactive");
    }

    const userPermissions = activeRoles.flatMap((r) =>
      (r.permissions || [])
        .filter((p) => {
          if (typeof p === "string") return true; 
          return p?.isActive;
        })
        .map((p) => (typeof p === "string" ? p : p.name))
    );

    const uniquePermissions = [...new Set(userPermissions)];

    if (uniquePermissions.includes("select:all")) {
      return next();
    }

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
