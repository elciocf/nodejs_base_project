import { IUserAdmDTO } from "@modules/users/dtos/IUserAdmDTO";
import { UserAdm } from "@modules/users/entities/UserAdm";

interface IList {
    data: UserAdm[];
    count: number;
    limit: number;
    page: number;
    totalPages: number;
}

interface IUsersAdmRepository {
    create(data: IUserAdmDTO): Promise<UserAdm>;
    update(data: IUserAdmDTO): Promise<UserAdm>;
    delete(cod_usuario_adm: number): Promise<void>;
    getByPK(cod_usuario_adm: number): Promise<UserAdm>;
    listAll(page: number, limit?: number, order?: string): Promise<IList>;
}

export { IUsersAdmRepository, IList };
