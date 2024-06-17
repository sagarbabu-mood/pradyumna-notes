import { Component } from "react";
import { Link } from "react-router-dom";
import "./index.css";

class SignupPage extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    errorMsg: "",
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
      "http://localhost:3001/sign-up/",
      options
    );
    const signUpData = await signUpResponse.json();
    if (signUpResponse.ok === true) {
      console.log(signUpData);
      this.setState({ errorMsg: "" });
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
    const { username, email, password, confirmPassword, errorMsg } = this.state;
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

              <button className="sign-in-button" type="submit">
                SIGN UP
              </button>
              {errorMsg !== "" && (
                <p className="error-msg mt-5" id="signupConfirmError">
                  {errorMsg}
                </p>
              )}

              <Link className="signin-page-anchor" to="/login">
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
