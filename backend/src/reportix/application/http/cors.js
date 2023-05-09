import cors from 'cors';

export const corsConfig = (allowedOrigins) => {
    if (!allowedOrigins || allowedOrigins.length === 0) {
        return cors({ origin: false });
    }

    return cors({ allowedOrigins, credentials: true });
};
