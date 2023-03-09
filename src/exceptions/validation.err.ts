import { CustomError } from './custom.err';

export class ValidationErr extends CustomError {
    statusCode = 422;

    constructor(public message: string = "Invalid Request") {
        super(message);

        Object.setPrototypeOf(this, ValidationErr.prototype)
    }

    serializeErrors(): { message: string }[] {
        return [{ message: this.message }];
    }
}