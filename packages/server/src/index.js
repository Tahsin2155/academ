import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/init.js';
import classesRouter from './routes/classes.js';
import subjectsRouter from './routes/subjects.js';
import chaptersRouter from './routes/chapters.js';
import nodesRouter from './routes/nodes.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and start server
async function start() {
  await initDatabase();

  // Public API routes (read-only)
  app.use('/api/classes', classesRouter);
  app.use('/api/subjects', subjectsRouter);
  app.use('/api/chapters', chaptersRouter);
  app.use('/api/nodes', nodesRouter);

  // Admin API routes (CRUD)
  app.use('/api/admin', adminRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Academ API server running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);
