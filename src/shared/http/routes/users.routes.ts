import { CreateUserController } from "@modules/users/useCases/users/createUser/CreateUserController";
import { ListAllUserController } from "@modules/users/useCases/users/listAllUser/ListAllUserController";
import { Router } from "express";

const usersRoutes = Router();

const listAllUserController = new ListAllUserController();

const createUserController = new CreateUserController();

usersRoutes.post("/", createUserController.handle);
usersRoutes.get("/", listAllUserController.handle);

export { usersRoutes };
