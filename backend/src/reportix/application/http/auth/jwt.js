import jsonwebtoken from 'jsonwebtoken';
import { config } from '../../../config.js';

export const createToken = (principle) =>
    jsonwebtoken.sign({ principle }, config.secretKey, { expiresIn: 120 });

export const verifyToken = (token) =>
    jsonwebtoken.verify(token, config.secretKey);
