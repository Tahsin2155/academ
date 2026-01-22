import { Router } from 'express';
import db from '../db/init.js';

const router = Router();

// Get all subjects
router.get('/', (req, res) => {
  try {
    const subjects = db.all(`
      SELECT s.*, c.name as class_name 
      FROM subjects s 
      JOIN classes c ON s.class_id = c.id 
      ORDER BY s.order_index, s.name
    `);
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single subject by ID
router.get('/:id', (req, res) => {
  try {
    const subject = db.get(`
      SELECT s.*, c.name as class_name 
      FROM subjects s 
      JOIN classes c ON s.class_id = c.id 
      WHERE s.id = ?
    `, [req.params.id]);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chapters for a subject
router.get('/:id/chapters', (req, res) => {
  try {
    const chapters = db.all(
      'SELECT * FROM chapters WHERE subject_id = ? ORDER BY order_index, name',
      [req.params.id]
    );
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
