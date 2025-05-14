import { Response, Request } from "express";
import { container } from "tsyringe";

import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

class RefreshTokenController {
    async handle(request: Request, response: Response): Promise<Response> {
        const refresh_token =
            request.body.refresh_token ||
            request.headers["x-refresh-token"] ||
            request.query.refresh_token;

        const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

        const newToken = await refreshTokenUseCase.execute(refresh_token);

        return response.json(newToken);
    }
}

export { RefreshTokenController };
