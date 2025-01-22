import { Set } from "immutable";
import { MapNode } from "@sedap/types";

export const isNodeExpandable = (node?: MapNode) => node && node.submaps && node.submaps.length > 0;

export const isNodeExpanded = (node: MapNode | undefined, expandedNodes: Set<string>) =>
  node && isNodeExpandable(node) && expandedNodes.has(node.id);
