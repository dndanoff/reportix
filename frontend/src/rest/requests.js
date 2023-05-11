import { config } from '../config';
import { restClient } from './client';

export const getContentLink = async ({ contentLinkId }) => {
    const { data } = await restClient({
        url: `${config.backend.endpoints.contentLinks}/${contentLinkId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return data;
};

export const getRelatedContentLinks = async ({ recipient }) => {
    const { data } = await restClient({
        url: `${config.backend.endpoints.relatedLinks}/?recipient=${recipient}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return data;
};
