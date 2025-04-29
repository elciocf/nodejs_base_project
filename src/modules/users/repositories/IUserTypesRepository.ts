import { IUserTypeDTO } from "@modules/users/dtos/IUserTypeDTO";
import { UserType } from "@modules/users/entities/UserType";

interface IList {
    data: UserType[];
    count: number;
    limit: number;
    page: number;
    totalPages: number;
}

interface IUserTypesRepository {
    create(data: IUserTypeDTO): Promise<UserType>;
    update(data: IUserTypeDTO): Promise<UserType>;
    delete(cod: number, transfer?: number): Promise<void>;
    getByCod(cod: number): Promise<UserType>;
    listAll(): Promise<UserType[]>;
    InUse(cod: number): Promise<boolean>;
}

export { IUserTypesRepository, IList };
