const fs = require('fs')
const path = require('path')
const db = require('./db/db.json')

const port = process.env.port || 3001

// Starts express app
const express = require('express')
const app = express()

//Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(`/${__dirname}/public`, 'index.html'))
})

//Notes route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(`/${__dirname}/public`, 'notes.html'))
})

//Creates a randomized id that won't be repeated
const { v4: uuidv4 } = require('uuid');

// Unblocks public folder
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(express.json())


// Gets data that is already there
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            console.error('Error reading database file:', err);
            return res.status(500).json({ error: 'Failed to read database' });
        }

        const notes = JSON.parse(data);
        res.json(notes);
    });
});

// Posts data that is written
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    db.push(newNote);

    fs.writeFileSync('./db/db.json', JSON.stringify(db));
    res.json(db);
});

// deletes unwanted notes
app.delete('/api/notes/:id', (req, res) => {
    const idToDelete = req.params.id;
    const updatedDb = db.filter(note => note.id != idToDelete);

    fs.writeFileSync('./db/db.json', JSON.stringify(updatedDb));
    res.json(updatedDb);
});

//app location
app.listen(port, () => 
    console.log(`Port: ${port}`)
)
