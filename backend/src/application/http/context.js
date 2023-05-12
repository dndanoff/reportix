import asyncHandler from 'express-async-handler';
import { v4 as uuid } from 'uuid';

import { logger } from '../../logger.js';
import { ContentLinkRepo } from '../domain/content-links/repository/aws/contentLinkRepo.js';
import { DbClient } from '../domain/common/repository/aws/dbClient.js';
import { GetContentLinkById } from '../../domain/content-links/service/query/getContentLinkById.js';
import { CreateContentLink } from '../../domain/content-links/service/command/createContentLink.js';
import { UpdateContentLink } from '../../domain/content-links/service/command/updateContentLink.js';
import { DuplicateContentLink } from '../../domain/content-links/service/command/duplicateContentLink.js';
import { GetAllContentLinks } from '../../domain/content-links/service/query/getAllContentLinks.js';
import { verifyToken } from './auth/jwt.js';
import { GetRelatedContentLinks } from '../../domain/content-links/service/query/getRelatedContentLinks.js';
import { UserPrinciple } from './auth/userPrinciple.js';
import { Roles } from './auth/role.js';
import { GetLinkEventsByContentLink } from '../../domain/link-events/service/query/getByContentLink.js';
import { LinkEventRepo } from '../domain/link-events/repository/aws/linkEventRepo.js';
import { CreateLinkEvent } from '../../domain/link-events/service/command/createLinkEvent.js';

const createContainer = () => {
    const dbClient = new DbClient();
    const contentLinkRepo = new ContentLinkRepo(dbClient);
    const linkEventRepo = new LinkEventRepo(dbClient);
    const getContentLinkById = new GetContentLinkById({
        contentLinkRepo,
        createLinkEventService: new CreateLinkEvent({ linkEventRepo }),
    });
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

    const getByContentLink = new GetLinkEventsByContentLink({
        linkEventRepo,
    });
    return {
        getAllContentLinks,
        getRelatedContentLinks,
        getContentLinkById,
        createContentLink,
        updateContentLink,
        duplicateContentLink,
        getByContentLink,
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
        referrer: req.header('referrer') ?? 'none',
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
