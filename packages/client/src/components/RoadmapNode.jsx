import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const nodeTypeColors = {
  concept: {
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    accent: 'bg-primary-500',
    text: 'text-primary-700',
    hover: 'hover:border-primary-400 hover:shadow-primary-100',
  },
  application: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    accent: 'bg-green-500',
    text: 'text-green-700',
    hover: 'hover:border-green-400 hover:shadow-green-100',
  },
  exercise: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    accent: 'bg-amber-500',
    text: 'text-amber-700',
    hover: 'hover:border-amber-400 hover:shadow-amber-100',
  },
  prerequisite: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    accent: 'bg-purple-500',
    text: 'text-purple-700',
    hover: 'hover:border-purple-400 hover:shadow-purple-100',
  },
};

function RoadmapNode({ data, selected }) {
  const colors = nodeTypeColors[data.node_type] || nodeTypeColors.concept;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-gray-300 !border-2 !border-white"
      />
      
      <div
        className={`
          min-w-[180px] max-w-[250px] rounded-xl border-2 shadow-sm transition-all duration-200 cursor-pointer
          ${colors.bg} ${colors.border} ${colors.hover}
          ${selected ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
          ${data.isHighlighted ? 'ring-2 ring-amber-400 ring-offset-1' : ''}
        `}
      >
        {/* Accent bar */}
        <div className={`h-1 rounded-t-lg ${colors.accent}`}></div>
        
        {/* Content */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold text-sm leading-tight ${colors.text}`}>
              {data.title}
            </h3>
            {data.resources && (
              Object.values(data.resources).flat().length > 0
            ) && (
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </span>
            )}
          </div>
          
          {data.description && (
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
              {data.description}
            </p>
          )}
          
          {/* Type badge */}
          <div className="mt-2 flex items-center justify-between">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
              {data.node_type || 'concept'}
            </span>
            
            <span className="text-xs text-gray-400">
              Click to view
            </span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-gray-300 !border-2 !border-white"
      />
    </>
  );
}

export default memo(RoadmapNode);
