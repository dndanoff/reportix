import { ApiError } from '../../../domain/common/service/error.js';
import { UnknownOperation } from '../errors.js';

export const handleGetAllContentLinks = async (_req, res) => {
    const { container, logger } = res.locals.context;
    logger.info({ msg: 'Calling GetAllContentLinks' });
    const { getAllContentLinks } = container;

    const allLinks = await getAllContentLinks.execute();
    logger.info({
        msg: 'Successfully called GetAllContentLinks',
        allLinks,
    });

    res.status(200).send(allLinks.map((l) => l.toJSON()));
};

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
        throw new ApiError({ message: 'Link Not Found', statusCode: 404 });
    } else {
        res.status(200).send(contentLink.toJSON());
    }
};

export const handleCreateContentLink = async (req, res) => {
    const { container, logger } = res.locals.context;
    const params = { ...req.body };
    logger.info({ msg: 'Calling CreateContentLink' }, params);
    const { createContentLink } = container;

    const contentLink = await createContentLink.execute(params);
    logger.info({
        msg: 'Successfully called CreateContentLink',
        contentLink,
    });

    res.status(201).send(contentLink.toJSON());
};

export const handleUpdateContentLink = async (req, res) => {
    const { container, logger } = res.locals.context;
    const params = { ...req.body, id: req.params.id };
    logger.info({ msg: 'Calling UpdateContentLink' }, params);
    const { updateContentLink } = container;

    const contentLink = await updateContentLink.execute(params);
    logger.info({
        msg: 'Successfully called UpdateContentLink',
        contentLink,
    });

    res.status(200).send(contentLink.toJSON());
};

export const handleContentLinkOperation = async (req, res) => {
    const { container, logger } = res.locals.context;
    const { operation, params } = req.body;
    if (operation === 'duplicate') {
        logger.info({ msg: 'Calling DuplicateContentLink' }, params);
        const { duplicateContentLink } = container;

        const contentLink = await duplicateContentLink.execute(params);
        logger.info({
            msg: 'Successfully called DuplicateContentLink',
            contentLink,
        });

        res.status(201).send(contentLink.toJSON());
    } else {
        throw new UnknownOperation(`Unknown operation: ${operation}`);
    }
};

export const handleGetContentLinkEvents = async (req, res) => {
    const { container, logger } = res.locals.context;
    const { id: contentLinkId } = req.params;
    logger.info({ msg: 'Calling GetContentLinkEvents', contentLinkId });
    const { getByContentLink } = container;
    const events = await getByContentLink.execute(contentLinkId);
    logger.info({
        msg: 'Successfully called GetContentLinkEvents',
        events,
    });

    res.status(200).send(events.map((e) => e.toJSON()));
};
