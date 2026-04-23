//check role active or not
export const getActiveRoles = (user) => {
  return user?.roles?.filter((r) => r.isActive) || [];
};

//check role name
export const hasRole = (user, roleName) => {
  const roles = getActiveRoles(user);
  return roles.some((r) => r.name === roleName);
};

// check permission
export const hasPermission = (user, requiredPermissions = []) => {
  const roles = getActiveRoles(user);

  if (roles.some((r) => r.name === "admin")) return true;

  const permissions = roles.flatMap((r) => r.permissions || []);
  const uniquePermissions = [...new Set(permissions)];

  return requiredPermissions.every((p) => uniquePermissions.includes(p));
};
