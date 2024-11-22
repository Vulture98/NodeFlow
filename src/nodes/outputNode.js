// outputNode.js
import React from 'react';
import { BaseNode, commonStyles } from './baseNode';

export const OutputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Output Node"
      inputHandles={[{ id: 'input', label: 'Input' }]}
    >
      <select
        value={data?.type || 'text'}
        onChange={(e) => data?.onTypeChange?.(id, e.target.value)}
        style={commonStyles.select}
      >
        <option value="text">Text</option>
        <option value="file">File</option>
        <option value="json">JSON</option>
      </select>
      <input
        type="text"
        value={data?.name || ''}
        onChange={(e) => data?.onNameChange?.(id, e.target.value)}
        placeholder="Output name..."
        style={commonStyles.input}
      />
    </BaseNode>
  );
};
