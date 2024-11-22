// inputNode.js
import React from 'react';
import { BaseNode, commonStyles } from './baseNode';

export const InputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Input Node"
      outputHandles={[{ id: 'output', label: 'Output' }]}
    >
      <input
        type="text"
        value={data?.value || ''}
        onChange={(e) => data?.onValueChange?.(id, e.target.value)}
        placeholder="Enter value..."
        style={commonStyles.input}
      />
      <select
        value={data?.type || 'text'}
        onChange={(e) => data?.onTypeChange?.(id, e.target.value)}
        style={commonStyles.select}
      >
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
      </select>
    </BaseNode>
  );
};
