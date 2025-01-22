import * as Flow from "@xyflow/react";
import { MapNode } from "@sedap/types";
import React from "react";

export type Size = {
  width: number;
  height: number;
};

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

export interface ComponentOverrideProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export type OverrideComponent = React.ComponentType<ComponentOverrideProps>;

export interface ButtonOverrideProps extends ComponentOverrideProps {
  disabled?: boolean;
}

export type ButtonOverrideComponent = React.ComponentType<ButtonOverrideProps>;

export type ComponentOverrides = {
  expandButton?: ButtonOverrideComponent;
  zoomButton?: ButtonOverrideComponent;
  stepButton?: ButtonOverrideComponent;
  selectNodeButton?: ButtonOverrideComponent;
  button?: ButtonOverrideComponent;
  badge?: OverrideComponent;
};
