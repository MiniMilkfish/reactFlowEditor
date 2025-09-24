import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

function NodeCanvas({ id, data, ...props }: NodeProps) {
  return (
    <>
      <canvas width={200} height={200} style={{ background: "red" }} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}
export default memo(NodeCanvas);
