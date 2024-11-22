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
      height: 120, // Increased height for bottom padding
      border: '1px solid #2d3748',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      <div style={{
        padding: '4px 8px',
        backgroundColor: '#2d3748',
        color: 'white',
        fontWeight: 'bold',
        borderBottom: '1px solid #2d3748',
        borderRadius: '8px 8px 0 0'
      }}>
        Input
      </div>
      <div style={{ 
        padding: '12px 12px 20px 12px', // Increased bottom padding
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        flex: 1
      }}>
        <input 
          type="text" 
          value={currName}
          onChange={handleNameChange}
          style={{
            width: '100%',
            padding: '4px 8px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '13px',
            height: '24px',
            boxSizing: 'border-box'
          }}
        />
        <select 
          value={inputType} 
          onChange={handleTypeChange}
          style={{
            width: '100%',
            padding: '2px 6px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            backgroundColor: '#f7fafc',
            fontSize: '13px',
            height: '24px'
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
          top: '50%',
          right: '-6px', // Half the handle width for center alignment
          transform: 'translate(50%, -50%)',
          width: '12px',
          height: '12px',
          backgroundColor: '#48bb78',
          border: '2px solid #2f855a',
          zIndex: 1
        }}
      />
    </div>
  );
};
