import React, { memo } from "react";

function NodeAnnotation({
  data,
}: {
  data: { level: number; label: string; arrowStyle?: React.CSSProperties };
}) {
  return (
    <>
      <div style={{ padding: 10, display: "flex" }}>
        <div style={{ marginRight: 4 }}>{data.level}.</div>
        <div>{data.label}</div>
      </div>
      {data.arrowStyle && (
        <div className="arrow" style={data.arrowStyle}>
          ⤹
        </div>
      )}
    </>
  );
}

export default memo(NodeAnnotation);
