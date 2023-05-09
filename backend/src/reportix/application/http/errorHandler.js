import { ValidationError } from 'yup';
import IpFilter from 'express-ipfilter';

import { ApiError } from '../../domain/common/service/error.js';
import {
    AuthenticationError,
    AuthorizationError,
    UnknownOperation,
} from './errors.js';

export const errorHandler = (logger) => (error, _req, res, _next) => {
    const msg = `Error during the rest route: ${error.message}`;
    console.log(error);
    if (error instanceof ValidationError) {
        logger.warn({ error, msg });
        res.status(400).send(new ApiError(error.message, 400));
    } else if (error instanceof UnknownOperation) {
        logger.warn({ error, msg });
        res.status(404).send(new ApiError(error.message, 404));
    } else if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError ||
        error instanceof IpFilter.IpDeniedError
    ) {
        logger.warn({ error, msg });
        res.status(401).send(new ApiError(error.message, 401));
    } else {
        logger.error({ error, msg });
        let errorObject = error;
        if (!(error instanceof ApiError)) {
            errorObject = new ApiError(error.message);
        }
        res.status(500).send(errorObject);
    }
};
