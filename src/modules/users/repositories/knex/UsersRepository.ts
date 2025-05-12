import { db } from "@configs/knex";
import { IUserDTO } from "@modules/users/dtos/IUserDTO";
import { User } from "@modules/users/entities/User";

import { IUsersRepository, IList } from "../IUsersRepository";

class UsersRepository implements IUsersRepository {
    async create(data: IUserDTO): Promise<User> {
        const [createdUser] = await db("usuarios").insert(data).returning("*");
        return createdUser;
    }

    async update(data: IUserDTO): Promise<User> {
        const [updatedUser] = await db("usuarios")
            .where("cod_usuario", data.cod_usuario)
            .update(data)
            .returning("*");
        return updatedUser;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await db("usuarios").where("email", email).first();
        return user;
    }

    async findByLogin(login: string): Promise<User> {
        const user = await db("usuarios").where("login", login).first();
        return user;
    }

    async getByPK(cod: number): Promise<User> {
        const user = await db("usuarios").where("cod_usuario", cod).first();
        return user;
    }

    async listAll(page: number, limit = 10, order = "asc"): Promise<IList> {
        const offset = (page - 1) * limit;

        const [countResult] = await db("usuarios").count("* as count");
        const count = Number(countResult.count);

        const data = await db("usuarios")
            .select("*")
            .orderBy("cod_usuario", order)
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

    async delete(cod: number): Promise<void> {
        await db("usuarios").where("cod_usuario", cod).del();
    }

    async changeUserType(
        cod_tipo_usuario: number,
        cod_usuario: number
    ): Promise<User> {
        const [updatedUser] = await db("usuarios")
            .where("cod_usuario", cod_usuario)
            .update({ cod_tipo_usuario })
            .returning("*");
        return updatedUser;
    }
}

export { UsersRepository };
