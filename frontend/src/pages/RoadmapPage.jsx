import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getRoadmap, getChapter, getSubject } from '../api';
import NodeDetailPanel from '../components/NodeDetailPanel';
import RoadmapNode from '../components/RoadmapNode';

export default function RoadmapPage() {
  const { chapterId } = useParams();
  const [chapterInfo, setChapterInfo] = useState(null);
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodeTypes = useMemo(() => ({ roadmapNode: RoadmapNode }), []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [roadmapData, chapterData] = await Promise.all([
          getRoadmap(chapterId),
          getChapter(chapterId)
        ]);
        
        // Fetch subject info for proper breadcrumb navigation
        if (chapterData.subjectId) {
          const subjectData = await getSubject(chapterData.subjectId);
          setSubjectInfo(subjectData);
        }
        
        // Transform nodes to React Flow format
        const flowNodes = roadmapData.nodes.map((node) => ({
          id: node.id,
          type: 'roadmapNode',
          position: node.position || { x: 250, y: 0 },
          data: { 
            ...node,
            highlighted: false
          },
        }));
        
        // Transform edges to React Flow format
        const flowEdges = roadmapData.edges.map((edge) => ({
          id: edge.id,
          source: edge.from,
          target: edge.to,
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }));
        
        setNodes(flowNodes);
        setEdges(flowEdges);
        setChapterInfo(chapterData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [chapterId, setNodes, setEdges]);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, highlighted: false },
        }))
      );
      return;
    }
    
    const query = searchQuery.toLowerCase();
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          highlighted:
            node.data.title.toLowerCase().includes(query) ||
            node.data.description?.toLowerCase().includes(query),
        },
      }))
    );
  }, [searchQuery, setNodes]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data);
  }, []);

  const closePanel = useCallback(() => {
    setSelectedNode(null);
  }, []);

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
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)]">
      <nav className="mb-4">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          Classes
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to={`/class/${subjectInfo?.classId}`} className="text-indigo-600 hover:text-indigo-800">
          Subjects
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{chapterInfo?.name}</span>
      </nav>
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{chapterInfo?.name}</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg h-full border border-gray-200 overflow-hidden">
        {nodes.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Background color="#e0e0e0" gap={16} />
            <Controls />
            <MiniMap 
              nodeColor={(node) => node.data.highlighted ? '#fbbf24' : '#6366f1'}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg">No roadmap nodes yet for this chapter.</p>
              <p className="text-sm mt-2">Add nodes from the Admin panel.</p>
            </div>
          </div>
        )}
      </div>
      
      {selectedNode && (
        <NodeDetailPanel node={selectedNode} onClose={closePanel} />
      )}
    </div>
  );
}
