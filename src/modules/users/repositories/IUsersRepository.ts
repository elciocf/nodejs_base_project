import { IUserDTO } from "@modules/users/dtos/IUserDTO";
import { User } from "@modules/users/entities/User";

interface IList {
    data: User[];
    count: number;
    limit: number;
    page: number;
    totalPages: number;
}

interface IUsersRepository {
    create(data: IUserDTO): Promise<User>;
    update(data: IUserDTO): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findByLogin(login: string): Promise<User>;
    getByPK(cod: number): Promise<User>;
    delete(cod: number): Promise<void>;
    listAll(page: number, limit?: number, order?: string): Promise<IList>;
    changeUserType(
        cod_tipo_usuario: number,
        cod_usuario: number
    ): Promise<User>;
}

export { IUsersRepository, IList };
