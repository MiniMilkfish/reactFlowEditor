import React, { memo, useState } from "react";
import { Handle, Position, NodeToolbar as _NodeToolbar } from "@xyflow/react";

function NodeToolbar({ data }: { data: { label: string } }) {
  const [emoji, setEmoji] = useState(() => "🚀");

  return (
    <>
      <_NodeToolbar isVisible>
        <button onClick={() => setEmoji("🚀")}>🚀</button>
        <button onClick={() => setEmoji("🔥")}>🔥</button>
        <button onClick={() => setEmoji("✨")}>✨</button>
      </_NodeToolbar>
      <div style={{ padding: "10px 20px" }}>
        <div>{emoji}</div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <div
        style={{
          position: "absolute",
          color: "#555555",
          bottom: -15,
          fontSize: 8,
        }}
      >
        {data.label}
      </div>
    </>
  );
}

export default memo(NodeToolbar);
