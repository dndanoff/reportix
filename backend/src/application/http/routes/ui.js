import path from 'path';
import express from 'express';
import { config } from '../../../config.js';

export const createUiRouter = () => {
    const uiRouter = express.Router();
    if (config.web.serveFrontend) {
        const frontendDir = path.resolve(config.web.frontendPath);
        // Have Node serve the files for our built React app
        uiRouter.use(express.static(frontendDir));
        // All other GET requests not handled before will return our React app
        uiRouter.get('*', (_req, res) => {
            res.sendFile(path.join(frontendDir, 'index.html'));
        });
    }

    return uiRouter;
};
