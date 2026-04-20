import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { CheckCircle2 } from 'lucide-react';
import type { WorkflowNodeData } from '../../types/workflow';

const EndNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <div
      className="transition-all duration-200"
      style={{
        minWidth: 160,
        borderRadius: 999,
        background: selected
          ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'
          : 'var(--bg-panel)',
        border: `2px solid ${selected ? '#f43f5e' : 'rgba(244,63,94,0.5)'}`,
        boxShadow: selected
          ? '0 0 0 4px rgba(244,63,94,0.2), var(--shadow-node)'
          : 'var(--shadow-node)',
        padding: '8px 20px',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2"
        style={{ background: '#f43f5e', borderColor: 'var(--bg-primary)' }}
      />

      <div className="flex items-center gap-2.5">
        {/* Icon */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: selected ? 'rgba(255,255,255,0.2)' : 'rgba(244,63,94,0.15)',
          }}
        >
          <CheckCircle2
            className="w-3.5 h-3.5"
            style={{ color: selected ? '#fff' : '#fb7185' }}
          />
        </div>

        {/* Label */}
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: selected ? 'rgba(255,255,255,0.6)' : 'rgba(251,113,133,0.6)' }}
          >
            complete
          </div>
          <div
            className="text-sm font-bold leading-tight"
            style={{ color: selected ? '#fff' : 'var(--text-primary)' }}
          >
            {data.endMessage || 'End Workflow'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndNode;