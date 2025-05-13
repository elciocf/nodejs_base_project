import { CreateUserController } from "@modules/users/useCases/users/createUser/CreateUserController";
import { ListAllUserController } from "@modules/users/useCases/users/listAllUser/ListAllUserController";
import { Router } from "express";

const usersRoutes = Router();

const listAllUserController = new ListAllUserController();

const createUserController = new CreateUserController();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 */
usersRoutes.get("/", listAllUserController.handle);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */
usersRoutes.post("/", createUserController.handle);

export { usersRoutes };
