// textNode.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BaseNode, commonStyles, constants } from './baseNode';

const LINE_HEIGHT = 20;
const HEIGHT_INCREMENT = 40;
const MAX_CONTENT_HEIGHT = 300;

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState(() => {
    const regex = /{{([^}]+)}}/g;
    const matches = [...(data?.text || '{{input}}').matchAll(regex)];
    return matches.map(match => match[1].trim());
  });
  const [dimensions, setDimensions] = useState({ 
    width: constants.MIN_WIDTH, 
    height: constants.MIN_HEIGHT 
  });
  const textareaRef = useRef(null);
  const prevVariablesRef = useRef(variables);

  // Function to extract variables from text
  const extractVariables = useCallback((text) => {
    const regex = /{{([^}]+)}}/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(match => match[1].trim());
  }, []);

  // Calculate dimensions based on content and variables
  const calculateDimensions = useCallback(() => {
    const baseHeight = constants.HEADER_HEIGHT + constants.PADDING * 2;
    const varsHeight = variables.length * constants.HANDLE_SPACING;
    
    // Always ensure enough height for handles
    const minHeightForHandles = baseHeight + varsHeight + constants.MIN_HEIGHT;
    
    if (!textareaRef.current) return { 
      width: constants.MIN_WIDTH, 
      height: minHeightForHandles
    };

    const textarea = textareaRef.current;
    
    // Calculate content width
    const contentWidth = Math.min(
      Math.max(textarea.scrollWidth + constants.PADDING * 2, constants.MIN_WIDTH),
      constants.MAX_WIDTH
    );

    // Calculate content height
    const numLines = textarea.value.split('\n').length;
    const contentHeight = numLines * LINE_HEIGHT;
    const targetContentHeight = Math.min(contentHeight, MAX_CONTENT_HEIGHT);
    
    // Ensure height accommodates both content and handles
    const calculatedHeight = Math.max(
      minHeightForHandles,
      baseHeight + targetContentHeight + varsHeight
    );

    return { 
      width: contentWidth, 
      height: calculatedHeight 
    };
  }, [variables.length]);

  // Handle text changes
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setCurrText(newText);
    
    // Extract new variables
    const newVars = extractVariables(newText);
    
    // Update variables if they've changed
    if (JSON.stringify(newVars) !== JSON.stringify(variables)) {
      setVariables(newVars);
      prevVariablesRef.current = newVars;
    }
    
    // Update store
    if (data.onTextChange) {
      data.onTextChange(id, newText);
    }
  };

  // Update dimensions whenever variables change
  useEffect(() => {
    const newDimensions = calculateDimensions();
    setDimensions(newDimensions);
  }, [variables, calculateDimensions]);

  // Force handle position update when variables change
  useEffect(() => {
    if (JSON.stringify(prevVariablesRef.current) !== JSON.stringify(variables)) {
      const timer = setTimeout(() => {
        const newDimensions = calculateDimensions();
        setDimensions(newDimensions);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [variables, calculateDimensions]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text Node"
      width={dimensions.width}
      height={dimensions.height}
      inputHandles={variables.map((v, index) => ({ 
        id: v, 
        label: v,
        position: {
          x: 0,
          y: ((index + 1) * constants.HANDLE_SPACING) + constants.HEADER_HEIGHT
        }
      }))}
      outputHandles={[{ id: 'output', label: 'Output' }]}
    >
      <textarea
        ref={textareaRef}
        value={currText}
        onChange={handleTextChange}
        style={{
          ...commonStyles.textarea,
          lineHeight: LINE_HEIGHT + 'px',
          maxHeight: `${MAX_CONTENT_HEIGHT}px`,
          overflowY: 'auto'
        }}
      />
    </BaseNode>
  );
};
