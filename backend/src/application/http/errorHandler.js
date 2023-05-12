import { ValidationError } from 'yup';
import IpFilter from 'express-ipfilter';

import { ApiError } from '../../domain/common/service/error.js';
import {
    AuthenticationError,
    AuthorizationError,
    UnknownOperation,
} from './errors.js';

export const errorHandler = (logger) => (error, req, res, _next) => {
    const msg = `Error during the rest route(${req.url}): ${error.message}`;

    if (error instanceof ValidationError) {
        logger.warn({ error, msg, stackTrace: error.stack });
        res.status(400).send(
            new ApiError({ message: error.message, statusCode: 400 })
        );
    } else if (error instanceof UnknownOperation) {
        logger.warn({ error, msg, stackTrace: error.stack });
        res.status(404).send(
            new ApiError({ message: error.message, statusCode: 404 })
        );
    } else if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError ||
        error instanceof IpFilter.IpDeniedError
    ) {
        logger.warn({ error, msg, stackTrace: error.stack });
        res.status(401).send(
            new ApiError({ message: error.message, statusCode: 401 })
        );
    } else {
        logger.error({ error, msg, stackTrace: error.stack });
        let errorObject = error;
        if (!(error instanceof ApiError)) {
            errorObject = new ApiError();
        }
        res.status(errorObject.getStatusCode()).send(errorObject);
    }
};
