import { useState, useEffect } from 'react';
import {
  getAllData,
  createClass, updateClass, deleteClass,
  createSubject, updateSubject, deleteSubject,
  createChapter, updateChapter, deleteChapter,
  createNode, updateNode, deleteNode,
  createEdge, deleteEdge
} from '../api';

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const fetchData = async () => {
    try {
      const result = await getAllData();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreate = async (type, parentId = null) => {
    try {
      switch (type) {
        case 'class':
          await createClass({ name: 'New Class' });
          break;
        case 'subject':
          await createSubject({ classId: parentId, name: 'New Subject' });
          break;
        case 'chapter':
          await createChapter({ subjectId: parentId, name: 'New Chapter' });
          break;
        case 'node':
          await createNode({ chapterId: parentId, title: 'New Node', position: { x: 250, y: 0 } });
          break;
        default:
          break;
      }
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      switch (type) {
        case 'class':
          await deleteClass(id);
          break;
        case 'subject':
          await deleteSubject(id);
          break;
        case 'chapter':
          await deleteChapter(id);
          break;
        case 'node':
          await deleteNode(id);
          break;
        case 'edge':
          await deleteEdge(id);
          break;
        default:
          break;
      }
      setSelectedItem(null);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      const { type, id, ...updates } = selectedItem;
      switch (type) {
        case 'class':
          await updateClass(id, updates);
          break;
        case 'subject':
          await updateSubject(id, updates);
          break;
        case 'chapter':
          await updateChapter(id, updates);
          break;
        case 'node':
          await updateNode(id, updates);
          break;
        default:
          break;
      }
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddEdge = async (fromId, toId) => {
    try {
      await createEdge({ from: fromId, to: toId });
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

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
        <button 
          onClick={() => { setError(null); fetchData(); }}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-6">
      {/* Tree View Sidebar */}
      <div className="w-80 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="font-semibold text-gray-900">Curriculum Tree</h2>
          <button
            onClick={() => handleCreate('class')}
            className="p-1 text-indigo-600 hover:bg-indigo-100 rounded"
            title="Add Class"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {data?.classes?.map((classItem) => (
            <TreeItem
              key={classItem.id}
              item={{ ...classItem, type: 'class' }}
              expanded={expandedItems[classItem.id]}
              onToggle={() => toggleExpand(classItem.id)}
              onSelect={() => setSelectedItem({ ...classItem, type: 'class' })}
              onAdd={() => handleCreate('subject', classItem.id)}
              onDelete={() => handleDelete('class', classItem.id)}
              isSelected={selectedItem?.id === classItem.id}
            >
              {data.subjects
                .filter((s) => s.classId === classItem.id)
                .map((subject) => (
                  <TreeItem
                    key={subject.id}
                    item={{ ...subject, type: 'subject' }}
                    expanded={expandedItems[subject.id]}
                    onToggle={() => toggleExpand(subject.id)}
                    onSelect={() => setSelectedItem({ ...subject, type: 'subject' })}
                    onAdd={() => handleCreate('chapter', subject.id)}
                    onDelete={() => handleDelete('subject', subject.id)}
                    isSelected={selectedItem?.id === subject.id}
                    level={1}
                  >
                    {data.chapters
                      .filter((c) => c.subjectId === subject.id)
                      .map((chapter) => (
                        <TreeItem
                          key={chapter.id}
                          item={{ ...chapter, type: 'chapter' }}
                          expanded={expandedItems[chapter.id]}
                          onToggle={() => toggleExpand(chapter.id)}
                          onSelect={() => setSelectedItem({ ...chapter, type: 'chapter' })}
                          onAdd={() => handleCreate('node', chapter.id)}
                          onDelete={() => handleDelete('chapter', chapter.id)}
                          isSelected={selectedItem?.id === chapter.id}
                          level={2}
                        >
                          {data.nodes
                            .filter((n) => n.chapterId === chapter.id)
                            .map((node) => (
                              <TreeItem
                                key={node.id}
                                item={{ ...node, type: 'node', name: node.title }}
                                onSelect={() => setSelectedItem({ ...node, type: 'node' })}
                                onDelete={() => handleDelete('node', node.id)}
                                isSelected={selectedItem?.id === node.id}
                                level={3}
                                isLeaf
                              />
                            ))}
                        </TreeItem>
                      ))}
                  </TreeItem>
                ))}
            </TreeItem>
          ))}
          {data?.classes?.length === 0 && (
            <p className="text-gray-500 text-center py-4">No classes yet. Click + to add one.</p>
          )}
        </div>
      </div>

      {/* Edit Panel */}
      <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {selectedItem ? (
          <EditPanel
            item={selectedItem}
            onChange={setSelectedItem}
            onSave={handleUpdate}
            onDelete={() => handleDelete(selectedItem.type, selectedItem.id)}
            allNodes={data?.nodes || []}
            allEdges={data?.edges || []}
            onAddEdge={handleAddEdge}
            onDeleteEdge={(edgeId) => handleDelete('edge', edgeId)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p>Select an item from the tree to edit</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TreeItem({
  item,
  expanded,
  onToggle,
  onSelect,
  onAdd,
  onDelete,
  isSelected,
  level = 0,
  isLeaf = false,
  children,
}) {
  const hasChildren = !isLeaf && children;
  const icons = {
    class: '🎓',
    subject: '📚',
    chapter: '📖',
    node: '📍',
  };

  return (
    <div style={{ marginLeft: level * 8 }}>
      <div
        className={`group flex items-center py-1 px-2 rounded cursor-pointer ${
          isSelected ? 'bg-indigo-100 text-indigo-900' : 'hover:bg-gray-100'
        }`}
      >
        {!isLeaf && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            {expanded ? '▼' : '▶'}
          </button>
        )}
        {isLeaf && <span className="w-5" />}
        <span onClick={onSelect} className="flex-1 flex items-center">
          <span className="mr-2">{icons[item.type]}</span>
          <span className="truncate text-sm">{item.name || item.title}</span>
        </span>
        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
          {onAdd && (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="p-1 text-green-600 hover:bg-green-100 rounded"
              title="Add child"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {expanded && hasChildren && (
        <div className="ml-2 border-l border-gray-200 pl-2">{children}</div>
      )}
    </div>
  );
}

function EditPanel({ item, onChange, onSave, onDelete, allNodes, allEdges, onAddEdge, onDeleteEdge }) {
  const [newEdgeTarget, setNewEdgeTarget] = useState('');
  
  const isNode = item.type === 'node';
  const nodeEdges = isNode ? allEdges.filter(e => e.from === item.id || e.to === item.id) : [];
  const sameChapterNodes = isNode ? allNodes.filter(n => n.chapterId === item.chapterId && n.id !== item.id) : [];

  const updateField = (field, value) => {
    onChange({ ...item, [field]: value });
  };

  const updateResource = (category, index, field, value) => {
    const resources = { ...item.resources };
    resources[category] = [...resources[category]];
    resources[category][index] = { ...resources[category][index], [field]: value };
    onChange({ ...item, resources });
  };

  const addResource = (category) => {
    const resources = { ...item.resources };
    resources[category] = [...(resources[category] || []), { title: '', url: '' }];
    onChange({ ...item, resources });
  };

  const removeResource = (category, index) => {
    const resources = { ...item.resources };
    resources[category] = resources[category].filter((_, i) => i !== index);
    onChange({ ...item, resources });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">
          Edit {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
          >
            Save Changes
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Basic Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isNode ? 'Title' : 'Name'} *
          </label>
          <input
            type="text"
            value={isNode ? item.title || '' : item.name || ''}
            onChange={(e) => updateField(isNode ? 'title' : 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder={`Enter ${item.type} ${isNode ? 'title' : 'name'}`}
          />
        </div>

        {isNode && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={item.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={2}
                placeholder="Brief description of this topic"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={item.content || ''}
                onChange={(e) => updateField('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={4}
                placeholder="Detailed content for this topic"
              />
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Resources</h3>
              
              {['articles', 'videos', 'exercises'].map((category) => (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 capitalize">{category}</label>
                    <button
                      onClick={() => addResource(category)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + Add
                    </button>
                  </div>
                  {(item.resources?.[category] || []).map((resource, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={resource.title}
                        onChange={(e) => updateResource(category, idx, 'title', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Title"
                      />
                      <input
                        type="url"
                        value={resource.url}
                        onChange={(e) => updateResource(category, idx, 'url', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="URL"
                      />
                      <button
                        onClick={() => removeResource(category, idx)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Connections / Edges */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Connections</h3>
              
              {nodeEdges.length > 0 && (
                <div className="mb-4 space-y-2">
                  {nodeEdges.map((edge) => {
                    const isSource = edge.from === item.id;
                    const connectedId = isSource ? edge.to : edge.from;
                    const connectedNode = allNodes.find(n => n.id === connectedId);
                    return (
                      <div key={edge.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">
                          {isSource ? '→ To: ' : '← From: '}
                          <span className="font-medium">{connectedNode?.title || connectedId}</span>
                        </span>
                        <button
                          onClick={() => onDeleteEdge(edge.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="flex gap-2">
                <select
                  value={newEdgeTarget}
                  onChange={(e) => setNewEdgeTarget(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select node to connect...</option>
                  {sameChapterNodes
                    .filter(n => !nodeEdges.some(e => e.to === n.id && e.from === item.id))
                    .map(n => (
                      <option key={n.id} value={n.id}>{n.title}</option>
                    ))}
                </select>
                <button
                  onClick={() => {
                    if (newEdgeTarget) {
                      onAddEdge(item.id, newEdgeTarget);
                      setNewEdgeTarget('');
                    }
                  }}
                  disabled={!newEdgeTarget}
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                  Connect
                </button>
              </div>
            </div>
          </>
        )}

        <div className="text-xs text-gray-400">ID: {item.id}</div>
      </div>
    </div>
  );
}
