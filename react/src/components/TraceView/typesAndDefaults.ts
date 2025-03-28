import { ReactFlowProps } from "@xyflow/react";
import { LayoutOptions } from "elkjs";
import { ReactNode } from "react";
import { ComponentOverrides, NodeComponent, NodePrev, Size } from "../../types";
import { MapNode, MapUpdateEventBody } from "@gillianplatform/sedap-types";

type Nodes = {
  [k: string]: MapNode;
};

export const DEFAULT_LAYOUT_OPTIONS = {
  "elk.algorithm": "layered",
  "elk.edgeRouting": "SPLINES",
  "elk.direction": "DOWN",
  "elk.contentAlignment": "V_TOP H_CENTER",
  "elk.spacing.nodeNode": "30",
  "elk.padding": `[top=70,left=20,bottom=20,right=20]`,
  "elk.layered.compaction.postCompaction.strategy": "LEFT",
  "elk.layered.crossingMinimization.semiInteractive": "true",
};

export const DEFAULT_SELECTED_NODES = {
  primary: [],
  secondary: [],
};

export type TraceViewProps = {
  root: string;
  nodes: Nodes;
  children?: ReactNode;
  showControls?: boolean;
  showMinimap?: boolean;
  showBackground?: boolean;
  nodeSize?: Size;
  emptyNodeSize?: Size;
  nodeKinds?: Record<string, NodeComponent>;
  selectedNodes?: MapUpdateEventBody["currentSteps"];
  onNodeSelected?: (nodeId: string) => void;
  onNextStepSelected?: (prev: NodePrev) => void;
  onZoomNode?: (id: string, name: string) => void;
  initExpandedNodes?: string[];
  componentOverrides?: ComponentOverrides;
  layoutOptions?: LayoutOptions;
  reactFlowProps?: ReactFlowProps;
};

// Declaring as a constant to prevent a re-rendering trap!
// https://stackoverflow.com/questions/71060000/what-is-the-status-of-the-default-props-rerender-trap-in-react
export const DEFAULT_CUSTOM_NODE_KINDS = {};

export const DEFAULT_REACT_FLOW_PROPS: ReactFlowProps = {
  proOptions: { hideAttribution: true },
  nodesDraggable: false,
  nodesConnectable: false,
  nodesFocusable: false,
  edgesFocusable: false,
  elementsSelectable: false,
  edgesReconnectable: false,
  colorMode: "system",
};
