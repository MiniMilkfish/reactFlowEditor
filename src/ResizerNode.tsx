import { Handle, NodeResizer, Position } from "@xyflow/react";
import { memo } from "react";

function ResizerNode({ data }: { data: { label: string } }) {
  return (
    <>
      <NodeResizer minWidth={50} minHeight={50} />
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          position: "absolute",
          bottom: 0,
          width: "100%",
          left: 0,
        }}
      >
        <Handle
          id="a"
          type="source"
          position={Position.Bottom}
          style={{
            position: "relative",
            left: 0,
            transform: "none",
          }}
        />
        <Handle
          id="b"
          type="source"
          position={Position.Bottom}
          style={{
            position: "relative",
            left: 0,
            transform: "none",
          }}
        />
      </div>

      <Handle type="source" position={Position.Right} />
    </>
  );
}

export default memo(ResizerNode);
