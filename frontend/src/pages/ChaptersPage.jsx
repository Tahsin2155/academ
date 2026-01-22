import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getChaptersBySubject, getSubject } from '../api';

export default function ChaptersPage() {
  const { subjectId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [chaptersData, subjectData] = await Promise.all([
          getChaptersBySubject(subjectId),
          getSubject(subjectId)
        ]);
        setChapters(chaptersData);
        setSubjectInfo(subjectData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [subjectId]);

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
          Classes
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to={`/class/${subjectInfo?.classId}`} className="text-indigo-600 hover:text-indigo-800">
          Subjects
        </Link>
      </nav>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {subjectInfo?.name} - Chapters
      </h1>
      <p className="text-gray-600 mb-8">Select a chapter to view the learning roadmap</p>
      
      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <Link
            key={chapter.id}
            to={`/chapter/${chapter.id}`}
            className="group flex items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-100 hover:border-indigo-200"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <span className="font-bold text-indigo-600">{index + 1}</span>
            </div>
            <div className="ml-4 flex-grow">
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {chapter.name}
              </h2>
              <p className="text-gray-500 text-sm">Click to view roadmap</p>
            </div>
            <div className="flex-shrink-0 text-gray-400 group-hover:text-indigo-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
      
      {chapters.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No chapters available for this subject yet.
        </div>
      )}
    </div>
  );
}
