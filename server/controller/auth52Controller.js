const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

function generateToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email';
    const { rows } = await db.query(query, [email, hashedPassword]);
    const user = rows[0];
    const token = generateToken(user);

    // Set the token as an HTTP-only cookie in the response headers
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Max age set to 1 hour

    res.status(201).json({ message: 'Registration successful', user });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'An error occurred during user registration.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = 'SELECT id, email, password FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    // Set the token as an HTTP-only cookie in the response headers
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Max age set to 1 hour

    res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Error during user authentication:', error);
    res.status(500).json({ error: 'An error occurred during user authentication.' });
  }
};
