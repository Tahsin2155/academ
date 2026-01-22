const API_BASE = '/api';

async function fetchJSON(url) {
  const response = await fetch(`${API_BASE}${url}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Public API
export const api = {
  // Classes
  getClasses: () => fetchJSON('/classes'),
  getClass: (id) => fetchJSON(`/classes/${id}`),
  getClassSubjects: (classId) => fetchJSON(`/classes/${classId}/subjects`),

  // Subjects
  getSubjects: () => fetchJSON('/subjects'),
  getSubject: (id) => fetchJSON(`/subjects/${id}`),
  getSubjectChapters: (subjectId) => fetchJSON(`/subjects/${subjectId}/chapters`),

  // Chapters
  getChapters: () => fetchJSON('/chapters'),
  getChapter: (id) => fetchJSON(`/chapters/${id}`),
  getChapterRoadmap: (chapterId) => fetchJSON(`/chapters/${chapterId}/roadmap`),

  // Nodes
  getNode: (id) => fetchJSON(`/nodes/${id}`),
  getNodeChildren: (nodeId) => fetchJSON(`/nodes/${nodeId}/children`),
  searchNodes: (query) => fetchJSON(`/nodes/search/${encodeURIComponent(query)}`),
};

export default api;
