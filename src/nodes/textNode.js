// textNode.js

import { useState, useEffect, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const MIN_WIDTH = 200;
const MIN_HEIGHT = 80;
const PADDING = 20;

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

  // Update variables and dimensions when text changes
  useEffect(() => {
    // Extract variables
    const newVars = extractVariables(currText);
    setVariables(newVars);

    // Calculate dimensions based on text length
    const textLength = currText.length;
    const numLines = Math.ceil(textLength / 30); // Approximate characters per line
    
    setDimensions({
      width: Math.max(MIN_WIDTH, Math.min(textLength * 8, 400)), // Cap width at 400px
      height: Math.max(MIN_HEIGHT, 40 + (numLines * 20) + (newVars.length * 25))
    });
  }, [currText, extractVariables]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  return (
    <div style={{
      width: dimensions.width,
      height: dimensions.height,
      border: '1px solid black',
      borderRadius: '5px',
      padding: PADDING,
      backgroundColor: '#fff'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <span style={{ fontWeight: 'bold' }}>Text Node</span>
      </div>
      <div>
        <textarea
          value={currText}
          onChange={handleTextChange}
          style={{
            width: '100%',
            minHeight: '40px',
            resize: 'vertical',
            padding: '5px',
            borderRadius: '3px',
            border: '1px solid #ccc'
          }}
        />
      </div>
      
      {/* Dynamic input handles for variables */}
      {variables.map((variable, index) => (
        <Handle
          key={`${id}-${variable}`}
          type="target"
          position={Position.Left}
          id={`${id}-${variable}`}
          style={{ top: 40 + (index * 25) }}
        />
      ))}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />
    </div>
  );
}
