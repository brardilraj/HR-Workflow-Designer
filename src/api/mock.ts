import type { Edge } from 'reactflow';
import type { WorkflowNode } from '../types/workflow';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  getAutomations: async () => {
    await delay(500); 
    return [
      { id: "send_email", label: "Send Email", params: ["to", "subject"] },
      { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
      { id: "update_db", label: "Update Database", params: ["table", "record_id"] }
    ];
  },

  simulateWorkflow: async (payload: { nodes: WorkflowNode[]; edges: Edge[] }) => {
    await delay(1000);

    const { nodes, edges } = payload;
    const logs: string[] = [];
    
    let currentNode = nodes.find(n => n.type === 'start');
    
    if (!currentNode) {
      return { success: false, logs: ["Error: No Start Node found in the workflow."] };
    }

    logs.push(`[System] Initializing workflow simulation...`);

    let stepCount = 1;
    while (currentNode) {
      // FIX: Provide a safe fallback if the type is undefined
      const safeType = currentNode.type || 'unknown';
      const nodeName = currentNode.data.title || currentNode.data.startTitle || safeType.toUpperCase();
      
      logs.push(`Step ${stepCount}: Executing [${safeType.toUpperCase()}] - ${nodeName}`);
      
      const outgoingEdge = edges.find(e => e.source === currentNode?.id);
      
      if (!outgoingEdge) {
        if (currentNode.type !== 'end') {
          logs.push(`[Warning] Workflow ended abruptly. No outgoing connection from ${safeType} node.`);
        } else {
          logs.push(`[Success] Workflow completed: ${currentNode.data.endMessage || 'No final message provided.'}`);
        }
        break; 
      }

      currentNode = nodes.find(n => n.id === outgoingEdge.target);
      stepCount++;
      
      if (stepCount > 25) {
        logs.push(`[Error] Simulation terminated: Infinite execution cycle detected.`);
        break;
      }
    }

    return { success: true, logs };
  }
};