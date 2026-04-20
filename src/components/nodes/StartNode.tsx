import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import type { WorkflowNodeData } from '../../types/workflow';

const StartNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <div
      className="transition-all duration-200"
      style={{
        minWidth: 160,
        borderRadius: 999,
        background: selected
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : 'var(--bg-panel)',
        border: `2px solid ${selected ? '#10b981' : 'rgba(16,185,129,0.5)'}`,
        boxShadow: selected
          ? '0 0 0 4px rgba(16,185,129,0.2), var(--shadow-node)'
          : 'var(--shadow-node)',
        padding: '8px 20px',
      }}
    >
      <div className="flex items-center gap-2.5">
        {/* Icon */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: selected ? 'rgba(255,255,255,0.2)' : 'rgba(16,185,129,0.15)',
          }}
        >
          <Play
            className="w-3.5 h-3.5 ml-0.5"
            style={{ color: selected ? '#fff' : '#34d399' }}
          />
        </div>

        {/* Label */}
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: selected ? 'rgba(255,255,255,0.6)' : '#34d39980' }}
          >
            trigger
          </div>
          <div
            className="text-sm font-bold leading-tight"
            style={{ color: selected ? '#fff' : 'var(--text-primary)' }}
          >
            {data.startTitle || 'Start Workflow'}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2"
        style={{ background: '#10b981', borderColor: 'var(--bg-primary)' }}
      />
    </div>
  );
};

export default StartNode;