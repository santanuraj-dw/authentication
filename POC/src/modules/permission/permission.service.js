import { Permission } from "../../models/Permission.model.js";
import ApiError from "../../utils/ApiError.js";


// get all permissions
export const getAllPermissionsService = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const filter = {
    name: { $regex: search, $options: "i" },
  };

  const skip = (page - 1) * limit;

  const permissions = await Permission.find(filter)
    .sort({ [sortBy]: order === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Permission.countDocuments(filter);

  return {
    data: permissions,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};


// update permissions
export const updatePermissionService = async (id, body) => {
  const { name, group } = body;

  const exists = await Permission.findOne({ name });

  if (exists && exists._id.toString() !== id) {
    throw new ApiError("Permission already exists");
  }

  const updated = await Permission.findByIdAndUpdate(
    id,
    { name, group },
    { new: true },
  );

  if (!updated) {
    throw new ApiError("Permission not found");
  }

  return updated;
};


//change permissions status
export const changePermissionStatusService = async (id) => {
  const permission = await Permission.findById(id);

  if (!permission) {
    throw new ApiError("Permission not found");
  }

  permission.isActive = !permission.isActive;
  await permission.save();

  return permission;
};
