import express from 'express';
import cors from 'cors';
import { query } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- RAW QUERY ENDPOINT (for SQL Explorer) ---
app.post('/api/query', async (req, res) => {
  const { sql } = req.body;
  try {
    const result = await query(sql);
    // If it's a SELECT query, return rows and columns
    if (result.command === 'SELECT') {
      const cols = result.fields.map(f => f.name);
      const rows = result.rows.map(r => Object.values(r));
      res.json({ cols, rows });
    } else {
      // For INSERT, UPDATE, DELETE
      res.json({ 
        cols: ['Status', 'Message'], 
        rows: [['Success', `${result.command} successful. ${result.rowCount || 0} rows affected.`]] 
      });
    }
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- ENTITY ROUTES ---

// Donors
app.get('/api/donors', async (req, res) => {
  try {
    const result = await query('SELECT * FROM donors ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/donors', async (req, res) => {
  const { name, email, phone, city } = req.body;
  try {
    const result = await query(
      'INSERT INTO donors (name, email, phone, city, donation_count, joined_date) VALUES ($1, $2, $3, $4, 0, CURRENT_DATE) RETURNING *',
      [name, email, phone, city]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NGOs
app.get('/api/ngos', async (req, res) => {
  try {
    const result = await query('SELECT * FROM ngos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ngos', async (req, res) => {
  const { name, city, focus_area, contact } = req.body;
  try {
    // Calling Stored Procedure
    await query('CALL register_ngo_proc($1, $2, $3, $4)', [name, city, focus_area, contact]);
    res.status(201).json({ message: 'NGO registered via stored procedure.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Volunteers
app.get('/api/volunteers', async (req, res) => {
  try {
    const result = await query('SELECT * FROM volunteers ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/volunteers', async (req, res) => {
  const { name, phone, city } = req.body;
  try {
    const result = await query(
      'INSERT INTO volunteers (name, phone, city, deliveries_completed, status) VALUES ($1, $2, $3, 0, $4) RETURNING *',
      [name, phone, city, 'Available']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Donations
app.get('/api/donations', async (req, res) => {
  try {
    const result = await query('SELECT * FROM donations ORDER BY donation_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/donations', async (req, res) => {
  const { donor_name, type, quantity, description } = req.body;
  try {
    // Calling Stored Procedure which handles both Insert and Donor Count Update with Business Rules
    await query('CALL add_donation_proc($1, $2, $3, $4)', [donor_name, type, parseInt(quantity), description]);
    res.status(201).json({ message: 'Donation recorded via stored procedure.' });
  } catch (err) {
    // Stored procedure might raise an exception for business rules (e.g. qty < 1)
    res.status(500).json({ error: err.message });
  }
});

// --- STORED PROCEDURE ROUTES ---

app.post('/api/procedures/assign-delivery', async (req, res) => {
  const { donation_id, volunteer_name, ngo_name } = req.body;
  try {
    await query('CALL assign_delivery_proc($1, $2, $3)', [donation_id, volunteer_name, ngo_name]);
    res.json({ message: 'Delivery assigned successfully via stored procedure.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/procedures/complete-delivery', async (req, res) => {
  const { delivery_id } = req.body;
  try {
    await query('CALL complete_delivery_proc($1)', [delivery_id]);
    res.json({ message: 'Delivery completed successfully via stored procedure.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const result = await query('SELECT * FROM feedbacks ORDER BY feedback_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Requests
app.get('/api/requests', async (req, res) => {
  try {
    const result = await query('SELECT * FROM donation_requests ORDER BY request_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deliveries
app.get('/api/deliveries', async (req, res) => {
  try {
    const result = await query('SELECT * FROM deliveries ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
