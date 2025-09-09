import React from "react";
import { ReactFlow, type Node, Position, useNodesState } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  NodeTooltip,
  NodeTooltipContent,
  NodeTooltipTrigger,
} from "./components/node-tooltip";
import { BaseNode, BaseNodeContent } from "./components/base-node";

function Tooltip() {
  return (
    <NodeTooltip>
      <NodeTooltipContent position={Position.Top}>
        Hidden Content
      </NodeTooltipContent>
      <BaseNode>
        <BaseNodeContent>
          <NodeTooltipTrigger>Hover</NodeTooltipTrigger>
        </BaseNodeContent>
      </BaseNode>
    </NodeTooltip>
  );
}

const nodeTypes = {
  tooltip: Tooltip,
};

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {},
    type: "tooltip",
  },
];

function Flow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);

  return (
    <div className="h-screen w-screen rounded-xl bg-gray-50 p-8">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        fitView
      />
    </div>
  );
}
export default function App() {
  return <Flow />;
}
