// baseNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const MIN_HEIGHT = 160; // Increased minimum height to accommodate all content
const PADDING = 16; // Increased padding
const HEADER_HEIGHT = 32;
const HANDLE_SPACING = 20;
const BOTTOM_MARGIN = 1;

export const BaseNode = ({ 
  id, 
  data,
  title = 'Node',
  width = MIN_WIDTH,
  height = MIN_HEIGHT,
  children,
  inputHandles = [],
  outputHandles = [],
}) => {
  return (
    <div style={{
      width,
      minHeight: height, // Changed to minHeight to allow content to determine actual height
      border: '1px solid #2d3748',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'width 0.2s ease, height 0.2s ease'
    }}>
      <div style={{ 
        height: HEADER_HEIGHT,
        padding: '4px 8px',
        backgroundColor: '#2d3748',
        color: 'white',
        fontWeight: 'bold',
        borderBottom: '1px solid #2d3748',
        borderRadius: '8px 8px 0 0',
        flexShrink: 0
      }}>
        {title}
      </div>
      
      <div style={{
        padding: PADDING,
        paddingBottom: PADDING + BOTTOM_MARGIN,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {children}
      </div>

      {/* Input Handles */}
      {inputHandles.map((handle, index) => (
        <Handle
          key={handle.id}
          type="target"
          position={Position.Left}
          id={handle.id}
          style={{
            top: `${(index + 1) * (100 / (inputHandles.length + 1))}%`,
            left: '-6px',
            transform: 'translate(-50%, -50%)',
            width: '12px',
            height: '12px',
            backgroundColor: '#4299e1',
            border: '2px solid #2b6cb0',
            zIndex: 1
          }}
        />
      ))}

      {/* Output Handles */}
      {outputHandles.map((handle, index) => (
        <Handle
          key={handle.id}
          type="source"
          position={Position.Right}
          id={handle.id}
          style={{
            top: `${(index + 1) * (100 / (outputHandles.length + 1))}%`,
            right: '-6px',
            transform: 'translate(50%, -50%)',
            width: '12px',
            height: '12px',
            backgroundColor: '#48bb78',
            border: '2px solid #2f855a',
            zIndex: 1
          }}
        />
      ))}
    </div>
  );
};

// Common styles that can be used by all nodes
export const commonStyles = {
  input: {
    width: '100%',
    padding: '4px 8px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '13px',
    height: '28px', // Reduced height
    boxSizing: 'border-box',
    backgroundColor: '#f7fafc'
  },
  select: {
    width: '100%',
    padding: '4px 8px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    backgroundColor: '#f7fafc',
    fontSize: '13px',
    height: '28px', // Reduced height
    boxSizing: 'border-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  textarea: {
    width: '100%',
    height: '100%',
    resize: 'none',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
    fontFamily: 'monospace',
    fontSize: '13px',
    backgroundColor: '#f7fafc',
    boxSizing: 'border-box',
    overflow: 'hidden'
  }
};

// Constants that can be used by all nodes
export const constants = {
  MIN_WIDTH,
  MAX_WIDTH,
  MIN_HEIGHT,
  PADDING,
  HEADER_HEIGHT,
  HANDLE_SPACING,
  BOTTOM_MARGIN
};
