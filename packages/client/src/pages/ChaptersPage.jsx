import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

function ChaptersPage() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getSubject(subjectId),
      api.getSubjectChapters(subjectId)
    ])
      .then(([subjectInfo, chaptersList]) => {
        setSubject(subjectInfo);
        setChapters(chaptersList);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [subjectId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading chapters...</p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load chapters</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link to="/" className="btn-primary">Go Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section 
        className="py-12 text-white"
        style={{ background: `linear-gradient(135deg, ${subject?.color || '#3B82F6'}, ${subject?.color || '#3B82F6'}dd)` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm opacity-80 mb-4">
            <Link to="/" className="hover:opacity-100 transition-opacity">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to={`/class/${subject?.class_id}`} className="hover:opacity-100 transition-opacity">
              {subject?.class_name}
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="opacity-100">{subject?.name}</span>
          </nav>
          
          <div className="flex items-center gap-4">
            <span className="text-5xl">{subject?.icon || '📖'}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{subject?.name}</h1>
              <p className="opacity-90 text-lg max-w-2xl">
                {subject?.description || 'Explore chapters and their learning roadmaps'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters List */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Chapters</h2>
            <span className="text-sm text-gray-500">{chapters.length} chapters</span>
          </div>

          {chapters.length === 0 ? (
            <div className="text-center py-12 card">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No chapters available</h3>
              <p className="text-gray-500">Chapters will appear here once they are added to this subject.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <Link
                  key={chapter.id}
                  to={`/chapter/${chapter.id}`}
                  className="card-hover group flex items-center gap-4 p-5 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg"
                    style={{ 
                      backgroundColor: subject?.color + '15',
                      color: subject?.color 
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                      {chapter.name}
                    </h3>
                    {chapter.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {chapter.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center text-gray-400 group-hover:text-primary-600 transition-colors">
                    <span className="hidden sm:inline text-sm font-medium mr-2">View Roadmap</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default ChaptersPage;
