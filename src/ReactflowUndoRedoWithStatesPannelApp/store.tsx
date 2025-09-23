import { create } from "zustand";
import { immer } from "zustand/middleware/immer"; // 依赖 immer 库，引入之前请先安装 immer
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import { temporal, type TemporalState } from "zundo";
import { useStoreWithEqualityFn } from "zustand/traditional"; // replace 'useStore'
import type { AppState, AppNode } from "./types";

// 初始化 Nodes、Edges
import { nodes as initialNodes } from "./nodes";
import { edges as initialEdges } from "./edges";

// 添加一个标志来跟踪是否已经初始化
let isInitialized = false;

const useStore = create(
  immer(
    temporal<AppState>(
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
        onDelete: ({ nodes, edges }) => {
          set({
            nodes: nodes.filter((node) => !nodes.includes(node)),
            edges: edges.filter((edge) => !edges.includes(edge)),
          });
        },
        record: (callback: () => void) => {
          const temporalStore = useStore.temporal.getState();

          // 如果是首次调用，暂停跟踪并清空历史
          if (!isInitialized) {
            temporalStore.pause();
            temporalStore.clear();
            isInitialized = true;
          }

          const wasTracking = temporalStore.isTracking;

          // 如果当前没有在跟踪，则开始跟踪
          if (!wasTracking) {
            temporalStore.resume();
          }

          callback();

          // 如果原来没有在跟踪，则暂停跟踪
          if (!wasTracking) {
            temporalStore.pause();
          }
        },
      }),
      {
        // partialize: () => { },   // TODO: 排除不需要被记录的字段，避免内存占用过高
        limit: 10, // 限制历史状态数量，避免内存占用过高
      },
    ),
  ),
);
export default useStore;

export const useTemporalStore = <T extends unknown>(
  selector: (state: TemporalState<AppState>) => T,
  equality?: (a: T, b: T) => boolean,
) => useStoreWithEqualityFn(useStore.temporal, selector!, equality);
