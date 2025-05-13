import { Router } from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated";
import { adminRoutes } from "./admin.routes";
import { signinRoutes } from "./signin.routes";
import { usersRoutes } from "./users.routes";

const router = Router();

// unprotected routes
router.use(signinRoutes);

// admin routes
router.use("/admin", adminRoutes);

// protected routes
router.use(isAuthenticated);
router.use("/users", usersRoutes);

export { router };
