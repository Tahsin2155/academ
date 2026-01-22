import { useState, useEffect } from 'react';
import adminApi from '../api';

const NODE_TYPES = [
  { value: 'concept', label: 'Concept' },
  { value: 'application', label: 'Application' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'prerequisite', label: 'Prerequisite' },
];

const RESOURCE_TYPES = [
  { value: 'article', label: 'Article' },
  { value: 'video', label: 'Video' },
  { value: 'exercise', label: 'Exercise/Practice' },
  { value: 'pdf', label: 'PDF Document' },
  { value: 'other', label: 'Other' },
];

function NodeEditor({ node, onClose, onSave, onDelete, saving }) {
  const [formData, setFormData] = useState({
    title: node.title || '',
    description: node.description || '',
    content: node.content || '',
    node_type: node.node_type || 'concept',
  });
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [newResource, setNewResource] = useState({ type: 'article', title: '', url: '', description: '' });
  const [showAddResource, setShowAddResource] = useState(false);

  // Fetch resources
  useEffect(() => {
    setLoadingResources(true);
    adminApi.getResources(node.id)
      .then(setResources)
      .catch(console.error)
      .finally(() => setLoadingResources(false));
  }, [node.id]);

  const handleSave = () => {
    onSave({ ...node, ...formData });
  };

  const handleAddResource = async () => {
    if (!newResource.title || !newResource.url) {
      alert('Please fill in title and URL');
      return;
    }
    try {
      const created = await adminApi.createResource({
        node_id: node.id,
        ...newResource,
        order_index: resources.length,
      });
      setResources([...resources, created]);
      setNewResource({ type: 'article', title: '', url: '', description: '' });
      setShowAddResource(false);
    } catch (error) {
      alert('Error adding resource: ' + error.message);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!confirm('Delete this resource?')) return;
    try {
      await adminApi.deleteResource(resourceId);
      setResources(resources.filter(r => r.id !== resourceId));
    } catch (error) {
      alert('Error deleting resource: ' + error.message);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Node</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(node.id)}
              className="btn-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Basic Info</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Title *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Type</label>
                <select
                  className="input"
                  value={formData.node_type}
                  onChange={(e) => setFormData({ ...formData, node_type: e.target.value })}
                >
                  {NODE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description shown on the node"
                />
              </div>
            </div>
          </section>

          {/* Content */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Content (Markdown)</h3>
            <textarea
              className="textarea font-mono text-sm"
              rows={10}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="# Title&#10;&#10;Write detailed content using Markdown..."
            />
            <p className="text-xs text-gray-500 mt-1">Supports Markdown formatting</p>
          </section>

          {/* Resources */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h3>
              <button
                onClick={() => setShowAddResource(!showAddResource)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {showAddResource ? 'Cancel' : '+ Add Resource'}
              </button>
            </div>

            {/* Add Resource Form */}
            {showAddResource && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Type</label>
                    <select
                      className="input"
                      value={newResource.type}
                      onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                    >
                      {RESOURCE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Title *</label>
                    <input
                      type="text"
                      className="input"
                      value={newResource.title}
                      onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      placeholder="Resource title"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">URL *</label>
                  <input
                    type="url"
                    className="input"
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <input
                    type="text"
                    className="input"
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
                <button onClick={handleAddResource} className="btn-primary btn-sm w-full">
                  Add Resource
                </button>
              </div>
            )}

            {/* Resource List */}
            {loadingResources ? (
              <div className="text-center py-4 text-gray-500">Loading resources...</div>
            ) : resources.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No resources added yet</div>
            ) : (
              <div className="space-y-2">
                {resources.map((resource) => (
                  <div 
                    key={resource.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg">
                        {resource.type === 'video' ? '🎬' : 
                         resource.type === 'article' ? '📄' :
                         resource.type === 'exercise' ? '✏️' :
                         resource.type === 'pdf' ? '📑' : '🔗'}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{resource.title}</p>
                        <p className="text-xs text-gray-500 truncate">{resource.url}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

export default NodeEditor;
