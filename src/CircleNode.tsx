import React, { memo } from "react";
import { Handle, useStore, Position } from "@xyflow/react";

export default memo(({ id }: { id: string }) => {
  const label = useStore((s) => {
    const node = s.nodeLookup.get(id);

    if (!node) {
      return null;
    }

    return `position x:${parseInt(node.position.x.toString())} y:${parseInt(
      node.position.y.toString(),
    )}`;
  });

  return (
    <>
      <div className="wrapper gradient">
        <div className="inner">{label || "no node connected"}</div>
      </div>
      <Handle type="target" position={Position.Left} />
    </>
  );
});
