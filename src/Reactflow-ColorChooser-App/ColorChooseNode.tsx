// import type { NodeProps } from "@xyflow/react";
// import { Handle, Position } from "@xyflow/react";
// import userStore from "./store";
// import type { ColorNode } from "./types";

// function ColorChooserNode({ id, data }: NodeProps<ColorNode>) {
//   const updateNodeColor = userStore((state) => state.updateNodeColor);

//   return (
//     <div style={{ backgroundColor: data.color, borderRadius: 10 }}>
//       <Handle type="target" position={Position.Top} />
//       <div style={{ padding: 20 }}>
//         <input
//           type="color"
//           defaultValue={data.color}
//           onChange={(e) => updateNodeColor(id, e.target.value)}
//           className="nodrag"
//         />
//       </div>
//       <Handle type="source" position={Position.Bottom} />
//     </div>
//   );
// }

// export default ColorChooserNode;
