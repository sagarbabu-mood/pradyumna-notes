import { Component } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Popup from "reactjs-popup";
import "./index.css";
import Cookies from "js-cookie";
import Header from "../Header";
import NoteLockLoader from "../NoteLockLoader";

const passwordEditPageConstStatus = {
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

class PasswordEditPage extends Component {
  state = {
    username: "",
    password: "",
    passwordEditPageStatus: passwordEditPageConstStatus.loading,
    displayPasswordEditPageErrorMsg: "",
    displayPasswordUpdatePopup: false,
    verifyPasswordErrorMsg: "",
    userPassword: "",
    isVerified: false,
  };

  componentDidMount() {
    this.getPasswordItemDetails();
  }

  getPasswordItemDetails = async () => {
    const token = Cookies.get("jwt_token");
    this.setState({
      passwordEditPageStatus: passwordEditPageConstStatus.loading,
    });
    const { match } = this.props;
    const { params } = match;
    const { passwordId } = params;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const passwordItemDetailsResponse = await fetch(
      `https://note-lock-backend-production.up.railway.app/password/${passwordId}/`,
      options
    );
    if (passwordItemDetailsResponse.ok === true) {
      const passwordItemDetailsResponseData =
        await passwordItemDetailsResponse.json();
      const parsedPasswordItemDetails = {
        userId: passwordItemDetailsResponseData.data.user_id,
        passwordId: passwordItemDetailsResponseData.data.password_id,
        username: passwordItemDetailsResponseData.data.username,
        password: passwordItemDetailsResponseData.data.password,
      };
      this.setState({
        passwordEditPageStatus: passwordEditPageConstStatus.success,
        username: parsedPasswordItemDetails.username,
        password: parsedPasswordItemDetails.password,
        displayPasswordEditPageErrorMsg: "",
      });
    } else {
      this.setState({
        passwordEditPageStatus: passwordEditPageConstStatus.failure,
        displayPasswordEditPageErrorMsg: "",
      });
    }
  };

  updatePasswordDetails = async () => {
    const { username, password } = this.state;
    this.setState({
      passwordEditPageStatus: passwordEditPageConstStatus.loading,
    });
    const { match } = this.props;
    const { params } = match;
    const { passwordId } = params;
    const myToken = Cookies.get("jwt_token");
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };
    const updatePasswordItemResponse = await fetch(
      `https://note-lock-backend-production.up.railway.app/passwords/${passwordId}`,
      options
    );
    if (updatePasswordItemResponse.ok === true) {
      this.setState({
        passwordEditPageStatus: passwordEditPageConstStatus.success,
        displayPasswordUpdatePopup: true,
      });
    } else {
      this.setState({
        passwordEditPageStatus: passwordEditPageConstStatus.failure,
        displayPasswordUpdatePopup: false,
      });
    }
  };

  verifyUserPasswordFunction = async () => {
    const { userPassword } = this.state;
    if (userPassword !== "") {
      const myToken = Cookies.get("jwt_token");
      const userIdOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${myToken}`,
        },
      };
      const userIdResponse = await fetch(
        "https://note-lock-backend-production.up.railway.app/get-user-id/",
        userIdOptions
      );
      const userIdData = await userIdResponse.json();
      if (userIdResponse.ok === true) {
        const options = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${myToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: userPassword }),
        };
        const passwordVerifyResponse = await fetch(
          `https://note-lock-backend-production.up.railway.app/verify-password/${userIdData.userId}`,
          options
        );
        if (passwordVerifyResponse.ok === true) {
          this.setState(
            { verifyPasswordErrorMsg: "", userPassword: "", isVerified: true },
            this.getPasswordItemDetails
          );
        } else {
          this.setState({
            verifyPasswordErrorMsg: "Incorrect Password",
            isVerified: false,
          });
        }
      }
    } else {
      this.setState({
        verifyPasswordErrorMsg: "Please fill all details",
        isVerified: false,
      });
    }
  };

  changeusernameInput = (e) => {
    this.setState({ username: e.target.value });
  };

  changepasswordInput = (e) => {
    this.setState({ password: e.target.value });
  };

  onSubmitPasswordDetails = (e) => {
    e.preventDefault();
    const { username, password } = this.state;

    if (username !== "" && password !== "") {
      this.updatePasswordDetails();
    } else {
      this.setState({
        displayPasswordEditPageErrorMsg: "Please fill all the columns",
      });
    }
  };

  changeUserPassword = (e) => {
    this.setState({ userPassword: e.target.value });
  };

  renderPasswordEditPageLoader = () => <NoteLockLoader />;

  renderPasswordEditPageFailure = () => (
    <div className="password-edit-page-failure-container">
      <img
        src="https://res.cloudinary.com/daxizvsge/image/upload/v1705386860/alert-triangle_wng4nt.png"
        alt="failure-img"
        className="failure-img"
      />
      <p className="failure-description">
        There is problem with the request.Please try again.
      </p>
      <button
        className="failure-retry-button"
        type="button"
        onClick={this.getPasswordItemDetails}
      >
        Retry
      </button>
    </div>
  );

  renderPasswordEditPageSuccess = () => {
    const {
      username,
      password,
      displayPasswordEditPageErrorMsg,
      displayPasswordUpdatePopup,
      userPassword,
      verifyPasswordErrorMsg,
      isVerified,
    } = this.state;
    return (
      <>
        {isVerified === false ? (
          <div className="password-check-popup-container">
            <div className="password-check-popup-inner">
              <p className="password-check-desc">
                Enter your notelock account password to edit.
              </p>
              <input
                type="password"
                className="password-check-password-input"
                onChange={this.changeUserPassword}
                value={userPassword}
              />
              <button
                className="verify-popup-password-button"
                type="button"
                onClick={this.verifyUserPasswordFunction}
              >
                Verify
              </button>
              {verifyPasswordErrorMsg !== "" && (
                <p className="error-msg"> {verifyPasswordErrorMsg}</p>
              )}
            </div>
          </div>
        ) : (
          <form
            className={
              displayPasswordUpdatePopup ? "d-none" : "edit-password-forms"
            }
            onSubmit={this.onSubmitPasswordDetails}
          >
            <label className="password-edit-label">username</label>
            <input
              type="text"
              className="username-edit-input"
              placeholder="Enter username"
              onChange={this.changeusernameInput}
              value={username}
              required
            />
            <label className="password-edit-label">password</label>
            <input
              className="password-edit-password-input"
              placeholder="Enter password"
              onChange={this.changepasswordInput}
              value={password}
              type="password"
              required
            />
            <button className="password-edit-submit-button" type="submit">
              Submit
            </button>

            {displayPasswordUpdatePopup && (
              <Popup
                modal
                open={displayPasswordUpdatePopup}
                onClose={() =>
                  this.setState({ displayPasswordUpdatePopup: false })
                }
              >
                <div className="password-update-popup-container">
                  <button
                    type="button"
                    className="close-popup-button"
                    onClick={() =>
                      this.setState({ displayPasswordUpdatePopup: false })
                    }
                  >
                    <IoClose size={25} />
                  </button>
                  <div className="password-update-popup-inner">
                    <img
                      src="https://res.cloudinary.com/daxizvsge/image/upload/v1718619846/tick_jpoeka.jpg"
                      alt="tick-img"
                      className="tick-img"
                    />
                    <p className="password-update-popup-desc">
                      Password has been successfully updated.
                    </p>
                    <div className="password-update-popup-buttons-container">
                      <Link to="/note-locker/passwords">
                        <button className="view-all-passwords-button">
                          View all passwords
                        </button>
                      </Link>

                      <button
                        className="edit-password-popup-button"
                        onClick={() => {
                          this.setState({ displayPasswordUpdatePopup: false });
                        }}
                      >
                        Edit password
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            )}
            {displayPasswordEditPageErrorMsg !== "" && (
              <p className="password-edit-error-msg">
                {displayPasswordEditPageErrorMsg}
              </p>
            )}
          </form>
        )}
      </>
    );
  };

  renderPasswordEditPage = () => {
    const { passwordEditPageStatus } = this.state;
    switch (passwordEditPageStatus) {
      case passwordEditPageConstStatus.loading:
        return this.renderPasswordEditPageLoader();
      case passwordEditPageConstStatus.success:
        return this.renderPasswordEditPageSuccess();
      case passwordEditPageConstStatus.failure:
        return this.renderPasswordEditPageFailure();
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="password-edit-page-bg">
        <Header />
        <div className="edit-page-contents">
          <div className="password-page-top">
            <Link to="/note-locker/passwords">
              <button className="back-arrow-button" type="button">
                <IoArrowBack size={25} />
              </button>
            </Link>
          </div>
          {this.renderPasswordEditPage()}
        </div>
      </div>
    );
  }
}

export default PasswordEditPage;
