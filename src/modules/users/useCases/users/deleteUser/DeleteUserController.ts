import { Response, Request } from "express";
import { container } from "tsyringe";

import { DeleteUserUseCase } from "./DeleteUserUseCase";

class DeleteUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { coduser } = request.params;
        const cod_usuario = Number(coduser);

        const deleteUserUseCase = container.resolve(DeleteUserUseCase);

        await deleteUserUseCase.execute({ cod_usuario });
        return response.status(201).send();
    }
}

export { DeleteUserController };
