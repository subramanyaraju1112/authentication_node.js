import { ApiError } from "./ApiError";

export class TooManyRequestsError extends ApiError {
    constructor(message = "Too many requests") {
        super(429, message);
    }
}