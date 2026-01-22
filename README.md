# Academic Roadmaps

Visual, interactive curriculum paths for school students — web-based and lightweight.

## 🎯 Features

- **Student View**: Browse classes, subjects, chapters, and interactive learning roadmaps
- **Interactive Roadmap Canvas**: Zoom, pan, search, and click nodes to view content
- **Admin Interface**: Full CRUD operations for curriculum management without authentication
- **Mobile-First Design**: Responsive and works on all devices

## 🏗️ Project Structure

```
academ/
├── frontend/          # React + Vite frontend
│   └── src/
│       ├── api/       # API service functions
│       ├── components/ # Reusable UI components
│       └── pages/     # Page components
└── backend/           # Express.js REST API
    └── data/          # JSON data storage
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd academ
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the Backend Server** (in one terminal)
```bash
cd backend
npm start
# Server runs on http://localhost:3001
```

2. **Start the Frontend** (in another terminal)
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

3. Open http://localhost:5173 in your browser

## 📊 API Endpoints

### Public APIs (Read-only)
- `GET /api/classes` - List all classes
- `GET /api/classes/:id/subjects` - List subjects for a class
- `GET /api/subjects/:id/chapters` - List chapters for a subject
- `GET /api/chapters/:id/roadmap` - Get roadmap nodes and edges for a chapter

### Admin APIs (CRUD)
- `POST/PUT/DELETE /api/admin/classes/:id` - Manage classes
- `POST/PUT/DELETE /api/admin/subjects/:id` - Manage subjects
- `POST/PUT/DELETE /api/admin/chapters/:id` - Manage chapters
- `POST/PUT/DELETE /api/admin/nodes/:id` - Manage roadmap nodes
- `POST/DELETE /api/admin/edges/:id` - Manage node connections

## 🛠️ Tech Stack

- **Frontend**: React, Vite, React Flow, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Storage**: JSON file-based storage (easily upgradable to MongoDB/SQLite)

## 📝 License

ISC