import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import ChaptersPage from './pages/ChaptersPage';
import RoadmapPage from './pages/RoadmapPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/class/:classId" element={<SubjectsPage />} />
        <Route path="/subject/:subjectId" element={<ChaptersPage />} />
        <Route path="/chapter/:chapterId" element={<RoadmapPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
