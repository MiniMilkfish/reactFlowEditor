import type { AppEdge } from "./types";
import { MarkerType } from "@xyflow/react";

export default [
  {
    id: "e1-2",
    source: "1-1",
    target: "1-2",
    label: "edge",
    type: "smoothstep",
  },
  {
    id: "e1-3",
    source: "1-1",
    target: "1-3",
    animated: true,
    label: "animated edge",
  },
  {
    id: "e2-2",
    source: "1-2",
    target: "2-2",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e2-3",
    source: "2-2",
    target: "2-3",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e3-3",
    source: "2-3",
    target: "3-2",
    type: "button",
    animated: true,
    style: {
      stroke: "rgb(158, 118, 255)",
      strokeWidth: 2,
    },
    sourceHandle: "a",
  },
  {
    id: "e3-4",
    source: "2-3",
    target: "3-1",
    sourceHandle: "b",
    type: "button",
    style: {
      strokeWidth: 2,
    },
  },
] as AppEdge[];
