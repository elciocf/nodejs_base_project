import { IRefreshTokenDTO } from "@modules/users/dtos/IRefreshTokenDTO";
import { RefreshToken } from "@modules/users/entities/RefreshToken";

interface IList {
    data: RefreshToken[];
    count: number;
    limit: number;
    page: number;
    totalPages: number;
}

interface IRefreshTokensRepository {
    create(data: IRefreshTokenDTO): Promise<RefreshToken>;
    update(data: IRefreshTokenDTO): Promise<RefreshToken>;
    delete(cod_token: number): Promise<void>;
    getByCodUser(cod_user: number): Promise<RefreshToken>;
    listAll(page: number, limit?: number, order?: string): Promise<IList>;
}

export { IRefreshTokensRepository, IList };
