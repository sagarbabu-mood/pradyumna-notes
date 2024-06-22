import { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import "./index.css";

class Home extends Component {
  render() {
    return (
      <div className="home-bg">
        <Header />
        <div className="home-contents">
          <div className="home-contents-1">
            <h1 className="note-locker-heading">
              NoteLock: A Secure Note and Password Manager Web Application
            </h1>
            <p className="home-description">
              NoteLock is a sophisticated web application designed to provide
              users with a secure platform for managing their sensitive notes
              and passwords. In an era where online security is paramount,
              NoteLock oCers robust encryption techniques to safeguard personal
              information, ensuring user confidentiality and peace of mind. With
              a sleek and intuitive user interface, users can easily organize,
              store, and retrieve their notes and passwords from any device with
              internet access. NoteLock prioritizes user privacy and security,
              employing state-of-the-art encryption algorithms and
              authentication mechanisms to protect against unauthorized access
              and data breaches. This project aims to provide a seamless and
              reliable solution for individuals and businesses seeking a
              trustworthy platform to manage their digital credentials and
              sensitive information.
            </p>
            <div className="home-buttons-container">
              <Link to="/note-locker/notes">
                <button className="try-notes-button" type="button">
                  Try Notes
                </button>
              </Link>
              <Link to="/note-locker/passwords">
                <button className="try-passwords-button" type="button">
                  Try Passwords
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
