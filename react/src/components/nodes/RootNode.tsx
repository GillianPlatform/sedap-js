import styled from "styled-components";
import { NodeComponent, NodeComponentProps } from "../../types";
import TraceViewFallbackNode from "./FallbackNode";
import NodeBase_ from "./NodeBase";
import NodeItems from "./util/NodeItems";
import CenterButton from "./util/CenterButton";
import { VscZoomIn } from "react-icons/vsc";
import { useContext } from "react";
import TraceViewContext from "../TraceView/TraceViewContext";
import NodeBox from "./util/NodeBox";

const DEFAULT_SIZE = {
  width: 150,
  height: 50,
};

const NodeBase = styled(NodeBase_)`
  border-width: 3px;
  border-style: double;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25em;
  flex-direction: row;
  font-size: 1.1em;
  font-weight: bold;
`;

const Subtitle = styled.div`
  font-style: italic;
  font-size: 0.8em;
`;

const TraceViewRootNode = (props: NodeComponentProps) => {
  const { root, zoomNode, componentOverrides } = useContext(TraceViewContext);
  const { data } = props;
  const { node } = data;
  const options = node?.options;
  if (node === undefined || options?.kind !== "root") {
    console.error("Invalid root node!", props);
    return <TraceViewFallbackNode {...props} />;
  }
  const { title, subtitle, extras } = options;
  const zoomButton =
    root !== node.id &&
    (() => {
      const Button = componentOverrides.zoomButton || componentOverrides.button || CenterButton;
      return (
        <Button
          onClick={() => zoomNode(node.id, `${title} (${node.id})`)}
          className="sedap__zoomNodeButton"
        >
          <VscZoomIn />
        </Button>
      );
    })();

  return (
    <NodeBase nodeKind="root" sourceHandle>
      <NodeBox>
        <Title>
          <span>{title}</span>
          {zoomButton}
        </Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        <NodeItems {...{ extras }} />
      </NodeBox>
    </NodeBase>
  );
};

export default (() => {
  const f = TraceViewRootNode as NodeComponent;
  f.baseSize = DEFAULT_SIZE;
  return f;
})();
