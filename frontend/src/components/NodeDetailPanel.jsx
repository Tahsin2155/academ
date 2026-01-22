export default function NodeDetailPanel({ node, onClose }) {
  if (!node) return null;

  const { title, description, content, resources } = node;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md h-full overflow-y-auto shadow-xl animate-slide-in">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 truncate pr-4">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-gray-700">{description}</p>
            </div>
          )}
          
          {content && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Content
              </h3>
              <div className="prose prose-sm text-gray-700">
                {content}
              </div>
            </div>
          )}
          
          {resources && (
            <div className="space-y-4">
              {resources.articles?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                    <span className="mr-2">📄</span> Articles
                  </h3>
                  <ul className="space-y-2">
                    {resources.articles.map((article, idx) => (
                      <li key={idx}>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
                        >
                          {article.title}
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {resources.videos?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                    <span className="mr-2">🎬</span> Videos
                  </h3>
                  <ul className="space-y-2">
                    {resources.videos.map((video, idx) => (
                      <li key={idx}>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
                        >
                          {video.title}
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {resources.exercises?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                    <span className="mr-2">✏️</span> Exercises
                  </h3>
                  <ul className="space-y-2">
                    {resources.exercises.map((exercise, idx) => (
                      <li key={idx}>
                        <a
                          href={exercise.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
                        >
                          {exercise.title}
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(!resources.articles?.length && !resources.videos?.length && !resources.exercises?.length) && (
                <p className="text-gray-500 italic">No resources available for this topic yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
