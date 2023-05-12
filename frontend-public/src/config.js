const getEnvVar = (envVarName) => {
    const envVar = import.meta.env[envVarName];
    if (!envVar) {
        throw new Error(`Couldn't find environment variable: ${envVarName}`);
    } else {
        return envVar;
    }
};

export const config = {
    backend: {
        url: getEnvVar('VITE_BACKEND_URL'),
        endpoints: {
            contentLinks: 'api/content-links',
            relatedLinks: 'api/related-content-links',
        },
    },
};
