import { CreateUserController } from "@modules/users/useCases/users/createUser/CreateUserController";
import { Router } from "express";

const usersRoutes = Router();

const createUserController = new CreateUserController();

usersRoutes.post("/", createUserController.handle);

export { usersRoutes };
