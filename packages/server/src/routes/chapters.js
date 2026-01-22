import { Router } from 'express';
import db from '../db/init.js';

const router = Router();

// Get all chapters
router.get('/', (req, res) => {
  try {
    const chapters = db.all(`
      SELECT ch.*, s.name as subject_name, c.name as class_name
      FROM chapters ch
      JOIN subjects s ON ch.subject_id = s.id
      JOIN classes c ON s.class_id = c.id
      ORDER BY ch.order_index, ch.name
    `);
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single chapter by ID
router.get('/:id', (req, res) => {
  try {
    const chapter = db.get(`
      SELECT ch.*, s.name as subject_name, s.id as subject_id, c.name as class_name, c.id as class_id
      FROM chapters ch
      JOIN subjects s ON ch.subject_id = s.id
      JOIN classes c ON s.class_id = c.id
      WHERE ch.id = ?
    `, [req.params.id]);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get roadmap for a chapter (nodes + edges)
router.get('/:id/roadmap', (req, res) => {
  try {
    const chapter = db.get('SELECT * FROM chapters WHERE id = ?', [req.params.id]);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    // Get all nodes for this chapter
    const nodes = db.all(`
      SELECT * FROM nodes WHERE chapter_id = ? ORDER BY order_index
    `, [req.params.id]);

    // Get resources for each node
    const nodesWithResources = nodes.map(node => {
      const resources = db.all(
        'SELECT * FROM resources WHERE node_id = ? ORDER BY order_index',
        [node.id]
      );
      
      // Group resources by type
      const groupedResources = {
        articles: resources.filter(r => r.type === 'article'),
        videos: resources.filter(r => r.type === 'video'),
        exercises: resources.filter(r => r.type === 'exercise'),
        pdfs: resources.filter(r => r.type === 'pdf'),
        other: resources.filter(r => !['article', 'video', 'exercise', 'pdf'].includes(r.type))
      };

      return { ...node, resources: groupedResources };
    });

    // Get edges
    const edges = db.all(
      'SELECT * FROM edges WHERE chapter_id = ?',
      [req.params.id]
    );

    res.json({
      chapter,
      nodes: nodesWithResources,
      edges
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
