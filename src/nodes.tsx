import type { AppNode } from "./types";

export default [
  {
    id: "annotation-1",
    type: "annotation",
    draggable: false,
    selectable: false,
    data: {
      level: 1,
      label: "内置节点和边类型。可拖拽、可删除、可连线",
      arrowStyle: {
        right: 0,
        bottom: 0,
        transform: "translate(-30px, 10px) rotate(-80deg)",
      },
    },
    position: { x: -80, y: -30 },
  },
  {
    id: "1-1",
    type: "input",
    data: { Label: "Input Node" },
    position: { x: 150, y: 0 },
  },
  {
    id: "1-2",
    type: "default",
    data: { Label: "Default Node" },
    position: { x: 0, y: 100 },
  },
  {
    id: "1-3",
    type: "output",
    data: { Label: "Output Node" },
    position: { x: 300, y: 100 },
  },
  {
    id: "annotation-2",
    type: "annotation",
    draggable: false,
    selectable: false,
    data: {
      level: 2,
      label: "Sub flows, toolbars 和 resizable nodes!",
      arrowStyle: {
        left: 0,
        bottom: 0,
        transform: "translate(5px, 25px) scale(1, -1) rotate(100deg)",
      },
    },
    position: { x: 220, y: 200 },
  },
  {
    id: "2-1",
    type: "group",
    position: { x: -170, y: 250 },
    style: {
      width: 380,
      height: 180,
      backgroundColor: "rgba(208, 192, 247, 0.2)",
    },
    data: {},
  },
  {
    id: "2-2",
    type: "tools",
    data: { Label: "Node with Toolbal" },
    position: { x: 50, y: 50 },
    style: {
      width: 80,
      height: 80,
      background: "rgb(208, 192, 247)",
    },
    parentId: "2-1",
    extent: "parent",
  },
  {
    id: "2-3",
    type: "resizer",
    data: { Label: "resizable node" },
    position: { x: 250, y: 50 },
    style: {
      width: 80,
      height: 80,
      background: "rgb(208, 192, 247)",
      color: "white",
    },
    parentId: "2-1",
    extent: "parent",
  },
  {
    id: "annotation-3",
    type: "annotation",
    draggable: false,
    selectable: false,
    data: {
      level: 3,
      label: "<>节点和边可以是任何东西，而且完全可以自定义</>",
      arrowStyle: {
        right: 0,
        bottom: 0,
        transform: "translate(-35px, 20px) rotate(-80deg)",
      },
    },
    position: { x: -40, y: 570 },
  },
  {
    id: "3-2",
    type: "textinput",
    data: {},
    position: { x: 150, y: 650 },
  },
  {
    id: "3-1",
    type: "circle",
    position: { x: 350, y: 500 },
    data: {},
  },
] as AppNode[];
