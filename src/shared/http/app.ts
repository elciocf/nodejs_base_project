import "reflect-metadata";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";

import { AppError } from "../errors/AppError";
import { router } from "./routes";

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(express.text());
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.enable("trust proxy");
app.use(cors());

app.use(router);

app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            return response.status(err.statusCode).json(err.message);
        }

        return response.status(500).json({
            status: "error",
            message: `Internal server error - ${err.message}`,
        });
    }
);

export { app };
