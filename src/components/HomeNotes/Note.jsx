import React from "react";
import deleteIcon from "./delete.svg";
import "./Note.css";

let timer = 500, timeout;

function Note({ note, updateText, deleteNote }) {
  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const monthNames = ["Jan", "Feb", "March", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let hrs = date.getHours();
    let amPm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs ? hrs : "12";
    hrs = hrs > 12 ? (hrs = 24 - hrs) : hrs;
    let min = date.getMinutes();
    min = min < 10 ? "0" + min : min;
    let day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${hrs}:${min} ${amPm} ${day} ${month}`;
  };

  const debounce = (func) => {
    clearTimeout(timeout);
    timeout = setTimeout(func, timer);
  };

  const handleUpdateText = (text, id) => {
    debounce(() => updateText(text, id));
  };

  return (
    <div className="note" style={{ backgroundColor: note.color }}>
      <textarea
        className="note_text"
        defaultValue={note.text}
        onChange={(event) => handleUpdateText(event.target.value, note.id)}
      />
      <div className="note_footer">
        <p>{formatDate(note.time)}</p>
        <img
          src={deleteIcon}
          alt="DELETE"
          onClick={() => deleteNote(note.id)}
        />
      </div>
    </div>
  );
}

export default Note;
