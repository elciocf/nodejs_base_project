import { Response, Request } from "express";
import { container } from "tsyringe";

import { ListAllUserUseCase } from "./ListAllUserUseCase";

class ListAllUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const page = (
            Number.isNaN(Number(request.query.page))
                ? 1
                : Number(request.query.page)
        ) as number;
        const limit = (
            Number.isNaN(Number(request.query.limit))
                ? 30
                : Number(request.query.limit)
        ) as number;
        const order = (request.query.order || "asc") as string;

        const listAllUserUseCase = container.resolve(ListAllUserUseCase);

        const list = await listAllUserUseCase.execute({ page, limit, order });
        return response.status(200).json(list);
    }
}

export { ListAllUserController };
