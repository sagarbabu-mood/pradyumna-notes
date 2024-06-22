import { Component } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Popup from "reactjs-popup";
import "./index.css";
import Cookies from "js-cookie";
import Header from "../Header";
import NoteLockLoader from "../NoteLockLoader";

const newNotePageConstStatus = {
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

class NewNote extends Component {
  state = {
    title: "",
    description: "",
    newNotePageStatus: newNotePageConstStatus.success,
    displayNewNotePageErrorMsg: "",
    displayNewNoteSuccessPopup: false,
  };

  postNewNoteDetails = async () => {
    const { title, description } = this.state;
    this.setState({ newNotePageStatus: newNotePageConstStatus.loading });
    const { match } = this.props;
    const { params } = match;
    const { userId } = params;
    const myToken = Cookies.get("jwt_token");
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    };
    const postNewNoteResponse = await fetch(
      `https://note-lock-backend-production.up.railway.app/new-note/${userId}`,
      options
    );
    if (postNewNoteResponse.ok === true) {
      this.setState({
        newNotePageStatus: newNotePageConstStatus.success,
        displayNewNoteSuccessPopup: true,
      });
    } else {
      this.setState({
        newNotePageStatus: newNotePageConstStatus.failure,
        displayNewNoteSuccessPopup: false,
      });
    }
  };

  changeNewNoteTitleInput = (e) => {
    this.setState({ title: e.target.value });
  };

  changeNewNoteDescriptionInput = (e) => {
    this.setState({ description: e.target.value });
  };

  onSubmitNewNoteDetails = (e) => {
    e.preventDefault();
    const { title, description } = this.state;

    if (title !== "" && description !== "") {
      this.postNewNoteDetails();
    } else {
      this.setState({
        displayNewNotePageErrorMsg: "Please fill all the columns",
      });
    }
  };

  renderNewNotePageLoader = () => <NoteLockLoader />;

  renderNewNotePageFailure = () => (
    <div className="notes-page-failure-container">
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
        onClick={this.onSubmitNewNoteDetails}
      >
        Retry
      </button>
    </div>
  );

  renderNewNotePageSuccess = () => {
    const {
      title,
      description,
      displayNewNotePageErrorMsg,
      displayNewNoteSuccessPopup,
    } = this.state;
    return (
      <form
        className={displayNewNoteSuccessPopup ? "d-none" : "new-note-form"}
        onSubmit={this.onSubmitNewNoteDetails}
      >
        <label className="new-note-label">Title</label>
        <input
          type="text"
          className="new-title-input"
          placeholder="Enter Title"
          onChange={this.changeNewNoteTitleInput}
          value={title}
          required
        />
        <label className="note-edit-label">Description</label>
        <textarea
          className="new-note-description-input"
          placeholder="Enter Description"
          onChange={this.changeNewNoteDescriptionInput}
          value={description}
          required
        />
        <button className="new-note-add-button" type="submit">
          Add
        </button>

        {displayNewNoteSuccessPopup && (
          <Popup
            modal
            open={displayNewNoteSuccessPopup}
            onClose={() =>
              this.setState({
                displayNewNoteSuccessPopup: false,
                title: "",
                description: "",
              })
            }
          >
            <div className="new-note-popup-container">
              <button
                type="button"
                className="close-popup-button"
                onClick={() =>
                  this.setState({
                    displayNewNoteSuccessPopup: false,
                    title: "",
                    description: "",
                  })
                }
              >
                <IoClose size={25} />
              </button>
              <div className="new-note-popup-inner">
                <img
                  src="https://res.cloudinary.com/daxizvsge/image/upload/v1718619846/tick_jpoeka.jpg"
                  alt="tick-img"
                  className="tick-img"
                />
                <p className="new-note-popup-desc">
                  Note has been successfully Saved.
                </p>
                <div className="new-note-popup-buttons-container">
                  <Link to="/note-locker/notes">
                    <button className="view-all-notes-button">
                      View all notes
                    </button>
                  </Link>

                  <button
                    className="new-note-popup-button"
                    onClick={() => {
                      this.setState({
                        displayNewNoteSuccessPopup: false,
                        title: "",
                        description: "",
                      });
                    }}
                  >
                    Add new note
                  </button>
                </div>
              </div>
            </div>
          </Popup>
        )}
        {displayNewNotePageErrorMsg !== "" && (
          <p className="new-note-error-msg">{displayNewNotePageErrorMsg}</p>
        )}
      </form>
    );
  };

  renderNewNotePage = () => {
    const { newNotePageStatus } = this.state;
    switch (newNotePageStatus) {
      case newNotePageConstStatus.loading:
        return this.renderNewNotePageLoader();
      case newNotePageConstStatus.success:
        return this.renderNewNotePageSuccess();
      case newNotePageConstStatus.failure:
        return this.renderNewNotePageFailure();
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="new-note-page-bg">
        <Header />
        <div className="new-note-page-contents">
          <div className="new-note-page-top">
            <Link to="/note-locker/notes">
              <button className="back-arrow-button" type="button">
                <IoArrowBack size={25} />
              </button>
            </Link>
          </div>
          {this.renderNewNotePage()}
        </div>
      </div>
    );
  }
}

export default NewNote;
