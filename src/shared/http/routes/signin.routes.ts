import { LoginUserController } from "@modules/users/useCases/user/login/LoginUserController";
import { Router } from "express";

const signinRoutes = Router();

const loginUserController = new LoginUserController();

signinRoutes.post("/signin", loginUserController.handle);

export { signinRoutes };
