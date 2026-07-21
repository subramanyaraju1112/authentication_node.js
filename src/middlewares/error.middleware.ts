import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";

const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    if (error instanceof ApiError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });

        return;
    }

    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};

export default errorMiddleware;