import { CustomError } from "./custom.err";

export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor(message:string = 'Not Found!') {
        super(message);

        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    serializeErrors(): { message: string; field?: string }[] {
        return [{ message: 'Not found.' }];
    }
}