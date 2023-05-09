import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const deepFreeze = (obj) => {
    Object.keys(obj).forEach((prop) => {
        if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
            deepFreeze(obj[prop]);
        }
    });
    return Object.freeze(obj);
};

export const fileDirName = (meta) => {
    // eslint-disable-next-line no-underscore-dangle
    const __filename = fileURLToPath(meta.url);
    // eslint-disable-next-line no-underscore-dangle
    const __dirname = dirname(__filename);

    return { __dirname, __filename };
};
