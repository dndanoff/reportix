import asyncHandler from 'express-async-handler';
import { v4 as uuid } from 'uuid';

import { logger } from '../../logger.js';
import { ContentLinkRepo } from '../content-links/repository/aws/contentLinkRepo.js';
import { DbClient } from '../common/repository/aws/dbClient.js';
import { GetContentLinkById } from '../../domain/content-links/service/query/getContentLinkById.js';
import { CreateContentLink } from '../../domain/content-links/service/command/createContentLink.js';
import { UpdateContentLink } from '../../domain/content-links/service/command/updateContentLink.js';
import { DuplicateContentLink } from '../../domain/content-links/service/command/duplicateContentLink.js';
import { GetAllContentLinks } from '../../domain/content-links/service/query/getAllContentLinks.js';
import { verifyToken } from './auth/jwt.js';
import { GetRelatedContentLinks } from '../../domain/content-links/service/query/getRelatedContentLinks.js';
import { UserPrinciple } from './auth/userPrinciple.js';
import { Roles } from './auth/role.js';

const createContainer = () => {
    const dbClient = new DbClient();
    const contentLinkRepo = new ContentLinkRepo(dbClient);
    const getContentLinkById = new GetContentLinkById({ contentLinkRepo });
    const getRelatedContentLinks = new GetRelatedContentLinks({
        contentLinkRepo,
    });
    const getAllContentLinks = new GetAllContentLinks({
        contentLinkRepo,
    });
    const createContentLink = new CreateContentLink({
        contentLinkRepo,
    });
    const updateContentLink = new UpdateContentLink({
        contentLinkRepo,
    });
    const duplicateContentLink = new DuplicateContentLink({
        contentLinkRepo,
    });
    return {
        getAllContentLinks,
        getRelatedContentLinks,
        getContentLinkById,
        createContentLink,
        updateContentLink,
        duplicateContentLink,
    };
};

const createContext = async ({ req }) => {
    const container = createContainer();

    let principle = new UserPrinciple({
        username: 'anonymous',
        role: Roles.Anonymous,
    });
    if (req.headers.authorization) {
        const token = req.headers.authorization?.split(' ')[1] || '';
        principle = verifyToken(token).principle;
    }

    const client = {
        agent: req.header('user-agent'),
        referrer: req.header('referrer'),
        ip: req.header('x-forwarded-for') || req.connection.remoteAddress,
        clientProxy: req.header('via') || 'none',
    };

    const requestId = uuid();
    const requestLogger = logger.child({ requestId });

    return { logger: requestLogger, container, principle, client };
};

export const initContext = () =>
    asyncHandler(async (req, res, next) => {
        const context = await createContext({ req });
        res.locals.context = context;
        next();
    });
