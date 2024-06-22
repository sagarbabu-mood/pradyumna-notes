import { LuClipboardEdit } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import "./index.css";

const NoteItem = (props) => {
  const { noteItemDetails, deleteNoteItem } = props;
  const { title, noteId, description } = noteItemDetails;
  const onClickDeleteNoteItem = () => {
    deleteNoteItem(noteId);
  };
  return (
    <li className="note-item">
      <div className="note-item-first">
        <p className="note-title">
          Title : <span className="note-item-content-title">{title}</span>
        </p>
        <p className="note-description">
          Description :{" "}
          <span className="note-item-content-description">{description}</span>
        </p>
      </div>
      <div className="note-item-buttons-container">
        <Link to={`/note-locker/notes/${noteId}`}>
          <button type="button" className="edit-note-button">
            <LuClipboardEdit size={25} />
          </button>
        </Link>
        <button
          type="button"
          className="delete-note-button"
          onClick={() => onClickDeleteNoteItem()}
        >
          <MdOutlineDelete size={25} />
        </button>
      </div>
    </li>
  );
};

export default NoteItem;
