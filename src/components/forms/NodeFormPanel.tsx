import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, ClipboardList, Play, UserCheck, Zap, Flag, Hash } from 'lucide-react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { mockApi } from '../../api/mock';
import type { WorkflowNodeData } from '../../types/workflow';

/* ── Shared input styles ─────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  borderRadius: 8,
  padding: '7px 11px',
  fontSize: 13,
  fontFamily: "'Inter', sans-serif",
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box',
};

const FormField: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
      {label}
      {required && <span className="ml-1" style={{ color: '#f43f5e' }}>*</span>}
    </label>
    {children}
  </div>
);

const StyledInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        ...inputBase,
        borderColor: focused ? 'var(--indigo)' : 'var(--border-subtle)',
        boxShadow: focused ? '0 0 0 3px var(--indigo-glow)' : 'none',
      }}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
    />
  );
};

const StyledTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      style={{
        ...inputBase,
        borderColor: focused ? 'var(--indigo)' : 'var(--border-subtle)',
        boxShadow: focused ? '0 0 0 3px var(--indigo-glow)' : 'none',
        minHeight: 80,
        resize: 'vertical',
      }}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
    />
  );
};

const StyledSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => {
  const [focused, setFocused] = useState(false);
  return (
    <select
      {...props}
      style={{
        ...inputBase,
        borderColor: focused ? 'var(--indigo)' : 'var(--border-subtle)',
        boxShadow: focused ? '0 0 0 3px var(--indigo-glow)' : 'none',
        cursor: 'pointer',
        appearance: 'none',
      }}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
    >
      {props.children}
    </select>
  );
};

/* ── Node-type meta ─────────────────────────────────────────────── */
const NODE_META: Record<string, { label: string; icon: React.ReactNode; color: string; gradient: string }> = {
  start: {
    label: 'Start Node',
    icon: <Play className="w-3.5 h-3.5" />,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  task: {
    label: 'Task Node',
    icon: <ClipboardList className="w-3.5 h-3.5" />,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  },
  approval: {
    label: 'Approval Node',
    icon: <UserCheck className="w-3.5 h-3.5" />,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  },
  automated: {
    label: 'Automated Step',
    icon: <Zap className="w-3.5 h-3.5" />,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  end: {
    label: 'End Node',
    icon: <Flag className="w-3.5 h-3.5" />,
    color: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
  },
};

/* ── Dynamic Fields ─────────────────────────────────────────────── */
const DynamicFields: React.FC<{
  type: string | undefined;
  data: WorkflowNodeData;
  onChange: (field: string, value: string) => void;
}> = ({ type, data, onChange }) => {
  const [automations, setAutomations] = useState<{ id: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (type !== 'automated') return;
    setIsLoading(true);
    mockApi.getAutomations()
      .then(setAutomations)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [type]);

  switch (type) {
    case 'start':
      return (
        <FormField label="Start Title">
          <StyledInput
            type="text"
            value={data.startTitle || ''}
            onChange={(e) => onChange('startTitle', e.target.value)}
            placeholder="e.g., Begin Onboarding"
          />
        </FormField>
      );

    case 'task':
      return (
        <>
          <FormField label="Task Title" required>
            <StyledInput
              type="text"
              value={data.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="e.g., Collect ID Documents"
            />
          </FormField>
          <FormField label="Description">
            <StyledTextarea
              value={data.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Provide details about the task…"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Assignee">
              <StyledInput
                type="text"
                value={data.assignee || ''}
                onChange={(e) => onChange('assignee', e.target.value)}
                placeholder="e.g., HR Admin"
              />
            </FormField>
            <FormField label="Due Date">
              <StyledInput
                type="date"
                value={data.dueDate || ''}
                onChange={(e) => onChange('dueDate', e.target.value)}
              />
            </FormField>
          </div>
        </>
      );

    case 'approval':
      return (
        <>
          <FormField label="Approval Title">
            <StyledInput
              type="text"
              value={data.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="e.g., Manager Review"
            />
          </FormField>
          <FormField label="Approver Role">
            <StyledSelect
              value={data.approverRole || ''}
              onChange={(e) => onChange('approverRole', e.target.value)}
            >
              <option value="">Select a role…</option>
              <option value="Manager">Manager</option>
              <option value="HRBP">HRBP</option>
              <option value="Director">Director</option>
            </StyledSelect>
          </FormField>
        </>
      );

    case 'automated':
      return (
        <>
          <FormField label="Action Title">
            <StyledInput
              type="text"
              value={data.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="e.g., Send Welcome Email"
            />
          </FormField>
          <FormField label="System Action">
            {isLoading ? (
              <div
                className="h-9 rounded-lg skeleton"
                style={{ width: '100%' }}
              />
            ) : (
              <StyledSelect
                value={data.actionId || ''}
                onChange={(e) => onChange('actionId', e.target.value)}
              >
                <option value="">Select an action…</option>
                {automations.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </StyledSelect>
            )}
          </FormField>
        </>
      );

    case 'end':
      return (
        <FormField label="Completion Message">
          <StyledInput
            type="text"
            value={data.endMessage || ''}
            onChange={(e) => onChange('endMessage', e.target.value)}
            placeholder="e.g., Process Complete"
          />
        </FormField>
      );

    default:
      return (
        <div
          className="text-xs italic p-3 rounded-xl"
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.25)',
            color: '#fbbf24',
          }}
        >
          Configuration fields for "{type}" are not yet implemented.
        </div>
      );
  }
};

/* ── Main Panel ─────────────────────────────────────────────────── */
const NodeFormPanel: React.FC = () => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleChange = useCallback((field: string, value: string) => {
    if (selectedNodeId) updateNodeData(selectedNodeId, { [field]: value });
  }, [selectedNodeId, updateNodeData]);

  const handleDelete = () => {
    if (selectedNodeId) deleteNode(selectedNodeId);
  };

  /* Empty state */
  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
        >
          <ClipboardList className="w-6 h-6" style={{ color: 'var(--indigo-light)', opacity: 0.5 }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No node selected</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Click a node on the canvas to configure its properties.</p>
        </div>
      </div>
    );
  }

  const meta = NODE_META[selectedNode.type || ''];
  const shortId = selectedNode.id.split('-')[0].toUpperCase();

  return (
    <div className="flex flex-col gap-0 h-full panel-enter overflow-y-auto">

      {/* Node type header banner */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: meta
            ? `${meta.gradient.replace('linear-gradient', 'linear-gradient').split(')')[0]})`.replace('135deg', '135deg') + '18'
            : undefined,
          borderBottom: `1px solid ${meta ? meta.color + '22' : 'var(--border-subtle)'}`,
        }}
      >
        <div className="flex items-start gap-2.5">
          {/* Type badge */}
          {meta && (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: meta.gradient, color: '#fff' }}
            >
              {meta.icon}
            </div>
          )}
          <div>
            <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {meta?.label || `${selectedNode.type} Node`}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Hash className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
              <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>{shortId}</span>
            </div>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          aria-label="Delete this node"
          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
          style={{ color: 'var(--text-muted)', border: '1px solid transparent' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#f43f5e';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,63,94,0.1)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(244,63,94,0.2)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
          }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Form fields */}
      <div className="p-4 flex flex-col gap-4">
        <div
          className="text-[10px] font-bold uppercase tracking-widest pb-2"
          style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          Configuration
        </div>

        <DynamicFields
          type={selectedNode.type}
          data={selectedNode.data}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default NodeFormPanel;