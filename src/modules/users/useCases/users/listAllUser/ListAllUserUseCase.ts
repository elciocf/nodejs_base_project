import { User } from "@modules/users/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
    page: number;
    limit: number;
    order: string;
}

interface IList {
    data: User[];
    count: number;
    limit: number;
    page: number;
    totalPages: number;
}

@injectable()
class ListAllUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({ page, limit, order }: IRequest): Promise<IList> {
        const list = await this.usersRepository.listAll(page, limit, order);
        return list;
    }
}

export { ListAllUserUseCase };
