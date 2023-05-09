import { AuthenticationError } from '../errors.js';
import { createToken } from '../auth/jwt.js';
import { UserPrinciple } from '../auth/userPrinciple.js';
import { Roles } from '../auth/role.js';

export const handleGetContentLinkById = async (req, res) => {
    const { container, logger } = res.locals.context;
    const { id: linkId } = req.params;
    logger.info({ msg: 'Calling GetContentLinkById', linkId });
    const { getContentLinkById } = container;
    const contentLink = await getContentLinkById.execute(linkId);
    logger.info({
        msg: 'Successfully called GetContentLinkById',
        contentLink,
    });

    if (!contentLink) {
        res.sendStatus(404);
    } else if (contentLink.isRedirect()) {
        res.redirect(contentLink.getSourceUrl());
    } else {
        const dto = {
            ...contentLink.toDto(),
            expired: false,
            moreContent: `/related-content-links?recipient=${Buffer.from(
                data
            ).toString('base64')}`,
        };
        if (contentLink.isExpired()) {
            dto.expired = true;
            dto.sourceUrl = '';
        }
        res.status(200).send(dto);
    }
};

export const handleGetRelatedContentLinks = async (req, res) => {
    const { recipientBase64 } = req.query;
    const { container, logger } = res.locals.context;
    logger.info({ msg: 'Calling GetRelatedContentLinks', recipientBase64 });
    const recipient = Buffer.from(recipientBase64 ?? '', 'base64').toString();
    const { getRelatedContentLinks } = container;
    const contentLinks = await getRelatedContentLinks.execute(recipient);
    logger.info({
        msg: 'Successfully called GetRelatedContentLinks',
        contentLinks,
    });
    res.status(200).send(
        contentLinks
            .filter((l) => !l.isExpired())
            .map((l) => {
                return {
                    id: l.getId(),
                    sourceUrl: l.getSourceUrl(),
                    name: l.getName(),
                };
            })
    );
};

export const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    const { logger } = res.locals.context;
    logger.info({ msg: 'Calling Login', params: req.body });

    if (username !== 'admin' && password !== 'admin') {
        throw new AuthenticationError();
    }

    const token = createToken(
        new UserPrinciple({ username: 'admin', role: Roles.Admin })
    );

    logger.info({
        msg: 'Successfully called Login',
        token,
    });

    res.status(200).send({ token });
};
