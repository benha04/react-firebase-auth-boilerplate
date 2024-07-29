import React from "react";
import Note from "./Note.jsx";
import "./NoteContainer.css";

function NoteContainer({ notes, deleteNote, updateText }) {
  const reverseArray = (arr) => {
    return arr.slice().reverse();
  };

  const reversedNotes = reverseArray(notes);

  return (
    <div className="note-container">
      <h2>Notes</h2>
      <div className="note-container_notes custom-scroll">
        {reversedNotes.length > 0 ? (
          reversedNotes.map((item) => (
            <Note
              key={item.id}
              note={item}
              deleteNote={deleteNote}
              updateText={updateText}
            />
          ))
        ) : (
          <h3>No Notes present</h3>
        )}
      </div>
    </div>
  );
}

export default NoteContainer;
