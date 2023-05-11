import { AuthenticationError } from '../errors.js';
import { createToken } from '../auth/jwt.js';
import { UserPrinciple } from '../auth/userPrinciple.js';
import { Roles } from '../auth/role.js';
import { ApiError } from '../../../domain/common/service/error.js';

export const handleGetContentLinkById = async (req, res) => {
    const { container, logger, client } = res.locals.context;
    const { id: linkId } = req.params;
    logger.info({ msg: 'Calling GetContentLinkById', linkId });
    const { getContentLinkById } = container;
    const contentLink = await getContentLinkById.execute(linkId, client);
    logger.info({
        msg: 'Successfully called GetContentLinkById',
        contentLink,
    });

    if (!contentLink) {
        throw new ApiError({ message: 'Link Not Found', statusCode: 404 });
    } else {
        const dto = {
            id: contentLink.getId(),
            name: contentLink.getName(),
            expired: contentLink.isExpired(),
            recipient: Buffer.from(contentLink.getRecipient()).toString(
                'base64'
            ),
            sourceUrl: contentLink.getSourceUrl(),
        };
        if (contentLink.isExpired()) {
            dto.sourceUrl = '';
        }
        res.status(200).send(dto);
    }
};

export const handleGetRelatedContentLinks = async (req, res) => {
    const { recipient: recipientBase64 } = req.query;
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
            .map((l) => ({
                id: l.getId(),
                sourceUrl: l.getSourceUrl(),
                name: l.getName(),
            }))
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
