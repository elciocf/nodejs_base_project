import { CreateUserController } from "@modules/users/useCases/users/createUser/CreateUserController";
import { Router } from "express";

import { isAdminAuthenticated } from "../middlewares/isAdminAuthenticated";

const adminRoutes = Router();

const createUserController = new CreateUserController();

adminRoutes.use(isAdminAuthenticated);
adminRoutes.post("/users", createUserController.handle);

export { adminRoutes };
