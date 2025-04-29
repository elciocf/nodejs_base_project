import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IUserTypesRepository } from "@modules/users/repositories/IUserTypesRepository";
import { UsersRepository } from "@modules/users/repositories/knex/UsersRepository";
import { UserTypesRepository } from "@modules/users/repositories/knex/UserTypesRepository";
import { container } from "tsyringe";

import { IDateProvider } from "./providers/DateProvider/IDateProvider";
import { DayjsDateProvider } from "./providers/DateProvider/implementations/DayjsDateProvider";

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

// IDateProvider
container.registerSingleton<IDateProvider>("DateProvider", DayjsDateProvider);
