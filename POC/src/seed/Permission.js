import mongoose from "mongoose";

import dotenv from "dotenv";
import { Permission } from "../models/Permission.model.js";

dotenv.config();

const PERMISSIONS = {
  PERMISSIONS_UPDATE: "permissions:update",
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
