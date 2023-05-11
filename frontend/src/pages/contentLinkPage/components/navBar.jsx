import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dreamixLogo from '../../../assets/dreamix-logo.svg';

export function NavBar({ recipient }) {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link className="navbar-brand" to="http://dreamix.eu">
                    <img
                        src={dreamixLogo}
                        alt="Dreamix"
                        width="120"
                        height="24"
                    />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse justify-content-end"
                    id="navbarContent"
                >
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to={`/more?recipient=${recipient}`}
                            >
                                Read More
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

NavBar.propTypes = {
    recipient: PropTypes.string.isRequired,
};
