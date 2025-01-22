import { NodeComponent, NodeComponentProps } from "../../types";
import TraceViewFallbackNode from "./FallbackNode";
import { ReactNode, useContext } from "react";
import NodeBase_ from "./NodeBase";
import { VscTarget } from "react-icons/vsc";
import ExpandButton from "./util/ExpandButton";
import TraceViewContext from "../TraceView/TraceViewContext";
import NodeItems from "./util/NodeItems";
import CenterButton from "./util/CenterButton";
import styled from "styled-components";
import NodeBox from "./util/NodeBox";
import { isNodeExpanded } from "./util/node";

const baseWidth = 150;
const baseHeight = 50;
const baseSize = { width: baseWidth, height: baseHeight };

const NodeBase = styled(NodeBase_)`
  justify-content: flex-start;
`;

const TraceViewBasicNode = (props: NodeComponentProps) => {
  const { busy, selectedNodes, selectNode, expandedNodes, setNodeExpanded, componentOverrides } =
    useContext(TraceViewContext);

  const { data } = props;
  const { node } = data;
  const options = node?.options;
  if (!node || options?.kind !== "basic") {
    console.error("Invalid basic node!", props);
    return <TraceViewFallbackNode {...props} />;
  }

  const { display, selectable = true, extras } = options;

  let selected = false;
  for (const id of [node.id, ...(node.aliases || [])]) {
    if (selectedNodes.includes(id)) {
      selected = true;
      break;
    }
  }

  const hasSourceHandle = (() => {
    switch (node.next.kind) {
      case "single":
      case "branch":
        return true;
      case "final":
        return false;
    }
  })();

  const items: Record<string, ReactNode> = {};
  if (selectable) {
    const Button = componentOverrides.selectNodeButton || componentOverrides.button || CenterButton;
    const selectButton = (
      <Button
        disabled={busy || selected}
        onClick={() => selectNode(node.id)}
        className="sedap__selectNodeButton"
      >
        <VscTarget />
      </Button>
    );
    items.selectButton = selectButton;
  }
  items.expandButton = ExpandButton({
    enabled: !busy,
    expandedNodes,
    setNodeExpanded,
    node,
    componentOverrides,
  }) as ReactNode;

  return (
    <NodeBase nodeKind="basic" selected={selected} targetHandle sourceHandle={hasSourceHandle}>
      <NodeBox baseHeight={baseHeight} expanded={isNodeExpanded(node, expandedNodes)}>
        <span className="sedap__nodeText">{display}</span>
        <NodeItems {...{ items, extras }} />
      </NodeBox>
    </NodeBase>
  );
};

export default (() => {
  const f = TraceViewBasicNode as unknown as NodeComponent;
  f.baseSize = baseSize;
  return f;
})();
