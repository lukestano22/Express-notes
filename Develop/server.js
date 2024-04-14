// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE_PATH = './db/db.json';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile(DB_FILE_PATH, (err, data) => {
        if (err) {
            console.error('Error reading database file:', err);
            return res.status(500).json({ error: 'Failed to read database' });
        }
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    
    const db = JSON.parse(fs.readFileSync(DB_FILE_PATH));
    db.push(newNote);
    
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2));
    res.json(db);
});

app.delete('/api/notes/:id', (req, res) => {
    const idToDelete = req.params.id;
    
    let db = JSON.parse(fs.readFileSync(DB_FILE_PATH));
    db = db.filter(note => note.id !== idToDelete);
    
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2));
    res.json(db);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});