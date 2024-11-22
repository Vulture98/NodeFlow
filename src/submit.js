// submit.js

import { useCallback } from 'react';
import { useStore } from './store';

export const useSubmitPipeline = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const submitPipeline = useCallback(async () => {
    try {
      console.log('Submitting pipeline with:', { nodes, edges });
      
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          nodes: nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
          edges: edges.map(({ id, source, sourceHandle, target, targetHandle }) => 
            ({ id, source, sourceHandle, target, targetHandle }))
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Server response:', data);
      
      // Create user-friendly message
      const message = `Pipeline Analysis:
• Number of nodes: ${data.num_nodes}
• Number of edges: ${data.num_edges}
• Is a valid DAG: ${data.is_dag ? 'Yes' : 'No'}`;

      // Show alert with results
      alert(message);

      return data;
    } catch (error) {
      console.error('Error submitting pipeline:', error);
      alert(`Failed to submit pipeline: ${error.message}`);
    }
  }, [nodes, edges]);

  return submitPipeline;
};

export const SubmitButton = () => {
  const submitPipeline = useSubmitPipeline();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '20px 0'
    }}>
      <button
        onClick={submitPipeline}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
      >
        Submit Pipeline
      </button>
    </div>
  );
};
