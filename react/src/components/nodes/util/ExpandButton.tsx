import { Set } from "immutable";
import { MapNode } from "@sedap/types";
import { ComponentOverrides } from "../../../types";
import { VscChevronRight, VscChevronDown } from "react-icons/vsc";
import CenterButton from "./CenterButton";
import { isNodeExpandable, isNodeExpanded } from "./node";

type ExpandButtonProps = {
  expandedNodes: Set<string>;
  node: MapNode;
  setNodeExpanded: (nodeId: string, expanded: boolean) => void;
  enabled: boolean;
  componentOverrides: ComponentOverrides;
};

const ExpandButton: React.FC<ExpandButtonProps> = ({
  expandedNodes,
  node,
  setNodeExpanded,
  enabled,
  componentOverrides,
}) => {
  if (!isNodeExpandable(node)) return null;
  const expanded = isNodeExpanded(node, expandedNodes);
  const Button = componentOverrides.expandButton || componentOverrides.button || CenterButton;
  return (
    <Button
      disabled={!enabled}
      onClick={() => setNodeExpanded(node.id, !expanded)}
      className="sedap__expandNodeButton"
    >
      {expanded ? <VscChevronDown /> : <VscChevronRight />}
    </Button>
  );
};

export default ExpandButton;
