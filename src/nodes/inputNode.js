// inputNode.js

import { useState } from 'react';
import { Handle, Position } from 'reactflow';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
  };

  return (
    <div style={{
      width: 200,
      height: 80,
      border: '1px solid #2d3748',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '4px 8px',
        backgroundColor: '#2d3748',
        color: 'white',
        fontWeight: 'bold',
        marginBottom: '8px'
      }}>
        Input
      </div>
      <div style={{ padding: '0 8px' }}>
        <div style={{ marginBottom: '4px' }}>
          <input 
            type="text" 
            value={currName}
            onChange={handleNameChange}
            style={{
              width: '100%',
              padding: '4px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        <select 
          value={inputType} 
          onChange={handleTypeChange}
          style={{
            width: '100%',
            padding: '4px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            backgroundColor: '#f7fafc',
            fontSize: '14px'
          }}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
      <Handle
        type="source"
        position={Position.Right}
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
