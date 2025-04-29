import { Router } from "express";

import { signinRoutes } from "./signin.routes";
import { usersRoutes } from "./users.routes";

const router = Router();

router.use(signinRoutes);
router.use("/users", usersRoutes);

export { router };
