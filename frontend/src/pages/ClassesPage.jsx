import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClasses } from '../api';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

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
        <p className="text-gray-500 mt-2">Please make sure the backend server is running.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Class</h1>
      <p className="text-gray-600 mb-8">Choose your grade level to explore learning roadmaps</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {classes.map((classItem) => (
          <Link
            key={classItem.id}
            to={`/class/${classItem.id}`}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-indigo-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <span className="text-2xl">🎓</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {classItem.name}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">Click to view subjects</p>
            </div>
          </Link>
        ))}
      </div>
      
      {classes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No classes available yet. Add some from the Admin panel.
        </div>
      )}
    </div>
  );
}
