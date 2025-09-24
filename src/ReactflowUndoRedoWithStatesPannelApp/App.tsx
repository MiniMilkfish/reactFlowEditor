import { useEffect } from "react";
import {
  Background,
  ConnectionLineType,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  useReactFlow,
} from "@xyflow/react";
import { customAlphabet } from "nanoid";

import { useShallow } from "zustand/react/shallow";

import "@xyflow/react/dist/style.css";
import { Button, Flex, Input, Space, Typography } from "antd";
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

import useStore, { useTemporalStore } from "./store";
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
  onDelete: state.onDelete,
});

let isDraggingFirstSlice = true;

const App = () => {
  // Reactflow 钩子函数
  const { updateEdge, toObject, addNodes, addEdges } = useReactFlow();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    record,
    onDelete,
  } = useStore(useShallow(selector));

  const { undo, redo, futureStates, pastStates } = useTemporalStore(
    (state) => state,
  );

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

  useEffect(() => {
    // 初始化 - 设置初始状态但不记录到历史
    // - 空操作，只是为了初始化记录器
    record(() => {});
  }, [record]);

  return (
    <div className="h-screen w-screen rounded-xl bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // debug={true}
        // snapGrid={true}
        snapToGrid={true}
        snapGrid={[5, 5]}
        nodeTypes={nodeTypes}
        // alignLine={{
        //   enable: true,
        //   stroke: 'red',
        //   strokeWidth: 1
        // }}
        connectionLineType={ConnectionLineType.SmoothStep}
        onDelete={(changes) => {
          console.log("onDelete: ", changes);
          // onDelete(changes);
          // record(() => {
          //   onDelete(changes);
          // });
        }}
        onNodeClick={() => {
          console.log("onNodeClick");
        }}
        onNodeDragStart={() => {
          console.log("onNodeDragStart");
        }}
        onNodeDragStop={() => {
          console.log("onNodeDragStop");
        }}
        onNodesDelete={() => {
          console.log("onNodesDelete");
        }}
        onNodeMouseMove={() => {
          console.log("onNodeMouseMove");
        }}
        onNodeMouseLeave={() => {
          console.log("onNodeMouseLeave");
        }}
        onNodeDrag={() => {
          console.log("onNodeDrag");
        }}
        onNodesChange={(changes) => {
          console.log("onNodesChange", changes);
          const immediateRecordTypes = new Set(["add", "position"]);

          // 完整的拖拽过程（鼠标点击-开始拖拽-拖拽-鼠标弹起-拖拽结束）里只需要记录拖拽的开始和结束
          changes.forEach((change) => {
            if (change.type === "position") {
              if (!change.dragging) {
                console.log(1, change);
                onNodesChange([change]);
                isDraggingFirstSlice = true;
              } else {
                if (isDraggingFirstSlice) {
                  console.log(2);
                  record(() => {
                    onNodesChange([change]);
                    isDraggingFirstSlice = false;
                  });
                  isDraggingFirstSlice = false;
                } else {
                  console.log(3);
                  onNodesChange([change]);
                  isDraggingFirstSlice = false;
                }
              }
            } else if (immediateRecordTypes.has(change.type)) {
              console.log(4);
              // 对add、remove类型立即记录到历史
              record(() => {
                onNodesChange([change]);
              });
            } else {
              console.log(5);
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
            <Button type="primary" onClick={handleAddNode.bind(this)}>
              添加元素
            </Button>
            <Button onClick={handleInsertNode}>插入元素</Button>
            <Space />
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
