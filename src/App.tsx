// Language: TypeScript JSX
import { useCallback, useState, type ChangeEventHandler } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  type OnConnect,
  type ColorMode,
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
  Panel,
} from "@xyflow/react";

import { NumNode } from "./components/nodes/num-node";
import { SumNode } from "./components/nodes/sum-node";

import { DataEdge } from "./components/data-edge";

import "@xyflow/react/dist/style.css";

const nodeTypes = {
  num: NumNode,
  sum: SumNode,
};

const initialNodes: Node[] = [
  { id: "a", type: "num", data: { value: 0 }, position: { x: 0, y: 0 } },
  { id: "b", type: "num", data: { value: 0 }, position: { x: 0, y: 200 } },
  { id: "c", type: "sum", data: { value: 0 }, position: { x: 300, y: 100 } },
  { id: "d", type: "num", data: { value: 0 }, position: { x: 0, y: 400 } },
  { id: "e", type: "sum", data: { value: 0 }, position: { x: 600, y: 400 } },
];

const edgeTypes = {
  data: DataEdge,
};

const initialEdges: Edge[] = [
  {
    id: "a->c",
    type: "data",
    data: { key: "value" },
    source: "a",
    target: "c",
    targetHandle: "x",
  },
  {
    id: "b->c",
    type: "data",
    data: { key: "value" },
    source: "b",
    target: "c",
    targetHandle: "y",
  },
  {
    id: "c->e",
    type: "data",
    data: { key: "value" },
    source: "c",
    target: "e",
    targetHandle: "x",
  },
  {
    id: "d->e",
    type: "data",
    data: { key: "value" },
    source: "d",
    target: "e",
    targetHandle: "y",
  },
];

function Flow() {
  const [colorMode, setColorMode] = useState<ColorMode>("light");
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((edges) =>
        addEdge({ type: "data", data: { key: "value" }, ...params }, edges),
      );
    },
    [setEdges],
  );

  const onChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    setColorMode(evt.target.value as ColorMode);
  };

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
        colorMode={colorMode}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
        <Panel position="top-right">
          <select
            className="xy-theme__select"
            onChange={onChange}
            data-testid="colormode-select"
          >
            <option value="light">light</option>
            <option value="dark">dark</option>
            <option value="system">system</option>
          </select>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function App() {
  return <Flow />;
}
