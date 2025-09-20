import { memo } from "react";
import { Handle, Position, useStore, type NodeProps } from "@xyflow/react";

function NodeCircle({ id, data, ...props }: NodeProps) {
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
}
export default memo(NodeCircle);
