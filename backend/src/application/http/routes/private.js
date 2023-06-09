import express from 'express';
import asyncHandler from 'express-async-handler';
import {
    handleCreateContentLink,
    handleGetAllContentLinks,
    handleContentLinkOperation,
    handleUpdateContentLink,
    handleGetContentLinkById,
    handleGetContentLinkEvents,
} from './privateHandlers.js';
import { config } from '../../../config.js';
import { corsConfig } from '../cors.js';
import { createJwtAuthenticator } from '../auth/authentication.js';
import { Roles } from '../auth/role.js';
import { initContext } from '../context.js';

export const createPrivateRouter = () => {
    const privateRouter = express.Router();
    privateRouter.use(
        corsConfig(config.web.privateAllowedOrigins),
        createJwtAuthenticator({ roles: [Roles.Admin] }),
        initContext()
    );
    /*
    GET /content-links
    */
    privateRouter.get('/content-links', asyncHandler(handleGetAllContentLinks));

    /*
    GET /content-links/:id
    required fields: id
    */
    privateRouter.get(
        '/content-links/:id',
        asyncHandler(handleGetContentLinkById)
    );

    /*
    POST /content-links
    */
    privateRouter.post('/content-links', asyncHandler(handleCreateContentLink));

    /*
    PUT /content-links/:id
    required fields: id
    */
    privateRouter.put(
        '/content-links/:id',
        asyncHandler(handleUpdateContentLink)
    );

    /*
    POST /content-links/operations
    required fields: operation, params
    */
    privateRouter.post(
        '/content-links/operations',
        asyncHandler(handleContentLinkOperation)
    );

    /*
    GET /content-links/:id/events
    required fields: id
    */
    privateRouter.get(
        '/content-links/:id/events',
        asyncHandler(handleGetContentLinkEvents)
    );

    return privateRouter;
};
