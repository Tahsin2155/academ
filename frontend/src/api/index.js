const API_BASE = '/api';

// Helper for fetch requests
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || error.error || 'Request failed');
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

// Public APIs
export const getClasses = () => request('/classes');
export const getClass = (id) => request(`/classes/${id}`);
export const getSubjectsByClass = (classId) => request(`/classes/${classId}/subjects`);
export const getSubject = (id) => request(`/subjects/${id}`);
export const getChaptersBySubject = (subjectId) => request(`/subjects/${subjectId}/chapters`);
export const getChapter = (id) => request(`/chapters/${id}`);
export const getRoadmap = (chapterId) => request(`/chapters/${chapterId}/roadmap`);
export const getNode = (id) => request(`/nodes/${id}`);

// Admin APIs
export const getAllData = () => request('/admin/data');

// Classes CRUD
export const createClass = (data) => request('/admin/classes', { method: 'POST', body: JSON.stringify(data) });
export const updateClass = (id, data) => request(`/admin/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteClass = (id) => request(`/admin/classes/${id}`, { method: 'DELETE' });

// Subjects CRUD
export const createSubject = (data) => request('/admin/subjects', { method: 'POST', body: JSON.stringify(data) });
export const updateSubject = (id, data) => request(`/admin/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSubject = (id) => request(`/admin/subjects/${id}`, { method: 'DELETE' });

// Chapters CRUD
export const createChapter = (data) => request('/admin/chapters', { method: 'POST', body: JSON.stringify(data) });
export const updateChapter = (id, data) => request(`/admin/chapters/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteChapter = (id) => request(`/admin/chapters/${id}`, { method: 'DELETE' });

// Nodes CRUD
export const createNode = (data) => request('/admin/nodes', { method: 'POST', body: JSON.stringify(data) });
export const updateNode = (id, data) => request(`/admin/nodes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteNode = (id) => request(`/admin/nodes/${id}`, { method: 'DELETE' });

// Edges CRUD
export const createEdge = (data) => request('/admin/edges', { method: 'POST', body: JSON.stringify(data) });
export const deleteEdge = (id) => request(`/admin/edges/${id}`, { method: 'DELETE' });
