import { LoginUserController } from "@modules/users/useCases/users/login/LoginUserController";
import { LoginUserAdmController } from "@modules/users/useCases/users/loginUserAdm/LoginUserAdmController";
import { Router } from "express";

const signinRoutes = Router();

const loginUserController = new LoginUserController();
const loginUserAdmController = new LoginUserAdmController();

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
signinRoutes.post("/signin", loginUserController.handle);

signinRoutes.post("/admin/signin", loginUserAdmController.handle);

export { signinRoutes };
