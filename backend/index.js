const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'db.json');
const SEED_FILE = path.join(__dirname, 'data', 'seed.json');

// Initialize or load data
function loadData() {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(DATA_FILE)) {
      // Copy seed data to db.json on first run
      const seedData = fs.readFileSync(SEED_FILE, 'utf8');
      fs.writeFileSync(DATA_FILE, seedData);
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (error) {
    console.error('Error loading data:', error);
    return { classes: [], subjects: [], chapters: [], nodes: [], edges: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ============== PUBLIC READ APIs ==============

// GET /api/classes - List all classes
app.get('/api/classes', (req, res) => {
  const data = loadData();
  res.json(data.classes);
});

// GET /api/classes/:id - Get a single class
app.get('/api/classes/:id', (req, res) => {
  const data = loadData();
  const classItem = data.classes.find(c => c.id === req.params.id);
  if (!classItem) {
    return res.status(404).json({ error: 'Class not found' });
  }
  res.json(classItem);
});

// GET /api/classes/:id/subjects - List subjects for a class
app.get('/api/classes/:id/subjects', (req, res) => {
  const data = loadData();
  const subjects = data.subjects.filter(s => s.classId === req.params.id);
  res.json(subjects);
});

// GET /api/subjects/:id - Get a single subject
app.get('/api/subjects/:id', (req, res) => {
  const data = loadData();
  const subject = data.subjects.find(s => s.id === req.params.id);
  if (!subject) {
    return res.status(404).json({ error: 'Subject not found' });
  }
  res.json(subject);
});

// GET /api/subjects/:id/chapters - List chapters for a subject
app.get('/api/subjects/:id/chapters', (req, res) => {
  const data = loadData();
  const chapters = data.chapters.filter(c => c.subjectId === req.params.id);
  res.json(chapters);
});

// GET /api/chapters/:id - Get a single chapter
app.get('/api/chapters/:id', (req, res) => {
  const data = loadData();
  const chapter = data.chapters.find(c => c.id === req.params.id);
  if (!chapter) {
    return res.status(404).json({ error: 'Chapter not found' });
  }
  res.json(chapter);
});

// GET /api/chapters/:id/roadmap - Get roadmap nodes and edges for a chapter
app.get('/api/chapters/:id/roadmap', (req, res) => {
  const data = loadData();
  const nodes = data.nodes.filter(n => n.chapterId === req.params.id);
  const nodeIds = new Set(nodes.map(n => n.id));
  const edges = data.edges.filter(e => nodeIds.has(e.from) || nodeIds.has(e.to));
  res.json({ nodes, edges });
});

// GET /api/nodes/:id - Get a single node
app.get('/api/nodes/:id', (req, res) => {
  const data = loadData();
  const node = data.nodes.find(n => n.id === req.params.id);
  if (!node) {
    return res.status(404).json({ error: 'Node not found' });
  }
  res.json(node);
});

// ============== ADMIN CRUD APIs ==============

// Classes CRUD
app.post('/api/admin/classes', (req, res) => {
  const data = loadData();
  const newClass = {
    id: `class-${uuidv4().slice(0, 8)}`,
    name: req.body.name
  };
  data.classes.push(newClass);
  saveData(data);
  res.status(201).json(newClass);
});

app.put('/api/admin/classes/:id', (req, res) => {
  const data = loadData();
  const index = data.classes.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Class not found' });
  }
  data.classes[index] = { ...data.classes[index], ...req.body };
  saveData(data);
  res.json(data.classes[index]);
});

app.delete('/api/admin/classes/:id', (req, res) => {
  const data = loadData();
  const index = data.classes.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Class not found' });
  }
  // Cascade delete: remove related subjects, chapters, nodes, edges
  const subjectIds = data.subjects.filter(s => s.classId === req.params.id).map(s => s.id);
  const chapterIds = data.chapters.filter(c => subjectIds.includes(c.subjectId)).map(c => c.id);
  const nodeIds = data.nodes.filter(n => chapterIds.includes(n.chapterId)).map(n => n.id);
  
  data.edges = data.edges.filter(e => !nodeIds.includes(e.from) && !nodeIds.includes(e.to));
  data.nodes = data.nodes.filter(n => !chapterIds.includes(n.chapterId));
  data.chapters = data.chapters.filter(c => !subjectIds.includes(c.subjectId));
  data.subjects = data.subjects.filter(s => s.classId !== req.params.id);
  data.classes.splice(index, 1);
  
  saveData(data);
  res.status(204).send();
});

// Subjects CRUD
app.post('/api/admin/subjects', (req, res) => {
  const data = loadData();
  const newSubject = {
    id: `subject-${uuidv4().slice(0, 8)}`,
    classId: req.body.classId,
    name: req.body.name
  };
  data.subjects.push(newSubject);
  saveData(data);
  res.status(201).json(newSubject);
});

app.put('/api/admin/subjects/:id', (req, res) => {
  const data = loadData();
  const index = data.subjects.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Subject not found' });
  }
  data.subjects[index] = { ...data.subjects[index], ...req.body };
  saveData(data);
  res.json(data.subjects[index]);
});

app.delete('/api/admin/subjects/:id', (req, res) => {
  const data = loadData();
  const index = data.subjects.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Subject not found' });
  }
  // Cascade delete
  const chapterIds = data.chapters.filter(c => c.subjectId === req.params.id).map(c => c.id);
  const nodeIds = data.nodes.filter(n => chapterIds.includes(n.chapterId)).map(n => n.id);
  
  data.edges = data.edges.filter(e => !nodeIds.includes(e.from) && !nodeIds.includes(e.to));
  data.nodes = data.nodes.filter(n => !chapterIds.includes(n.chapterId));
  data.chapters = data.chapters.filter(c => c.subjectId !== req.params.id);
  data.subjects.splice(index, 1);
  
  saveData(data);
  res.status(204).send();
});

// Chapters CRUD
app.post('/api/admin/chapters', (req, res) => {
  const data = loadData();
  const newChapter = {
    id: `chapter-${uuidv4().slice(0, 8)}`,
    subjectId: req.body.subjectId,
    name: req.body.name
  };
  data.chapters.push(newChapter);
  saveData(data);
  res.status(201).json(newChapter);
});

app.put('/api/admin/chapters/:id', (req, res) => {
  const data = loadData();
  const index = data.chapters.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Chapter not found' });
  }
  data.chapters[index] = { ...data.chapters[index], ...req.body };
  saveData(data);
  res.json(data.chapters[index]);
});

app.delete('/api/admin/chapters/:id', (req, res) => {
  const data = loadData();
  const index = data.chapters.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Chapter not found' });
  }
  // Cascade delete
  const nodeIds = data.nodes.filter(n => n.chapterId === req.params.id).map(n => n.id);
  
  data.edges = data.edges.filter(e => !nodeIds.includes(e.from) && !nodeIds.includes(e.to));
  data.nodes = data.nodes.filter(n => n.chapterId !== req.params.id);
  data.chapters.splice(index, 1);
  
  saveData(data);
  res.status(204).send();
});

// Nodes CRUD
app.post('/api/admin/nodes', (req, res) => {
  const data = loadData();
  const newNode = {
    id: `node-${uuidv4().slice(0, 8)}`,
    chapterId: req.body.chapterId,
    title: req.body.title || 'New Node',
    description: req.body.description || '',
    content: req.body.content || '',
    resources: req.body.resources || { articles: [], videos: [], exercises: [] },
    children: [],
    position: req.body.position || { x: 250, y: 0 }
  };
  data.nodes.push(newNode);
  saveData(data);
  res.status(201).json(newNode);
});

app.put('/api/admin/nodes/:id', (req, res) => {
  const data = loadData();
  const index = data.nodes.findIndex(n => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Node not found' });
  }
  data.nodes[index] = { ...data.nodes[index], ...req.body };
  saveData(data);
  res.json(data.nodes[index]);
});

app.delete('/api/admin/nodes/:id', (req, res) => {
  const data = loadData();
  const index = data.nodes.findIndex(n => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Node not found' });
  }
  // Remove related edges
  data.edges = data.edges.filter(e => e.from !== req.params.id && e.to !== req.params.id);
  data.nodes.splice(index, 1);
  
  saveData(data);
  res.status(204).send();
});

// Edges CRUD
app.post('/api/admin/edges', (req, res) => {
  const data = loadData();
  const newEdge = {
    id: `edge-${uuidv4().slice(0, 8)}`,
    from: req.body.from,
    to: req.body.to
  };
  data.edges.push(newEdge);
  saveData(data);
  res.status(201).json(newEdge);
});

app.delete('/api/admin/edges/:id', (req, res) => {
  const data = loadData();
  const index = data.edges.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Edge not found' });
  }
  data.edges.splice(index, 1);
  saveData(data);
  res.status(204).send();
});

// Get all data for admin
app.get('/api/admin/data', (req, res) => {
  const data = loadData();
  res.json(data);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
