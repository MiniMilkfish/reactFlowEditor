import React, { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Background,
  MiniMap,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { Slider } from "antd";

import type { OnDelete, Node, Edge } from "@xyflow/react";

interface AppNode extends Node {
  data: { label: string };
}

interface AppEdge extends Edge {}

const EventTestFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([
    { id: "1", data: { label: "节点 1" }, position: { x: 100, y: 100 } },
    { id: "2", data: { label: "节点 2" }, position: { x: 300, y: 100 } },
    { id: "3", data: { label: "节点 3" }, position: { x: 200, y: 300 } },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([
    { id: "e1-2", source: "1", target: "2" },
    { id: "e1-3", source: "1", target: "3" },
  ]);

  const [eventLog, setEventLog] = useState<string[]>([]);

  // 缩放控制状态
  const [zoomValue, setZoomValue] = useState(100);
  const { zoomTo, fitView } = useReactFlow();

  const addLog = useCallback((message: string) => {
    setEventLog((prev) => [
      ...prev,
      `${new Date().toISOString().split("T")[1]} - ${message}`,
    ]);
  }, []);

  // onDelete 事件 - 统一处理删除操作
  const onDelete: OnDelete<AppNode, AppEdge> = useCallback(
    (params) => {
      const { nodes: nodesToDelete, edges: edgesToDelete } = params;

      addLog(
        `🎯 onDelete (合并操作): ${nodesToDelete?.length || 0} 节点, ${edgesToDelete?.length || 0} 边`,
      );

      // 手动删除节点和边
      if (nodesToDelete && nodesToDelete.length > 0) {
        setNodes((nds) =>
          nds.filter((node) => !nodesToDelete.find((n) => n.id === node.id)),
        );
      }

      if (edgesToDelete && edgesToDelete.length > 0) {
        setEdges((eds) =>
          eds.filter((edge) => !edgesToDelete.find((e) => e.id === edge.id)),
        );
      }

      // 阻止默认删除行为，避免触发其他事件
      return false;
    },
    [addLog, setNodes, setEdges],
  );

  // onNodesChange 事件 - 过滤掉删除操作
  const handleNodesChange = useCallback(
    (changes: any[]) => {
      // 过滤掉删除操作，只处理其他类型的变更
      const nonRemoveChanges = changes.filter(
        (change) => change.type !== "remove",
      );

      const removeChanges = changes.filter(
        (change) => change.type === "remove",
      );

      if (removeChanges.length > 0) {
        addLog(`❌ onNodesChange: 已过滤删除操作 (${removeChanges.length} 个)`);
      }

      // 只执行非删除的变更
      if (nonRemoveChanges.length > 0) {
        onNodesChange(nonRemoveChanges);
      }
    },
    [addLog, onNodesChange],
  );

  // onEdgesChange 事件 - 过滤掉删除操作
  const handleEdgesChange = useCallback(
    (changes: any[]) => {
      // 过滤掉删除操作，只处理其他类型的变更
      const nonRemoveChanges = changes.filter(
        (change) => change.type !== "remove",
      );

      const removeChanges = changes.filter(
        (change) => change.type === "remove",
      );

      if (removeChanges.length > 0) {
        addLog(`❌ onEdgesChange: 已过滤删除操作 (${removeChanges.length} 个)`);
      }

      // 只执行非删除的变更
      if (nonRemoveChanges.length > 0) {
        onEdgesChange(nonRemoveChanges);
      }
    },
    [addLog, onEdgesChange],
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // 添加节点计数器，用于生成唯一ID
  const nodeCountRef = useRef(4); // 从4开始，因为已有节点1,2,3

  // 添加节点功能
  const addNode = useCallback(() => {
    const newNodeId = nodeCountRef.current.toString();
    const newNode: AppNode = {
      id: newNodeId,
      data: { label: `节点 ${newNodeId}` },
      position: {
        x: Math.random() * 400 + 50, // 随机位置
        y: Math.random() * 300 + 50,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    nodeCountRef.current++;

    addLog(`➕ 添加节点: ${newNode.data.label} (${newNode.id})`);
  }, [setNodes, addLog]);

  // 插入节点功能 - 在两个连接的节点之间插入
  const insertNode = useCallback(() => {
    // 找到第一条边来插入节点
    if (edges.length === 0) {
      addLog(`❌ 插入节点失败: 没有可用的边`);
      return;
    }

    const targetEdge = edges[0]; // 选择第一条边
    const sourceNode = nodes.find((n) => n.id === targetEdge.source);
    const targetNode = nodes.find((n) => n.id === targetEdge.target);

    if (!sourceNode || !targetNode) {
      addLog(`❌ 插入节点失败: 找不到源节点或目标节点`);
      return;
    }

    const newNodeId = nodeCountRef.current.toString();
    const newNode: AppNode = {
      id: newNodeId,
      data: { label: `插入节点 ${newNodeId}` },
      position: {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
      },
    };

    // 创建新的边：source -> newNode -> target
    const newEdge1: AppEdge = {
      id: `e${targetEdge.source}-${newNodeId}`,
      source: targetEdge.source,
      target: newNodeId,
    };

    const newEdge2: AppEdge = {
      id: `e${newNodeId}-${targetEdge.target}`,
      source: newNodeId,
      target: targetEdge.target,
    };

    // 更新节点和边
    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [
      ...eds.filter((e) => e.id !== targetEdge.id), // 移除原边
      newEdge1,
      newEdge2,
    ]);

    nodeCountRef.current++;

    addLog(
      `🔗 插入节点: ${newNode.data.label} 在 ${sourceNode.data.label} 和 ${targetNode.data.label} 之间`,
    );
  }, [nodes, edges, setNodes, setEdges, addLog]);

  // 随机连接两个节点
  const connectRandomNodes = useCallback(() => {
    if (nodes.length < 2) {
      addLog(`❌ 连接失败: 节点数量不足`);
      return;
    }

    // 随机选择两个不同的节点
    const availableNodes = [...nodes];
    const sourceNode =
      availableNodes[Math.floor(Math.random() * availableNodes.length)];
    const targetNodes = availableNodes.filter((n) => n.id !== sourceNode.id);
    const targetNode =
      targetNodes[Math.floor(Math.random() * targetNodes.length)];

    // 检查是否已存在连接
    const existingEdge = edges.find(
      (e) =>
        (e.source === sourceNode.id && e.target === targetNode.id) ||
        (e.source === targetNode.id && e.target === sourceNode.id),
    );

    if (existingEdge) {
      addLog(
        `❌ 连接失败: ${sourceNode.data.label} 和 ${targetNode.data.label} 已连接`,
      );
      return;
    }

    const newEdge: AppEdge = {
      id: `e${sourceNode.id}-${targetNode.id}`,
      source: sourceNode.id,
      target: targetNode.id,
    };

    setEdges((eds) => [...eds, newEdge]);
    addLog(`🔗 连接节点: ${sourceNode.data.label} -> ${targetNode.data.label}`);
  }, [nodes, edges, setEdges, addLog]);

  // 缩放控制函数
  const handleZoomChange = useCallback(
    (value: number) => {
      setZoomValue(value);
      zoomTo(value / 100);
      addLog(`🔍 缩放变更: ${value}%`);
    },
    [zoomTo, addLog],
  );

  // 适应视图函数
  const handleFitView = useCallback(() => {
    fitView();
    setZoomValue(100);
    addLog(`📐 适应视图`);
  }, [fitView, addLog]);

  return (
    <div style={{ display: "flex", height: "900px" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onDelete={onDelete}
          fitView
        >
          <Background />
          <MiniMap
            style={{
              height: 120,
              width: 200,
              backgroundColor: "#f8f9fa",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
            }}
            zoomable
            pannable
            nodeColor={(node) => {
              switch (node.type) {
                default:
                  return "#1890ff";
              }
            }}
            nodeStrokeColor="#fff"
            nodeStrokeWidth={2}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>

        {/* 自定义缩放控制面板 */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            backgroundColor: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            border: "1px solid #e9ecef",
            minWidth: "280px",
          }}
        >
          <div style={{ marginBottom: "8px", fontSize: "12px", color: "#666" }}>
            缩放控制: {zoomValue}%
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Slider
              min={10}
              max={200}
              value={zoomValue}
              onChange={handleZoomChange}
              style={{ flex: 1 }}
              marks={{
                25: "25%",
                50: "50%",
                100: "100%",
                150: "150%",
                200: "200%",
              }}
              tooltip={{
                formatter: (value) => `${value}%`,
              }}
            />
            <button
              onClick={handleFitView}
              style={{
                padding: "4px 8px",
                backgroundColor: "#1890ff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              📐 适应
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "300px",
          background: "#f5f5f5",
          padding: "10px",
          overflow: "auto",
        }}
      >
        <h4>控制面板</h4>

        {/* 节点操作按钮 */}
        <div style={{ marginBottom: "15px" }}>
          <h5 style={{ margin: "0 0 8px 0", color: "#666" }}>节点操作</h5>
          <button
            onClick={addNode}
            style={{
              marginRight: "8px",
              marginBottom: "5px",
              padding: "6px 12px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            ➕ 添加节点
          </button>
          <button
            onClick={insertNode}
            style={{
              marginRight: "8px",
              marginBottom: "5px",
              padding: "6px 12px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            🔗 插入节点
          </button>
          <button
            onClick={connectRandomNodes}
            style={{
              marginBottom: "5px",
              padding: "6px 12px",
              backgroundColor: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            🔀 随机连接
          </button>
        </div>

        {/* 视图控制 */}
        <div style={{ marginBottom: "15px" }}>
          <h5 style={{ margin: "0 0 8px 0", color: "#666" }}>视图控制</h5>
          <button
            onClick={handleFitView}
            style={{
              marginRight: "8px",
              marginBottom: "5px",
              padding: "6px 12px",
              backgroundColor: "#1890ff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            📐 适应视图
          </button>
          <button
            onClick={() => handleZoomChange(100)}
            style={{
              marginBottom: "5px",
              padding: "6px 12px",
              backgroundColor: "#722ed1",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            🔍 重置缩放
          </button>
        </div>

        {/* 日志操作 */}
        <div style={{ marginBottom: "15px" }}>
          <h5 style={{ margin: "0 0 8px 0", color: "#666" }}>事件日志</h5>
          <button
            onClick={() => setEventLog([])}
            style={{
              padding: "6px 12px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            🗑️ 清空日志
          </button>
        </div>

        {/* 统计信息 */}
        <div style={{ marginBottom: "15px", fontSize: "12px", color: "#666" }}>
          <div>节点数量: {nodes.length}</div>
          <div>边数量: {edges.length}</div>
          <div>当前缩放: {zoomValue}%</div>
        </div>

        {/* 事件日志显示 */}
        <div style={{ fontFamily: "monospace", fontSize: "12px" }}>
          {eventLog.map((log, index) => (
            <div
              key={index}
              style={{
                color: log.includes("❌")
                  ? "#999"
                  : log.includes("🎯")
                    ? "#e74c3c"
                    : log.includes("➕")
                      ? "#4CAF50"
                      : log.includes("🔗")
                        ? "#2196F3"
                        : log.includes("🔍")
                          ? "#722ed1"
                          : "#333",
                marginBottom: "2px",
                padding: "2px 4px",
                backgroundColor: log.includes("🎯") ? "#fff5f5" : "transparent",
                borderRadius: "2px",
              }}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <ReactFlowProvider>
    <EventTestFlow />
  </ReactFlowProvider>
);

export default App;
