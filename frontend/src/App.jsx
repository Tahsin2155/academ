import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ClassesPage from './pages/ClassesPage';
import SubjectsPage from './pages/SubjectsPage';
import ChaptersPage from './pages/ChaptersPage';
import RoadmapPage from './pages/RoadmapPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ClassesPage />} />
          <Route path="class/:classId" element={<SubjectsPage />} />
          <Route path="subject/:subjectId" element={<ChaptersPage />} />
          <Route path="chapter/:chapterId" element={<RoadmapPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
