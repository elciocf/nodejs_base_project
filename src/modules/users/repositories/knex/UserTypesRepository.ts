import { db } from "@configs/knex";
import { IUserTypeDTO } from "@modules/users/dtos/IUserTypeDTO";
import { UserType } from "@modules/users/entities/UserType";

import { IUserTypesRepository } from "../IUserTypesRepository";

class UserTypesRepository implements IUserTypesRepository {
    async create(data: IUserTypeDTO): Promise<UserType> {
        const [pk] = await db("tipos_usuario").insert(data);
        const createdUserType = await db("tipos_usuario")
            .where("cod_tipo_usuario", pk)
            .first();

        return createdUserType;
    }

    async update(data: IUserTypeDTO): Promise<UserType> {
        await db("tipos_usuario")
            .where("cod_tipo_usuario", data.cod_tipo_usuario)
            .update(data);
        const updatedUserType = await db("tipos_usuario")
            .where("cod_tipo_usuario", data.cod_tipo_usuario)
            .first();
        return updatedUserType;
    }

    async delete(cod: number, transfer?: number): Promise<void> {
        if (transfer) {
            // Transfer users to another user type before deletion
            await db("usuarios")
                .where("cod_tipo_usuario", cod)
                .update({ cod_tipo_usuario: transfer });
        }
        await db("tipos_usuario").where("cod_tipo_usuario", cod).del();
    }

    async getByPK(cod: number): Promise<UserType> {
        const userType = await db("tipos_usuario")
            .where("cod_tipo_usuario", cod)
            .first();
        return userType;
    }

    async listAll(): Promise<UserType[]> {
        const userTypes = await db("tipos_usuario").select("*");
        return userTypes;
    }

    async InUse(cod: number): Promise<boolean> {
        const count = await db("usuarios")
            .where("cod_tipo_usuario", cod)
            .count("* as count")
            .first();
        return Number(count?.count) > 0;
    }
}

export { UserTypesRepository };
