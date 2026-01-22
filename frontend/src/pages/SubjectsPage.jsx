import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSubjectsByClass, getClass } from '../api';

const subjectIcons = {
  Mathematics: '📐',
  Physics: '⚡',
  Chemistry: '🧪',
  Biology: '🧬',
  English: '📖',
  History: '🏛️',
  Geography: '🌍',
  Computer: '💻',
  default: '📚'
};

function getIcon(name) {
  for (const [key, icon] of Object.entries(subjectIcons)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return subjectIcons.default;
}

export default function SubjectsPage() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [subjectsData, classData] = await Promise.all([
          getSubjectsByClass(classId),
          getClass(classId)
        ]);
        setSubjects(subjectsData);
        setClassInfo(classData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [classId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <nav className="mb-6">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Classes
        </Link>
      </nav>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {classInfo?.name} - Subjects
      </h1>
      <p className="text-gray-600 mb-8">Select a subject to explore chapters and learning paths</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/subject/${subject.id}`}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-indigo-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
                <span className="text-2xl">{getIcon(subject.name)}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {subject.name}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">View chapters</p>
            </div>
          </Link>
        ))}
      </div>
      
      {subjects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No subjects available for this class yet.
        </div>
      )}
    </div>
  );
}
