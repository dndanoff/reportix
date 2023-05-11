export const config = {
    backend: {
        url: import.meta.env.VITE_BACKEND_URL,
        endpoints: {
            contentLinks: 'api/content-links',
            relatedLinks: 'api/related-content-links',
        },
    },
};
