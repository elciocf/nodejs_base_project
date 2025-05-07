import { IRefreshTokensRepository } from "@modules/users/repositories/IRefreshTokensRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IUserTypesRepository } from "@modules/users/repositories/IUserTypesRepository";
import { RefreshTokensRepository } from "@modules/users/repositories/knex/RefreshTokensRepository";
import { UsersRepository } from "@modules/users/repositories/knex/UsersRepository";
import { UserTypesRepository } from "@modules/users/repositories/knex/UserTypesRepository";
import { container } from "tsyringe";

// IUsersRepository
container.registerSingleton<IUsersRepository>(
    "UsersRepository",
    UsersRepository
);

// IUserTypesRepository
container.registerSingleton<IUserTypesRepository>(
    "UserTypesRepository",
    UserTypesRepository
);

// IRefreshTokensRepository
container.registerSingleton<IRefreshTokensRepository>(
    "RefreshTokensRepository",
    RefreshTokensRepository
);
// EOF - used by CLI Generate Entity
