import { Response, Request } from "express";
import { container } from "tsyringe";

import { UpdateUserAvatarUseCase } from "./UpdateUserAvatarUseCase";

class UpdateUserAvatarController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { coduser } = request.params;
        const avatar = request.file.filename;

        const cod_usuario = Number(coduser);

        const updateUserUseCase = container.resolve(UpdateUserAvatarUseCase);

        const user = await updateUserUseCase.execute({
            avatar,
            email: request.user.email,
            login: request.user.login,
            nome: request.user.nome,
            cod_usuario,
        });
        return response.status(201).json(user);
    }
}

export { UpdateUserAvatarController };
