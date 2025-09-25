import type {
  Node,
  Edge,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  OnDelete,
} from "@xyflow/react";

import NodeCanvas from "./NodeCanvas";

export const nodeTypes = {
  nodeCanvas: NodeCanvas,
};

export type AppNode = Node;
export type AppEdge = Edge;
export interface AppState {
  nodes: AppNode[];
  edges: AppEdge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange<AppEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: AppEdge[]) => void;
  record: (callback: () => void) => void;
  initializeHistory: () => void;
}

export interface EditorState {
  nodes: AppNode[];
  edges: AppEdge[];
}
