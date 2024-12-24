// outputNode.js
import React, { useState, useEffect } from 'react';
import { BaseNode, commonStyles } from './baseNode';

export const OutputNode = ({ id, data }) => {
  // Extract node number from id (e.g., 'output-1' -> '1')
  const nodeNumber = id.match(/\d+/)?.[0] || '1';
  const defaultName = `output_${nodeNumber}`;
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    // Update name when id changes
    setName(`output_${nodeNumber}`);
  }, [nodeNumber]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Output Node"
      inputHandles={[{ id: 'input', label: 'Input' }]}
    >
      <div style={{ 
        fontSize: '13px', 
        fontWeight: 'bold',
        color: '#4a5568'
      }}>
        Name:
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          data?.onNameChange?.(id, e.target.value);
        }}
        placeholder="Enter output name..."
        style={commonStyles.input}
      />
      <select
        value={data?.type || 'Text'}
        onChange={(e) => data?.onTypeChange?.(id, e.target.value)}
        style={commonStyles.select}
      >
        <option value="Text">Text</option>
        <option value="Image">Image</option>
      </select>
    </BaseNode>
  );
};
