import { useState, useEffect } from 'react';
import adminApi from '../api';
import Modal from '../components/Modal';

const SUBJECT_COLORS = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', class_id: '', icon: '', color: '#3B82F6', order_index: 0
  });
  const [saving, setSaving] = useState(false);
  const [filterClassId, setFilterClassId] = useState('');

  const fetchData = () => {
    setLoading(true);
    Promise.all([adminApi.getSubjects(), adminApi.getClasses()])
      .then(([subjectsData, classesData]) => {
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

  const openModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name,
        description: subject.description || '',
        class_id: subject.class_id,
        icon: subject.icon || '',
        color: subject.color || '#3B82F6',
        order_index: subject.order_index || 0,
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: '', description: '',
        class_id: filterClassId || (classes[0]?.id || ''),
        icon: '', color: '#3B82F6',
        order_index: filteredSubjects.length
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSubject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSubject) {
        await adminApi.updateSubject(editingSubject.id, formData);
      } else {
        await adminApi.createSubject(formData);
      }
      fetchData();
      closeModal();
    } catch (error) {
      alert('Error saving subject: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (subject) => {
    if (!confirm(`Are you sure you want to delete "${subject.name}"? This will also delete all chapters and nodes in this subject.`)) {
      return;
    }
    try {
      await adminApi.deleteSubject(subject.id);
      fetchData();
    } catch (error) {
      alert('Error deleting subject: ' + error.message);
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
          <h2 className="text-2xl font-bold text-gray-900">Subjects</h2>
          <p className="text-gray-500">Manage subjects for each class</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary" disabled={classes.length === 0}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Subject
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filter by Class:</label>
        <select
          value={filterClassId}
          onChange={(e) => setFilterClassId(e.target.value)}
          className="input w-48"
        >
          <option value="">All Classes</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {classes.length === 0 ? (
        <div className="card p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes available</h3>
          <p className="text-gray-500">Create a class first before adding subjects.</p>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No subjects yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first subject.</p>
          <button onClick={() => openModal()} className="btn-primary">
            Create First Subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject) => (
            <div key={subject.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: subject.color + '20' }}
                >
                  {subject.icon || '📖'}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(subject)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(subject)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">{subject.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{subject.class_name}</p>
              {subject.description && (
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{subject.description}</p>
              )}
              <div 
                className="w-full h-1 rounded-full mt-4"
                style={{ backgroundColor: subject.color }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingSubject ? 'Edit Subject' : 'Add Subject'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Class *</label>
            <select
              className="input"
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
              required
            >
              <option value="">Select a class</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
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
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="textarea"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Icon (Emoji)</label>
              <input
                type="text"
                className="input"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📐"
              />
            </div>
            <div>
              <label className="label">Color</label>
              <div className="flex gap-2">
                {SUBJECT_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full transition-transform ${formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>
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
              {saving ? 'Saving...' : editingSubject ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default SubjectsPage;
