import { LoginUserController } from "@modules/users/useCases/users/login/LoginUserController";
import { LoginUserAdmController } from "@modules/users/useCases/users/loginUserAdm/LoginUserAdmController";
import { Router } from "express";

const signinRoutes = Router();

const loginUserController = new LoginUserController();
const loginUserAdmController = new LoginUserAdmController();

signinRoutes.post("/signin", loginUserController.handle);
signinRoutes.post("/admin/signin", loginUserAdmController.handle);

export { signinRoutes };
