import { createContext } from "react";
import { Set } from "immutable";
import { ComponentOverrides, NodePrev } from "../../types";

export type TraceViewContext = {
  root: string;
  busy: boolean;
  selectedNodes: readonly string[];
  selectNode: (nodeId: string) => void;
  stepNext: (prev: NodePrev) => void;
  expandedNodes: Set<string>;
  setNodeExpanded: (nodeId: string, expanded: boolean) => void;
  zoomNode: (nodeId: string) => void;
  componentOverrides: ComponentOverrides;
};

const TraceViewContext = createContext<TraceViewContext>({
  root: "",
  busy: false,
  selectedNodes: [],
  expandedNodes: Set(),
  setNodeExpanded: () => {},
  selectNode: () => {},
  stepNext: () => {},
  zoomNode: () => {},
  componentOverrides: {},
});

export default TraceViewContext;
