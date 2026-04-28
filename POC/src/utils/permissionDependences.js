import ApiError from "./ApiError.js";

export const validatePermissionDependencies = (permissions) => {
  const permissionNames = permissions.map((p) =>
    typeof p === "string" ? p : p.name,
  );

  const permissionSet = new Set(permissionNames);

  for (const perm of permissionNames) {
    const [resource, action] = perm.split(":");

    if (action !== "read") {
      const requiredRead = `${resource}:read`;

      if (!permissionSet.has(requiredRead)) {
        throw new ApiError(400, `${perm} requires ${requiredRead} permission`);
      }
    }
  }
};
