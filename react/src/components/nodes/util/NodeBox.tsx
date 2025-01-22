import styled from "styled-components";
import Box_ from "./Box";

type NodeBoxProps = {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  expanded?: boolean;
  baseHeight?: number;
};

const Box = styled(Box_)<{ $expanded: boolean; $height?: number }>`
  ${(props) => (props.$expanded ? "border-bottom: 1px solid black;" : "")}
  ${(props) => (props.$height ? `height: ${props.$height}px;` : "")}
`;

const NodeBox: React.FC<NodeBoxProps> = ({
  style = {},
  className: className_,
  children,
  expanded = false,
  baseHeight,
}) => {
  let className = "sedap__node";
  if (className_) className += ` ${className_}`;

  const height = baseHeight === undefined ? undefined : baseHeight - 1;

  return (
    <Box className={className} style={style} $expanded={expanded} $height={height}>
      {children}
    </Box>
  );
};

export default NodeBox;
