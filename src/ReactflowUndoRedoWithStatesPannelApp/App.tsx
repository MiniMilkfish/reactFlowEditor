import React from "react";
import {
  Background,
  ConnectionLineType,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  //   useNodesInitialized,
  useReactFlow,
} from "@xyflow/react";
import { customAlphabet } from "nanoid";

import { useShallow } from "zustand/react/shallow";

import "@xyflow/react/dist/style.css";
import { Button, Flex } from "antd";

import useStore, { useUndoRedo } from "./store";

const uuid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16); //=> "4f90d13a42"

const UndoRedoFlow = () => {
  //   const nodesInitialized = useNodesInitialized();
  const { fitView, updateEdge, toObject, addNodes, addEdges } = useReactFlow();

  // 用于存储拖拽开始时的节点位置
  const dragStartPositions = React.useRef<
    Record<string, { x: number; y: number }>
  >({});

  // 防抖函数用于position记录
  const debounceTimers = React.useRef<Record<string, NodeJS.Timeout>>({});

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setEdges,
  } = useStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
    })),
  );

  const { undo, redo, record } = useUndoRedo();

  // 添加节点元素
  const handleAddNode = () => {
    const nodeId = uuid(),
      edgeID = uuid();
    const newNode = {
      id: nodeId,
      data: { label: nodeId },
      position: {
        x: parseInt(String(Math.random() * 200)),
        y: parseInt(String(Math.random() * 100)),
      },
    };
    record(() => {
      addNodes(newNode);
      addEdges({
        id: edgeID,
        source: "1",
        target: newNode.id,
      });
    });
  };

  // 插入节点元素
  const handleInsertNode = () => {
    const nodeId = uuid(),
      edgeID = uuid();
    const newNode = {
      id: nodeId,
      data: { label: nodeId },
      position: {
        x: 0,
        y: 100 + parseInt(String(Math.random() * 100)),
      },
    };
    record(() => {
      addNodes(newNode);
      addEdges({
        id: edgeID,
        source: "2",
        target: newNode.id,
      });
      const targetEdge = edges.find((edge) => edge.source === "2");
      updateEdge(targetEdge?.id as string, {
        source: newNode.id,
      });
    });
  };

  return (
    <div className="h-screen w-screen rounded-xl bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          const immediateRecordTypes = new Set(["add", "remove", "position"]);
          changes.forEach((change) => {
            if (change.type === "position") {
              // 立即更新UI
              onNodesChange([change]);

              if (!change.dragging) {
                // DragEnd 记录当前状态到历史
                record(() => {
                  // onNodesChange([change])
                });
              }
            } else if (immediateRecordTypes.has(change.type)) {
              // 对add、remove类型立即记录
              record(() => {
                onNodesChange([change]);
              });
            } else {
              // 其他类型直接更新，不记录历史
              onNodesChange([change]);
            }
          });
        }}
        onEdgesChange={(changes) => {
          const recordTypes = new Set(["add", "remove"]);
          changes.forEach((change) => {
            if (recordTypes.has(change.type)) {
              record(() => {
                onEdgesChange([change]);
              });
            } else {
              onEdgesChange([change]);
            }
          });
        }}
        onConnect={(connection) => {
          // 连接操作需要记录到撤销/重做历史中
          record(() => {
            onConnect(connection);
          });
        }}
        nodesDraggable={true} // 启用拖拽，用户可以手动排列节点
        defaultEdgeOptions={{
          animated: true,
          type: ConnectionLineType.SmoothStep,
        }}
        proOptions={{ hideAttribution: true }}
        fitView
      >
        <Background />
        <Panel position="top-right">
          <Flex gap="small" wrap>
            <Button color="danger" variant="solid" onClick={() => undo()}>
              撤销
            </Button>
            <Button type="dashed" danger onClick={() => redo()}>
              重做
            </Button>
          </Flex>
        </Panel>
        <Controls orientation="horizontal" position="top-left" />
        <Panel position="bottom-left">
          <Button
            onClick={() => {
              console.info(toObject());
            }}
          >
            打印数据
          </Button>
        </Panel>
        <Panel position="bottom-right">
          <Flex gap="small" wrap>
            <Button type="primary" onClick={handleAddNode.bind(this)}>
              添加元素
            </Button>
            <Button onClick={handleInsertNode}>插入元素</Button>
          </Flex>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default () => {
  return (
    <ReactFlowProvider>
      <UndoRedoFlow />
    </ReactFlowProvider>
  );
};
