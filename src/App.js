import React, { useState } from 'react';
import { GraphCanvas } from 'reagraph';
import { nodes as initialNodes, edges as initialEdges } from './data';

function App() {
  const [tooltip, setTooltip] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleNodePointerOver = (node, event) => {
    setTooltip(`${node.id}: ${node.label}`);
    setTooltipPos({ x: event.clientX, y: event.clientY });
  };

  const handleEdgePointerOver = (edge, event) => {
    setTooltip(`${edge.label}: Gas price`);
    setTooltipPos({ x: event.clientX, y: event.clientY });
  };

  const handlePointerOut = () => {
    setTooltip('');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <GraphCanvas
        nodes={initialNodes}
        edges={initialEdges}
        onNodePointerOver={handleNodePointerOver}
        onNodePointerOut={handlePointerOut}
        onEdgePointerOver={handleEdgePointerOver}
        onEdgePointerOut={handlePointerOut}
      />
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            padding: '5px 10px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '5px',
            pointerEvents: 'none', // Prevents tooltip from blocking graph interactions
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}

export default App;
