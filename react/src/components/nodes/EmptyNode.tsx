import styled from "styled-components";
import { NodeComponent, NodeComponentProps } from "../../types";
import NodeBase_ from "./NodeBase";
import { VscPlay } from "react-icons/vsc";
import NodeBox from "./util/NodeBox";
import CenterButton from "./util/CenterButton";
import TraceViewContext from "../TraceView/TraceViewContext";
import { useCallback, useContext } from "react";

export const DEFAULT_SIZE = {
  width: 50,
  height: 50,
};

const NodeBase = styled(NodeBase_)`
  border-radius: 100%;
`;

const RoundButton = styled(CenterButton)`
  border-radius: 100%;
  aspect-ratio: 1;
`;

const TraceViewEmptyNode = ({ data }: NodeComponentProps) => {
  const { prev } = data;
  const { stepNext } = useContext(TraceViewContext);

  const onStepButtonClick = useCallback(() => {
    if (prev) {
      stepNext(prev);
    }
  }, [prev, stepNext]);

  const { componentOverrides } = useContext(TraceViewContext);
  const Button = componentOverrides.stepButton || componentOverrides.button || RoundButton;
  return (
    <NodeBase nodeKind="empty" targetHandle={!!prev}>
      <NodeBox>
        <Button onClick={onStepButtonClick} className="sedap__stepButton">
          <VscPlay />
        </Button>
      </NodeBox>
    </NodeBase>
  );
};

export default (() => {
  const f = TraceViewEmptyNode as unknown as NodeComponent;
  f.baseSize = DEFAULT_SIZE;
  return f;
})();
