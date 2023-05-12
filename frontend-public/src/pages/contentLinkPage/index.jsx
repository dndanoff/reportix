import { useParams } from 'react-router-dom';
import { ContentViewer } from './components/contentViewer';
import { NavBar } from './components/navBar';
import './index.css';
import { getContentLink } from '../../rest/requests';
import { useCallback, useEffect, useState } from 'react';
import { Spinner } from '../../components/spinner';
import { Error } from '../../components/error';

export const ContentLinkPage = () => {
    const [contentLink, setContentLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { contentLinkId } = useParams();

    useEffect(() => {
        getContentLink({ contentLinkId })
            .then((res) => setContentLink(res))
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }, [contentLinkId]);

    if (error) {
        return <Error msg={error} />;
    } else if (loading) {
        return <Spinner />;
    } else {
        return (
            <div id="content-page" className="vh-100">
                <NavBar recipient={contentLink.recipient} />
                <ContentViewer
                    sourceUrl={contentLink.sourceUrl}
                    name={contentLink.name}
                />
            </div>
        );
    }
};
