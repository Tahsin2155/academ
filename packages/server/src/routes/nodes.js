import { Router } from 'express';
import db from '../db/init.js';

const router = Router();

// Get single node by ID with resources
router.get('/:id', (req, res) => {
  try {
    const node = db.get('SELECT * FROM nodes WHERE id = ?', [req.params.id]);
    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    const resources = db.all(
      'SELECT * FROM resources WHERE node_id = ? ORDER BY order_index',
      [req.params.id]
    );

    const groupedResources = {
      articles: resources.filter(r => r.type === 'article'),
      videos: resources.filter(r => r.type === 'video'),
      exercises: resources.filter(r => r.type === 'exercise'),
      pdfs: resources.filter(r => r.type === 'pdf'),
      other: resources.filter(r => !['article', 'video', 'exercise', 'pdf'].includes(r.type))
    };

    res.json({ ...node, resources: groupedResources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get children of a node
router.get('/:id/children', (req, res) => {
  try {
    const children = db.all(
      'SELECT * FROM nodes WHERE parent_id = ? ORDER BY order_index',
      [req.params.id]
    );
    res.json(children);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search nodes
router.get('/search/:query', (req, res) => {
  try {
    const query = `%${req.params.query}%`;
    const nodes = db.all(`
      SELECT n.*, ch.name as chapter_name, s.name as subject_name
      FROM nodes n
      JOIN chapters ch ON n.chapter_id = ch.id
      JOIN subjects s ON ch.subject_id = s.id
      WHERE n.title LIKE ? OR n.description LIKE ? OR n.content LIKE ?
      LIMIT 50
    `, [query, query, query]);
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
