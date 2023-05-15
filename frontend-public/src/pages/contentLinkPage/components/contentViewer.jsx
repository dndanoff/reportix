import PropTypes from 'prop-types';
import './contentViewer.css';

export const ContentViewer = ({ sourceUrl, name }) => {
    return (
        <div id="content-page">
            <h1>{name}</h1>
            <iframe src={sourceUrl + '#toolbar=0'} width="100%" height="100%" />
        </div>
    );
};

ContentViewer.propTypes = {
    sourceUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};
