import { PERMISSIONS } from "../constants/permissions";

//check role active or not
export const getActiveRoles = (user) => {
  return user?.roles?.filter((r) => r.isActive) || [];
};

//check role name
export const hasRole = (user, roleName) => {
  const roles = getActiveRoles(user);
  return roles.some((r) => r.name === roleName);
};

//check user have permissions or not
export const hasAnyPermission = (user) => {
  const roles = getActiveRoles(user);

  const permissions = roles.flatMap((r) =>
    (r.permissions || []).map((p) => (typeof p === "string" ? p : p.name)),
  );

  return permissions.length > 0;
};

// check permission
export const hasPermission = (user, requiredPermissions = []) => {
  const roles = getActiveRoles(user);

  const permissions = roles.flatMap((r) =>
    (r.permissions || [])
      .filter((p) => {
        if (typeof p === "string") return true;
        return p?.isActive;
      })
      .map((p) => (typeof p === "string" ? p : p.name)),
  );

  const uniquePermissions = [...new Set(permissions)];

  if (uniquePermissions.includes(PERMISSIONS.SELECT_ALL)) return true;

  return requiredPermissions.every((p) => uniquePermissions.includes(p));
};
