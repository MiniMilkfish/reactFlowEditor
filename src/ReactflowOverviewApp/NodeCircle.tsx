import { memo } from "react";
import { Handle, Position, useStore, type NodeProps } from "@xyflow/react";
// import { constants } from "buffer";

function NodeCircle({ id, data, ...props }: NodeProps) {
  const { positionAbsoluteX, positionAbsoluteY } = props;

  return (
    <>
      <div className="wrapper gradient">
        <div className="inner">
          <div>
            {id} x:{Math.round(positionAbsoluteX)}, y:
            {Math.round(positionAbsoluteY)}
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}
export default memo(NodeCircle);
