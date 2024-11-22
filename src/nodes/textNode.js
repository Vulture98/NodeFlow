// textNode.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { Handle, Position } from 'reactflow';

const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const MIN_HEIGHT = 100;
const PADDING = 8;
const HEADER_HEIGHT = 32;
const HANDLE_SPACING = 20;
const LINE_HEIGHT = 20;  // Fixed height per line

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [dimensions, setDimensions] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT });
  const textareaRef = useRef(null);

  // Function to extract variables from text
  const extractVariables = useCallback((text) => {
    const regex = /{{([^}]+)}}/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(match => match[1].trim());
  }, []);

  // Calculate dimensions based on content
  const calculateDimensions = useCallback(() => {
    if (!textareaRef.current) return { width: MIN_WIDTH, height: MIN_HEIGHT };

    const textarea = textareaRef.current;
    
    // Create a hidden div to measure text width
    const measurer = document.createElement('div');
    measurer.style.position = 'absolute';
    measurer.style.visibility = 'hidden';
    measurer.style.whiteSpace = 'pre';  
    measurer.style.padding = '6px 8px';
    measurer.style.boxSizing = 'border-box';
    measurer.style.font = window.getComputedStyle(textarea).font;
    document.body.appendChild(measurer);

    // Calculate width by measuring each line
    let contentWidth = MIN_WIDTH;
    const lines = textarea.value.split('\n');
    lines.forEach(line => {
      measurer.textContent = line;
      const lineWidth = measurer.offsetWidth + PADDING * 4; 
      contentWidth = Math.max(contentWidth, lineWidth);
    });
    document.body.removeChild(measurer);

    // Bound width between MIN and MAX
    const calculatedWidth = Math.min(Math.max(contentWidth, MIN_WIDTH), MAX_WIDTH);

    // Calculate height based only on number of lines and variables
    const numLines = textarea.value.split('\n').length;
    const contentHeight = numLines * LINE_HEIGHT;
    const varsHeight = variables.length > 0 ? variables.length * HANDLE_SPACING : 0;
    const calculatedHeight = Math.max(
      MIN_HEIGHT, 
      contentHeight + varsHeight + HEADER_HEIGHT + PADDING * 3
    );

    return { width: calculatedWidth, height: calculatedHeight };
  }, [variables.length]);

  // Update dimensions when text changes
  useEffect(() => {
    const newVars = extractVariables(currText);
    setVariables(newVars);
    const newDimensions = calculateDimensions();
    setDimensions(newDimensions);
  }, [currText, calculateDimensions, extractVariables]);

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
        Text Node
      </div>
      <div style={{
        padding: PADDING,
        flex: 1,
        display: 'flex'
      }}>
        <textarea
          ref={textareaRef}
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
            lineHeight: LINE_HEIGHT + 'px',  // Match LINE_HEIGHT
            backgroundColor: '#f7fafc',
            boxSizing: 'border-box',
            overflow: 'hidden'  
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
            top: `${(index + 1) * (100 / (variables.length + 1))}%`,
            left: '-6px',
            transform: 'translate(-50%, -50%)',
            width: '12px',
            height: '12px',
            backgroundColor: '#4299e1',
            border: '2px solid #2b6cb0',
            zIndex: 1
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
          right: '-6px',
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
