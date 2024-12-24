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
    const varsHeight = Math.max(variables.length * constants.HANDLE_SPACING, 0);
    
    if (!textareaRef.current) return { 
      width: constants.MIN_WIDTH, 
      height: baseHeight + varsHeight + constants.MIN_HEIGHT
    };

    const textarea = textareaRef.current;
    
    // Calculate content height
    const numLines = (textarea.value.match(/\n/g) || []).length + 1;
    const contentHeight = Math.max(numLines * LINE_HEIGHT, LINE_HEIGHT);
    const targetContentHeight = Math.min(contentHeight + constants.PADDING * 2, MAX_CONTENT_HEIGHT);
    
    // Calculate total height
    const calculatedHeight = Math.max(
      constants.MIN_HEIGHT,
      baseHeight + targetContentHeight + varsHeight
    );

    // Calculate width
    const contentWidth = Math.min(
      Math.max(textarea.scrollWidth + constants.PADDING * 2, constants.MIN_WIDTH),
      constants.MAX_WIDTH
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
          y: constants.HEADER_HEIGHT + (constants.HANDLE_SPACING * (index + 1))
        }
      }))}
      outputHandles={[{ 
        id: 'output', 
        label: 'Output',
        position: {
          x: 0,
          y: constants.HEADER_HEIGHT + (constants.HANDLE_SPACING * 1.5)
        }
      }]}
    >
      <textarea
        ref={textareaRef}
        value={currText}
        onChange={handleTextChange}
        style={{
          ...commonStyles.textarea,
          flex: 1,
          minHeight: LINE_HEIGHT * 2,
          maxHeight: MAX_CONTENT_HEIGHT
        }}
      />
    </BaseNode>
  );
};
