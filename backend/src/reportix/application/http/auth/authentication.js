import { AuthenticationError, AuthorizationError } from '../errors.js';
import { verifyToken } from './jwt.js';

export const createBasicAuthenticator =
    ({ user, password }) =>
    (req, _res, next) => {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new AuthenticationError('Authorization header is missing!');
        }

        const base64auth = authorization.split(' ')[1] || '';
        const [actualUser, actualPassword] = Buffer.from(base64auth, 'base64')
            .toString()
            .split(':');

        if (actualUser !== user || actualPassword !== password) {
            throw new AuthenticationError('Invalid credentials');
        }

        next();
    };

export const createJwtAuthenticator =
    ({ roles }) =>
    (req, _res, next) => {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new AuthenticationError('Authorization header is missing!');
        }

        const token = authorization.split(' ')[1] || '';
        try {
            const { principle } = verifyToken(token);
            if (!roles?.map((r) => r.name).includes(principle.role.name)) {
                throw new AuthorizationError('Insufficient privileges');
            }
        } catch (e) {
            throw new AuthenticationError('Invalid token provided!');
        }
        next();
    };
