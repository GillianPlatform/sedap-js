import { Handle, Position } from "@xyflow/react";
import { ReactNode } from "react";
import styled from "styled-components";
import { Selected } from "../../types";

export type TraceViewNodeBaseProps = {
  selected?: Selected;
  nodeKind: string;
  targetHandle?: boolean;
  sourceHandle?: boolean;
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
  children,
  style = {},
  className: className_,
}: TraceViewNodeBaseProps) => {
  let className = "sedap__nodeWrap";
  if (className_) className += ` ${className_}`;

  return (
    <>
      {targetHandle && <Handle type="target" position={Position.Top} isConnectable={false} />}
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
