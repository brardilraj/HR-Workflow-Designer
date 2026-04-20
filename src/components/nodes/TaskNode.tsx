import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { ClipboardList, Clock, User } from 'lucide-react';
import type { WorkflowNodeData } from '../../types/workflow';

const TaskNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <div
      className="transition-all duration-200"
      style={{
        width: 240,
        borderRadius: 12,
        background: 'var(--bg-panel)',
        border: `1.5px solid ${selected ? '#6366f1' : 'rgba(99,102,241,0.3)'}`,
        boxShadow: selected
          ? '0 0 0 3px rgba(99,102,241,0.2), var(--shadow-node)'
          : 'var(--shadow-node)',
        overflow: 'hidden',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2"
        style={{ background: '#6366f1', borderColor: 'var(--bg-primary)' }}
      />

      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{
          background: selected
            ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
            : 'rgba(99,102,241,0.1)',
          borderBottom: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: selected ? 'rgba(255,255,255,0.2)' : 'rgba(99,102,241,0.2)' }}
        >
          <ClipboardList
            className="w-3.5 h-3.5"
            style={{ color: selected ? '#fff' : '#818cf8' }}
          />
        </div>
        <div>
          <div
            className="text-[9px] font-bold uppercase tracking-widest"
            style={{ color: selected ? 'rgba(255,255,255,0.55)' : 'rgba(129,140,248,0.6)' }}
          >
            task node
          </div>
          <div
            className="text-xs font-bold leading-tight truncate"
            style={{ color: selected ? '#fff' : 'var(--text-primary)', maxWidth: 158 }}
          >
            {data.title || 'New Task'}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 flex flex-col gap-2">
        {/* Description */}
        <p
          className="text-xs leading-relaxed line-clamp-2"
          style={{ color: data.description ? 'var(--text-secondary)' : 'var(--text-muted)', fontStyle: data.description ? 'normal' : 'italic' }}
        >
          {data.description || 'No description provided.'}
        </p>

        {/* Metadata row */}
        <div
          className="flex items-center justify-between pt-2"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <User className="w-3 h-3" />
            <span className="text-[11px] font-medium">{data.assignee || 'Unassigned'}</span>
          </div>
          <div
            className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md"
            style={{
              background: 'rgba(99,102,241,0.1)',
              color: '#818cf8',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <Clock className="w-3 h-3" />
            <span>{data.dueDate || '—'}</span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2"
        style={{ background: '#6366f1', borderColor: 'var(--bg-primary)' }}
      />
    </div>
  );
};

export default TaskNode;