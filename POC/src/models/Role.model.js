import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
    },

    permissions: {
      type: [String],
      default: [],
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Role = mongoose.model("Role", roleSchema);
