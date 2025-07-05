export class ErrorService extends Error {
    status;
    error;

    constructor(status, message, errors = []) {
        super(message)
        this.status = status;
        this.errors = errors;
    }

    static BadRequestError(message = 'Bad Request', errors = []) {
        return new ErrorService(400, message, errors)
    }

    static UnauthorizedError(message = 'User unauthorized') {
        return new ErrorService(401, message)
    }
    static NotFoundErrorCreator(message = "Resource not found", errors = []) {
        return new ErrorService(404, message, errors);
    }
}