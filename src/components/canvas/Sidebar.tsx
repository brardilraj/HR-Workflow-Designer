import React from 'react';
import { Play, ClipboardList, UserCheck, Zap, Flag, Lightbulb } from 'lucide-react';

interface NodeConfig {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  gradient: string;
}

const NODE_CONFIGS: NodeConfig[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Workflow entry point',
    icon: <Play className="w-4 h-4" />,
    accent:       '#10b981',
    accentBg:     'rgba(16,185,129,0.1)',
    accentBorder: 'rgba(16,185,129,0.35)',
    accentText:   '#34d399',
    gradient:     'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Human action required',
    icon: <ClipboardList className="w-4 h-4" />,
    accent:       '#6366f1',
    accentBg:     'rgba(99,102,241,0.1)',
    accentBorder: 'rgba(99,102,241,0.35)',
    accentText:   '#818cf8',
    gradient:     'linear-gradient(135deg, #6366f1, #4f46e5)',
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Requires sign-off',
    icon: <UserCheck className="w-4 h-4" />,
    accent:       '#8b5cf6',
    accentBg:     'rgba(139,92,246,0.1)',
    accentBorder: 'rgba(139,92,246,0.35)',
    accentText:   '#a78bfa',
    gradient:     'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  },
  {
    type: 'automated',
    label: 'Automated',
    description: 'System-triggered action',
    icon: <Zap className="w-4 h-4" />,
    accent:       '#f59e0b',
    accentBg:     'rgba(245,158,11,0.1)',
    accentBorder: 'rgba(245,158,11,0.35)',
    accentText:   '#fbbf24',
    gradient:     'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Workflow terminator',
    icon: <Flag className="w-4 h-4" />,
    accent:       '#f43f5e',
    accentBg:     'rgba(244,63,94,0.1)',
    accentBorder: 'rgba(244,63,94,0.35)',
    accentText:   '#fb7185',
    gradient:     'linear-gradient(135deg, #f43f5e, #e11d48)',
  },
];

const NodeCard: React.FC<NodeConfig & { index: number }> = ({
  type, label, description, icon, accentBg, accentBorder, accentText, gradient, index
}) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      role="button"
      aria-label={`Drag to add ${label} node`}
      className="sidebar-card group flex items-center gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 select-none"
      style={{
        background: accentBg,
        border: `1px solid ${accentBorder}`,
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateX(3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${accentBg}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Icon Badge */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: gradient, color: '#fff' }}
      >
        {icon}
      </div>

      {/* Labels */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold leading-tight" style={{ color: accentText }}>
          {label}
        </div>
        <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
          {description}
        </div>
      </div>

      {/* Drag indicator */}
      <div
        className="w-1 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
        style={{ background: gradient }}
      />
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="p-3 flex flex-col gap-2">
      <p className="text-xs pt-1 pb-2 px-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Drag nodes onto the canvas to build your workflow.
      </p>

      <div className="flex flex-col gap-1.5">
        {NODE_CONFIGS.map((config, i) => (
          <NodeCard key={config.type} {...config} index={i} />
        ))}
      </div>

      <div
        className="mt-4 p-3 rounded-xl text-xs leading-relaxed"
        style={{
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.15)',
          color: 'var(--text-muted)',
        }}
      >
        <div className="font-semibold mb-1 flex items-center gap-1.5" style={{ color: 'var(--indigo-light)' }}>
          <Lightbulb className="w-3 h-3" />
          Quick tip
        </div>
        Connect nodes by dragging from the bottom handle to the top handle of another node.
      </div>
    </div>
  );
};

export default Sidebar;