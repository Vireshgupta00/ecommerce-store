export class ErrorHandler extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 500) {
        super(message);
        // console.log('errorHandler called');
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }

    static create(message: string = 'Something went wrong!', statusCode = 500) {
        return new ErrorHandler(message, statusCode);
    }
}
