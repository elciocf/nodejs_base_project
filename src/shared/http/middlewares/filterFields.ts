import { Request, Response, NextFunction } from "express";
import mask = require("json-mask");

export function filterFields(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const fields =
        (req.headers["x-fields"] as string) || (req.query.fields as string);

    console.log("fields", fields);

    if (!fields) {
        return next();
    }

    // Guarda o método original
    const originalJson = res.json.bind(res);

    // Substitui o método res.json
    res.json = function jsonMaskedResponse(
        data: Record<string, unknown>
    ): Response {
        try {
            // check if response JSON has field data
            if (data.data) {
                console.log("data.data", data.data);
                // eslint-disable-next-line no-param-reassign
                data.data = mask(data.data, fields);
            } else {
                // eslint-disable-next-line no-param-reassign
                data = mask(data, fields);
            }

            console.log("maskedData", data);
            return originalJson(data);
        } catch (err) {
            console.error("Erro ao aplicar json-mask:", err);
            return originalJson(data);
        }
    };

    return next();
}
