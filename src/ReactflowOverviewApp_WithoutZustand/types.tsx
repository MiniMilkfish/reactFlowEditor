import type {
  Node,
  Edge,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
} from "@xyflow/react";
import AnnotationNode from "./NodeAnnotation";
import ResizerNode from "./NodeResizer";
import CircleNode from "./NodeCircle";
import TextNode from "./NodeText";
import ToolBarNode from "./NodeToolBar";
import ButtonEdge from "./EdgeButton";

export const nodeTypes = {
  annotation: AnnotationNode,
  tools: ToolBarNode,
  resizer: ResizerNode,
  circle: CircleNode,
  textinput: TextNode,
};

export const edgeTypes = {
  button: ButtonEdge,
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
}
