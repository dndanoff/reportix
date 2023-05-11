import path from 'path';
import express from 'express';
import { config } from '../../../config.js';

export const createUiRouter = (contentDir) => {
    const uiRouter = express.Router();
    if (config.web.serveFrontend) {
        // Have Node serve the files for our built React app
        uiRouter.use(express.static(contentDir));
        // All other GET requests not handled before will return our React app
        uiRouter.get('*', (_req, res) => {
            res.sendFile(path.join(contentDir, 'index.html'));
        });
    }

    return uiRouter;
};
