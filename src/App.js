import React, { useEffect, useState } from 'react';
import { GraphCanvas } from 'reagraph';


function transformData(walletData) {
  const nodes = new Set();
  const edges = [];

  // Process transactions to create nodes and edges
  walletData.txs.slice(30, 35).forEach((tx, index) => {
    if (tx.inputs) {
      tx.inputs.forEach(input => {
        if (input.prev_out && input.prev_out.addr) {
          nodes.add(input.prev_out.addr);
          nodes.add(walletData.address); // Assuming this is always present

          // Check and add only if value is defined and nodes are distinct
          if (input.prev_out.value && input.prev_out.addr !== walletData.address) {
            edges.push({
              source: input.prev_out.addr,
              target: walletData.address,
              label: `Tx ${index + 1}: ${input.prev_out.value} satoshis`
            });
          }
        }
      });
    }

    if (tx.out) {
      tx.out.forEach(output => {
        if (output.addr) {
          nodes.add(output.addr);
          // Create an edge if the output is to a different address
          if (output.value && walletData.address !== output.addr) {
            edges.push({
              source: walletData.address,
              target: output.addr,
              label: `Tx ${index + 1}: ${output.value} satoshis`
            });
          }
        }
      });
    }
  });

  return { nodes: Array.from(nodes).map(node => ({ id: node, label: node })), edges };
}




function App() {
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [tooltip, setTooltip] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch('/wallet.json')
      .then(response => response.json())
      .then(jsonData => {
        const transformedData = transformData(jsonData); 
        console.log(transformedData.edges);  // Verify edge structure and content
        setData(transformedData);
      });
  }, []);

  const handleNodePointerOver = (node, event) => {
    setTooltip(`${node.id}: ${node.label.substring(0, 5)}`);
    setTooltipPos({ x: event.clientX, y: event.clientY });
  };

  const handleEdgePointerOver = (edge, event) => {
    console.log('Event object:', event); // Check what the event object contains
    if (event && event.clientX && event.clientY) {
      setTooltip(`${edge.label.substring(0, 5)}: ${edge.source.substring(0, 5)} to ${edge.target.substring(0, 5)}`);
      setTooltipPos({ x: event.clientX, y: event.clientY });
    } else {
      console.log('Event does not contain clientX and clientY properties');
    }
  };
  

  const handlePointerOut = () => {
    setTooltip('');
    setTooltipPos({ x: 0, y: 0 });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <GraphCanvas
        nodes={data.nodes}
        edges={data.edges}
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
            pointerEvents: 'none',
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
export default App;
