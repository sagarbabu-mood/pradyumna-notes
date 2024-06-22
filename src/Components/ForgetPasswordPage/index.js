import { Component } from "react";
import { Link } from "react-router-dom";
import NoteLockLoader from "../NoteLockLoader";
import "./index.css";

const forgetPasswordConstStatus = {
  getOtpSection: "GETOTP",
  verifyOtpSection: "VERIFYOTP",
  changePasswordSection: "CHANGEPASSWORD",
  loading: "LOADING",
  success: "SUCCESS",
};

class ForgetPasswordPage extends Component {
  state = {
    foregtPasswordPageStatus: forgetPasswordConstStatus.getOtpSection,
    email: "",
    displayEmailErrorMsg: "",
    otpInput: "",
    displayOtpErrorMsg: "",
    displayChangePasswordErrorMsg: "",
    newPassword: "",
    newConfirmPassword: "",
  };

  resendOtp = async () => {
    const { email } = this.state;
    this.setState({
      foregtPasswordPageStatus: forgetPasswordConstStatus.loading,
      otpInput: "",
      displayOtpErrorMsg: "",
    });
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    };
    const resendOtpResponse = await fetch(
      "https://note-lock-backend-production.up.railway.app/send-otp",
      options
    );
    if (resendOtpResponse.ok === true) {
      this.setState({
        foregtPasswordPageStatus: forgetPasswordConstStatus.verifyOtpSection,
      });
    }
  };

  sendOtp = async () => {
    const { email } = this.state;
    if (email !== "") {
      this.setState({
        foregtPasswordPageStatus: forgetPasswordConstStatus.loading,
      });
      const details = { email };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      };
      const generateOtpResponse = await fetch(
        "https://note-lock-backend-production.up.railway.app/send-otp/",
        options
      );
      const generateOtpResponseData = await generateOtpResponse.json();
      console.log(generateOtpResponseData);
      if (generateOtpResponse.ok === true) {
        this.setState({
          displayEmailErrorMsg: "",
          foregtPasswordPageStatus: forgetPasswordConstStatus.verifyOtpSection,
        });
      } else {
        this.setState({
          displayEmailErrorMsg: generateOtpResponseData.Error,
          foregtPasswordPageStatus: forgetPasswordConstStatus.getOtpSection,
          email: "",
        });
      }
    } else {
      this.setState({ displayEmailErrorMsg: "Please fill the column" });
    }
  };

  verifyOtp = async () => {
    const { otpInput, email } = this.state;
    if (otpInput !== "") {
      this.setState({
        foregtPasswordPageStatus: forgetPasswordConstStatus.loading,
      });
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userOtp: otpInput }),
      };

      const otpVerifyResponse = await fetch(
        "https://note-lock-backend-production.up.railway.app/verify-otp/",
        options
      );
      const otpVerifyResponseData = await otpVerifyResponse.json();
      if (otpVerifyResponse.ok === true) {
        this.setState({
          otpInput: "",
          displayOtpErrorMsg: "",
          foregtPasswordPageStatus:
            forgetPasswordConstStatus.changePasswordSection,
        });
      } else {
        this.setState({
          displayOtpErrorMsg: otpVerifyResponseData.Error,
          otpInput: "",
          foregtPasswordPageStatus: forgetPasswordConstStatus.verifyOtpSection,
        });
      }
    } else {
      this.setState({ displayOtpErrorMsg: "Please enter otp", otpInput: "" });
    }
  };

  changeOtpInput = (e) => {
    this.setState({ otpInput: e.target.value });
  };

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  changeNewPassword = (e) => {
    this.setState({ newPassword: e.target.value });
  };

  confirmNewPassword = (e) => {
    this.setState({ newConfirmPassword: e.target.value });
  };

  updateNewPassword = async () => {
    const { newPassword, newConfirmPassword, email } = this.state;
    if (newPassword !== "" && newConfirmPassword !== "") {
      if (newPassword === newConfirmPassword) {
        this.setState({
          foregtPasswordPageStatus: forgetPasswordConstStatus.loading,
        });
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password: newPassword }),
        };
        const updateNewPasswordResponse = await fetch(
          "https://note-lock-backend-production.up.railway.app/forget-password/",
          options
        );
        const updateNewPasswordData = await updateNewPasswordResponse.json();
        if (updateNewPasswordResponse.ok === true) {
          console.log(updateNewPasswordData);
          this.setState({
            displayChangePasswordErrorMsg: "",
            foregtPasswordPageStatus: forgetPasswordConstStatus.success,
            newPassword: "",
            newConfirmPassword: "",
          });
        } else {
          this.setState({
            foregtPasswordPageStatus:
              forgetPasswordConstStatus.changePasswordSection,
            displayChangePasswordErrorMsg: updateNewPasswordData.Error,
          });
        }
      } else {
        this.setState({
          displayChangePasswordErrorMsg: "password didn't match",
        });
      }
    } else {
      this.setState({
        displayChangePasswordErrorMsg: "Please fill all the details",
      });
    }
  };

  renderForgetPasswordGetOtpSection = () => {
    const { email, displayEmailErrorMsg } = this.state;
    return (
      <div className="forget-inner-container">
        <input
          type="email"
          className="email-input"
          placeholder="Enter registerd email"
          value={email}
          onChange={this.onChangeEmail}
          required
        />
        <button className="get-otp-button" type="button" onClick={this.sendOtp}>
          Get Otp
        </button>
        {displayEmailErrorMsg !== "" && (
          <p className="error-email-msg">{displayEmailErrorMsg}</p>
        )}
      </div>
    );
  };

  renderVerifyOtpSection = () => {
    const { otpInput, displayOtpErrorMsg } = this.state;
    return (
      <div className="enter-otp-container">
        <input
          type="number"
          placeholder="Enter OTP"
          className="otp-input"
          onChange={this.changeOtpInput}
          value={otpInput}
          required
        />
        <p className="resend-otp" onClick={this.resendOtp}>
          Resend OTP
        </p>
        <button
          className="submit-otp-button"
          type="button"
          onClick={this.verifyOtp}
        >
          Submit
        </button>
        {displayOtpErrorMsg !== "" && (
          <p className="error-email-msg">{displayOtpErrorMsg}</p>
        )}
      </div>
    );
  };

  renderChangePasswordSection = () => {
    const { newPassword, newConfirmPassword, displayChangePasswordErrorMsg } =
      this.state;
    return (
      <div className="change-password-container">
        <input
          type="password"
          placeholder="Enter new password"
          className="new-password-input"
          onChange={this.changeNewPassword}
          value={newPassword}
          required
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="confirm-new-password-input"
          onChange={this.confirmNewPassword}
          value={newConfirmPassword}
          required
        />
        <button
          className="new-password-submit"
          onClick={this.updateNewPassword}
          type="button"
        >
          Submit
        </button>
        {displayChangePasswordErrorMsg !== "" && (
          <p className="error-email-msg">{displayChangePasswordErrorMsg}</p>
        )}
      </div>
    );
  };

  renderSuccessSection = () => (
    <div className="success-change-password-container">
      <img
        src="https://res.cloudinary.com/daxizvsge/image/upload/v1718619846/tick_jpoeka.jpg"
        alt="tick-img"
        className="tick-img"
      />
      <p className="success-password-description">
        You've successfully changed your password.
      </p>
      <Link to="/login" className="login-link-button">
        <button className="go-login-page-button" type="button">
          Go to Login page.
        </button>
      </Link>
    </div>
  );

  renderLoader = () => <NoteLockLoader />;

  renderForgetPasswordPage = () => {
    const { foregtPasswordPageStatus } = this.state;
    switch (foregtPasswordPageStatus) {
      case forgetPasswordConstStatus.getOtpSection:
        return this.renderForgetPasswordGetOtpSection();
      case forgetPasswordConstStatus.verifyOtpSection:
        return this.renderVerifyOtpSection();
      case forgetPasswordConstStatus.changePasswordSection:
        return this.renderChangePasswordSection();
      case forgetPasswordConstStatus.success:
        return this.renderSuccessSection();
      case forgetPasswordConstStatus.loading:
        return this.renderLoader();
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="forget-password-bg">
        {this.renderForgetPasswordPage()}
      </div>
    );
  }
}

export default ForgetPasswordPage;
