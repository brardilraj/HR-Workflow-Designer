# HR Workflow Designer

> A professional, interactive visual workflow editor for designing, configuring, and simulating HR automation processes — built as a full-stack frontend case study using React 19, TypeScript, and React Flow.

<br/>

## ✨ Live Demo

```
npm install && npm run dev
# → http://localhost:5173
```

---

## ✨ Interface Highlights

| Dark Mode | Light Mode |
|---|---|
| Deep navy canvas with glassmorphism panels | Clean white layout with soft blue-grey accents |
| Drag nodes → connect → simulate in real-time | Persistent theme preference via `localStorage` |

---

## 🧱 Architecture

### Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | React 19 + TypeScript | Type-safe, component-based UI with strict type coverage |
| **Build Tool** | Vite 6 | Sub-second HMR, ESM-native, minimal config |
| **Graph Engine** | React Flow v11 | Production-grade canvas: pan, zoom, drag-and-drop, custom nodes, edges |
| **State Management** | Zustand v5 | Atomic, boilerplate-free global state — no Provider wrapping needed |
| **Styling** | Tailwind CSS v3 + Custom CSS Variables | Utility classes for layout; CSS tokens for the design system |
| **Icons** | Lucide React | Consistent, tree-shakable SVG icon set |
| **ID Generation** | `uuid` v11 | Cryptographically unique node IDs on every drop |
| **Mock Service** | Custom `async/await` with `setTimeout` | Simulates real API latency without a backend |

---

### Folder Structure

```
hr-workflow-designer/
├── src/
│   ├── api/
│   │   └── mock.ts            # Async service layer: getAutomations(), simulateWorkflow()
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── WorkflowCanvas.tsx   # ReactFlow engine, DnD, export, simulation trigger
│   │   │   ├── Sidebar.tsx          # Draggable node library panel
│   │   │   └── SimulationModal.tsx  # Terminal-style execution viewer
│   │   ├── forms/
│   │   │   └── NodeFormPanel.tsx    # Dynamic property editor (per-node-type fields)
│   │   └── nodes/
│   │       ├── StartNode.tsx        # Workflow entry point
│   │       ├── TaskNode.tsx         # Human action step
│   │       ├── ApprovalNode.tsx     # Sign-off gate with role selector
│   │       ├── AutomatedNode.tsx    # System-triggered action
│   │       └── EndNode.tsx          # Workflow terminator
│   ├── store/
│   │   └── useWorkflowStore.ts  # Zustand store: nodes, edges, selection, CRUD
│   ├── types/
│   │   └── workflow.ts          # WorkflowNodeData interface, WorkflowNode type
│   ├── App.tsx                  # Root layout, theme toggle, 3-panel shell
│   ├── index.css                # Design tokens, dark/light variables, global overrides
│   └── main.tsx                 # React root entry
├── tailwind.config.js           # Extended design tokens, custom fonts, shadows
├── index.html                   # Google Fonts (Inter, JetBrains Mono), meta SEO
└── package.json
```

---

### Data Flow

```
User drags node from Sidebar
        │
        ▼
WorkflowCanvas.onDrop()
  → screenToFlowPosition()       # Convert screen coords → canvas coords
  → uuidv4()                     # Generate unique ID
  → useWorkflowStore.addNode()   # Write to Zustand
        │
        ▼
React Flow re-renders canvas
  → Custom node components read `data.*` from props
        │
        ▼
User clicks a node
  → useWorkflowStore.setSelectedNodeId()
  → NodeFormPanel reads selectedNode from store
  → DynamicFields renders type-specific inputs
  → onChange → useWorkflowStore.updateNodeData()
        │
        ▼
User clicks "Run Simulation"
  → mockApi.simulateWorkflow({ nodes, edges })
  → DAG traversal: start → outgoing edge → next node → repeat
  → Returns structured log array
  → SimulationModal streams logs with 100ms stagger animation
```

---

## 🧠 Key Design Decisions

### 1. Zustand over Context API
React Context is not suitable for a real-time canvas editor. Every node drag triggers dozens of position updates per second — a Context provider would force a full re-render of the entire tree on every update. Zustand uses fine-grained subscriptions so only the components that subscribe to `nodes` re-render, while `NodeFormPanel` (subscribed only to `selectedNodeId`) stays completely untouched.

### 2. Strict Service Layer Abstraction
All async operations are isolated in `src/api/mock.ts` behind a clean interface (`getAutomations`, `simulateWorkflow`). Components never contain `setTimeout` or raw data construction — they only call API methods and handle results. **Swapping the mock for a real REST/GraphQL backend requires changing exactly one file.**

### 3. Type-First Node Data Model
`WorkflowNodeData` is a single, unified interface covering every field across all 5 node types. Using a discriminated union was considered but rejected: React Flow's node `data` prop is a single object, and the union would require constant narrowing at every render site. The flat interface with optional keys — backed by the `[key: string]: unknown` index signature — is cleaner for this canvas-editor pattern.

### 4. Dynamic Field Routing via Switch
`NodeFormPanel` uses a `switch(type)` pattern to mount only the fields relevant to the selected node, rather than one enormous form with conditional visibility. This keeps the DOM minimal, makes each case independently readable, and means adding a new node type requires adding exactly one `case` block.

### 5. CSS Variable Design System (Dark + Light)
All colours, shadows, and borders are CSS custom properties on `:root` (dark) and `[data-theme="light"]`. This means:
- Every component uses `var(--bg-primary)` etc. — zero hardcoded colour values in component files
- Theme switching is a **single attribute change** on the root `<div>`, with a 200ms CSS transition applied globally
- Preference is persisted in `localStorage` and restored on page load — no flash of wrong theme

### 6. `useMemo` for `nodeTypes` (React Flow Performance)
React Flow docs warn that passing a new `nodeTypes` object on every render causes full canvas re-mounts. The `nodeTypes` map is wrapped in `useMemo` with an empty dependency array, ensuring it is created exactly once for the lifetime of the component.

---

## 🚀 How to Run

**Prerequisites:** Node.js ≥ 18, npm ≥ 9

```bash
# 1. Clone the repository
git clone <https://github.com/brardilraj/HR-Workflow-Designer>
cd hr-workflow-designer

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# → Open http://localhost:5173
```

**Other available commands:**

```bash
npm run build    # Production build (TypeScript compile + Vite bundle)
npm run preview  # Serve the production build locally
npm run lint     # ESLint with TypeScript rules
```

**No environment variables, no backend, no database required.** The app is fully self-contained.

---

## ✅ What Was Completed

### Core Functionality
- [x] **Drag-and-drop canvas** — all 5 node types draggable from the sidebar onto the canvas
- [x] **Node connections** — drag from source handle (bottom) to target handle (top) to create `smoothstep` animated edges
- [x] **Node selection** — click any node to open its property editor; click canvas to deselect
- [x] **Dynamic property panel** — type-specific configuration fields that write to global state in real-time
- [x] **Node deletion** — delete button in the property panel removes the node and all its connected edges atomically
- [x] **Workflow simulation** — DAG traversal engine that walks the graph from Start → End and produces a step-by-step execution log with infinite loop protection (25-step cap)
- [x] **Export to JSON** — serializes the full workflow (`nodes` + `edges`) to a downloadable `.json` file
- [x] **Async automation loader** — `getAutomations()` simulates a 500ms API call to populate the Automated node's action dropdown with a skeleton loading state

### UI & Experience
- [x] **Premium dark mode** — deep navy palette, glassmorphism panels, per-node accent gradients
- [x] **Light mode** — full light theme with all components responding to CSS variable overrides
- [x] **Dark / Light toggle** — animated pill toggle in the header, preference persisted to `localStorage`
- [x] **Simulation terminal** — macOS-style window chrome, JetBrains Mono font, animated log entries with auto-scroll
- [x] **MiniMap** — zoomable/pannable overview with per-type node colours
- [x] **Canvas controls** — zoom in/out, fit view, lock controls from React Flow
- [x] **Empty state** — contextual prompt when canvas is empty
- [x] **Node/edge counter** — live count badge in the canvas header
- [x] **Smooth theme transitions** — 200ms CSS transitions on all background, border, and text properties
- [x] **Responsive focus states** — visible keyboard focus rings on all interactive inputs
- [x] **`prefers-reduced-motion` support** — animation keyframes respect user accessibility settings

---

## 🔭 What I Would Add With More Time

### High Priority — Core Features
- **Persistent Workflows** — Save/load named workflows to `localStorage` or a backend. Currently, refreshing the page clears the canvas.
- **Undo / Redo** — Integrate `zustand-middleware-immer` with a history stack to support `Ctrl+Z` / `Ctrl+Y`.
- **Form Validation** — Prevent simulation if required fields (e.g. Task Title) are empty. Show inline error states on the form inputs with aria-invalid attributes.
- **Conditional Branching** — Allow Approval nodes to have two outgoing edges: "Approved" and "Rejected", turning the linear DAG into a true decision tree.

### Medium Priority — Architecture
- **Real Backend Integration** — Replace `mock.ts` with a proper REST API (e.g. Express/FastAPI). The service abstraction means the swap is a one-file change.
- **Real-time Collaboration** — Add WebSocket support (e.g. via Yjs + WebSocket server) so multiple users can edit the same workflow simultaneously, similar to Figma's multiplayer canvas.
- **Automated Testing** — Unit tests for `useWorkflowStore` (Vitest + React Testing Library) and E2E tests for the core drag-drop-simulate flow (Playwright).
- **Node Search & Filter** — Add a search bar to the sidebar to filter node types, useful once the node library grows.

### Low Priority — Polish
- **Keyboard Shortcuts** — `Del` to delete selected node, `Ctrl+E` to export, `Ctrl+Enter` to run simulation.
- **Node Groups / Lanes** — Allow grouping related nodes into labelled swim lanes (e.g. "HR Team", "System").
- **Custom Edge Labels** — Label edges with conditions (e.g. "If Approved", "If Rejected") for richer visual documentation.
- **Workflow Templates** — Provide starter templates (Employee Onboarding, Performance Review, Leave Approval) that pre-populate the canvas.
- **Zoom-to-fit on load** — If a saved workflow is loaded, automatically fit all nodes into view.

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.4 | UI framework |
| `react-dom` | ^19.2.4 | DOM rendering |
| `reactflow` | ^11.11.4 | Graph canvas engine |
| `zustand` | ^5.0.12 | State management |
| `lucide-react` | ^1.8.0 | SVG icon library |
| `uuid` | ^11.0.0 | Unique node ID generation |
| `tailwindcss` | ^3.4.19 | Utility-first CSS |
| `vite` | ^6.0.0 | Build tool & dev server |
| `typescript` | ~5.7.0 | Static type checking |

---


> *"Good software is built in layers: clean types at the bottom, clean state in the middle, and clean UI on top."*
