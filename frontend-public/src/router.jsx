import { createBrowserRouter } from 'react-router-dom';
import { AboutPage } from './pages/aboutPage';
import { ContentLinkPage } from './pages/contentLinkPage';
import { MoreContentPage } from './pages/moreContentPage';
import { ErrorPage } from './pages/errorPage';
import { RootPage } from './pages/rootPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootPage />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <AboutPage />,
            },
            {
                path: 'about',
                element: <AboutPage />,
            },
            {
                path: 'link/:contentLinkId',
                element: <ContentLinkPage />,
            },
            {
                path: 'more',
                element: <MoreContentPage />,
            },
        ],
    },
]);
