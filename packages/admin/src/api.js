const API_BASE = '/api/admin';

async function fetchJSON(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export const adminApi = {
  // Classes
  getClasses: () => fetchJSON('/classes'),
  createClass: (data) => fetchJSON('/classes', { method: 'POST', body: JSON.stringify(data) }),
  updateClass: (id, data) => fetchJSON(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClass: (id) => fetchJSON(`/classes/${id}`, { method: 'DELETE' }),

  // Subjects
  getSubjects: () => fetchJSON('/subjects'),
  createSubject: (data) => fetchJSON('/subjects', { method: 'POST', body: JSON.stringify(data) }),
  updateSubject: (id, data) => fetchJSON(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSubject: (id) => fetchJSON(`/subjects/${id}`, { method: 'DELETE' }),

  // Chapters
  getChapters: () => fetchJSON('/chapters'),
  createChapter: (data) => fetchJSON('/chapters', { method: 'POST', body: JSON.stringify(data) }),
  updateChapter: (id, data) => fetchJSON(`/chapters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteChapter: (id) => fetchJSON(`/chapters/${id}`, { method: 'DELETE' }),

  // Nodes
  getNodes: (chapterId) => fetchJSON(chapterId ? `/nodes?chapter_id=${chapterId}` : '/nodes'),
  createNode: (data) => fetchJSON('/nodes', { method: 'POST', body: JSON.stringify(data) }),
  updateNode: (id, data) => fetchJSON(`/nodes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNode: (id) => fetchJSON(`/nodes/${id}`, { method: 'DELETE' }),

  // Resources
  getResources: (nodeId) => fetchJSON(nodeId ? `/resources?node_id=${nodeId}` : '/resources'),
  createResource: (data) => fetchJSON('/resources', { method: 'POST', body: JSON.stringify(data) }),
  updateResource: (id, data) => fetchJSON(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteResource: (id) => fetchJSON(`/resources/${id}`, { method: 'DELETE' }),

  // Edges
  getEdges: (chapterId) => fetchJSON(chapterId ? `/edges?chapter_id=${chapterId}` : '/edges'),
  createEdge: (data) => fetchJSON('/edges', { method: 'POST', body: JSON.stringify(data) }),
  deleteEdge: (id) => fetchJSON(`/edges/${id}`, { method: 'DELETE' }),
  bulkCreateEdges: (chapterId, edges) => fetchJSON('/edges/bulk', { 
    method: 'POST', 
    body: JSON.stringify({ chapter_id: chapterId, edges }) 
  }),
  deleteChapterEdges: (chapterId) => fetchJSON(`/edges/chapter/${chapterId}`, { method: 'DELETE' }),
};

// Public API for reading
export const publicApi = {
  getChapterRoadmap: (chapterId) => fetch(`/api/chapters/${chapterId}/roadmap`).then(r => r.json()),
};

export default adminApi;
