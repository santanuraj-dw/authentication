import mongoose from "mongoose";
const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    group: { 
      type: String, 
      required: true, 
      lowercase: true, 
      trim: true 
    },

    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true },
);

export const Permission = mongoose.model("Permission", permissionSchema);
