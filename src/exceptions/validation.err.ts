import { CustomError } from './custom.err';

export class ValidationErr extends CustomError {
    statusCode = 422;

    constructor(message:string) {
        super(message);

        Object.setPrototypeOf(this, ValidationErr.prototype)
    }

    serializeErrors(): { message: string; field?: string }[] {
        return [{message: this.message}];
    }
}