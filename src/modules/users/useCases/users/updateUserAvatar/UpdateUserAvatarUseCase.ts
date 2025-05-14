import { User } from "@modules/users/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

interface IRequest {
    nome: string;
    login: string;
    email: string;
    cod_usuario: number;
    avatar?: string;
}

@injectable()
class UpdateUserAvatarUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({
        nome,
        login,
        email,
        cod_usuario,
        avatar = "",
    }: IRequest): Promise<User> {
        const userExists = await this.usersRepository.getByPK(cod_usuario);

        if (!userExists) {
            throw new AppError("Usuário não localizado.", 400);
        }

        const user = await this.usersRepository.update({
            nome,
            login,
            email,
            cod_usuario,
            avatar,
        });
        return user;
    }
}

export { UpdateUserAvatarUseCase };
