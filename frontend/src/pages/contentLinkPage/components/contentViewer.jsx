import PropTypes from 'prop-types';

export const ContentViewer = ({ sourceUrl, name }) => {
    return (
        <>
            <h1>{name}</h1>
            <iframe src={sourceUrl + '#toolbar=0'} width="100%" height="85%" />
        </>
    );
};

ContentViewer.propTypes = {
    sourceUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};
