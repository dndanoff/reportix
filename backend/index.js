import path from 'path';
import express from 'express';
import { IpFilter as ipFilter } from 'express-ipfilter';

import { logger } from './src/reportix/logger.js';
import { config } from './src/reportix/config.js';
import { errorHandler } from './src/reportix/application/http/errorHandler.js';
import { createPublicRouter } from './src/reportix/application/http/routes/public.js';
import { createPrivateRouter } from './src/reportix/application/http/routes/private.js';
import { createUiRouter } from './src/reportix/application/http/routes/ui.js';

const start = async () => {
    const app = express();
    app.use(express.json());
    app.use(ipFilter(config.web.blockedIps));
    app.use('/api', createPublicRouter());
    app.use('/api/private', createPrivateRouter());
    app.use(createUiRouter(path.resolve(path.join('..', 'frontend', 'build'))));
    app.use(errorHandler(logger));
    app.listen({ port: config.web.httpPort }, () => {
        logger.info({
            msg: `🚀 Server ready to server public API at: http://localhost:${config.web.httpPort}/api`,
        });
        logger.info({
            msg: `🚀 Server ready to server private API at: http://localhost:${config.web.httpPort}/api/private`,
        });
    });
};

start().catch((err) => {
    logger.error({ msg: 'Error while server is running. Shutting down.', err });
    process.exit(1);
});
