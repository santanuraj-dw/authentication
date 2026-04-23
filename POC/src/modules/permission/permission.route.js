import { Router } from "express";
import authorize from "../../middlewares/authorize.middleware";

const router = Router();

router.post("/", verifyJWT, authorize("permission_create"), createPermission);
router.get("/", verifyJWT, authorize("permission_read"), getPermissions);
router.patch(
  "/:id",
  verifyJWT,
  authorize("permission_update"),
  updatePermission,
);
router.patch(
  "/status/:id",
  verifyJWT,
  authorize("permission_update"),
  togglePermissionStatus,
);

export default router;
