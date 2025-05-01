import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

interface IRequest {
    cod_usuario?: number;
}

@injectable()
class GetByPKUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({ cod_usuario }: IRequest): Promise<User> {
        // check if has pk_field
        if (!cod_usuario) {
            throw new AppError("O código PK da User deve ser informado.");
        }

        const User = await this.usersRepository.getByPK(cod_usuario);
        return User;
    }
}

export { GetByPKUserUseCase };
