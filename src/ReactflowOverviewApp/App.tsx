import React, { useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import type { Node } from "@xyflow/react";

import {
  nodes as initialNodes,
  edges as initialEdges,
} from "./initial-elements";
import AnnotationNode from "./AnnotationNode";
import ResizerNode from "./ResizerNode";
import CircleNode from "./CircleNode";
import TextNode from "./TextNode";
import ButtonEdge from "./ButtonEdge";
import ToolBarNode from "./ToolBarNode";

import "@xyflow/react/dist/style.css";
import "./overview.less";

const nodeTypes = {
  annotation: AnnotationNode,
  tools: ToolBarNode,
  resizer: ResizerNode,
  circle: CircleNode,
  textinput: TextNode,
};

const edgeTypes = {
  button: ButtonEdge,
};

const nodeClassName = (node: any) => node.type;

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div className="h-screen w-screen rounded-xl bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="top-right"
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        className="overview"
      >
        <MiniMap zoomable pannable nodeClassName={nodeClassName} />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export type AppNode = Node;
export default function App() {
  return <OverviewFlow />;
}
