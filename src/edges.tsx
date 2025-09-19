import type { AppEdge } from "./types";

export default [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    data: {
      label: "1-2",
    },
    type: "default",
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    data: {
      label: "2-3",
    },
    type: "smoothstep",
  },
] as AppEdge[];
