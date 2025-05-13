import { Response, Request } from "express";
import { container } from "tsyringe";

import { LoginUserAdmUseCase } from "./LoginUserAdmUseCase";

class LoginUserAdmController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { email, senha } = request.body;

        const loginUserAdmUseCase = container.resolve(LoginUserAdmUseCase);

        const authenticateInfo = await loginUserAdmUseCase.execute({
            email,
            senha,
        });

        return response.status(200).json(authenticateInfo);
    }
}

export { LoginUserAdmController };
