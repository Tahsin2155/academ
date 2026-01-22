import { Router } from 'express';
import db from '../db/init.js';

const router = Router();

// Get all classes
router.get('/', (req, res) => {
  try {
    const classes = db.all('SELECT * FROM classes ORDER BY order_index, name');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single class by ID
router.get('/:id', (req, res) => {
  try {
    const classItem = db.get('SELECT * FROM classes WHERE id = ?', [req.params.id]);
    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subjects for a class
router.get('/:id/subjects', (req, res) => {
  try {
    const subjects = db.all(
      'SELECT * FROM subjects WHERE class_id = ? ORDER BY order_index, name',
      [req.params.id]
    );
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
