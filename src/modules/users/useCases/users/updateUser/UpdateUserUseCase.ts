import { User } from "@modules/users/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

interface IRequest {
    cod_usuario: number;
    nome: string;
    login: string;
    senha: string;
    email: string;
    cod_tipo_usuario: number;
}

@injectable()
class UpdateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute(data: IRequest): Promise<User> {
        // check if has pk_field
        if (!data.cod_usuario) {
            throw new AppError("O código PK da User deve ser informado.");
        }

        // check if User exists
        const userExists = await this.usersRepository.getByPK(data.cod_usuario);

        if (!userExists) {
            throw new AppError("Código PK User informado, não foi econtrado.");
        }

        const newUser = await this.usersRepository.create(data);
        return newUser;
    }
}

export { UpdateUserUseCase };
