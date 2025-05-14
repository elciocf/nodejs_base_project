import auth from "@configs/auth";
import { IRefreshTokensRepository } from "@modules/users/repositories/IRefreshTokensRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
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
        cod_usuario: number;
        cod_tipo_usuario: number;
    };
}

@injectable()
class LoginUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("RefreshTokensRepository")
        private refreshTokensRepository: IRefreshTokensRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute({ email, senha }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("E-mail ou Senha incorretos!", 401);
        }

        // senha correta
        const passwordMatch = await compare(senha, user.senha);

        if (!passwordMatch) {
            throw new AppError("E-mail ou Senha incorretos!", 401);
        }

        // TO DO - check if user is active

        // TO DO - generate and return refresh token
        const userRefreshToken =
            await this.refreshTokensRepository.getByCodUser(user.cod_usuario);

        if (userRefreshToken) {
            await this.refreshTokensRepository.delete(
                userRefreshToken.cod_token
            );
        }

        // gerar jsonwebtoken
        const token = sign({}, auth.secret_token, {
            subject: `${user.cod_usuario}`,
            expiresIn: auth.expires_in_token,
        });

        // gerar refresh token
        const refresh_token = sign({ email }, auth.secret_refresh_token, {
            subject: `${user.cod_usuario}`,
            expiresIn: auth.expires_in_refresh_token,
        });

        const expires_in = this.dateProvider.addDays(
            auth.expires_refresh_token_days
        );

        await this.refreshTokensRepository.create({
            cod_usuario: user.cod_usuario,
            refresh_token,
            expira_em: expires_in,
        });

        return {
            token,
            expiresInMinutes: auth.expires_in_token_minutes,
            user: {
                nome: user.nome,
                cod_usuario: user.cod_usuario,
                cod_tipo_usuario: user.cod_tipo_usuario,
            },
        };
    }
}

export { LoginUserUseCase };
