import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import useStore from "../store";

export default memo(({ id, data, ...props }: NodeProps) => {
  console.log("CircleNode - id:", id, "data:", data, "all props:", {
    id,
    data,
    ...props,
  });

  const label = useStore((state) => {
    const node = state.nodes.find((n) => n.id === id);

    if (!node) {
      return null;
    }

    return `position x:${Math.round(node.position.x)}, y:${Math.round(
      node.position.y,
    )}`;
  });

  return (
    <>
      <div className="wrapper gradient">
        <div className="inner">
          <div>{label || "no node connected"}</div>
          {data && <div>Data: {JSON.stringify(data)}</div>}
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
});
