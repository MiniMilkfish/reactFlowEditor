import type { AppNode } from "./types";
// import { Position } from '@xyflow/react';

export const nodes = [
  {
    id: "1",
    type: "input",
    data: { label: "input" },
    position: { x: 0, y: -100 },
  },
  {
    id: "2",
    type: "default",
    data: { label: "default" },
    position: { x: 0, y: 0 },
    // handles: [
    //   { id: 'a', type: 'target', position: Position.Right },
    //   { id: 'b', type: 'source', position: Position.Left },
    // ]
  },
  {
    id: "3",
    type: "output",
    data: { label: "output" },
    position: { x: 0, y: 500 },
  },
] as AppNode[];
