// textNode.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BaseNode, commonStyles, constants } from './baseNode';

const LINE_HEIGHT = 20;
const HEIGHT_INCREMENT = 40;
const MAX_CONTENT_HEIGHT = 300;

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [dimensions, setDimensions] = useState({ 
    width: constants.MIN_WIDTH, 
    height: constants.MIN_HEIGHT 
  });
  const textareaRef = useRef(null);

  // Function to extract variables from text
  const extractVariables = useCallback((text) => {
    const regex = /{{([^}]+)}}/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(match => match[1].trim());
  }, []);

  // Calculate dimensions based on content
  const calculateDimensions = useCallback(() => {
    if (!textareaRef.current) return { 
      width: constants.MIN_WIDTH, 
      height: constants.MIN_HEIGHT 
    };

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
    let contentWidth = constants.MIN_WIDTH;
    const lines = textarea.value.split('\n');
    lines.forEach(line => {
      measurer.textContent = line;
      const lineWidth = measurer.offsetWidth + constants.PADDING * 2;
      contentWidth = Math.max(contentWidth, lineWidth);
    });
    document.body.removeChild(measurer);

    // Calculate base content height
    const numLines = textarea.value.split('\n').length;
    const contentHeight = numLines * LINE_HEIGHT;
    
    // Calculate height in increments
    const baseHeight = constants.HEADER_HEIGHT + constants.PADDING * 2;
    const varsHeight = variables.length > 0 ? variables.length * constants.HANDLE_SPACING : 0;
    const targetContentHeight = Math.min(contentHeight, MAX_CONTENT_HEIGHT);
    
    // Round up to nearest HEIGHT_INCREMENT
    const incrementedHeight = Math.ceil(targetContentHeight / HEIGHT_INCREMENT) * HEIGHT_INCREMENT;
    const calculatedHeight = Math.max(
      constants.MIN_HEIGHT,
      baseHeight + incrementedHeight + varsHeight
    );

    // Bound width between MIN and MAX
    const calculatedWidth = Math.min(
      Math.max(contentWidth, constants.MIN_WIDTH),
      constants.MAX_WIDTH
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
    <BaseNode
      id={id}
      data={data}
      title="Text Node"
      width={dimensions.width}
      height={dimensions.height}
      inputHandles={variables.map(v => ({ id: v, label: v }))}
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
