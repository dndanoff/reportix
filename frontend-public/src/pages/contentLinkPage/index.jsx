import { useParams } from 'react-router-dom';
import { ContentViewer } from './components/contentViewer';
import { getContentLink } from '../../rest/requests';
import { useEffect, useState } from 'react';
import { Spinner } from '../../components/spinner';
import { Error } from '../../components/error';
import { useStorage } from '../../contexts/useStorage';

export const ContentLinkPage = () => {
    const [contentLink, setContentLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { setStorage } = useStorage();
    const { contentLinkId } = useParams();

    useEffect(() => {
        getContentLink({ contentLinkId })
            .then((link) => {
                setContentLink(link);
                setStorage({ recipient: link.recipient });
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }, [contentLinkId]);

    if (error) {
        return <Error msg={error} />;
    } else if (loading) {
        return <Spinner />;
    } else {
        return (
            <ContentViewer
                sourceUrl={contentLink.sourceUrl}
                name={contentLink.name}
            />
        );
    }
};
