import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from "@xyflow/react";
import * as Flow from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import computeLayout from "./layout";
import builtinNodeKinds from "../nodes";
import TraceViewContext from "./TraceViewContext";
import { Set } from "immutable";
import Box from "../nodes/util/Box";
import {
  DEFAULT_CUSTOM_NODE_KINDS,
  DEFAULT_LAYOUT_OPTIONS,
  DEFAULT_REACT_FLOW_PROPS,
  DEFAULT_SELECTED_NODES,
  TraceViewProps,
} from "./typesAndDefaults";

const TraceView: React.FC<TraceViewProps> = ({
  root,
  nodes,
  children,
  showControls = true,
  showMinimap = true,
  showBackground = true,
  nodeKinds: customNodeKinds = DEFAULT_CUSTOM_NODE_KINDS,
  selectedNodes = DEFAULT_SELECTED_NODES,
  onNodeSelected = () => {},
  onNextStepSelected = () => {},
  onZoomNode = () => {},
  initExpandedNodes = [],
  componentOverrides = {},
  layoutOptions = DEFAULT_LAYOUT_OPTIONS,
  reactFlowProps = DEFAULT_REACT_FLOW_PROPS,
  nodeTooltips = false,
}: TraceViewProps) => {
  const [rfNodes, setRfNodes] = useState<Flow.Node[]>([]);
  const [rfEdges, setRfEdges] = useState<Flow.Edge[]>([]);
  const [busy, setBusy] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(Set(initExpandedNodes));

  const nodeTypes = useMemo(
    () => ({
      ...builtinNodeKinds,
      ...customNodeKinds,
    }),
    [customNodeKinds],
  );

  useEffect(() => {
    let isActive = true;
    setBusy(true);
    computeLayout(root, nodes, nodeTypes, expandedNodes, layoutOptions).then(
      ([placedNodes, placedEdges]) => {
        if (isActive) {
          setRfNodes(placedNodes);
          setRfEdges(placedEdges);
          setBusy(false);
        }
      },
    );
    return () => {
      isActive = false;
    };
  }, [root, nodes, nodeTypes, expandedNodes, layoutOptions]);

  const onNodesChange = useCallback(
    (changes: Flow.NodeChange<Flow.Node>[]) => {
      setRfNodes((oldNodes) => applyNodeChanges(changes, oldNodes));
    },
    [setRfNodes],
  );

  const controls = showControls ? <Controls showInteractive={false} /> : undefined;
  const minimap = showMinimap ? <MiniMap pannable /> : undefined;
  const background = showBackground ? (
    <Background variant={BackgroundVariant.Dots} gap={10} size={1} />
  ) : undefined;

  const setNodeExpanded = (nodeId: string, expanded: boolean) => {
    if (expanded) {
      setExpandedNodes(expandedNodes.add(nodeId));
    } else {
      setExpandedNodes(expandedNodes.remove(nodeId));
    }
  };

  const context = {
    root,
    busy,
    selectedNodes,
    expandedNodes,
    setNodeExpanded,
    selectNode: onNodeSelected,
    stepNext: onNextStepSelected,
    zoomNode: onZoomNode,
    componentOverrides,
    nodeTooltips,
  };

  return (
    <Box>
      <TraceViewContext.Provider value={context}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          {...reactFlowProps}
        >
          {controls}
          {minimap}
          {background}
          {children}
        </ReactFlow>
      </TraceViewContext.Provider>
    </Box>
  );
};

export default TraceView;
