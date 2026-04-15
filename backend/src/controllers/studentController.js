const pool = require('../config/db');

// Generate unique admission number: ADM-YYYY-XXXX
const generateAdmissionNumber = async () => {
  const year = new Date().getFullYear();
  const result = await pool.query(
    `SELECT admission_number FROM students
     WHERE admission_number LIKE $1
     ORDER BY admission_number DESC LIMIT 1`,
    [`ADM-${year}-%`]
  );

  let sequence = 1;
  if (result.rows.length > 0) {
    const last = result.rows[0].admission_number;
    sequence = parseInt(last.split('-')[2]) + 1;
  }

  return `ADM-${year}-${String(sequence).padStart(4, '0')}`;
};

// GET /api/students
const getAllStudents = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM students';
    let params = [];

    if (search) {
      query += ` WHERE name ILIKE $1 OR course ILIKE $1 OR admission_number ILIKE $1`;
      params = [`%${search}%`];
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, course, year, date_of_birth, email, mobile_number, gender, address } = req.body;

    // Validation
    if (!name || !course || !year || !date_of_birth || !email || !mobile_number || !gender || !address) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile_number)) {
      return res.status(400).json({ success: false, message: 'Mobile number must be 10 digits' });
    }

    const admission_number = await generateAdmissionNumber();
    const photo_url = req.file ? req.file.path : null;

    const result = await pool.query(
      `INSERT INTO students
        (admission_number, name, course, year, date_of_birth, email, mobile_number, gender, address, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [admission_number, name, course, year, date_of_birth, email, mobile_number, gender, address, photo_url]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const { name, course, year, date_of_birth, email, mobile_number, gender, address } = req.body;

    if (!name || !course || !year || !date_of_birth || !email || !mobile_number || !gender || !address) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile_number)) {
      return res.status(400).json({ success: false, message: 'Mobile number must be 10 digits' });
    }

    // Check if a new photo was uploaded
    const existing = await pool.query('SELECT photo_url FROM students WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const photo_url = req.file ? req.file.path : existing.rows[0].photo_url;

    const result = await pool.query(
      `UPDATE students SET
        name=$1, course=$2, year=$3, date_of_birth=$4,
        email=$5, mobile_number=$6, gender=$7, address=$8, photo_url=$9
       WHERE id=$10 RETURNING *`,
      [name, course, year, date_of_birth, email, mobile_number, gender, address, photo_url, req.params.id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
