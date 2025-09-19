import React, { memo } from "react";

function AnnotationNode({
  data,
}: {
  data: { label: string; arrowStyle?: React.CSSProperties };
}) {
  return (
    <>
      <div style={{ padding: 10, display: "flex" }}>
        <div style={{ marginRight: 4 }}>{data.label}</div>
      </div>
      {data.arrowStyle && (
        <div className="arrow" style={data.arrowStyle}>
          ⤹
        </div>
      )}
    </>
  );
}
export default memo(AnnotationNode);
