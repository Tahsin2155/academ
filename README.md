# Academ - Academic Roadmaps

Visual, interactive curriculum paths for school students — web-based and lightweight.

![Academ Preview](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Academ+-+Academic+Roadmaps)

## 🎯 Features

### Student Experience
- **Visual Roadmaps**: Interactive node-based learning paths
- **Rich Content**: Markdown-supported explanations with videos, articles, and exercises
- **Search & Navigate**: Find concepts quickly with instant search
- **Zoom & Pan**: Explore detailed roadmaps with intuitive controls
- **Mobile-First**: Works seamlessly on all devices, even on slow connections

### Admin Experience
- **Tree View Management**: Organize classes, subjects, and chapters
- **Visual Editor**: Drag-and-drop roadmap canvas for creating learning paths
- **Resource Management**: Add videos, articles, PDFs, and practice links
- **No Authentication**: Simple setup - edit curriculum without login

## 🛠 Tech Stack

- **Frontend**: React 18, React Flow, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: SQLite (via better-sqlite3)
- **Build Tool**: Vite

## 📁 Project Structure

```
academ/
├── packages/
│   ├── client/          # Student-facing web app (port 3000)
│   ├── admin/           # Admin panel (port 3002)
│   └── server/          # Backend API (port 3001)
├── package.json         # Workspace configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
cd academ

# Install dependencies
npm install

# Seed the database with sample data
npm run seed

# Start all services (server, client, admin)
npm run dev
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Student App | http://localhost:3000 | Main student interface |
| Admin Panel | http://localhost:3002 | Curriculum management |
| API Server | http://localhost:3001 | REST API |

## 📊 API Endpoints

### Public APIs (Read-only)

```
GET /api/classes              # List all classes
GET /api/classes/:id          # Get class details
GET /api/classes/:id/subjects # Get subjects for a class
GET /api/subjects/:id         # Get subject details
GET /api/subjects/:id/chapters # Get chapters for a subject
GET /api/chapters/:id/roadmap # Get roadmap data (nodes + edges)
GET /api/nodes/search/:query  # Search nodes
```

### Admin APIs (CRUD)

```
# Classes
POST   /api/admin/classes
PUT    /api/admin/classes/:id
DELETE /api/admin/classes/:id

# Subjects
POST   /api/admin/subjects
PUT    /api/admin/subjects/:id
DELETE /api/admin/subjects/:id

# Chapters
POST   /api/admin/chapters
PUT    /api/admin/chapters/:id
DELETE /api/admin/chapters/:id

# Nodes
POST   /api/admin/nodes
PUT    /api/admin/nodes/:id
DELETE /api/admin/nodes/:id

# Resources
POST   /api/admin/resources
PUT    /api/admin/resources/:id
DELETE /api/admin/resources/:id

# Edges
POST   /api/admin/edges
DELETE /api/admin/edges/:id
```

## 📚 Data Models

### Class
```json
{
  "id": "uuid",
  "name": "Grade 10",
  "description": "Secondary school curriculum",
  "order_index": 0
}
```

### Subject
```json
{
  "id": "uuid",
  "class_id": "uuid",
  "name": "Mathematics",
  "icon": "📐",
  "color": "#3B82F6",
  "description": "Algebra, Geometry, Trigonometry"
}
```

### Chapter
```json
{
  "id": "uuid",
  "subject_id": "uuid",
  "name": "Quadratic Equations",
  "description": "Solution methods, Nature of roots"
}
```

### Node
```json
{
  "id": "uuid",
  "chapter_id": "uuid",
  "title": "Quadratic Formula",
  "description": "Universal formula for solving quadratics",
  "content": "# Markdown content...",
  "node_type": "concept",
  "position_x": 400,
  "position_y": 200
}
```

### Resource
```json
{
  "id": "uuid",
  "node_id": "uuid",
  "type": "video",
  "title": "Introduction Video",
  "url": "https://youtube.com/...",
  "description": "15 min tutorial"
}
```

## 🎨 Node Types

| Type | Color | Purpose |
|------|-------|---------|
| `concept` | Blue | Core learning concepts |
| `application` | Green | Real-world applications |
| `exercise` | Amber | Practice problems |
| `prerequisite` | Purple | Required prior knowledge |

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Frontend**: Deploy `packages/client/dist` to Netlify, Vercel, or GitHub Pages
- **Admin**: Deploy `packages/admin/dist` similarly
- **Backend**: Deploy to Replit, Railway, or any Node.js host

### Environment Variables

```env
PORT=3001                # Server port
NODE_ENV=production      # Environment
```

## 📝 Development

### Running Individual Services

```bash
# Server only
npm run dev:server

# Client only
npm run dev:client

# Admin only
npm run dev:admin
```

### Database

The SQLite database is stored at `packages/server/data/academ.db`. To reset:

```bash
rm packages/server/data/academ.db
npm run seed
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

---

Built with ❤️ for students everywhere
