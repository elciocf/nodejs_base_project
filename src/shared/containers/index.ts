import { container } from "tsyringe";

import { IDateProvider } from "./providers/DateProvider/IDateProvider";
import { DayjsDateProvider } from "./providers/DateProvider/implementations/DayjsDateProvider";

import "./users.containers";
// End of imports - used by CLI Generate Entity

// IDateProvider
container.registerSingleton<IDateProvider>("DateProvider", DayjsDateProvider);
