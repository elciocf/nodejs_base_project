import { db } from "@configs/knex";
import { IRefreshTokenDTO } from "@modules/users/dtos/IRefreshTokenDTO";
import { RefreshToken } from "@modules/users/entities/RefreshToken";

import { IRefreshTokensRepository, IList } from "../IRefreshTokensRepository";

class RefreshTokensRepository implements IRefreshTokensRepository {
    async create(data: IRefreshTokenDTO): Promise<RefreshToken> {
        const [created] = await db("refresh_tokens")
            .insert(data)
            .returning("*");
        return created;
    }

    async update(data: IRefreshTokenDTO): Promise<RefreshToken> {
        const [updated] = await db("refresh_tokens")
            .where("cod_token", data.cod_token)
            .update(data)
            .returning("*");
        return updated;
    }

    async delete(cod_token: number): Promise<void> {
        await db("refresh_tokens").where("cod_token", cod_token).del();
    }

    async getByCodUser(cod_user: number): Promise<RefreshToken> {
        const item = await db("refresh_tokens")
            .where("cod_usuario", cod_user)
            .first();
        return item;
    }

    async listAll(page: number, limit = 10, order = "asc"): Promise<IList> {
        const offset = (page - 1) * limit;

        const [countResult] = await db("refresh_tokens").count("* as count");
        const count = Number(countResult.count);

        const data = await db("refresh_tokens")
            .select("*")
            .orderBy("cod_token", order)
            .limit(limit)
            .offset(offset);

        const totalPages = Math.ceil(count / limit);

        return {
            data,
            count,
            limit,
            page,
            totalPages,
        };
    }
}

export { RefreshTokensRepository };
