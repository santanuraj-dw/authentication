import mongoose from "mongoose";

import dotenv from "dotenv";
import { Permission } from "../models/Permission.model.js";
dotenv.config();

const PERMISSIONS = {
  SELECT_ALL: "select:all",

  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",

  PROJECT_READ: "project:read",
  PROJECT_CREATE: "project:create",
  PROJECT_UPDATE: "project:update",
  PROJECT_DELETE: "project:delete",

  ROLE_READ: "role:read",
  ROLE_CREATE: "role:create",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",

  PERMISSIONS_READ: "permissions:read",
};

const seedPermissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const permissions = Object.values(PERMISSIONS).map((perm) => {
      const [group] = perm.split(":");

      return {
        name: perm,
        group,
      };
    });

    for (const perm of permissions) {
      await Permission.updateOne(
        { name: perm.name },
        { $set: perm },
        { upsert: true },
      );
    }

    console.log("Permissions add successfully");
    process.exit();
  } catch (error) {
    console.error("Error permissions:", error);
    process.exit(1);
  }
};

seedPermissions();
