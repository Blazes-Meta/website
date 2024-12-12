require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const path = require('path');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// .env konfigurieren
process.env.TNS_ADMIN = path.join(__dirname, 'login data');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rate Limiting (max. 1 Anfrage pro IP alle 10 Sekunden)
const limiter = rateLimit({
  windowMs: 10 * 1000, // 10 Sekunden
  max: 5, // Nur 1 Anfrage pro IP
  message: 'Du bist zu schnell. Bitte versuche es später erneut.',
});
app.use(limiter);

// Funktion für den Test-Ping zur Datenbank
async function testDbConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
    });

    const result = await connection.execute('SELECT 1 FROM dual');
    if (result.rows.length > 0) {
      console.log('Datenbankverbindung erfolgreich getestet!');
    } else {
      console.log('Keine Ergebnisse von der Datenbank erhalten.');
    }

    await connection.close();
  } catch (err) {
    console.error('Fehler beim Testen der Datenbankverbindung:', err.message);
  }
}

// Test der Datenbankverbindung
testDbConnection();

// Route für die Login-Seite
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Login-Handling
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Benutzername und Passwort sind erforderlich!');
  }

  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
    });

    const query = `SELECT password_hash FROM users WHERE username = :username`;
    const result = await connection.execute(query, { username });

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(401).send('Ungültige Anmeldedaten.');
    }

    const passwordHash = result.rows[0][0];
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      return res.status(401).send('Ungültige Anmeldedaten.');
    }

    res.send(`<h1>Login erfolgreich! Willkommen, ${username}.</h1>`);
  } catch (err) {
    console.error('Fehler beim Login:', err.message);
    res.status(500).send('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
  }
});

// Registrierung
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Benutzername und Passwort sind erforderlich!');
  }

  // Passwortvalidierung (mindestens 5 Zeichen, eine Zahl und maximal 32 Zeichen)
  const passwordRegex = /^(?=.*\d).{5,32}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).send('Passwort muss mindestens 5 Zeichen lang sein und eine Zahl enthalten.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
    });

    const checkQuery = `SELECT username FROM users WHERE username = :username`;
    const checkResult = await connection.execute(checkQuery, { username });

    if (checkResult.rows.length > 0) {
      await connection.close();
      return res.status(409).send('Benutzername ist bereits vergeben.');
    }

    const insertQuery = `INSERT INTO users (username, password_hash) VALUES (:username, :password_hash)`;
    await connection.execute(insertQuery, { username, password_hash: hashedPassword }, { autoCommit: true });

    await connection.close();

    res.send('Benutzer erfolgreich registriert!');
  } catch (err) {
    console.error('Fehler bei der Registrierung:', err.message);
    res.status(500).send('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
