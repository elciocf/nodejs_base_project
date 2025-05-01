import { Response, Request } from "express";
import { container } from "tsyringe";

import { GetByPKUserUseCase } from "./GetByPKUserUseCase";

class GetByPKUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { coduser } = request.params;
        const cod_usuario = Number(coduser);

        const getByPKUserUseCase = container.resolve(GetByPKUserUseCase);

        const user = await getByPKUserUseCase.execute(cod_usuario);
        return response.status(200).json(user);
    }
}

export { GetByPKUserController };
