import Popup from "reactjs-popup";
import Cookies from "js-cookie";
import { Link, withRouter } from "react-router-dom";
import { CgNotes } from "react-icons/cg";
import { RiLockPasswordFill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import "./index.css";

const Header = (props) => {
  const logoutUser = () => {
    Cookies.remove("jwt_token");
    const { history } = props;
    history.replace("/note-locker/login");
  };
  return (
    <nav className="navbar">
      <Link to="/note-locker/">
        <img
          src="https://res.cloudinary.com/daxizvsge/image/upload/v1718613991/1_tgezlt.jpg"
          alt="nav-logo"
          className="nav-logo"
        />
      </Link>
      <div className="navbar-inner-container">
        <ul className="nav-items-container">
          <li className="nav-item">
            <Link to="/note-locker/notes" className="nav-item-inner">
              <p className="nav-item-inner">
                <CgNotes size={33} />
                <span className="nav-item-span">Notes</span>
              </p>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/note-locker/passwords" className="nav-item-inner">
              <p className="nav-item-inner">
                <RiLockPasswordFill size={33} />
                <span className="nav-item-span">Passwords</span>
              </p>
            </Link>
          </li>
        </ul>
        <Popup
          modal
          trigger={
            <button className="logout-button" type="button">
              Logout
            </button>
          }
        >
          {(close) => (
            <div className="logout-popup-container">
              <button
                type="button"
                className="close-popup-button"
                onClick={() => close()}
              >
                <IoClose size={25} />
              </button>
              <p className="logout-description">
                Are you sure, want to logout?
              </p>
              <div className="logout-popup-inner">
                <button
                  className="logout-popup-button"
                  type="button"
                  onClick={() => logoutUser()}
                >
                  Logout
                </button>
                <button
                  className="cancel-popup-button"
                  type="button"
                  onClick={() => close()}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Popup>

        <Popup
          modal
          trigger={
            <button className="logout-button-small" type="button">
              <FiLogOut size={30} />
            </button>
          }
        >
          {(close) => (
            <div className="logout-popup-container">
              <button
                type="button"
                className="close-popup-button"
                onClick={() => close()}
              >
                <IoClose size={25} />
              </button>
              <p className="logout-description">
                Are you sure, want to logout?
              </p>
              <div className="logout-popup-inner">
                <button
                  className="logout-popup-button"
                  type="button"
                  onClick={() => logoutUser()}
                >
                  Logout
                </button>
                <button
                  className="cancel-popup-button"
                  type="button"
                  onClick={() => close()}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </nav>
  );
};

export default withRouter(Header);
