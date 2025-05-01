import { Response, Request } from "express";
import { container } from "tsyringe";

import { UpdateUserUseCase } from "./UpdateUserUseCase";

class UpdateUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const data = request.body;
        const { coduser } = request.params;
        data.cod_usuario = Number(coduser);

        const updateUserUseCase = container.resolve(UpdateUserUseCase);

        const user = await updateUserUseCase.execute(data);
        return response.status(201).json(user);
    }
}

export { UpdateUserController };
