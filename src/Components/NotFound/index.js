import { Link } from "react-router-dom";
import "./index.css";

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/daxizvsge/image/upload/v1709893686/pagenotfound_puca2k.jpg"
      alt="not-found-img"
      className="not-found-img"
    />
    <p className="not-found-description">
      The Page you are looking for is not found
    </p>
    <Link to="/note-locker/">
      <button className="go-home-button" type="button">
        Go Home
      </button>
    </Link>
  </div>
);

export default NotFound;
