import auth from "@configs/auth";
import { IUsersAdmRepository } from "@modules/users/repositories/IUsersAdmRepository";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IDateProvider } from "@shared/containers/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    email: string;
    senha: string;
}

interface IResponse {
    token: string;
    expiresInMinutes: number;
    user: {
        nome: string;
        cod_usuario_adm: number;
    };
}

@injectable()
class LoginUserAdmUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersAdmRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute({ email, senha }: IRequest): Promise<IResponse> {
        // usuario existe
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("E-mail ou Senha incorretos!", 401);
        }

        // senha correta
        const passwordMatch = await compare(senha, user.senha);

        if (!passwordMatch) {
            throw new AppError("E-mail ou Senha incorretos!", 401);
        }

        // TO DO - generate and return refresh token

        // gerar jsonwebtoken
        const token = sign({}, auth.secret_token, {
            subject: `${user.cod_usuario_adm}`,
            expiresIn: auth.expires_in_token,
        });

        return {
            token,
            expiresInMinutes: auth.expires_in_token_minutes,
            user: {
                nome: user.nome,
                cod_usuario_adm: user.cod_usuario_adm,
            },
        };
    }
}

export { LoginUserAdmUseCase };
