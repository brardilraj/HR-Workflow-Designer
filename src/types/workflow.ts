import type { Node } from 'reactflow';

// Defines all possible data fields across the required custom nodes
export interface WorkflowNodeData {
  // Start Node
  startTitle?: string; // [cite: 83]
  metadata?: Record<string, string>; // [cite: 84]
  
  // Task Node
  title?: string; // [cite: 86]
  description?: string; // [cite: 87]
  assignee?: string; // [cite: 88]
  dueDate?: string; // [cite: 89]
  customFields?: Record<string, string>; // [cite: 90]
  
  // Approval Node
  approverRole?: string; // [cite: 93]
  autoApproveThreshold?: number; // [cite: 94]
  
  // Automated Step Node
  actionId?: string; // [cite: 97]
  actionParams?: Record<string, unknown>; // [cite: 98]
  
  // End Node
  endMessage?: string; // [cite: 100]
  isSummary?: boolean; // [cite: 102]
  
  // Internal state tracking
  [key: string]: unknown;
}

export type WorkflowNode = Node<WorkflowNodeData>;