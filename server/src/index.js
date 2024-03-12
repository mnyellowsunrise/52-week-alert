// index.js
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth52Routes');

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
