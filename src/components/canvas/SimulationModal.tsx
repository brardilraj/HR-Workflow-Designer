import React, { useEffect, useRef } from 'react';
import { X, Terminal, Circle } from 'lucide-react';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: string[];
  isSimulating: boolean;
}

const SimulationModal: React.FC<SimulationModalProps> = ({ isOpen, onClose, logs, isSimulating }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isSimulating]);

  if (!isOpen) return null;

  const getLogStyle = (log: string): { color: string; prefix: string } => {
    if (log.includes('[Error]'))   return { color: '#f87171', prefix: '✗' };
    if (log.includes('[Success]')) return { color: '#34d399', prefix: '✓' };
    if (log.includes('[Warning]')) return { color: '#fbbf24', prefix: '⚠' };
    if (log.includes('[System]'))  return { color: '#60a5fa', prefix: '○' };
    return { color: '#94a3b8', prefix: '›' };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex flex-col overflow-hidden"
        style={{
          width: '100%',
          maxWidth: 680,
          maxHeight: '82vh',
          borderRadius: 16,
          background: '#0d1117',
          border: '1px solid rgba(99,120,171,0.22)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.08)',
          animation: 'fadeUp 0.25s ease both',
        }}
      >
        {/* ── Traffic-light title bar ───────────────────── */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{
            background: '#161b22',
            borderBottom: '1px solid rgba(99,120,171,0.18)',
          }}
        >
          {/* Traffic lights + title */}
          <div className="flex items-center gap-3">
            {/* macOS-style traffic lights */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onClose}
                aria-label="Close terminal"
                className="w-3 h-3 rounded-full transition-opacity hover:opacity-80 cursor-pointer"
                style={{ background: '#f43f5e' }}
              />
              <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
            </div>

            <div className="w-px h-4 mx-1" style={{ background: 'rgba(99,120,171,0.25)' }} />

            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" style={{ color: '#34d399' }} />
              <span className="text-sm font-semibold" style={{ color: '#e6edf3' }}>
                Workflow Execution Terminal
              </span>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            {isSimulating ? (
              <div className="flex items-center gap-1.5">
                <Circle
                  className="w-2 h-2 fill-current"
                  style={{ color: '#34d399', animation: 'pulse 1.2s cubic-bezier(0.4,0,0.6,1) infinite' }}
                />
                <span className="text-xs font-medium" style={{ color: '#34d399' }}>Running</span>
              </div>
            ) : logs.length > 0 ? (
              <div className="flex items-center gap-1.5">
                <Circle className="w-2 h-2 fill-current" style={{ color: '#4d5566' }} />
                <span className="text-xs" style={{ color: '#4d5566' }}>Done</span>
              </div>
            ) : null}
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
              style={{ color: '#4d5566', border: '1px solid transparent' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#e6edf3';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,120,171,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#4d5566';
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Terminal prompt line ──────────────────────── */}
        <div
          className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
          style={{
            background: '#0d1117',
            borderBottom: '1px solid rgba(99,120,171,0.1)',
            fontFamily: "'JetBrains Mono', 'Consolas', monospace",
            fontSize: 12,
          }}
        >
          <span style={{ color: '#6366f1' }}>hr-workflow</span>
          <span style={{ color: '#4d5566' }}>→</span>
          <span style={{ color: '#34d399' }}>simulate</span>
          <span style={{ color: '#f59e0b' }}>--format=json</span>
          <span className="terminal-cursor inline-block w-2 h-4 ml-2 rounded-sm" style={{ background: '#34d399' }} />
        </div>

        {/* ── Log output area ───────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-1.5"
          style={{
            background: '#0d1117',
            fontFamily: "'JetBrains Mono', 'Consolas', monospace",
            fontSize: 12.5,
          }}
        >
          {isSimulating && (
            <div className="flex items-center gap-3" style={{ color: '#60a5fa' }}>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: '#60a5fa',
                      animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
              <span style={{ color: '#60a5fa' }}>Initializing workflow engine…</span>
            </div>
          )}

          {!isSimulating && logs.length === 0 && (
            <div className="text-sm italic" style={{ color: '#4d5566' }}>
              No execution logs found.
            </div>
          )}

          {logs.map((log, index) => {
            const { color, prefix } = getLogStyle(log);
            return (
              <div
                key={index}
                className="flex items-start gap-2.5 leading-relaxed break-words"
                style={{ animationDelay: `${index * 40}ms`, animation: 'fadeUp 0.2s ease both' }}
              >
                <span className="flex-shrink-0 font-bold" style={{ color, minWidth: 12 }}>{prefix}</span>
                <span style={{ color: `${color}cc` }}>{log}</span>
              </div>
            );
          })}
          <div ref={logsEndRef} />
        </div>

        {/* ── Footer ───────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
          style={{
            background: '#161b22',
            borderTop: '1px solid rgba(99,120,171,0.15)',
          }}
        >
          <span className="text-xs font-mono" style={{ color: '#4d5566' }}>
            {logs.length} {logs.length === 1 ? 'line' : 'lines'} of output
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150"
            style={{
              background: 'rgba(99,120,171,0.1)',
              border: '1px solid rgba(99,120,171,0.25)',
              color: '#8b949e',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.15)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.35)';
              (e.currentTarget as HTMLButtonElement).style.color = '#818cf8';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,120,171,0.1)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,120,171,0.25)';
              (e.currentTarget as HTMLButtonElement).style.color = '#8b949e';
            }}
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationModal;