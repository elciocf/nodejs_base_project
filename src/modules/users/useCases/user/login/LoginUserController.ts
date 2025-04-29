import { Response, Request } from "express";
import { container } from "tsyringe";

import { LoginUserUseCase } from "./LoginUserUseCase";

class LoginUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { email, senha } = request.body;

        const loginUserUseCase = container.resolve(LoginUserUseCase);

        const authenticateInfo = await loginUserUseCase.execute({
            email,
            senha,
        });

        return response.status(200).json(authenticateInfo);
    }
}

export { LoginUserController };
