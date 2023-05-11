import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getRelatedContentLinks } from '../rest/requests';
import { Error } from '../components/error';
import { Spinner } from '../components/spinner';

export const MoreContentPage = () => {
    const [relatedLinks, setRelatedLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();

    const recipient = searchParams.get('recipient');

    useEffect(() => {
        getRelatedContentLinks({ recipient })
            .then((res) => setRelatedLinks(res))
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }, [recipient]);

    if (error) {
        return <Error msg={error} />;
    } else if (loading) {
        return <Spinner />;
    } else {
        return (
            <div className="text-center">
                <h1>Check out more content that was shared with you</h1>
                {relatedLinks?.length ? (
                    <div className="row gy-3 mt-3">
                        {relatedLinks.map((link) => (
                            <Link
                                className="col-12 btn btn-primary"
                                to={`/link/${link.id}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p>There is no additional content shared with you</p>
                )}
            </div>
        );
    }
};
