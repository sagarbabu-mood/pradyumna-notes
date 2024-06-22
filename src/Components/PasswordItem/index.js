import { LuClipboardEdit } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { withRouter, Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Popup from "reactjs-popup";
import Cookies from "js-cookie";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";

import "./index.css";

const PasswordItem = (props) => {
  const [userPassword, changeUserPassword] = useState("");
  const [userSpecificPassword, changeUserSpecificPassword] = useState("");
  const [displayUserPassword, changeDisplayUserPassword] = useState(false);
  const [verifyPasswordErrorMsg, changeVerifyPasswordMessage] = useState("");
  const { passwordItemDetails, onDeleteUserPasswordItem } = props;
  const { userId, passwordId, website, username } = passwordItemDetails;
  const onChangeUserPassword = (e) => {
    changeUserPassword(e.target.value);
  };
  const deletePassItem = () => {
    onDeleteUserPasswordItem(passwordId);
  };
  const verifyUserPasswordFunction = async () => {
    if (userPassword !== "") {
      const myToken = Cookies.get("jwt_token");

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${myToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: userPassword }),
      };
      const passwordVerifyResponse = await fetch(
        `https://note-lock-backend-production.up.railway.app/verify-password/${userId}`,
        options
      );
      if (passwordVerifyResponse.ok === true) {
        const passwordOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${myToken}`,
          },
        };
        const specificPasswordResponse = await fetch(
          `https://note-lock-backend-production.up.railway.app/password/${passwordId}`,
          passwordOptions
        );
        const specificPasswordData = await specificPasswordResponse.json();

        if (specificPasswordResponse.ok === true) {
          changeUserSpecificPassword(specificPasswordData.data.password);
          changeDisplayUserPassword(true);
          changeVerifyPasswordMessage("");
          changeUserPassword("");
        }
      } else {
        changeVerifyPasswordMessage("Incorrect Password");
      }
    } else {
      changeVerifyPasswordMessage("Please fill all details");
    }
  };

  return (
    <li className="password-item">
      <p className="p-item-web">{website}</p>
      <p className="p-item-username">{username}</p>
      <p className="p-item-password">
        ******
        <Popup
          modal
          trigger={
            <button type="button" className="password-item-eye-button">
              <FaEyeSlash />
            </button>
          }
        >
          {(close) => (
            <div className="password-check-popup-container">
              <button
                type="button"
                className="close-popup-button"
                onClick={() => {
                  changeDisplayUserPassword(false);
                  changeUserPassword("");
                  changeVerifyPasswordMessage("");
                  close();
                }}
              >
                <IoClose size={25} />
              </button>
              {displayUserPassword ? (
                <div className="password-check-popup-inner">
                  <p className="user-password-content">
                    Your Password :{" "}
                    <span className="specific-password">
                      {userSpecificPassword}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="password-check-popup-inner">
                  <p className="password-check-desc">
                    Enter your notelock account password to view password.
                  </p>
                  <input
                    type="password"
                    className="password-check-password-input"
                    onChange={onChangeUserPassword}
                    value={userPassword}
                  />
                  <button
                    className="verify-popup-password-button"
                    type="button"
                    onClick={() => verifyUserPasswordFunction()}
                  >
                    Verify
                  </button>
                  {verifyPasswordErrorMsg !== "" && (
                    <p className="error-msg"> {verifyPasswordErrorMsg}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </Popup>
      </p>
      <p className="p-item-edit">
        <Link to={`/note-locker/password/${passwordId}`}>
          <button type="button" className="edit-password-button">
            <LuClipboardEdit size={25} />
          </button>
        </Link>
      </p>
      <p className="p-item-delete">
        <button
          type="button"
          className="delete-password-button"
          onClick={() => deletePassItem()}
        >
          <MdOutlineDelete size={25} />
        </button>
      </p>
    </li>
  );
};

export default withRouter(PasswordItem);
