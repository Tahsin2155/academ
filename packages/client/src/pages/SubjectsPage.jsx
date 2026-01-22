import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

function SubjectsPage() {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getClass(classId),
      api.getClassSubjects(classId)
    ])
      .then(([classInfo, subjectsList]) => {
        setClassData(classInfo);
        setSubjects(subjectsList);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading subjects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load subjects</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link to="/" className="btn-primary">Go Back Home</Link>
        </div>
      </div>
    );
  }

  const subjectIcons = {
    'Mathematics': '📐',
    'Physics': '⚡',
    'Chemistry': '🧪',
    'Biology': '🧬',
    'English': '📚',
    'History': '📜',
    'Geography': '🌍',
    'Computer Science': '💻',
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-200 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{classData?.name}</span>
          </nav>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{classData?.name}</h1>
          <p className="text-primary-100 text-lg max-w-2xl">
            {classData?.description || 'Explore subjects and their learning roadmaps'}
          </p>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Subjects</h2>

          {subjects.length === 0 ? (
            <div className="text-center py-12 card">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No subjects available</h3>
              <p className="text-gray-500">Subjects will appear here once they are added to this class.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject, index) => (
                <Link
                  key={subject.id}
                  to={`/subject/${subject.id}`}
                  className="card-hover group p-6 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: subject.color + '20' }}
                  >
                    <span className="text-3xl">
                      {subject.icon || subjectIcons[subject.name] || '📖'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {subject.description || 'Explore chapters and learning paths'}
                  </p>
                  <div 
                    className="flex items-center text-sm font-medium"
                    style={{ color: subject.color }}
                  >
                    View Chapters
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default SubjectsPage;
