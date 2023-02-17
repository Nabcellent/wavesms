import { CustomError } from './custom.err';

export class ValidationErr extends CustomError {
    statusCode = 422;

    constructor(public errors: any) {
        super("Invalid Request");

        Object.setPrototypeOf(this, ValidationErr.prototype)
    }

    serializeErrors(): { message: string }[] {
        return [{ message: this.errors }];
    }
}