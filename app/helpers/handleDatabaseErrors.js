import Logger from '../services/Logger.js';
import { ErrorService } from '../services/error-service.js';
import { Prisma } from '@prisma/client';

export const handleDatabaseError = (error, context = {}) => {
    Logger.error(error.message, {
        ...context,
        errorType: error.constructor.name,
        stack: error.stack
    });

    if (error instanceof ErrorService) {
        throw error;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        throw ErrorService.BadRequestError('Invalid input format');
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        Logger.warn('Prisma known error', {
            code: error.code,
            meta: error.meta,
            ...context
        });

        switch (error.code) {
            case 'P2002':
                throw ErrorService.ConflictError('Duplicate record');
            case 'P2003':
                throw ErrorService.BadRequestError('Foreign key constraint failed');
            case 'P2025':
                throw ErrorService.NotFoundError('Record not found');
            case 'P2014':
                throw ErrorService.BadRequestError('Required relation missing');
            default:
                throw ErrorService.DatabaseError(`Database Error: ${error.code}`);
        }
    }

    Logger.error('Unexpected error occurred', {
        ...context,
        errorMessage: error.message,
        errorStack: error.stack
    });

    throw ErrorService.InternalServerError('Unexpected error occurred');
};
