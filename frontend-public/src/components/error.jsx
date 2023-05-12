import PropTypes from 'prop-types';

export const Error = ({ msg }) => (
    <div className="alert alert-danger" role="alert">
        {msg}
    </div>
);

Error.propTypes = {
    msg: PropTypes.string.isRequired,
};
