const express = require('express');
const mariadb = require('mariadb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'cinema_secret_change_in_production';

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  connectionLimit: 10,
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Απαιτείται σύνδεση.' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Μη έγκυρο token.' });
    req.userId = Number(decoded.id);
    next();
  });
}

app.get('/theatres', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM theatres');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.end();
  }
});

app.get('/theatres/:id/shows', async (req, res) => {
  let conn;
  try {
    const theatreId = req.params.id;
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM shows WHERE theatre_id = ?', [theatreId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.end();
  }
});

app.get('/shows', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM shows');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.end();
  }
});

app.post('/register', async (req, res) => {
  let conn;
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Συμπληρώστε όλα τα πεδία.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    conn = await pool.getConnection();

    const existing = await conn.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Το email χρησιμοποιείται ήδη.' });
    }

    await conn.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    res.status(201).json({ message: 'Ο χρήστης δημιουργήθηκε με επιτυχία!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.end();
  }
});

app.post('/login', async (req, res) => {
  let conn;
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Συμπληρώστε email και κωδικό.' });
    }
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Λάθος email ή κωδικός.' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Λάθος email ή κωδικός.' });
    }
    const userId = Number(user.user_id);
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Επιτυχής σύνδεση!', token, user_id: userId, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.end();
  }
});

app.post('/bookings', authenticateToken, async (req, res) => {
  let conn;
  try {
    const { show_id } = req.body;
    if (!show_id) {
      return res.status(400).json({ error: 'Λείπει το show_id.' });
    }
    conn = await pool.getConnection();

    const existing = await conn.query(
      'SELECT booking_id FROM bookings WHERE user_id = ? AND show_id = ?',
      [req.userId, show_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Έχετε ήδη κάνει κράτηση για αυτή την παράσταση.' });
    }

    await conn.query('INSERT INTO bookings (user_id, show_id) VALUES (?, ?)', [req.userId, show_id]);
    res.status(201).json({ message: 'Η κράτηση ολοκληρώθηκε με επιτυχία!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.end();
  }
});

app.get('/my-bookings', authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT b.booking_id, s.title, s.date, s.price, s.location, t.name AS theatre_name
       FROM bookings b
       INNER JOIN shows s ON b.show_id = s.show_id
       INNER JOIN theatres t ON s.theatre_id = t.theatre_id
       WHERE b.user_id = ?
       ORDER BY b.booking_id DESC`,
      [req.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.end();
  }
});

app.delete('/bookings/:id', authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      'DELETE FROM bookings WHERE booking_id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Η κράτηση δεν βρέθηκε.' });
    }
    res.json({ message: 'Η κράτηση ακυρώθηκε.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
