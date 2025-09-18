import { create } from "zustand";
import initialNodes from "./nodes";
import initialEdges from "./edges";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type { AppState } from "./types";

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
}));

export default useStore;
