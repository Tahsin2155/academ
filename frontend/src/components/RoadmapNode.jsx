import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

function RoadmapNode({ data }) {
  const { title, description, highlighted } = data;
  
  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-md border-2 min-w-[180px] max-w-[250px] cursor-pointer transition-all duration-200 ${
        highlighted 
          ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300' 
          : 'bg-white border-indigo-300 hover:border-indigo-500 hover:shadow-lg'
      }`}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 !bg-indigo-500"
      />
      <div className="font-semibold text-gray-900 text-sm">{title}</div>
      {description && (
        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</div>
      )}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 !bg-indigo-500"
      />
    </div>
  );
}

export default memo(RoadmapNode);
