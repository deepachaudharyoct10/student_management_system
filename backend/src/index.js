const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const studentRoutes = require('./routes/students');
const initDb = require('./config/initDb');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('[SERVER] WEB-09 booting, NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded photos as static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/students', studentRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Student Management API is running' });
});

// Initialize DB table then start server (local dev)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await initDb();
  });
} else {
  // On Vercel, init DB on first request
  initDb();
}

module.exports = app;
