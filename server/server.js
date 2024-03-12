// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const db = require('./db/db'); 
const auth52Routes = require('./routes/auth52Routes'); // Import your authentication routes
const auth52Controller = require('./controller/auth52Controller');

// Load environment variables from .env file
dotenv.config();

// Create an instance of Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.use('/auth', auth52Routes); // Mount authentication routes under the /auth prefix

app.get('/', (req, res) => {
  res.send('Hello, World! This is your Node.js server.');
});

// Start the server
const PORT = process.env.PORT || 3000; // Use port specified in .env or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
