import { Component } from "react";
import Cookies from "js-cookie";
import Header from "../Header";

import "./index.css";
import PasswordItem from "../PasswordItem";
import NoteLockLoader from "../NoteLockLoader";

const passwordPageConstStatus = {
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

class PasswordsPage extends Component {
  state = {
    website: "",
    username: "",
    password: "",
    passwordPageErrMsg: "",
    userId: "",
    passwordPageStatus: passwordPageConstStatus.loading,
    passwordPageFormStatus: passwordPageConstStatus.loading,
    userPasswordsList: [],
  };

  componentDidMount() {
    this.getUserId();
  }

  getUserId = async () => {
    this.setState({ passwordPageFormStatus: passwordPageConstStatus.loading });
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
    if (userIdResponse.ok === true) {
      const userIdData = await userIdResponse.json();
      this.setState(
        {
          userId: userIdData.userId,
          passwordPageFormStatus: passwordPageConstStatus.success,
        },
        this.getUserPasswords
      );
    } else {
      this.setState({
        passwordPageFormStatus: passwordPageConstStatus.failure,
      });
    }
  };

  getUserPasswords = async () => {
    const myToken = Cookies.get("jwt_token");
    this.setState({ passwordPageStatus: passwordPageConstStatus.loading });
    const { userId } = this.state;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${myToken}`,
      },
    };

    const userPasswordsResponse = await fetch(
      `https://note-lock-backend-production.up.railway.app/passwords/${userId}/`,
      options
    );
    const userPasswordsData = await userPasswordsResponse.json();
    if (userPasswordsResponse.ok === true) {
      const parsedUserPasswordsList = userPasswordsData.data.map((each) => ({
        userId: each.user_id,
        passwordId: each.password_id,
        username: each.username,
        password: each.password,
        website: each.website,
      }));

      this.setState({
        userPasswordsList: parsedUserPasswordsList,
        passwordPageStatus: passwordPageConstStatus.success,
      });
    } else {
      this.setState({ passwordPageStatus: passwordPageConstStatus.failure });
    }
  };

  addNewPassword = async () => {
    this.setState({ passwordPageStatus: passwordPageConstStatus.loading });
    const myToken = Cookies.get("jwt_token");
    const { website, username, password, userId } = this.state;
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, website, password }),
    };
    const addNewPasswordResponse = await fetch(
      `https://note-lock-backend-production.up.railway.app/passwords/${userId}`,
      options
    );
    if (addNewPasswordResponse.ok === true) {
      this.setState(
        {
          passwordPageStatus: passwordPageConstStatus.success,
          website: "",
          username: "",
          password: "",
        },
        this.getUserPasswords
      );
    } else {
      this.setState({ passwordPageStatus: passwordPageConstStatus.failure });
    }
  };

  deleteUserPassword = async (id) => {
    const myToken = Cookies.get("jwt_token");
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${myToken}`,
      },
    };

    const deletePasswordItemResponse = await fetch(
      `https://note-lock-backend-production.up.railway.app/passwords/${id}`,
      options
    );
    //const deletePasswordData = await deletePasswordItemResponse.json();
    if (deletePasswordItemResponse.ok === true) {
      this.setState(
        { passwordPageStatus: passwordPageConstStatus.success },
        this.getUserPasswords
      );
    } else {
      this.setState({ passwordPageStatus: passwordPageConstStatus.failure });
    }
  };

  onChangeWebsite = (e) => {
    this.setState({ website: e.target.value });
  };

  onChangeUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  onSubmitPasswordForm = (e) => {
    e.preventDefault();
    const { website, username, password } = this.state;
    if (website !== "" && username !== "" && password !== "") {
      this.addNewPassword();
    } else {
      this.setState({ passwordPageErrMsg: "Please fill all the details" });
    }
  };

  renderPasswordPageSuccess = () => {
    const { userPasswordsList } = this.state;
    return (
      <>
        {userPasswordsList.length === 0 ? (
          <>
            <img
              src="https://res.cloudinary.com/daxizvsge/image/upload/v1718898020/no_passwords_swspgn.jpg"
              alt="no-passwords-img"
              className="no-passwords-img"
            />
            <p className="no-passwords-description">
              There are no passwords to show,Add a password to show.
            </p>
          </>
        ) : (
          <ul className="password-items-container">
            <li className="password-item-header">
              <p className="p-item-web-heading">Website</p>
              <p className="p-item-username-heading">Username</p>
              <p className="p-item-password-password">Password</p>
              <p className="p-item-edit-edit">Edit</p>
              <p className="p-item-delete-delete">Delete</p>
            </li>
            {userPasswordsList.map((each) => (
              <PasswordItem
                passwordItemDetails={each}
                key={each.passwordId}
                onDeleteUserPasswordItem={this.deleteUserPassword}
              />
            ))}
          </ul>
        )}
      </>
    );
  };

  renderPasswordFormSuccess = () => {
    const { website, username, password, passwordPageErrMsg } = this.state;
    return (
      <form className="new-password-form" onSubmit={this.onSubmitPasswordForm}>
        <h3 className="add-password-heading">Add Password</h3>
        <input
          className="website-input"
          placeholder="Enter website"
          type="text"
          value={website}
          onChange={this.onChangeWebsite}
          required
        />
        <div className="inputs-container">
          <input
            type="text"
            className="username-input"
            placeholder="Enter username"
            value={username}
            onChange={this.onChangeUsername}
            required
          />
          <input
            type="password"
            className="password-input"
            placeholder="Enter Password"
            value={password}
            onChange={this.onChangePassword}
            required
          />
        </div>
        <button className="add-password-button" type="submit">
          Add Password
        </button>
        {passwordPageErrMsg !== "" && (
          <p className="error-msg">{passwordPageErrMsg}</p>
        )}
      </form>
    );
  };

  renderPasswordPageLoader = () => <NoteLockLoader />;

  renderPasswordPageFailure = () => (
    <div className="password-page-failure-container">
      <img
        src="https://res.cloudinary.com/daxizvsge/image/upload/v1705386860/alert-triangle_wng4nt.png"
        alt="failure-img"
        className="failure-img"
      />
      <p>There is problem with the request.Please try again.</p>
      <button
        className="failure-retry-button"
        type="button"
        onClick={this.getUserPasswords}
      >
        Retry
      </button>
    </div>
  );

  renderPasswordFormFailure = () => (
    <div className="password-page-failure-container">
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
        onClick={this.getUserId}
      >
        Retry
      </button>
    </div>
  );

  renderPasswordPage = () => {
    const { passwordPageStatus } = this.state;
    switch (passwordPageStatus) {
      case passwordPageConstStatus.loading:
        return this.renderPasswordPageLoader();
      case passwordPageConstStatus.success:
        return this.renderPasswordPageSuccess();
      case passwordPageConstStatus.failure:
        return this.renderPasswordPageFailure();
      default:
        return null;
    }
  };

  renderPasswordForm = () => {
    const { passwordPageFormStatus } = this.state;
    switch (passwordPageFormStatus) {
      case passwordPageConstStatus.loading:
        return this.renderPasswordPageLoader();
      case passwordPageConstStatus.success:
        return this.renderPasswordFormSuccess();
      case passwordPageConstStatus.failure:
        return this.renderPasswordFormFailure();
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="passwords-page-bg">
        <Header />
        <div className="passwords-page-inner">
          {this.renderPasswordForm()}
          {this.renderPasswordPage()}
        </div>
      </div>
    );
  }
}

export default PasswordsPage;
