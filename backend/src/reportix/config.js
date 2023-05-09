import { cleanEnv, str, num, bool } from 'envalid';

const localDefaults = {
    NODE_ENV: 'local',
    SECRET_KEY: '3fa5dcd4-1d04-40c7-858b-287c150d4cca',
    AWS_REGION: 'local',
    AWS_ENDPOINT: 'http://localhost:8000',
};

const devDefaults = {
    NODE_ENV: 'dev',
    AWS_REGION: 'us-east-1',
};

const qaDefaults = {
    NODE_ENV: 'qa',
    AWS_REGION: 'us-east-1',
};

const prodDefaults = {
    NODE_ENV: 'prod',
};

const defaults = {
    local: localDefaults,
    dev: devDefaults,
    qa: qaDefaults,
    prod: prodDefaults,
};

const { NODE_ENV } = process.env;

const env = cleanEnv(
    { ...(defaults[NODE_ENV] ?? defaults.local), ...process.env },
    {
        NODE_ENV: str({
            desc: 'NODE_ENV is used by various libraries. We use only the standard values.',
        }),
        LOG_LEVEL: str({
            desc: 'Logger level.',
            default: 'info',
        }),
        SECRET_KEY: str({ desc: 'A secret used for hashing sensitive data' }),
        WEB_HTTP_PORT: num({
            desc: 'Web server port',
            default: 3001,
        }),
        WEB_BLOCKED_IPS: str({
            desc: 'IPs that need to be blocked',
            default: '',
        }),
        WEB_PUBLIC_ALLOWED_ORIGINS: str({
            desc: 'Allowed origins for the public API',
            default: '*',
        }),
        WEB_PRIVATE_ALLOWED_ORIGINS: str({
            desc: 'Allowed origins for the private API',
            default: '',
        }),
        WEB_SERVE_FRONTNED: bool({
            desc: 'If frontend should be served',
            default: true,
        }),
        AWS_REGION: str({
            desc: 'AWS Region',
        }),
        AWS_ENDPOINT: str({
            desc: 'Specifies different endpoint used for local development',
            default: undefined,
        }),
    }
);

export const config = {
    nodeEnv: env.NODE_ENV,
    loggerLevel: env.LOG_LEVEL,
    secretKey: env.SECRET_KEY,
    web: {
        httpPort: env.WEB_HTTP_PORT,
        blockedIps: env.WEB_BLOCKED_IPS.split(',').filter((ip) => ip !== ''),
        publicAllowedOrigins: env.WEB_PUBLIC_ALLOWED_ORIGINS.split(',').filter(
            (origin) => origin !== ''
        ),
        privateAllowedOrigins: env.WEB_PRIVATE_ALLOWED_ORIGINS.split(
            ','
        ).filter((origin) => origin !== ''),
        serverFrontend: env.WEB_SERVE_FRONTNED,
    },
    aws: {
        region: env.AWS_REGION,
        endpoint: env.AWS_ENDPOINT,
    },
};

export const nodeEnvs = {
    local: 'local',
    dev: 'dev',
    qa: 'qa',
    prod: 'prod',
};
