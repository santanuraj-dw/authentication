export const getDefaultRoute = (user) => {
  if (hasPermission(user, [PERMISSIONS.USER_READ])) return "/users";
  if (hasPermission(user, [PERMISSIONS.ROLE_READ])) return "/roles";
  if (hasPermission(user, [PERMISSIONS.PERMISSIONS_READ])) return "/permissions";

  return "/";
};