import { Component } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Popup from "reactjs-popup";

import "./index.css";
import Cookies from "js-cookie";
import Header from "../Header";
import NoteLockLoader from "../NoteLockLoader";

const noteEditPageConstStatus = {
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

class NoteEditPage extends Component {
  state = {
    title: "",
    description: "",
    noteEditPageStatus: noteEditPageConstStatus.loading,
    displayNoteEditPageErrorMsg: "",
    displayNoteUpdatePopup: false,
  };

  componentDidMount() {
    this.getNoteItemDetails();
  }

  getNoteItemDetails = async () => {
    const token = Cookies.get("jwt_token");
    this.setState({ noteEditPageStatus: noteEditPageConstStatus.loading });
    const { match } = this.props;
    const { params } = match;
    const { noteId } = params;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const noteItemDetailsResponse = await fetch(
      `https://note-lock-backend-production.up.railway.app/notes/${noteId}/`,
      options
    );
    if (noteItemDetailsResponse.ok === true) {
      const noteItemDetailsResponseData = await noteItemDetailsResponse.json();
      const parsedNoteItemDetails = {
        userId: noteItemDetailsResponseData.data.user_id,
        noteId: noteItemDetailsResponseData.data.note_id,
        title: noteItemDetailsResponseData.data.title,
        description: noteItemDetailsResponseData.data.description,
      };
      this.setState({
        noteEditPageStatus: noteEditPageConstStatus.success,
        title: parsedNoteItemDetails.title,
        description: parsedNoteItemDetails.description,
        displayNoteEditPageErrorMsg: "",
      });
    } else {
      this.setState({
        noteEditPageStatus: noteEditPageConstStatus.failure,
        displayNoteEditPageErrorMsg: "",
      });
    }
  };

  updateNoteDetails = async () => {
    const { title, description } = this.state;
    this.setState({ noteEditPageStatus: noteEditPageConstStatus.loading });
    const { match } = this.props;
    const { params } = match;
    const { noteId } = params;
    const myToken = Cookies.get("jwt_token");
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    };
    const updateNoteItemResponse = await fetch(
      `https://note-lock-backend-production.up.railway.app/new-note/${noteId}`,
      options
    );
    if (updateNoteItemResponse.ok === true) {
      this.setState({
        noteEditPageStatus: noteEditPageConstStatus.success,
        displayNoteUpdatePopup: true,
      });
    } else {
      this.setState({
        noteEditPageStatus: noteEditPageConstStatus.failure,
        displayNoteUpdatePopup: false,
      });
    }
  };

  changeTitleInput = (e) => {
    this.setState({ title: e.target.value });
  };

  changeDescriptionInput = (e) => {
    this.setState({ description: e.target.value });
  };

  onSubmitNoteDetails = (e) => {
    e.preventDefault();
    const { title, description } = this.state;

    if (title !== "" && description !== "") {
      this.updateNoteDetails();
    } else {
      this.setState({
        displayNoteEditPageErrorMsg: "Please fill all the columns",
      });
    }
  };

  renderNoteEditPageLoader = () => <NoteLockLoader />;

  renderNoteEditPageFailure = () => (
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
        onClick={this.getNoteItemDetails}
      >
        Retry
      </button>
    </div>
  );

  renderNoteEditPageSuccess = () => {
    const {
      title,
      description,
      displayNoteEditPageErrorMsg,
      displayNoteUpdatePopup,
    } = this.state;
    return (
      <form
        className={displayNoteUpdatePopup ? "d-none" : "edit-note-form"}
        onSubmit={this.onSubmitNoteDetails}
      >
        <label className="note-edit-label">Title</label>
        <input
          type="text"
          className="title-edit-input"
          placeholder="Enter Title"
          onChange={this.changeTitleInput}
          value={title}
          required
        />
        <label className="note-edit-label">Description</label>
        <textarea
          className="note-edit-description-input"
          placeholder="Enter Description"
          onChange={this.changeDescriptionInput}
          value={description}
          required
        />
        <button className="note-edit-submit-button" type="submit">
          Submit
        </button>

        {displayNoteUpdatePopup && (
          <Popup
            modal
            open={displayNoteUpdatePopup}
            onClose={() => this.setState({ displayNoteUpdatePopup: false })}
          >
            <div className="note-update-popup-container">
              <button
                type="button"
                className="close-popup-button"
                onClick={() => this.setState({ displayNoteUpdatePopup: false })}
              >
                <IoClose size={25} />
              </button>
              <div className="note-update-popup-inner">
                <img
                  src="https://res.cloudinary.com/daxizvsge/image/upload/v1718619846/tick_jpoeka.jpg"
                  alt="tick-img"
                  className="tick-img"
                />
                <p className="note-update-popup-desc">
                  Note has been successfully updated.
                </p>
                <div className="note-update-popup-buttons-container">
                  <Link to="/note-locker/notes">
                    <button className="view-all-notes-button">
                      View all notes
                    </button>
                  </Link>

                  <button
                    className="edit-note-popup-button"
                    onClick={() => {
                      this.setState({ displayNoteUpdatePopup: false });
                    }}
                  >
                    Edit note
                  </button>
                </div>
              </div>
            </div>
          </Popup>
        )}
        {displayNoteEditPageErrorMsg !== "" && (
          <p className="note-edit-error-msg">{displayNoteEditPageErrorMsg}</p>
        )}
      </form>
    );
  };

  renderNoteEditPage = () => {
    const { noteEditPageStatus } = this.state;
    switch (noteEditPageStatus) {
      case noteEditPageConstStatus.loading:
        return this.renderNoteEditPageLoader();
      case noteEditPageConstStatus.success:
        return this.renderNoteEditPageSuccess();
      case noteEditPageConstStatus.failure:
        return this.renderNoteEditPageFailure();
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="note-edit-page-bg">
        <Header />
        <div className="edit-page-contents">
          <div className="edit-page-top">
            <Link to="/note-locker/notes">
              <button className="back-arrow-button" type="button">
                <IoArrowBack size={25} />
              </button>
            </Link>
          </div>
          {this.renderNoteEditPage()}
        </div>
      </div>
    );
  }
}

export default NoteEditPage;
