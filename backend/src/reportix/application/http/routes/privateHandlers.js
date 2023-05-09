import { UnknownOperation } from '../errors.js';

export const handleGetAllContentLinks = async (_req, res) => {
    logger.info({ msg: 'Calling GetAllContentLinks' });
    const { getAllContentLinks } = container;

    const allLinks = await getAllContentLinks.execute();
    logger.info({
        msg: 'Successfully called GetAllContentLinks',
        allLinks,
    });

    res.status(200).send(
        allLinks.map((l) => {
            return { ...l.toDto(), expired: l.isExpired() };
        })
    );
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

    res.status(201).send(contentLink);
};

export const handleUpdateContentLink = async (req, res) => {
    const { container, logger } = res.locals.context;
    const params = { ...req.body };
    logger.info({ msg: 'Calling UpdateContentLink' }, params);
    const { updateContentLink } = container;

    const contentLink = await updateContentLink.execute(params);
    logger.info({
        msg: 'Successfully called UpdateContentLink',
        contentLink,
    });

    res.status(200).send(contentLink);
};

export const handleContentLinkOperation = async (req, res) => {
    const { container, logger } = res.locals.context;
    const { operation, params } = req.body;
    if ('duplicate' === operation) {
        logger.info({ msg: 'Calling DuplicateContentLink' }, params);
        const { duplicateContentLink } = container;

        const contentLink = await duplicateContentLink.execute(params);
        logger.info({
            msg: 'Successfully called DuplicateContentLink',
            contentLink,
        });

        res.status(201).send(contentLink);
    } else {
        throw new UnknownOperation(`Unknown operation: ${operation}`);
    }
};
