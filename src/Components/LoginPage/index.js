import { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

class LoginPage extends Component {
  state = { username: "", password: "", errorMsg: "" };

  makeLoginUser = async () => {
    const { username, password } = this.state;
    const details = {
      username,
      password,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    };
    const response = await fetch("http://localhost:3001/login/", options);
    const data = await response.json();
    if (response.ok === true) {
      Cookies.set("jwt_token", data.jwtToken, { expires: 30 });
      const { history } = this.props;
      history.replace("/");
    } else {
      this.setState({ errorMsg: data.Error });
    }
  };

  onChangeUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  submitForm = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    if (username !== "" && password !== "") {
      this.makeLoginUser();
      this.setState({ username: "", password: "" });
    }
  };

  render() {
    const { username, password, errorMsg } = this.state;
    const token = Cookies.get("jwt_token");
    if (token !== undefined) {
      return <Redirect to="/" />;
    }
    return (
      <div className="login-bg">
        <div className="login-container" id="loginContainer">
          <form
            className="form-container"
            id="loginForm"
            onSubmit={this.submitForm}
          >
            <h1 className="form-heading">Have an account?</h1>
            <input
              type="text"
              placeholder="Username"
              className="input-style"
              id="username"
              onChange={this.onChangeUsername}
              value={username}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input-style"
              id="password"
              onChange={this.onChangePassword}
              value={password}
              required
            />
            <button className="sign-in-button" type="submit">
              SIGN IN
            </button>
            {errorMsg !== "" && (
              <p className="error-msg mt-5" id="signinConfirmError">
                {errorMsg}
              </p>
            )}

            <p className="no-account-text">
              Didn't have an account?{" "}
              <Link to="/sign-up" className="create-anchor" id="createOne">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginPage;
