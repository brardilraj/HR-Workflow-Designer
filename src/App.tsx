import React, { useState, useEffect } from 'react';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import Sidebar from './components/canvas/Sidebar';
import NodeFormPanel from './components/forms/NodeFormPanel';
import { GitBranch, Layers, Sun, Moon } from 'lucide-react';

/* ── Persist theme preference ── */
const getInitialTheme = (): 'dark' | 'light' => {
  try {
    const saved = localStorage.getItem('hr-workflow-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* ignore */ }
  return 'dark';
};

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme);

  /* Apply data-theme attribute to root div (and persist) */
  useEffect(() => {
    localStorage.setItem('hr-workflow-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const isDark = theme === 'dark';

  return (
    <div
      data-theme={theme}
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* ── Top Header Bar ─────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-5 h-12 flex-shrink-0"
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: isDark
            ? '0 1px 0 rgba(99,120,171,0.08)'
            : '0 1px 0 rgba(99,120,171,0.12)',
        }}
      >
        {/* ── Left: Brand ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <GitBranch className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              HR Workflow Designer
            </span>
            <span
              className="ml-2 text-xs px-1.5 py-0.5 rounded font-medium"
              style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--indigo-light)' }}
            >
              v1.0
            </span>
          </div>
        </div>

        {/* ── Right: Subtitle + Theme Toggle ──────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Layers className="w-3.5 h-3.5" />
            <span className="text-xs">Visual Process Automation</span>
          </div>

          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center gap-2.5 cursor-pointer select-none rounded-xl px-3 py-1.5"
            style={{
              background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(245,158,11,0.08)',
              border: `1px solid ${isDark ? 'rgba(99,102,241,0.28)' : 'rgba(245,158,11,0.25)'}`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = isDark
                ? 'rgba(99,102,241,0.18)'
                : 'rgba(245,158,11,0.14)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = isDark
                ? 'rgba(99,102,241,0.1)'
                : 'rgba(245,158,11,0.08)';
            }}
          >
            {/* Sun icon */}
            <Sun
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{
                color: isDark ? 'var(--text-muted)' : '#f59e0b',
                opacity: isDark ? 0.45 : 1,
                transition: 'color 0.2s, opacity 0.2s',
              }}
            />

            {/* Track */}
            <div
              className="relative flex-shrink-0"
              style={{
                width: 36,
                height: 20,
                borderRadius: 999,
                background: isDark
                  ? 'rgba(99,102,241,0.25)'
                  : 'rgba(245,158,11,0.22)',
                transition: 'background 0.2s ease',
              }}
            >
              {/* Sliding dot */}
              <div
                style={{
                  position: 'absolute',
                  top: 3,
                  left: 3,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: isDark
                    ? 'linear-gradient(135deg, #818cf8, #6366f1)'
                    : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  boxShadow: isDark
                    ? '0 0 6px rgba(99,102,241,0.6)'
                    : '0 0 6px rgba(245,158,11,0.6)',
                  transform: isDark ? 'translateX(0px)' : 'translateX(16px)',
                  transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), background 0.2s ease, box-shadow 0.2s ease',
                }}
              />
            </div>

            {/* Moon icon */}
            <Moon
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{
                color: isDark ? 'var(--indigo-light)' : 'var(--text-muted)',
                opacity: isDark ? 1 : 0.45,
                transition: 'color 0.2s, opacity 0.2s',
              }}
            />
          </button>
        </div>
      </header>

      {/* ── Body: Sidebar | Canvas | Config Panel ─────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className="w-60 flex-shrink-0 flex flex-col"
          style={{
            background: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border-subtle)',
          }}
        >
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Node Library
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 h-full relative overflow-hidden">
          <WorkflowCanvas />
        </main>

        {/* Right Config Panel */}
        <aside
          className="w-[300px] flex-shrink-0 flex flex-col"
          style={{
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border-subtle)',
          }}
        >
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Properties
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <NodeFormPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;