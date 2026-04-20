import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Zap } from 'lucide-react';
import type { WorkflowNodeData } from '../../types/workflow';

const AutomatedNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <div
      className="transition-all duration-200"
      style={{
        width: 220,
        borderRadius: 12,
        background: 'var(--bg-panel)',
        border: `1.5px solid ${selected ? '#f59e0b' : 'rgba(245,158,11,0.3)'}`,
        boxShadow: selected
          ? '0 0 0 3px rgba(245,158,11,0.2), var(--shadow-node)'
          : 'var(--shadow-node)',
        overflow: 'hidden',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2"
        style={{ background: '#f59e0b', borderColor: 'var(--bg-primary)' }}
      />

      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{
          background: selected
            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
            : 'rgba(245,158,11,0.1)',
          borderBottom: '1px solid rgba(245,158,11,0.2)',
        }}
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: selected ? 'rgba(255,255,255,0.2)' : 'rgba(245,158,11,0.2)' }}
        >
          <Zap
            className="w-3.5 h-3.5"
            style={{ color: selected ? '#fff' : '#fbbf24' }}
          />
        </div>
        <div>
          <div
            className="text-[9px] font-bold uppercase tracking-widest"
            style={{ color: selected ? 'rgba(255,255,255,0.55)' : 'rgba(251,191,36,0.6)' }}
          >
            automated step
          </div>
          <div
            className="text-xs font-bold leading-tight truncate"
            style={{ color: selected ? '#fff' : 'var(--text-primary)', maxWidth: 138 }}
          >
            {data.title || 'System Action'}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        <div
          className="text-[11px] font-mono px-2 py-1.5 rounded-lg truncate"
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            color: data.actionId ? '#fbbf24' : 'var(--text-muted)',
            fontStyle: data.actionId ? 'normal' : 'italic',
          }}
        >
          {data.actionId ? `⚡ ${data.actionId}` : '~ no action selected'}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2"
        style={{ background: '#f59e0b', borderColor: 'var(--bg-primary)' }}
      />
    </div>
  );
};

export default AutomatedNode;