import express from 'express';
import serverless from 'serverless-http';
import { IpFilter as ipFilter } from 'express-ipfilter';

import { logger } from './src/logger.js';
import { config, infraEnvs } from './src/config.js';
import { errorHandler } from './src/application/http/errorHandler.js';
import { createPublicRouter } from './src/application/http/routes/public.js';
import { createPrivateRouter } from './src/application/http/routes/private.js';
import { createUiRouter } from './src/application/http/routes/ui.js';

const createApp = () => {
    const app = express();
    app.use(express.json());
    app.use(ipFilter(config.web.blockedIps));
    app.use('/api', createPublicRouter());
    app.use('/api/private', createPrivateRouter());
    app.use(createUiRouter());
    app.use(errorHandler(logger));

    return app;
};

const start = async (app) => {
    app.listen({ port: config.web.httpPort }, () => {
        logger.info({
            msg: `🚀 Server ready to server public API at: http://localhost:${config.web.httpPort}/api 
            and private API at: http://localhost:${config.web.httpPort}/api/private`,
        });
    });
};

const app = createApp();
export const handler = serverless(app);

if (config.infraEnv === infraEnvs.server) {
    start(app).catch((err) => {
        logger.error({
            msg: 'Error while server is running. Shutting down.',
            err,
        });
        process.exit(1);
    });
}
