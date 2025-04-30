import { User } from "@modules/users/entities/Users";
import { IUserRepository } from "@modules/users/repositories/IUsersRepository";
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
        private userRepository: IUsersRepository
    ) {}

    async execute(data: IRequest): Promise<User> {
        const newUser = await this.userRepository.create(data);
        return newUser;
    }
}

export { CreateUserUseCase };
