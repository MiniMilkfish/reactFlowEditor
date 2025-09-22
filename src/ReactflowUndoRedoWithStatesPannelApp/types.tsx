import type {
  Node,
  Edge,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
} from "@xyflow/react";

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
}
