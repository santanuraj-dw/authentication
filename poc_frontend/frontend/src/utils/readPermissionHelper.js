export const validatePermissions = (selectedPermissions, allPermissions) => {
  const selectedNames = selectedPermissions.map((id) => {
    const perm = allPermissions.find((p) => p._id === id);
    return perm?.name;
  });

  const errors = [];

  selectedNames.forEach((name) => {
    if (!name) return;

    const [resource, action] = name.split(":");

    if (action !== "read") {
      const requiredRead = `${resource}:read`;

      if (!selectedNames.includes(requiredRead)) {
        errors.push(`${name} requires ${requiredRead}`);
      }
    }
  });

  return errors;
};