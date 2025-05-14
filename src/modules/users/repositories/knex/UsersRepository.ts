import { db } from "@configs/knex";
import { IUserDTO } from "@modules/users/dtos/IUserDTO";
import { User } from "@modules/users/entities/User";

import { IUsersRepository, IList } from "../IUsersRepository";

class UsersRepository implements IUsersRepository {
    async create(data: IUserDTO): Promise<User> {
        const [pk] = await db("usuarios").insert(data).returning("*");
        const createdUser = await db("usuarios")
            .where("cod_usuario", pk)
            .first();
        return createdUser;
    }

    async update(data: IUserDTO): Promise<User> {
        await db("usuarios")
            .where("cod_usuario", data.cod_usuario)
            .update(data)
            .returning("*");
        const updatedUser = await db("usuarios")
            .where("cod_usuario", data.cod_usuario)
            .first();
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
        // remove password from user object
        if (user) {
            delete user.senha;
        }
        return user;
    }

    async listAll(page: number, limit = 10, order = "asc"): Promise<IList> {
        const offset = (page - 1) * limit;

        const [countResult] = await db("usuarios").count("* as count");
        const count = Number(countResult.count);

        const rawData = await db("usuarios")
            .select("*")
            .orderBy("cod_usuario", order)
            .limit(limit)
            .offset(offset);

        // remove senha from users objects
        const data = rawData.map((user) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { senha, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

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
