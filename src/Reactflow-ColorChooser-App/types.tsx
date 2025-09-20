import type {
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
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
  updateNodeColor: (nodeId: string, color: string) => void;
}

/**
 * 颜色选择器节点（ColorNode） - 自定义 Node
 * 颜色选择器节点的数据类型为{color: string}
 * 颜色选择器节点的type为'colorChooser'
 */
export type ColorNode = Node<{ color: string }, "colorChooser">;
