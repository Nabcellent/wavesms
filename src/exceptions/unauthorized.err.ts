import { CustomError } from "./custom.err";

export class UnauthorizedErr extends CustomError {
    statusCode = 401;

    constructor(message: string = 'Unauthorized!') {
        super(message);

        Object.setPrototypeOf(this, UnauthorizedErr.prototype)
    }

    serializeErrors(): { message: string; field?: string }[] {
        return [{ message: this.message }];
    }
}