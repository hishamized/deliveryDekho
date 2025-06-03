const path = require('path');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');
require('dotenv').config();

const db = require('./models'); 
const adminRoutes = require('./routes/adminRoutes');
const riderRoutes = require('./routes/riderRoutes'); 

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // your React app
  credentials: true
}));
app.use(express.json());

// Session setup
const sessionStore = new SequelizeStore({
  db: db.sequelize,
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'mySecretKey',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: false, // true if using HTTPS
    sameSite: 'lax'
  }
}));

// Create session table if it doesn't exist
sessionStore.sync();

app.use('/api/admins', adminRoutes);
app.use('/api/riders', riderRoutes); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/test-db', async (req, res) => {
  try {
    res.send('Database connection successful!');
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('DB Error');
  }
});

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  try {
    console.log(`Backend is running on Port: ${port}`);
  } catch (err) {
    console.error('Sequelize sync failed:', err);
  }
});
