// outputNode.js

import { useState } from 'react';
import { Handle, Position } from 'reactflow';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

  return (
    <div style={{
      width: 200,
      height: 100,
      border: '1px solid #2d3748',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '4px 8px',
        backgroundColor: '#2d3748',
        color: 'white',
        fontWeight: 'bold',
        borderBottom: '1px solid #2d3748'
      }}>
        Output
      </div>
      <div style={{ 
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1
      }}>
        <input 
          type="text" 
          value={currName}
          onChange={handleNameChange}
          style={{
            width: '100%',
            padding: '4px 6px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '13px',
            height: '24px',
            boxSizing: 'border-box'
          }}
        />
        <select 
          value={outputType} 
          onChange={handleTypeChange}
          style={{
            width: '100%',
            padding: '2px 4px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            backgroundColor: '#f7fafc',
            fontSize: '13px',
            height: '24px'
          }}
        >
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-value`}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#4299e1',
          border: '2px solid #2b6cb0'
        }}
      />
    </div>
  );
};
