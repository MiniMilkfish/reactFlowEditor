import { memo } from "react";
import useStore from "./store";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export default memo(({ id }: NodeProps) => {
  const label = useStore((state) => {
    const node = state.nodes.find((n) => n.id === id);

    if (!node) return null;

    return `position x:${parseInt(node.position.x.toString())}, y:${parseInt(node.position.y.toString())}`;
  });

  return (
    <>
      <div className="wrapper gradient">
        <div className="inner">{label || "node node connected"}</div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
});
