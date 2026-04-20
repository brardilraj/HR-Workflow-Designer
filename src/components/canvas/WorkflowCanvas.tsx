import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  type NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { PlayCircle, Download, GitBranch, Cpu } from 'lucide-react';

import { useWorkflowStore } from '../../store/useWorkflowStore';
import { mockApi } from '../../api/mock';

import StartNode from '../nodes/StartNode';
import TaskNode from '../nodes/TaskNode';
import ApprovalNode from '../nodes/ApprovalNode';
import AutomatedNode from '../nodes/AutomatedNode';
import EndNode from '../nodes/EndNode';
import SimulationModal from './SimulationModal';
import type { WorkflowNode } from '../../types/workflow';

const FlowEngine: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
  const onConnect = useWorkflowStore((state) => state.onConnect);
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId);
  const addNode = useWorkflowStore((state) => state.addNode);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const nodeTypes = useMemo(() => ({
    start: StartNode,
    task: TaskNode,
    approval: ApprovalNode,
    automated: AutomatedNode,
    end: EndNode,
  }), []);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: WorkflowNode = {
        id: uuidv4(),
        type,
        position,
        data: { title: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      };
      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const handleExportJSON = async () => {
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 350));
    const workflowData = { nodes, edges };
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hr-workflow-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleRunSimulation = async () => {
    setIsModalOpen(true);
    setIsSimulating(true);
    setLogs([]);
    try {
      const result = await mockApi.simulateWorkflow({ nodes, edges });
      setLogs(result.logs);
    } catch {
      setLogs(['[Error] Simulation failed to execute due to a system error.']);
    } finally {
      setIsSimulating(false);
    }
  };

  const nodeCount = nodes.length;
  const edgeCount = edges.length;

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        style={{ background: 'var(--bg-primary)' }}
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: '#818cf8' },
          animated: false,
        }}
      >
        {/* Grid dot background */}
        <Background
          variant={BackgroundVariant.Dots}
          color="rgba(99,120,171,0.2)"
          gap={24}
          size={1.5}
        />
        <Controls />
        <MiniMap
          zoomable
          pannable
          nodeColor={(n) => {
            if (n.type === 'start') return '#10b981';
            if (n.type === 'task') return '#6366f1';
            if (n.type === 'approval') return '#8b5cf6';
            if (n.type === 'automated') return '#f59e0b';
            if (n.type === 'end') return '#f43f5e';
            return '#4d5566';
          }}
        />

        {/* ── Canvas Brand Badge ───────────────────────────── */}
        <Panel position="top-left">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-panel)',
            }}
          >
            <GitBranch className="w-3.5 h-3.5" style={{ color: 'var(--indigo-light)' }} />
            <span style={{ color: 'var(--text-primary)' }}>Canvas</span>
            <div className="mx-1 w-px h-3" style={{ background: 'var(--border-medium)' }} />
            <Cpu className="w-3 h-3" />
            <span>{nodeCount} nodes · {edgeCount} edges</span>
          </div>
        </Panel>

        {/* ── Action Buttons ───────────────────────────────── */}
        <Panel position="top-right">
          <div className="flex gap-2 items-center">
            {/* Export */}
            <button
              onClick={handleExportJSON}
              disabled={isExporting}
              aria-label="Export workflow as JSON"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200"
              style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow-panel)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--indigo)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-panel)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-medium)';
              }}
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting…' : 'Export JSON'}
            </button>

            {/* Run Simulation */}
            <button
              onClick={handleRunSimulation}
              aria-label="Run workflow simulation"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: '1px solid rgba(16,185,129,0.4)',
                color: '#fff',
                boxShadow: '0 0 20px rgba(16,185,129,0.25), var(--shadow-panel)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(16,185,129,0.45), var(--shadow-panel)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(16,185,129,0.25), var(--shadow-panel)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              <PlayCircle className="w-4 h-4" />
              Run Simulation
            </button>
          </div>
        </Panel>

        {/* ── Empty-state hint ─────────────────────────────── */}
        {nodeCount === 0 && (
          <Panel position="bottom-center">
            <div
              className="px-5 py-3 rounded-2xl text-sm"
              style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                boxShadow: 'var(--shadow-panel)',
              }}
            >
              Drag nodes from the <strong style={{ color: 'var(--indigo-light)' }}>Node Library</strong> to get started
            </div>
          </Panel>
        )}
      </ReactFlow>

      <SimulationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        logs={logs}
        isSimulating={isSimulating}
      />
    </div>
  );
};

const WorkflowCanvas: React.FC = () => (
  <ReactFlowProvider>
    <FlowEngine />
  </ReactFlowProvider>
);

export default WorkflowCanvas;