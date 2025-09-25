import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
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
        record: (callback: () => void) => {
          console.log("record 开始记录");
          const temporalStore = useStore.temporal.getState();
          temporalStore.resume();
          callback();
          temporalStore.pause();
        },
        initializeHistory: () => {
          const temporalStore = useStore.temporal.getState();
          temporalStore.clear();
          temporalStore.pause();
        },
      }),
      {
        partialize: (state) => ({
          nodes: state.nodes,
          edges: state.edges,
        }),
        limit: 10,
      },
    ),
  ),
);

export default useStore;

// 导出撤销重做钩子
export const useUndoRedo = () => {
  const temporalStore = useStore.temporal.getState();

  // 默认暂停跟踪
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
