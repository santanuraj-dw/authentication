import { Router } from "express";
import authRouter from "../modules/auth/auth.route.js";
import roleRouter from "../modules/role/role.route.js";
import permissionRouter from "../modules/permission/permission.route.js";
import userRouter from "../modules/user/user.route.js"

const router = Router();

router.use("/auth", authRouter);
router.use("/roles", roleRouter);
router.use("/permissions", permissionRouter);
router.use("/user", userRouter);

export default router;
