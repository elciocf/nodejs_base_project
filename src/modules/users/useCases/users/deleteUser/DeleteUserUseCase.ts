import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

interface IRequest {
    cod_usuario?: number;
}

@injectable()
class DeleteUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({ cod_usuario }: IRequest): Promise<void> {
        // check if has pk_field
        if (!data.cod_usuario) {
            throw new AppError("O código PK da User deve ser informado.");
        }

        // check if User exists
        const userExists = await this.usersRepository.getByPK(data.cod_usuario);

        if (!userExists) {
            throw new AppError("Código PK User informado, não foi econtrado.");
        }

        await this.usersRepository.delete(cod_usuario);
    }
}

export { DeleteUserUseCase };
