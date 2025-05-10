import * as Flow from "@xyflow/react";
import { MapNode } from "@gillianplatform/sedap-types";
import React from "react";

export type Size = {
  width: number;
  height: number;
};

export type Selected = "primary" | "secondary" | undefined;

export type NodePrev = {
  id: string;
  case?: unknown;
};

export type FlowNodeData = {
  node?: MapNode;
  prev?: NodePrev;
};

export type NodeComponentProps = Flow.NodeProps & {
  data: FlowNodeData;
};

export type NodeComponent<P = unknown> = React.FC<NodeComponentProps & P> & {
  baseSize: Size;
};

export type ComponentOverrideProps = React.HTMLAttributes<HTMLElement>;
export type OverrideComponent = React.ComponentType<ComponentOverrideProps>;

export type ButtonOverrideProps = ComponentOverrideProps & {
  disabled?: boolean;
};
export type ButtonOverrideComponent = React.ComponentType<ButtonOverrideProps>;

export type ComponentOverrides = {
  expandButton?: ButtonOverrideComponent;
  zoomButton?: ButtonOverrideComponent;
  stepButton?: ButtonOverrideComponent;
  selectNodeButton?: ButtonOverrideComponent;
  button?: ButtonOverrideComponent;
  badge?: OverrideComponent;
};
