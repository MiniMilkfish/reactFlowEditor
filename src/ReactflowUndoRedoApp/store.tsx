import { create } from "zustand";
import { immer } from "zustand/middleware/immer"; // 依赖 immer 库，引入之前请先安装 immer
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import { temporal } from "zundo";
import type { AppState } from "./types";

// 初始化 Nodes、Edges
import { nodes as initialNodes } from "./nodes";
import { edges as initialEdges } from "./edges";

const useStore = create<AppState>()(
  immer(
    temporal(
      (set, get) => ({
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
        onConnect: (connection) => {
          set({
            edges: addEdge(connection, get().edges),
          });
        },
        setNodes: (nodes) => {
          set({ nodes });
        },
        setEdges: (edges) => {
          set({ edges });
        },
      }),
      {
        partialize: (state) => ({
          nodes: state.nodes,
          edges: state.edges,
        }),
      },
    ),
  ),
);
export default useStore;

export const useUndoRedo = () => {
  const temporalStore = useStore.temporal.getState();
  if (temporalStore.isTracking) {
    temporalStore.pause();
  }

  return {
    ...temporalStore,
    record: (callback: () => void) => {
      temporalStore.resume();
      callback();
      temporalStore.pause();
    },
  };
};
