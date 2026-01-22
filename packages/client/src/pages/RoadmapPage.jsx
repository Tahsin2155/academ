import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import api from '../api';
import NodeDetailPanel from '../components/NodeDetailPanel';
import SearchBar from '../components/SearchBar';
import RoadmapNode from '../components/RoadmapNode';

// Custom node types
const nodeTypes = {
  roadmapNode: RoadmapNode,
};

function RoadmapPage() {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Fetch roadmap data
  useEffect(() => {
    setLoading(true);
    api.getChapterRoadmap(chapterId)
      .then(data => {
        setRoadmapData(data);
        setChapter(data.chapter);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [chapterId]);

  // Transform data to React Flow format
  useEffect(() => {
    if (!roadmapData) return;

    const flowNodes = roadmapData.nodes
      .filter(node => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          node.title.toLowerCase().includes(query) ||
          node.description?.toLowerCase().includes(query)
        );
      })
      .map(node => ({
        id: node.id,
        type: 'roadmapNode',
        position: { x: node.position_x, y: node.position_y },
        data: {
          ...node,
          isHighlighted: searchQuery && (
            node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            node.description?.toLowerCase().includes(searchQuery.toLowerCase())
          ),
          isCollapsed: collapsedNodes.has(node.id),
          onToggleCollapse: () => toggleCollapse(node.id),
        },
      }));

    const visibleNodeIds = new Set(flowNodes.map(n => n.id));
    
    const flowEdges = roadmapData.edges
      .filter(edge => visibleNodeIds.has(edge.source_id) && visibleNodeIds.has(edge.target_id))
      .map(edge => ({
        id: edge.id,
        source: edge.source_id,
        target: edge.target_id,
        label: edge.label,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#94a3b8',
        },
      }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [roadmapData, searchQuery, collapsedNodes, setNodes, setEdges]);

  const toggleCollapse = useCallback((nodeId) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const onNodeClick = useCallback((event, node) => {
    const fullNode = roadmapData?.nodes.find(n => n.id === node.id);
    setSelectedNode(fullNode);
  }, [roadmapData]);

  const closePanel = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Node colors based on type
  const nodeColor = useCallback((node) => {
    const colors = {
      concept: '#3b82f6',
      application: '#10b981',
      exercise: '#f59e0b',
      prerequisite: '#8b5cf6',
    };
    return colors[node.data?.node_type] || '#3b82f6';
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load roadmap</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link to="/" className="btn-primary">Go Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link to={`/class/${chapter?.class_id}`} className="hover:text-gray-700 transition-colors truncate max-w-[80px]">
                {chapter?.class_name}
              </Link>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link to={`/subject/${chapter?.subject_id}`} className="hover:text-gray-700 transition-colors truncate max-w-[80px]">
                {chapter?.subject_name}
              </Link>
            </nav>
            <h1 className="text-xl font-bold text-gray-900 truncate">{chapter?.name}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search concepts..."
            />
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                Concept
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                Application
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                Exercise
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Canvas */}
      <div className="flex-1 relative">
        {nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              {searchQuery ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching concepts</h3>
                  <p className="text-gray-500">Try adjusting your search query.</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No concepts available</h3>
                  <p className="text-gray-500">This chapter's roadmap is being created.</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'smoothstep',
            }}
          >
            <Background color="#e5e7eb" gap={20} />
            <Controls className="!shadow-lg !rounded-lg !border !border-gray-200" />
            <MiniMap 
              nodeColor={nodeColor}
              maskColor="rgba(255, 255, 255, 0.8)"
              className="!shadow-lg !rounded-lg !border !border-gray-200"
            />
          </ReactFlow>
        )}

        {/* Node Detail Panel */}
        {selectedNode && (
          <NodeDetailPanel 
            node={selectedNode} 
            onClose={closePanel}
          />
        )}
      </div>
    </div>
  );
}

export default RoadmapPage;
