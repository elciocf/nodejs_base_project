import auth from "@configs/auth";
import { UsersAdmRepository } from "@modules/users/repositories/knex/UsersAdmRepository";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "@shared/errors/AppError";

interface IPayload {
    sub: string;
}

export async function isAdminAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token missing", 401);
    }

    let token;
    const header = authHeader.split(" ");
    if (header[1]) {
        [, token] = header;
    } else {
        token = authHeader;
    }

    try {
        const { sub } = verify(token, auth.secret_token) as IPayload;

        const cod_usuario = Number(sub);

        const usersRepository = new UsersAdmRepository();
        const user = await usersRepository.getByPK(cod_usuario);

        if (!user) {
            throw new AppError("Usuário não existe!", 401);
        }

        request.userAdm = {
            nome: user.nome,
            cod_usuario_adm: user.cod_usuario_adm,
        };

        next();
    } catch {
        throw new AppError("Token inválido", 401);
    }
}
