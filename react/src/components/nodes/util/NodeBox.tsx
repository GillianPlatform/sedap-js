import styled from "styled-components";
import Box_ from "./Box";
import React, { HTMLAttributes } from "react";

type NodeBoxProps = {
  expanded?: boolean;
  baseHeight?: number;
} & HTMLAttributes<HTMLDivElement>;

const Box = styled(Box_)<{ $expanded: boolean; $height?: number }>`
  ${(props) => (props.$height ? `height: ${props.$height}px;` : "")}
  ${(props) => (props.$expanded ? "@layer { border-bottom: 1px solid black; }" : "")}
  pointer-events: all;
  cursor: grab;
`;

const NodeBox: React.FC<NodeBoxProps> = ({
  className: className_,
  expanded = false,
  baseHeight,
  ...props
}) => {
  let className = "sedap__node";
  if (className_) className += ` ${className_}`;

  const height = baseHeight === undefined ? undefined : baseHeight - 1;

  return <Box className={className} $expanded={expanded} $height={height} {...props} />;
};

export default NodeBox;
