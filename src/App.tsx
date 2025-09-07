import { useCallback, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// import { Button } from 'antd';
import { 
  ReactFlow, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge, 
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initNodes: Node[] = [
  {id: 'n1', position: {x: 0, y: 0}, data: { label: 'Node 1'}},
  {id: 'n2', position: {x: 0, y: 100}, data: { label: 'Node 2'}}
];

const initEdges: Edge[] = [{id: 'n1-n2', source: 'n1', target: 'n2'}]

function App() {
  const [nodes, setNodes] = useState<Node[]>(initNodes);
  const [edges, setEdges] = useState<Edge[]>(initEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes(
      nodesSnapshot => applyNodeChanges(changes, nodesSnapshot)
    ),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges(
      edgesSnapshot => applyEdgeChanges(changes, edgesSnapshot)
    ),
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    connection => setEdges(
      edgesSnapshot => addEdge(connection, edgesSnapshot)
    ),
    [setEdges]
  );

  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  )

}

export default App
