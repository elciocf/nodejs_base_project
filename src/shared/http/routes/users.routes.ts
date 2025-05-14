import { storage } from "@configs/uploadAvatar";
import { CreateUserController } from "@modules/users/useCases/users/createUser/CreateUserController";
import { ListAllUserController } from "@modules/users/useCases/users/listAllUser/ListAllUserController";
import { UpdateUserAvatarController } from "@modules/users/useCases/users/updateUserAvatar/UpdateUserAvatarController";
import { Router } from "express";
import multer from "multer";

const usersRoutes = Router();

const uploadAvatar = multer({ storage });

const listAllUserController = new ListAllUserController();

const createUserController = new CreateUserController();

const updateUserAvatarController = new UpdateUserAvatarController();

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

/**
 * @swagger
 * /avatar:
 *   post:
 *     summary: Upload user avatar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 */
usersRoutes.post(
    "/:coduser/avatar",
    uploadAvatar.single("avatar"),
    updateUserAvatarController.handle
);

export { usersRoutes };
