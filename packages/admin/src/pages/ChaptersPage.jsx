import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../api';
import Modal from '../components/Modal';

function ChaptersPage() {
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', subject_id: '', order_index: 0 });
  const [saving, setSaving] = useState(false);
  const [filterSubjectId, setFilterSubjectId] = useState('');
  const [filterClassId, setFilterClassId] = useState('');

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      adminApi.getChapters(),
      adminApi.getSubjects(),
      adminApi.getClasses()
    ])
      .then(([chaptersData, subjectsData, classesData]) => {
        setChapters(chaptersData);
        setSubjects(subjectsData);
        setClasses(classesData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSubjects = filterClassId
    ? subjects.filter(s => s.class_id === filterClassId)
    : subjects;

  const filteredChapters = chapters.filter(ch => {
    if (filterSubjectId && ch.subject_id !== filterSubjectId) return false;
    if (filterClassId) {
      const subject = subjects.find(s => s.id === ch.subject_id);
      if (subject?.class_id !== filterClassId) return false;
    }
    return true;
  });

  const openModal = (chapter = null) => {
    if (chapter) {
      setEditingChapter(chapter);
      setFormData({
        name: chapter.name,
        description: chapter.description || '',
        subject_id: chapter.subject_id,
        order_index: chapter.order_index || 0,
      });
    } else {
      setEditingChapter(null);
      setFormData({
        name: '', description: '',
        subject_id: filterSubjectId || (filteredSubjects[0]?.id || ''),
        order_index: filteredChapters.length
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingChapter(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingChapter) {
        await adminApi.updateChapter(editingChapter.id, formData);
      } else {
        await adminApi.createChapter(formData);
      }
      fetchData();
      closeModal();
    } catch (error) {
      alert('Error saving chapter: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (chapter) => {
    if (!confirm(`Are you sure you want to delete "${chapter.name}"? This will also delete all nodes and resources.`)) {
      return;
    }
    try {
      await adminApi.deleteChapter(chapter.id);
      fetchData();
    } catch (error) {
      alert('Error deleting chapter: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chapters</h2>
          <p className="text-gray-500">Manage chapters and their roadmaps</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary" disabled={subjects.length === 0}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Chapter
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Class:</label>
          <select
            value={filterClassId}
            onChange={(e) => {
              setFilterClassId(e.target.value);
              setFilterSubjectId('');
            }}
            className="input w-40"
          >
            <option value="">All</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Subject:</label>
          <select
            value={filterSubjectId}
            onChange={(e) => setFilterSubjectId(e.target.value)}
            className="input w-48"
          >
            <option value="">All</option>
            {filteredSubjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="card p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No subjects available</h3>
          <p className="text-gray-500">Create a subject first before adding chapters.</p>
        </div>
      ) : filteredChapters.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No chapters yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first chapter.</p>
          <button onClick={() => openModal()} className="btn-primary">
            Create First Chapter
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chapter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Roadmap</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChapters.map((chapter, index) => (
                <tr key={chapter.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{chapter.name}</p>
                        {chapter.description && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">{chapter.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{chapter.subject_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{chapter.class_name}</td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/roadmap/${chapter.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Edit Roadmap
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => openModal(chapter)}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(chapter)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingChapter ? 'Edit Chapter' : 'Add Chapter'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Subject *</label>
            <select
              className="input"
              value={formData.subject_id}
              onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
              required
            >
              <option value="">Select a subject</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.class_name})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Name *</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Quadratic Equations"
              required
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of chapter content"
            />
          </div>
          <div>
            <label className="label">Order Index</label>
            <input
              type="number"
              className="input"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingChapter ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ChaptersPage;
