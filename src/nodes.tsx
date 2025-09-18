import type { Node } from "@xyflow/react";

export default [
  {
    id: "1",
    type: "input",
    position: { x: 250, y: 25 },
    data: {
      label: "Input",
    },
  },
  {
    id: "2",
    position: { x: 100, y: 125 },
    data: {
      label: "Default",
    },
  },
  {
    id: "3",
    type: "output",
    position: { x: 250, y: 250 },
    data: {
      label: "Output",
    },
  },
] as Node[];
