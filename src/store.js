// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
    updateNodeData: (nodeId, data) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, ...data } };
          }
          return node;
        }),
      });
    },
    onTextNodeChange: (nodeId, newText) => {
      const oldNode = get().nodes.find(node => node.id === nodeId);
      if (!oldNode) return;

      const getVariables = (text) => {
        const regex = /{{([^}]+)}}/g;
        const matches = [...text.matchAll(regex)];
        return matches.map(match => match[1].trim());
      };

      const oldVars = getVariables(oldNode.data.text || '');
      const newVars = getVariables(newText);

      // Keep track of which edges are connected to which variables
      const edgesByVariable = {};
      get().edges.forEach(edge => {
        if (edge.target === nodeId) {
          edgesByVariable[edge.targetHandle] = edge;
        }
      });

      // Only keep edges whose variables still exist
      const updatedEdges = get().edges.filter(edge => {
        if (edge.target === nodeId) {
          return newVars.includes(edge.targetHandle);
        }
        return true;
      });

      set({
        edges: updatedEdges,
        nodes: get().nodes.map(node => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                text: newText,
                onTextChange: get().onTextNodeChange
              }
            };
          }
          return node;
        })
      });
    }
  }));
