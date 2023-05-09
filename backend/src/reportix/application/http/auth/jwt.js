import jsonwebtoken from 'jsonwebtoken';
import { config } from '../../../config.js';
import { AuthenticationError } from '../errors.js';

export const createToken = (principle) =>
    jsonwebtoken.sign({ principle }, config.secretKey, { expiresIn: 120 });

export const verifyToken = (token) => {
    try {
        jsonwebtoken.verify(token, config.secretKey);
    } catch (err) {
        throw new AuthenticationError('Invalid or expired token');
    }
};
