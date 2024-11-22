// llmNode.js

import { Handle, Position } from 'reactflow';

export const LLMNode = ({ id, data }) => {
  return (
    <div style={{
      width: 200,
      height: 100,
      border: '1px solid #2d3748',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        padding: '4px 8px',
        backgroundColor: '#2d3748',
        color: 'white',
        fontWeight: 'bold',
        marginBottom: '8px'
      }}>
        LLM Node
      </div>
      <div style={{ 
        padding: '8px',
        fontSize: '14px',
        color: '#4a5568'
      }}>
        <div style={{
          backgroundColor: '#f7fafc',
          padding: '6px',
          borderRadius: '4px',
          border: '1px solid #e2e8f0'
        }}>
          Language Model
        </div>
      </div>
      
      {/* System prompt handle */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-system`}
        style={{
          top: '40%',
          width: '12px',
          height: '12px',
          backgroundColor: '#4299e1',
          border: '2px solid #2b6cb0'
        }}
      />
      
      {/* User prompt handle */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-prompt`}
        style={{
          top: '70%',
          width: '12px',
          height: '12px',
          backgroundColor: '#4299e1',
          border: '2px solid #2b6cb0'
        }}
      />
      
      {/* Response handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-response`}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#48bb78',
          border: '2px solid #2f855a'
        }}
      />
    </div>
  );
};
