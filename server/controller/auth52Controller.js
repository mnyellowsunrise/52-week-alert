// Example code to handle user registration and authentication

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

// Function to hash the user's password
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Function to verify the user's password
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Function to generate a JWT token
function generateToken(user) {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}

// User registration endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await db.query(query, [username, email, hashedPassword]);
    const user = rows[0];
    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'An error occurred during user registration.' });
  }
});

// User authentication endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await db.query(query, [username]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    console.error('Error during user authentication:', error);
    res.status(500).json({ error: 'An error occurred during user authentication.' });
  }
});

