import { useCallback, useEffect } from "react";
import {
  Background,
  ConnectionLineType,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  useReactFlow,
  addEdge,
} from "@xyflow/react";
import { customAlphabet } from "nanoid";
import type {
  Connection,
  EdgeChange,
  NodeChange,
  OnDelete,
} from "@xyflow/react";

import { useShallow } from "zustand/react/shallow";

import "@xyflow/react/dist/style.css";
import { Button, Flex, Input, Space, Typography } from "antd";
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

import useStore, { useUndoRedo } from "./store";
import { type AppState, type AppNode, type AppEdge, nodeTypes } from "./types";
const nodeClassName = (node: any) => node.type;

const uuid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16); //=> "4f90d13a42"

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  record: state.record,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  initializeHistory: state.initializeHistory,
});

let isNodeDraggingFirstSlice = true;

const App = () => {
  // Reactflow 钩子函数
  const { updateEdge, toObject, addNodes, addEdges } = useReactFlow();

  // 应用的状态
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    record,
    setNodes,
    setEdges,
    initializeHistory,
  } = useStore(useShallow(selector));

  // "撤销/重做" 的状态 - 使用正确的钩子
  const { undo, redo, futureStates, pastStates } = useUndoRedo();

  // 初始化时清空历史记录
  useEffect(() => {
    initializeHistory();
  }, [initializeHistory]);

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
      // todo 节点和线插入 合并为一个操作
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
      // todo 节点和线插入 合并为一个操作
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

  // 添加Canvas 节点
  const handleAddCanvasNode = () => {
    const nodeId = uuid();
    const newNode = {
      id: nodeId,
      data: { label: nodeId },
      type: "nodeCanvas",
      position: {
        x: 100,
        y: 100 + parseInt(String(Math.random() * 100)),
      },
    };
    record(() => {
      addNodes(newNode);
    });
  };

  // onDelete 事件 - 统一处理删除操作
  const handleOnDelete: OnDelete<AppNode, AppEdge> = useCallback(
    (params) => {
      const { nodes: nodesToDelete, edges: edgesToDelete } = params;
      console.log(
        "handleOnDelete 删除节点:",
        nodesToDelete,
        "删除边:",
        edgesToDelete,
      );

      record(() => {
        // 手动删除节点和边
        if (nodesToDelete && nodesToDelete.length > 0) {
          console.log("删除节点:", nodesToDelete);
          setNodes(
            nodes.filter(
              (node) => !nodesToDelete.find((n) => n.id === node.id),
            ),
          );
        }

        if (edgesToDelete && edgesToDelete.length > 0) {
          console.log("删除边:", edgesToDelete);
          setEdges(
            edges.filter(
              (edge) => !edgesToDelete.find((e) => e.id === edge.id),
            ),
          );
        }
      });

      // 阻止默认删除行为，避免触发其他事件
      return false;
    },
    [record, setNodes, setEdges, nodes, edges],
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // change.type
      // position\remove\add\replace\dimensions\select
      changes.forEach((change) => {
        if (change.type === "position") {
          if (!change.dragging) {
            onNodesChange([change]);
            isNodeDraggingFirstSlice = true;
          } else {
            if (isNodeDraggingFirstSlice) {
              isNodeDraggingFirstSlice = false;
              record(() => {
                onNodesChange([change]);
              });
            } else {
              isNodeDraggingFirstSlice = false;
              onNodesChange([change]);
            }
          }
        } else if (change.type === "remove") {
          // 删除类型已经移交给 handleOnDelete 处理
          // isNodeDraggingFirstSlice = false;
          console.log("x 删除节点:", change);
          return;
        } else if (change.type === "add") {
          record(() => {
            onNodesChange([change]);
          });
        } else {
          onNodesChange([change]);
        }
      });
    },
    [record, onNodesChange],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      // change.type
      // remove\add\replace\select
      changes.forEach((change) => {
        if (change.type === "remove") {
          // 删除类型已经移交给 handleOnDelete 处理
          console.log("x 删除边:", change);
          return;
        } else if (change.type === "add") {
          record(() => {
            onEdgesChange([change]);
          });
        } else {
          onEdgesChange([change]);
        }
      });
    },
    [record, onEdgesChange],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      record(() => {
        onConnect(connection);
      });
    },
    [record, onConnect],
  );

  return (
    <div className="h-screen w-screen rounded-xl bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        snapToGrid={true}
        snapGrid={[5, 5]}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        // debug={true}
        onDelete={handleOnDelete}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        nodesDraggable={true} // 启用拖拽，用户可以手动排列节点
        defaultEdgeOptions={{
          animated: true,
          type: ConnectionLineType.Bezier,
        }}
        proOptions={{ hideAttribution: true }}
        fitView
      >
        <MiniMap
          zoomable
          pannable
          nodeClassName={nodeClassName}
          position="bottom-right"
        />
        <Controls orientation="vertical" position="center-right" />
        <Background />
        <Panel position="top-right">
          <Flex gap="small" wrap>
            <Space.Compact block>
              <Button
                color="danger"
                variant="solid"
                disabled={pastStates.length === 0}
                onClick={() => undo()}
              >
                ↶ 撤销 ({pastStates.length})
              </Button>
              <Button
                type="dashed"
                danger
                disabled={futureStates.length === 0}
                onClick={() => redo()}
              >
                ↷ 重做 ({futureStates.length})
              </Button>
            </Space.Compact>
          </Flex>
        </Panel>
        <Panel position="bottom-left">
          <Button
            onClick={() => {
              console.info(toObject());
            }}
          >
            打印数据
          </Button>
        </Panel>
        <Panel position="top-left">
          <Flex gap="small" wrap>
            <Space.Compact>
              <Button type="primary" onClick={handleAddNode.bind(this)}>
                添加元素
              </Button>
              <Button onClick={handleInsertNode}>插入元素</Button>
            </Space.Compact>
            <Button danger onClick={handleAddCanvasNode}>
              添加 CANVAS 节点
            </Button>
          </Flex>
        </Panel>
        <Panel position="center-left">
          <Title level={3}>过去状态</Title>
          <Paragraph>
            <TextArea
              value={JSON.stringify(pastStates, null, 2)}
              rows={4}
              showCount
            />
          </Paragraph>

          <Title level={3}>当前完整状态</Title>
          <Paragraph>
            <TextArea
              value={JSON.stringify({ nodes, edges }, null, 2)}
              rows={4}
              showCount
            />
          </Paragraph>

          <Title level={3}>未来状态:</Title>
          <Paragraph>
            <TextArea
              value={JSON.stringify(futureStates, null, 2)}
              rows={4}
              showCount
            />
          </Paragraph>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default () => {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
};
