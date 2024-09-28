const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Create the app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for handling form data
app.use(cors());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contactdb')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Define a schema for storing contact form details
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Create a model based on the schema
const Contact = mongoose.model('Contact', contactSchema);

// POST route for saving form data
app.post('/submit', async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Create a new contact object based on the Contact model
    const newContact = new Contact({
        name,
        email,
        phone,
        message,
    });

    try {
        // Save the new contact object to MongoDB
        await newContact.save();
        res.status(200).json({ message: 'Form submission successful!' });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting form', error: err });
    }
});

// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Ensure there's an index.html in 'public' folder
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Server is running on ${url}`);
    console.log(`Click here to open: ${url}`);
});
