import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ClassesPage from './pages/ClassesPage';
import SubjectsPage from './pages/SubjectsPage';
import ChaptersPage from './pages/ChaptersPage';
import RoadmapEditorPage from './pages/RoadmapEditorPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/chapters" element={<ChaptersPage />} />
        <Route path="/roadmap/:chapterId" element={<RoadmapEditorPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
