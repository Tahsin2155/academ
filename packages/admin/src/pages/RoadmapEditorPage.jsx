import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import adminApi, { publicApi } from '../api';
import Modal from '../components/Modal';
import NodeEditor from '../components/NodeEditor';

const NODE_TYPES = [
  { value: 'concept', label: 'Concept', color: '#3b82f6' },
  { value: 'application', label: 'Application', color: '#10b981' },
  { value: 'exercise', label: 'Exercise', color: '#f59e0b' },
  { value: 'prerequisite', label: 'Prerequisite', color: '#8b5cf6' },
];

function RoadmapEditorPage() {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rawNodes, setRawNodes] = useState([]);
  const [rawEdges, setRawEdges] = useState([]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeEditorOpen, setNodeEditorOpen] = useState(false);
  const [addNodeModalOpen, setAddNodeModalOpen] = useState(false);
  const [newNodeData, setNewNodeData] = useState({
    title: '', description: '', content: '', node_type: 'concept'
  });

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Fetch roadmap data
  useEffect(() => {
    setLoading(true);
    publicApi.getChapterRoadmap(chapterId)
      .then(data => {
        setChapter(data.chapter);
        setRawNodes(data.nodes);
        setRawEdges(data.edges);

        // Transform to React Flow format
        const flowNodes = data.nodes.map(node => ({
          id: node.id,
          type: 'default',
          position: { x: node.position_x, y: node.position_y },
          data: { 
            label: node.title,
            ...node
          },
          style: getNodeStyle(node.node_type),
        }));

        const flowEdges = data.edges.map(edge => ({
          id: edge.id,
          source: edge.source_id,
          target: edge.target_id,
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [chapterId, setNodes, setEdges]);

  const getNodeStyle = (nodeType) => {
    const colors = {
      concept: { background: '#eff6ff', border: '#3b82f6' },
      application: { background: '#ecfdf5', border: '#10b981' },
      exercise: { background: '#fffbeb', border: '#f59e0b' },
      prerequisite: { background: '#f5f3ff', border: '#8b5cf6' },
    };
    const c = colors[nodeType] || colors.concept;
    return {
      background: c.background,
      border: `2px solid ${c.border}`,
      borderRadius: '8px',
      padding: '10px 15px',
      fontSize: '13px',
      fontWeight: 500,
      minWidth: '150px',
      textAlign: 'center',
    };
  };

  // Handle edge connection
  const onConnect = useCallback(async (params) => {
    try {
      const newEdge = await adminApi.createEdge({
        chapter_id: chapterId,
        source_id: params.source,
        target_id: params.target,
        edge_type: 'default'
      });
      
      setEdges((eds) => addEdge({
        ...params,
        id: newEdge.id,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
        style: { stroke: '#94a3b8', strokeWidth: 2 },
      }, eds));
    } catch (error) {
      alert('Error creating edge: ' + error.message);
    }
  }, [chapterId, setEdges]);

  // Handle node position change
  const onNodeDragStop = useCallback(async (event, node) => {
    try {
      await adminApi.updateNode(node.id, {
        position_x: node.position.x,
        position_y: node.position.y,
      });
    } catch (error) {
      console.error('Error saving node position:', error);
    }
  }, []);

  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    const fullNode = rawNodes.find(n => n.id === node.id);
    setSelectedNode(fullNode);
    setNodeEditorOpen(true);
  }, [rawNodes]);

  // Handle edge delete
  const onEdgesDelete = useCallback(async (deletedEdges) => {
    for (const edge of deletedEdges) {
      try {
        await adminApi.deleteEdge(edge.id);
      } catch (error) {
        console.error('Error deleting edge:', error);
      }
    }
  }, []);

  // Add new node
  const handleAddNode = async () => {
    if (!newNodeData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      // Calculate position (center of viewport or offset from last node)
      const position = reactFlowInstance 
        ? reactFlowInstance.screenToFlowPosition({ x: 400, y: 300 })
        : { x: 200, y: nodes.length * 100 };

      const newNode = await adminApi.createNode({
        chapter_id: chapterId,
        title: newNodeData.title,
        description: newNodeData.description,
        content: newNodeData.content,
        node_type: newNodeData.node_type,
        position_x: position.x,
        position_y: position.y,
        order_index: nodes.length,
      });

      // Add to React Flow
      setNodes((nds) => [...nds, {
        id: newNode.id,
        type: 'default',
        position: { x: newNode.position_x, y: newNode.position_y },
        data: { label: newNode.title, ...newNode },
        style: getNodeStyle(newNode.node_type),
      }]);

      setRawNodes((prev) => [...prev, newNode]);
      setAddNodeModalOpen(false);
      setNewNodeData({ title: '', description: '', content: '', node_type: 'concept' });
    } catch (error) {
      alert('Error creating node: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Update node
  const handleUpdateNode = async (updatedNode) => {
    setSaving(true);
    try {
      await adminApi.updateNode(updatedNode.id, updatedNode);
      
      // Update React Flow node
      setNodes((nds) => nds.map(n => {
        if (n.id === updatedNode.id) {
          return {
            ...n,
            data: { ...n.data, ...updatedNode, label: updatedNode.title },
            style: getNodeStyle(updatedNode.node_type),
          };
        }
        return n;
      }));

      setRawNodes((prev) => prev.map(n => n.id === updatedNode.id ? { ...n, ...updatedNode } : n));
      setNodeEditorOpen(false);
      setSelectedNode(null);
    } catch (error) {
      alert('Error updating node: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete node
  const handleDeleteNode = async (nodeId) => {
    if (!confirm('Are you sure you want to delete this node and all its resources?')) return;
    
    try {
      await adminApi.deleteNode(nodeId);
      setNodes((nds) => nds.filter(n => n.id !== nodeId));
      setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
      setRawNodes((prev) => prev.filter(n => n.id !== nodeId));
      setNodeEditorOpen(false);
      setSelectedNode(null);
    } catch (error) {
      alert('Error deleting node: ' + error.message);
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
    <div className="h-[calc(100vh-8rem)] flex flex-col -m-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <Link to="/chapters" className="hover:text-gray-700">Chapters</Link>
            <span>→</span>
            <span className="text-gray-900">{chapter?.name}</span>
          </nav>
          <h1 className="text-lg font-semibold text-gray-900">Roadmap Editor</h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`http://localhost:3000/chapter/${chapterId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </a>
          <button 
            onClick={() => setAddNodeModalOpen(true)}
            className="btn-primary btn-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Node
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={reactFlowWrapper} className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onEdgesDelete={onEdgesDelete}
          onInit={setReactFlowInstance}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          deleteKeyCode={['Backspace', 'Delete']}
          minZoom={0.1}
          maxZoom={2}
        >
          <Background color="#e5e7eb" gap={20} />
          <Controls />
          <Panel position="bottom-left" className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Tips:</strong></p>
              <p>• Drag nodes to reposition</p>
              <p>• Drag from handle to connect</p>
              <p>• Click node to edit</p>
              <p>• Select edge + Delete to remove</p>
            </div>
          </Panel>
          <Panel position="bottom-right" className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="flex flex-wrap gap-3 text-xs">
              {NODE_TYPES.map(type => (
                <div key={type.value} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: type.color }}></div>
                  <span>{type.label}</span>
                </div>
              ))}
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Add Node Modal */}
      <Modal isOpen={addNodeModalOpen} onClose={() => setAddNodeModalOpen(false)} title="Add Node">
        <div className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              type="text"
              className="input"
              value={newNodeData.title}
              onChange={(e) => setNewNodeData({ ...newNodeData, title: e.target.value })}
              placeholder="e.g., Introduction to Quadratics"
            />
          </div>
          <div>
            <label className="label">Type</label>
            <select
              className="input"
              value={newNodeData.node_type}
              onChange={(e) => setNewNodeData({ ...newNodeData, node_type: e.target.value })}
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
              value={newNodeData.description}
              onChange={(e) => setNewNodeData({ ...newNodeData, description: e.target.value })}
              placeholder="Brief description shown on the node"
            />
          </div>
          <div>
            <label className="label">Content (Markdown)</label>
            <textarea
              className="textarea font-mono text-sm"
              rows={6}
              value={newNodeData.content}
              onChange={(e) => setNewNodeData({ ...newNodeData, content: e.target.value })}
              placeholder="# Title&#10;&#10;Detailed content in Markdown..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setAddNodeModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleAddNode} className="btn-primary" disabled={saving}>
              {saving ? 'Creating...' : 'Create Node'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Node Editor Drawer */}
      {nodeEditorOpen && selectedNode && (
        <NodeEditor
          node={selectedNode}
          onClose={() => {
            setNodeEditorOpen(false);
            setSelectedNode(null);
          }}
          onSave={handleUpdateNode}
          onDelete={handleDeleteNode}
          saving={saving}
        />
      )}
    </div>
  );
}

export default RoadmapEditorPage;
