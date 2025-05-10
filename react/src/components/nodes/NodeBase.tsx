import { Handle, Position } from "@xyflow/react";
import { ReactNode } from "react";
import styled from "styled-components";
import { Selected } from "../../types";
import Tooltip from "./util/Tooltip";

export type TraceViewNodeBaseProps = {
  selected?: Selected;
  nodeKind: string;
  targetHandle?: boolean;
  sourceHandle?: boolean;
  tooltip?: ReactNode | undefined;
  tooltipVisible?: boolean;
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

const Wrap = styled.div`
  @layer {
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: black;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    pointer-events: none;
  }
`;

const TraceViewNodeBase = ({
  selected,
  nodeKind,
  targetHandle = false,
  sourceHandle = false,
  tooltip,
  tooltipVisible = false,
  children,
  style = {},
  className: className_,
}: TraceViewNodeBaseProps) => {
  let className = "sedap__nodeWrap";
  if (className_) className += ` ${className_}`;

  let tooltipNode: ReactNode | undefined;
  if (tooltip) {
    tooltipNode = <Tooltip visible={tooltipVisible}>{tooltip}</Tooltip>;
  }

  return (
    <>
      {targetHandle && <Handle type="target" position={Position.Top} isConnectable={false} />}
      {tooltipNode}
      <Wrap
        data-sedap-node-kind={nodeKind}
        {...{
          className,
          style,
          ...(selected ? { "data-sedap-node-selected": selected } : {}),
        }}
      >
        {children}
      </Wrap>
      {sourceHandle && <Handle type="source" position={Position.Bottom} isConnectable={false} />}
    </>
  );
};

export default TraceViewNodeBase;
