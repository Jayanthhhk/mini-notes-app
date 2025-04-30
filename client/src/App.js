import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch notes
  useEffect(() => {
    axios.get('http://localhost:5050/notes')
      .then(res => {
        setNotes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching notes:', err);
        setLoading(false);
      });
  }, []);

  // Add note
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return alert('Both title and content are required!');
    }

    axios.post('http://localhost:5050/notes', { title, content })
      .then(res => {
        setNotes([res.data, ...notes]);
        setTitle('');
        setContent('');
      })
      .catch(err => console.error('Error adding note:', err));
  };

  // Delete note
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5050/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(note => note._id !== id));
      })
      .catch(err => console.error('Error deleting note:', err));
  };

  return (
    <div className="App">
      <header>
        <h1>Mini Notes App</h1>
        <h2>Keep your thoughts organized</h2>
      </header>

      <form className="add-note-form" onSubmit={handleSubmit}>
        <input
          className="input-field"
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="input-field"
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
        <button className="submit-btn" type="submit">Add Note</button>
      </form>

      {loading ? (
        <div className="loading">Loading notes...</div>
      ) : notes.length === 0 ? (
        <p className="no-notes">No notes available. Start by adding one!</p>
      ) : (
        <ul className="notes-list">
          {notes.map((note, index) => (
            <li key={note._id} className="note-item">
              <span className="note-number">{index + 1}.</span>
              <div className="note-content">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <button className="delete-btn" onClick={() => handleDelete(note._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
