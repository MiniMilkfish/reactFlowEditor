import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type { AppState, AppNode, ColorNode } from "./types";

import initialNodes from "./nodes";
import initialEdges from "./edges";

function isColorChooserNode(node: AppNode): node is ColorNode {
  return node.type === "colorChooser";
}

const useStore = create<AppState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: any) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes: any) => {
    set({ nodes });
  },
  setEdges: (edges: any) => {
    set({ edges });
  },
  updateNodeColor: (nodeId: string, color: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId && isColorChooserNode(node)) {
          return { ...node, data: { ...node.data, color } };
        }
        return node;
      }),
    });
  },
}));

export default useStore;
