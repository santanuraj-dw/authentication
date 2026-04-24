export const groupPermissions = (permissions) => {
  const grouped = {};

  permissions.forEach((perm) => {
    const [module, action] = perm.split(":");

    if (!grouped[module]) {
      grouped[module] = [];
    }

    grouped[module].push(action);
  });

  return grouped;
};