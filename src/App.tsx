import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  PanOnScrollMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./overview.less";
import { useShallow } from "zustand/react/shallow";
import type { AppState } from "./types";
import useStore from "./store";

// 自定义节点
import AnnotationNode from "./AnnotationNode";
import ResizerNode from "./ResizerNode";
import CircleNode from "./CircleNode";
import TextNode from "./TextNode";
import ButtonEdge from "./ButtonEdge";
import ToolbarNode from "./ToolBarNode";

const nodeTypes = {
  annotationNode: AnnotationNode,
  toolbarNode: ToolbarNode,
  resizerNode: ResizerNode,
  circleNode: CircleNode,
  textNode: TextNode,
};

const edgeTypes = {
  buttonEdge: ButtonEdge,
};

const nodeClassName = (node: any) => node.type;

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
});

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    useShallow(selector),
  );

  return (
    <div className="h-screen w-screen rounded-xl bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        className="overview"
        panOnScrollMode={PanOnScrollMode.Horizontal}
        panOnScroll={true}
        fitView
        attributionPosition="top-right"
      >
        <Controls />
        <MiniMap zoomable pannable nodeClassName={nodeClassName} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export type AppNode = Node;
export default function App() {
  return <Flow />;
}
