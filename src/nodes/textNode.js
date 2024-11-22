// textNode.js

import { useState, useEffect, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const MIN_WIDTH = 200;  // Start with smaller width
const MAX_WIDTH = 500;  // Maximum width
const MIN_HEIGHT = 100;  // Minimum height
const PADDING = 8;
const LINE_HEIGHT = 20;
const HANDLE_SPACING = 20;
const HEADER_HEIGHT = 32;

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

  // Calculate required dimensions based on content
  const calculateDimensions = useCallback((text, numVars) => {
    // Calculate width based on text length
    const longestLine = text.split('\n')
      .reduce((max, line) => Math.max(max, line.length), 0);
    const calculatedWidth = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, longestLine * 8)
    );

    // Calculate height based on text content and line breaks
    const lines = text.split('\n');
    const wrappedLines = lines.reduce((total, line) => 
      total + Math.ceil(line.length / (calculatedWidth / 8)), 0);
    const textHeight = Math.max(2, wrappedLines) * LINE_HEIGHT;
    const varsHeight = numVars * HANDLE_SPACING;
    const calculatedHeight = Math.max(MIN_HEIGHT, textHeight + varsHeight + PADDING * 3 + HEADER_HEIGHT);

    return { width: calculatedWidth, height: calculatedHeight };
  }, []);

  // Update variables and dimensions when text changes
  useEffect(() => {
    const newVars = extractVariables(currText);
    setVariables(newVars);
    setDimensions(calculateDimensions(currText, newVars.length));
  }, [currText, extractVariables, calculateDimensions]);

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
      border: '1px solid #2d3748',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease, height 0.2s ease'
    }}>
      <div style={{ 
        height: HEADER_HEIGHT,
        padding: '4px 8px',
        backgroundColor: '#2d3748',
        color: 'white',
        fontWeight: 'bold',
        borderBottom: '1px solid #2d3748',
        display: 'flex',
        alignItems: 'center'
      }}>
        Text Node
      </div>
      <div style={{
        padding: PADDING,
        flex: 1,
        display: 'flex'
      }}>
        <textarea
          value={currText}
          onChange={handleTextChange}
          style={{
            width: '100%',
            height: '100%',
            resize: 'none',
            padding: '6px 8px',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.4',
            backgroundColor: '#f7fafc'
          }}
        />
      </div>
      
      {variables.map((variable, index) => (
        <Handle
          key={variable}
          type="target"
          position={Position.Left}
          id={variable}
          style={{
            top: `${getHandlePosition(index, variables.length)}%`,
            transform: 'translateY(-50%)',
            width: '12px',
            height: '12px',
            backgroundColor: '#4299e1',
            border: '2px solid #2b6cb0'
          }}
          data-variable={variable}
        />
      ))}

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          width: '12px',
          height: '12px',
          backgroundColor: '#48bb78',
          border: '2px solid #2f855a'
        }}
      />
    </div>
  );
};
