import styled from "styled-components";
import { NodeComponent, NodeComponentProps } from "../../types";
import NodeBase_ from "./NodeBase";
import NodeBox from "./util/NodeBox";
import { isNodeExpanded } from "./util/node";
import { useContext } from "react";
import TraceViewContext from "../TraceView/TraceViewContext";

const baseWidth = 150;
const baseHeight = 50;
const baseSize = {
  width: baseWidth,
  height: baseHeight,
};

type ExtraProps = {
  msg?: string;
};

const NodeBase = styled(NodeBase_)`
  justify-content: flex-start;
`;

const TraceViewFallbackNode = (props: NodeComponentProps & ExtraProps) => {
  const { msg: msg_, data, id } = props;
  const { expandedNodes } = useContext(TraceViewContext);

  let msg: string;
  if (msg_) {
    msg = msg_;
  } else if (data.node) {
    if (data.node.options?.kind === "custom") {
      msg = `Unhandled custom node type '${data.node.options.customKind}'`;
    } else {
      msg = "I'm confused!";
    }
  } else {
    msg = "No node!";
  }

  console.error(`[${id}] ${msg}`, props);
  return (
    <NodeBase nodeKind="fallback" targetHandle sourceHandle>
      <NodeBox baseHeight={baseHeight} expanded={isNodeExpanded(data.node, expandedNodes)}>
        [{id}]<i>{msg}</i>
      </NodeBox>
    </NodeBase>
  );
};

export default (() => {
  const f = TraceViewFallbackNode as NodeComponent<ExtraProps>;
  f.baseSize = baseSize;
  return f;
})();
