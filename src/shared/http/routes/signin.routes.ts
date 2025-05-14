import { LoginUserController } from "@modules/users/useCases/users/login/LoginUserController";
import { LoginUserAdmController } from "@modules/users/useCases/users/loginUserAdm/LoginUserAdmController";
import { RefreshTokenController } from "@modules/users/useCases/users/refreshToken/RefreshTokenController";
import { Router } from "express";

const signinRoutes = Router();

const loginUserController = new LoginUserController();
const loginUserAdmController = new LoginUserAdmController();
const refreshTokenController = new RefreshTokenController();

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

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: New token and refresh_token generated successfully
 */
signinRoutes.post("/refresh-token", refreshTokenController.handle);

signinRoutes.post("/admin/signin", loginUserAdmController.handle);

export { signinRoutes };
