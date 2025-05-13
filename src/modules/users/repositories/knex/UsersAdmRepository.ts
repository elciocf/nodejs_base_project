import { db } from "@configs/knex";
import { IUserAdmDTO } from "@modules/users/dtos/IUserAdmDTO";
import { UserAdm } from "@modules/users/entities/UserAdm";

import { IUsersAdmRepository, IList } from "../IUsersAdmRepository";

class UsersAdmRepository implements IUsersAdmRepository {
    async create(data: IUserAdmDTO): Promise<UserAdm> {
        const [created] = await db("usuarios_adm").insert(data).returning("*");
        return created;
    }

    async update(data: IUserAdmDTO): Promise<UserAdm> {
        const [updated] = await db("usuarios_adm")
            .where("cod_usuario_adm", data.cod_usuario_adm)
            .update(data)
            .returning("*");
        return updated;
    }

    async delete(cod_usuario_adm: number): Promise<void> {
        await db("usuarios_adm")
            .where("cod_usuario_adm", cod_usuario_adm)
            .del();
    }

    async findByEmail(email: string): Promise<UserAdm> {
        const user = await db("usuarios_adm").where("email", email).first();
        return user;
    }

    async findByLogin(login: string): Promise<UserAdm> {
        const user = await db("usuarios_adm").where("login", login).first();
        return user;
    }

    async getByPK(cod_usuario_adm: number): Promise<UserAdm> {
        const item = await db("usuarios_adm")
            .where("cod_usuario_adm", cod_usuario_adm)
            .first();
        return item;
    }

    async listAll(page: number, limit = 10, order = "asc"): Promise<IList> {
        const offset = (page - 1) * limit;

        const [countResult] = await db("usuarios_adm").count("* as count");
        const count = Number(countResult.count);

        const data = await db("usuarios_adm")
            .select("*")
            .orderBy("cod_usuario_adm", order)
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

export { UsersAdmRepository };
