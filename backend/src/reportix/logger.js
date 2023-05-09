import fs from 'fs';
import path from 'path';
import pino from 'pino';
import { config, nodeEnvs } from './config.js';

class Logger {
    #internalLogger;

    constructor(internalLogger) {
        this.#internalLogger = internalLogger;
    }

    child(bindings) {
        return new Logger(this.#internalLogger.child(bindings));
    }

    fatal({ msg, ...params }) {
        return this.#internalLogger.fatal(params, msg);
    }

    error({ msg, ...params }) {
        return this.#internalLogger.error(params, msg);
    }

    warn({ msg, ...params }) {
        return this.#internalLogger.warn(params, msg);
    }

    info({ msg, ...params }) {
        return this.#internalLogger.info(params, msg);
    }

    debug({ msg, ...params }) {
        return this.#internalLogger.debug(params, msg);
    }

    trace({ msg, ...params }) {
        return this.#internalLogger.trace(params, msg);
    }

    silent({ msg, ...params }) {
        return this.#internalLogger.silent(params, msg);
    }
}

const createLogStreams = () => {
    const streams = [{ stream: process.stdout }];
    if (config.nodeEnv === nodeEnvs.local) {
        const logsDir = path.join('.', 'logs');
        fs.mkdirSync(logsDir, { recursive: true });
        // TODO Logs do not rotate for this we need another library such as logrotate
        streams.push({
            stream: pino.destination({
                dest: path.join(logsDir, 'output.log'),
                sync: false,
            }),
        });
    }
    return streams;
};

const log = pino(
    {
        level: config.loggerLevel || 'info',
        formatters: {
            level: (label) => ({ level: label }),
        },
    },
    pino.multistream(createLogStreams())
);

export const logger = new Logger(log);
