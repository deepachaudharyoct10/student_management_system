const pool = require('./db');

const initDb = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      admission_number VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      course VARCHAR(100) NOT NULL,
      year INTEGER NOT NULL,
      date_of_birth DATE NOT NULL,
      email VARCHAR(100) NOT NULL,
      mobile_number VARCHAR(15) NOT NULL,
      gender VARCHAR(10) NOT NULL,
      address TEXT NOT NULL,
      photo_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(query);
    console.log('Students table ready');
  } catch (err) {
    console.error('Error creating table:', err.message);
  }
};

module.exports = initDb;
