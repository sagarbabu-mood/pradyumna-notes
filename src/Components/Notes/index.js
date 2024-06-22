import { Component } from "react";
import Cookies from "js-cookie";
import { MdOutlinePostAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import Header from "../Header";
import "./index.css";
import NoteItem from "../NoteItem";
import NoteLockLoader from "../NoteLockLoader";

const notesPageConstStatus = {
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

class Notes extends Component {
  state = {
    userNotesList: [],
    notesPageStatus: notesPageConstStatus.loading,
    userId: "",
  };

  componentDidMount() {
    this.getUserNotesList();
  }

  getUserNotesList = async () => {
    this.setState({ notesPageStatus: notesPageConstStatus.loading });
    const myToken = Cookies.get("jwt_token");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${myToken}`,
      },
    };
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
    const userNotesResponse = await fetch(
      "https://note-lock-backend-production.up.railway.app/notes/",
      options
    );
    if (userNotesResponse.ok === true && userIdResponse.ok === true) {
      const userNotesResponseData = await userNotesResponse.json();
      const parsedUserNotesData = userNotesResponseData.data.map((each) => ({
        noteId: each.note_id,
        userId: each.user_id,
        title: each.title,
        description: each.description,
      }));
      this.setState({
        userNotesList: parsedUserNotesData,
        userId: userIdData.userId,
        notesPageStatus: notesPageConstStatus.success,
      });
    } else {
      this.setState({ notesPageStatus: notesPageConstStatus.failure });
    }
  };

  deleteNote = async (id) => {
    const myToken = Cookies.get("jwt_token");
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${myToken}`,
      },
    };
    const deleteNoteResponse = await fetch(
      `https://note-lock-backend-production.up.railway.app/new-note/${id}/`,
      options
    );
    if (deleteNoteResponse.ok === true) {
      this.getUserNotesList();
    }
  };

  retryNotesPage = () => {
    this.getUserNotesList();
  };

  renderNotesPageLoader = () => <NoteLockLoader />;

  renderNotesPageSuccess = () => {
    const { userNotesList, userId } = this.state;
    return (
      <>
        {userNotesList.length === 0 ? (
          <div className="no-notes-container">
            <img
              src="https://res.cloudinary.com/daxizvsge/image/upload/v1716265385/OIP_woirnr.jpg"
              alt="no-notes-img"
              className="no-notes-img"
            />
            <p className="no-notes-description">
              There are no Notes to show,Add a Note to show.
            </p>
            <Link to={`/note-locker/new-note/${userId}`}>
              <button className="add-note-redirect-button" type="button">
                Add note
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="notes-top-container">
              <h1 className="your-notes-heading">Your Notes</h1>
              <Link
                to={`/note-locker/new-note/${userId}`}
                className="add-button-link"
              >
                <button type="button" className="add-button">
                  <MdOutlinePostAdd size={45} />
                </button>
              </Link>
            </div>
            <ul className="notes-items-container">
              {userNotesList.map((eachNote) => (
                <NoteItem
                  key={eachNote.noteId}
                  noteItemDetails={eachNote}
                  deleteNoteItem={this.deleteNote}
                />
              ))}
            </ul>
          </>
        )}
      </>
    );
  };

  renderNotesPageFailure = () => (
    <div className="notes-page-failure-container">
      <img
        src="https://res.cloudinary.com/daxizvsge/image/upload/v1705386860/alert-triangle_wng4nt.png"
        alt="failure-img"
        className="failure-img"
      />
      <p>There is problem with the request.Please try again.</p>
      <button
        className="failure-retry-button"
        type="button"
        onClick={this.retryNotesPage}
      >
        Retry
      </button>
    </div>
  );

  renderNotesPage = () => {
    const { notesPageStatus } = this.state;
    switch (notesPageStatus) {
      case notesPageConstStatus.loading:
        return this.renderNotesPageLoader();
      case notesPageConstStatus.success:
        return this.renderNotesPageSuccess();
      case notesPageConstStatus.failure:
        return this.renderNotesPageFailure();
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="notes-bg">
        <Header />
        <div className="notes-inner">{this.renderNotesPage()}</div>
      </div>
    );
  }
}

export default Notes;
