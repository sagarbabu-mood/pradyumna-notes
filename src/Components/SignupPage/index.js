import { Component } from "react";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import { IoClose } from "react-icons/io5";
import "./index.css";

class SignupPage extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    errorMsg: "",
    displayPopup: false,
  };

  signUpNewUser = async () => {
    const { username, email, password } = this.state;
    const userDetails = {
      username,
      password,
      email,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    const signUpResponse = await fetch(
      "https://note-lock-backend-production.up.railway.app/sign-up/",
      options
    );
    const signUpData = await signUpResponse.json();
    if (signUpResponse.ok === true) {
      console.log(signUpData);
      this.setState({ errorMsg: "", displayPopup: true });
    } else {
      this.setState({ errorMsg: signUpData.Error });
    }
  };

  changeUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  changeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  changePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  changeConfirmPassword = (e) => {
    this.setState({ confirmPassword: e.target.value });
  };

  submitSignUpForm = (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = this.state;
    if (
      username !== "" &&
      password !== "" &&
      email !== "" &&
      confirmPassword !== "" &&
      password !== confirmPassword
    ) {
      this.setState({ errorMsg: "Password and confirm password didn't match" });
    } else if (
      username !== "" &&
      password !== "" &&
      email !== "" &&
      confirmPassword !== ""
    ) {
      this.signUpNewUser();
      this.setState({
        username: "",
        password: "",
        email: "",
        confirmPassword: "",
        errorMsg: "",
      });
    } else {
      this.setState({ errorMsg: "Please fill all details" });
    }
  };

  render() {
    const {
      username,
      email,
      password,
      confirmPassword,
      errorMsg,
      displayPopup,
    } = this.state;
    return (
      <div className="signup-bg">
        <div className="login-signup-container">
          <div className="register-container">
            <form
              className="register-form"
              id="registerForm"
              onSubmit={this.submitSignUpForm}
            >
              <h1 className="form-heading">Sign Up</h1>
              <input
                type="text"
                placeholder="Username"
                className="input-style"
                id="registerUser"
                required
                onChange={this.changeUsername}
                value={username}
              />
              <input
                type="email"
                placeholder="Email"
                className="input-style"
                id="registerEmail"
                required
                onChange={this.changeEmail}
                value={email}
              />

              <input
                type="password"
                placeholder="Password"
                className="input-style"
                id="registerPassword"
                required
                onChange={this.changePassword}
                value={password}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="input-style"
                id="confirmPassword"
                required
                onChange={this.changeConfirmPassword}
                value={confirmPassword}
              />

              <Popup
                modal
                trigger={
                  <button className="sign-in-button" type="submit">
                    SIGN UP
                  </button>
                }
              >
                {(close) => (
                  <div
                    className={
                      displayPopup ? "signup-popup-container" : "d-none"
                    }
                  >
                    <button
                      type="button"
                      className="close-popup-button"
                      onClick={() => close()}
                    >
                      <IoClose size={25} />
                    </button>

                    <div className="signup-popup-inner">
                      <img
                        src="https://res.cloudinary.com/daxizvsge/image/upload/v1718619846/tick_jpoeka.jpg"
                        alt="tick-img"
                        className="tick-img"
                      />
                      <p className="signup-popup-desc bold">
                        Welcome to NoteLock!
                      </p>
                      <p className="signup-popup-desc">
                        You've successfully signed up.Start exploring our
                        features and connect with the community.
                      </p>
                      <Link
                        to="/note-locker/login"
                        className="login-link-button"
                      >
                        <button className="go-login-page-button" type="button">
                          Go to Login page.
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </Popup>

              {errorMsg !== "" && (
                <p className="error-msg mt-5" id="signupConfirmError">
                  {errorMsg}
                </p>
              )}

              <Link className="signin-page-anchor" to="/note-locker/login">
                Go to sign-in page
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupPage;
