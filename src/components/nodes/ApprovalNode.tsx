import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { UserCheck, ShieldCheck } from 'lucide-react';
import type { WorkflowNodeData } from '../../types/workflow';

const ApprovalNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  const roleColors: Record<string, { bg: string; text: string; border: string }> = {
    Manager:  { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
    HRBP:     { bg: 'rgba(99,102,241,0.15)',  text: '#818cf8', border: 'rgba(99,102,241,0.3)' },
    Director: { bg: 'rgba(244,63,94,0.12)',   text: '#fb7185', border: 'rgba(244,63,94,0.3)'  },
  };
  const roleBadge = data.approverRole ? roleColors[data.approverRole] : null;

  return (
    <div
      className="transition-all duration-200"
      style={{
        width: 220,
        borderRadius: 12,
        background: 'var(--bg-panel)',
        border: `1.5px solid ${selected ? '#8b5cf6' : 'rgba(139,92,246,0.3)'}`,
        boxShadow: selected
          ? '0 0 0 3px rgba(139,92,246,0.2), var(--shadow-node)'
          : 'var(--shadow-node)',
        overflow: 'hidden',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2"
        style={{ background: '#8b5cf6', borderColor: 'var(--bg-primary)' }}
      />

      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{
          background: selected
            ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
            : 'rgba(139,92,246,0.1)',
          borderBottom: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: selected ? 'rgba(255,255,255,0.2)' : 'rgba(139,92,246,0.2)' }}
        >
          <UserCheck
            className="w-3.5 h-3.5"
            style={{ color: selected ? '#fff' : '#a78bfa' }}
          />
        </div>
        <div>
          <div
            className="text-[9px] font-bold uppercase tracking-widest"
            style={{ color: selected ? 'rgba(255,255,255,0.55)' : 'rgba(167,139,250,0.6)' }}
          >
            approval gate
          </div>
          <div
            className="text-xs font-bold leading-tight truncate"
            style={{ color: selected ? '#fff' : 'var(--text-primary)', maxWidth: 138 }}
          >
            {data.title || 'Manager Approval'}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[11px]">Approver</span>
        </div>
        {data.approverRole && roleBadge ? (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: roleBadge.bg, color: roleBadge.text, border: `1px solid ${roleBadge.border}` }}
          >
            {data.approverRole}
          </span>
        ) : (
          <span className="text-[11px] italic" style={{ color: 'var(--text-muted)' }}>Unassigned</span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2"
        style={{ background: '#8b5cf6', borderColor: 'var(--bg-primary)' }}
      />
    </div>
  );
};

export default ApprovalNode;