import { User } from "@modules/users/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
    cod_usuario?: number;
    nome: string;
    login: string;
    senha: string;
    email: string;
    cod_tipo_usuario: number;
}

@injectable()
class CreateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute(data: IRequest): Promise<User> {
        const newUser = await this.usersRepository.create(data);
        return newUser;
    }
}

export { CreateUserUseCase };
