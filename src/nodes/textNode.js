// textNode.js

import { useState, useEffect, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const MIN_WIDTH = 400; // Increased width
const MAX_WIDTH = 600; // Increased max width
const MIN_HEIGHT = 60; // Reduced minimum height
const PADDING = 10; // Reduced padding
const LINE_HEIGHT = 20;
const HANDLE_SPACING = 20; // Reduced spacing

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [dimensions, setDimensions] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT });

  // Function to extract variables from text
  const extractVariables = useCallback((text) => {
    const regex = /{{([^}]+)}}/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(match => match[1].trim());
  }, []);

  // Calculate required height based on content
  const calculateHeight = useCallback((text, numVars) => {
    const textLines = Math.ceil(text.length * 7 / MAX_WIDTH); // Approximate chars per line
    const textHeight = Math.max(2, textLines) * LINE_HEIGHT; // Minimum 2 lines
    const varsHeight = numVars * HANDLE_SPACING;
    return Math.max(MIN_HEIGHT, textHeight + varsHeight + PADDING * 2);
  }, []);

  // Update variables and dimensions when text changes
  useEffect(() => {
    // Extract variables
    const newVars = extractVariables(currText);
    setVariables(newVars);
    
    // Update dimensions
    setDimensions({
      width: MAX_WIDTH,
      height: calculateHeight(currText, newVars.length)
    });
  }, [currText, extractVariables, calculateHeight]);

  // Calculate handle positions
  const getHandlePosition = (index, total) => {
    if (total === 0) return 0;
    if (total === 1) return 50;
    const step = 100 / (total + 1);
    return step * (index + 1);
  };

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
    if (data.onTextChange) {
      data.onTextChange(id, e.target.value);
    }
  };

  return (
    <div style={{
      width: dimensions.width,
      height: dimensions.height,
      border: '1px solid black',
      borderRadius: '5px',
      padding: PADDING,
      backgroundColor: '#fff',
      position: 'relative'
    }}>
      <div style={{ marginBottom: '5px' }}>
        <span style={{ fontWeight: 'bold' }}>Text Node</span>
      </div>
      <div>
        <textarea
          value={currText}
          onChange={handleTextChange}
          style={{
            width: '100%',
            height: `${dimensions.height - 50}px`, // Dynamic height based on content
            resize: 'none', // Disable manual resizing
            padding: '5px',
            borderRadius: '3px',
            border: '1px solid #ccc',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.4',
            overflow: 'hidden' // Hide scrollbars
          }}
        />
      </div>
      
      {/* Dynamic input handles for variables */}
      {variables.map((variable, index) => (
        <Handle
          key={variable}
          type="target"
          position={Position.Left}
          id={variable}
          style={{
            top: `${getHandlePosition(index, variables.length)}%`,
            transform: 'translateY(-50%)'
          }}
          data-variable={variable}
        />
      ))}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  );
};
