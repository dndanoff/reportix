import express from 'express';
import asyncHandler from 'express-async-handler';
import {
    handleGetContentLinkById,
    handleGetRelatedContentLinks,
    handleLogin,
} from './publicHandlers.js';
import { config } from '../../../config.js';
import { corsConfig } from '../cors.js';
import { initContext } from '../context.js';

export const createPublicRouter = () => {
    const publicRouter = express.Router();
    publicRouter.use(
        corsConfig(config.web.publicAllowedOrigins),
        initContext()
    );
    /*
    GET /content-links/:id
    required fields: id
    */
    publicRouter.get(
        '/content-links/:id',
        asyncHandler(handleGetContentLinkById)
    );

    /*
    GET /related-content-links
    required fields: token
    */
    publicRouter.get(
        '/related-content-links',
        asyncHandler(handleGetRelatedContentLinks)
    );

    /*
    POST /login
    required fields: username, password
    */
    publicRouter.post('/login', asyncHandler(handleLogin));

    return publicRouter;
};
