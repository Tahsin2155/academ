import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init.js';

const router = Router();

// ============== CLASSES ==============

router.get('/classes', (req, res) => {
  try {
    const classes = db.all('SELECT * FROM classes ORDER BY order_index, name');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/classes', (req, res) => {
  try {
    const { name, description, order_index = 0 } = req.body;
    const id = uuidv4();
    db.run(
      'INSERT INTO classes (id, name, description, order_index) VALUES (?, ?, ?, ?)',
      [id, name, description, order_index]
    );
    const newClass = db.get('SELECT * FROM classes WHERE id = ?', [id]);
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/classes/:id', (req, res) => {
  try {
    const { name, description, order_index } = req.body;
    db.run(
      'UPDATE classes SET name = COALESCE(?, name), description = COALESCE(?, description), order_index = COALESCE(?, order_index), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, order_index, req.params.id]
    );
    const updated = db.get('SELECT * FROM classes WHERE id = ?', [req.params.id]);
    if (!updated) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/classes/:id', (req, res) => {
  try {
    const result = db.run('DELETE FROM classes WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== SUBJECTS ==============

router.get('/subjects', (req, res) => {
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

router.post('/subjects', (req, res) => {
  try {
    const { class_id, name, description, icon, color = '#3B82F6', order_index = 0 } = req.body;
    const id = uuidv4();
    db.run(
      'INSERT INTO subjects (id, class_id, name, description, icon, color, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, class_id, name, description, icon, color, order_index]
    );
    const newSubject = db.get('SELECT * FROM subjects WHERE id = ?', [id]);
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/subjects/:id', (req, res) => {
  try {
    const { class_id, name, description, icon, color, order_index } = req.body;
    db.run(`
      UPDATE subjects SET 
        class_id = COALESCE(?, class_id),
        name = COALESCE(?, name), 
        description = COALESCE(?, description),
        icon = COALESCE(?, icon),
        color = COALESCE(?, color),
        order_index = COALESCE(?, order_index),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [class_id, name, description, icon, color, order_index, req.params.id]);
    const updated = db.get('SELECT * FROM subjects WHERE id = ?', [req.params.id]);
    if (!updated) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/subjects/:id', (req, res) => {
  try {
    const result = db.run('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== CHAPTERS ==============

router.get('/chapters', (req, res) => {
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

router.post('/chapters', (req, res) => {
  try {
    const { subject_id, name, description, order_index = 0 } = req.body;
    const id = uuidv4();
    db.run(
      'INSERT INTO chapters (id, subject_id, name, description, order_index) VALUES (?, ?, ?, ?, ?)',
      [id, subject_id, name, description, order_index]
    );
    const newChapter = db.get('SELECT * FROM chapters WHERE id = ?', [id]);
    res.status(201).json(newChapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/chapters/:id', (req, res) => {
  try {
    const { subject_id, name, description, order_index } = req.body;
    db.run(`
      UPDATE chapters SET 
        subject_id = COALESCE(?, subject_id),
        name = COALESCE(?, name), 
        description = COALESCE(?, description),
        order_index = COALESCE(?, order_index),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [subject_id, name, description, order_index, req.params.id]);
    const updated = db.get('SELECT * FROM chapters WHERE id = ?', [req.params.id]);
    if (!updated) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/chapters/:id', (req, res) => {
  try {
    const result = db.run('DELETE FROM chapters WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== NODES ==============

router.get('/nodes', (req, res) => {
  try {
    const { chapter_id } = req.query;
    let query = 'SELECT * FROM nodes';
    const params = [];
    if (chapter_id) {
      query += ' WHERE chapter_id = ?';
      params.push(chapter_id);
    }
    query += ' ORDER BY order_index';
    const nodes = db.all(query, params);
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/nodes', (req, res) => {
  try {
    const { 
      chapter_id, parent_id, title, description, content,
      position_x = 0, position_y = 0, node_type = 'concept', order_index = 0 
    } = req.body;
    const id = uuidv4();
    db.run(`
      INSERT INTO nodes (id, chapter_id, parent_id, title, description, content, position_x, position_y, node_type, order_index) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, chapter_id, parent_id, title, description, content, position_x, position_y, node_type, order_index]);
    const newNode = db.get('SELECT * FROM nodes WHERE id = ?', [id]);
    res.status(201).json(newNode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/nodes/:id', (req, res) => {
  try {
    const { 
      chapter_id, parent_id, title, description, content,
      position_x, position_y, node_type, status, order_index 
    } = req.body;
    db.run(`
      UPDATE nodes SET 
        chapter_id = COALESCE(?, chapter_id),
        parent_id = ?,
        title = COALESCE(?, title), 
        description = COALESCE(?, description),
        content = COALESCE(?, content),
        position_x = COALESCE(?, position_x),
        position_y = COALESCE(?, position_y),
        node_type = COALESCE(?, node_type),
        status = COALESCE(?, status),
        order_index = COALESCE(?, order_index),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [chapter_id, parent_id, title, description, content, position_x, position_y, node_type, status, order_index, req.params.id]);
    const updated = db.get('SELECT * FROM nodes WHERE id = ?', [req.params.id]);
    if (!updated) {
      return res.status(404).json({ error: 'Node not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/nodes/:id', (req, res) => {
  try {
    const result = db.run('DELETE FROM nodes WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Node not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== RESOURCES ==============

router.get('/resources', (req, res) => {
  try {
    const { node_id } = req.query;
    let query = 'SELECT * FROM resources';
    const params = [];
    if (node_id) {
      query += ' WHERE node_id = ?';
      params.push(node_id);
    }
    query += ' ORDER BY order_index';
    const resources = db.all(query, params);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/resources', (req, res) => {
  try {
    const { node_id, type, title, url, description, order_index = 0 } = req.body;
    const id = uuidv4();
    db.run(
      'INSERT INTO resources (id, node_id, type, title, url, description, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, node_id, type, title, url, description, order_index]
    );
    const newResource = db.get('SELECT * FROM resources WHERE id = ?', [id]);
    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/resources/:id', (req, res) => {
  try {
    const { node_id, type, title, url, description, order_index } = req.body;
    db.run(`
      UPDATE resources SET 
        node_id = COALESCE(?, node_id),
        type = COALESCE(?, type),
        title = COALESCE(?, title), 
        url = COALESCE(?, url),
        description = COALESCE(?, description),
        order_index = COALESCE(?, order_index)
      WHERE id = ?
    `, [node_id, type, title, url, description, order_index, req.params.id]);
    const updated = db.get('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    if (!updated) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/resources/:id', (req, res) => {
  try {
    const result = db.run('DELETE FROM resources WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== EDGES ==============

router.get('/edges', (req, res) => {
  try {
    const { chapter_id } = req.query;
    let query = 'SELECT * FROM edges';
    const params = [];
    if (chapter_id) {
      query += ' WHERE chapter_id = ?';
      params.push(chapter_id);
    }
    const edges = db.all(query, params);
    res.json(edges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/edges', (req, res) => {
  try {
    const { chapter_id, source_id, target_id, label, edge_type = 'default' } = req.body;
    const id = uuidv4();
    db.run(
      'INSERT INTO edges (id, chapter_id, source_id, target_id, label, edge_type) VALUES (?, ?, ?, ?, ?, ?)',
      [id, chapter_id, source_id, target_id, label, edge_type]
    );
    const newEdge = db.get('SELECT * FROM edges WHERE id = ?', [id]);
    res.status(201).json(newEdge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/edges/:id', (req, res) => {
  try {
    const result = db.run('DELETE FROM edges WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Edge not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk operations for edges
router.post('/edges/bulk', (req, res) => {
  try {
    const { chapter_id, edges } = req.body;
    const results = [];
    
    for (const edge of edges) {
      const id = uuidv4();
      db.run(
        'INSERT INTO edges (id, chapter_id, source_id, target_id, label, edge_type) VALUES (?, ?, ?, ?, ?, ?)',
        [id, chapter_id, edge.source_id, edge.target_id, edge.label, edge.edge_type || 'default']
      );
      results.push({ id, ...edge });
    }

    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all edges for a chapter
router.delete('/edges/chapter/:chapter_id', (req, res) => {
  try {
    db.run('DELETE FROM edges WHERE chapter_id = ?', [req.params.chapter_id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
