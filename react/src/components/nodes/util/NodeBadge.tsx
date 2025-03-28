import styled from "styled-components";
import { MapNodeExtra } from "@gillianplatform/sedap-types";
import Icon from "./Icon";
import { TraceViewContext } from "../../TraceView";
import { useContext } from "react";

type NodeBadgeProps = MapNodeExtra & {
  kind: "badge";
  className?: string;
  style?: React.CSSProperties;
};

const DefaultBadge = styled.div`
  border-radius: 0.5em;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.25em;
  align-items: center;
`;

const Text = styled.span`
  font-size: 0.8em;
`;

const NodeBadge: React.FC<NodeBadgeProps> = ({ text, tag, className: className_, style }) => {
  const { componentOverrides } = useContext(TraceViewContext);
  let className = "sedap__nodeBadge";
  if (className_) className += ` ${className_}`;

  const Badge = componentOverrides.badge || DefaultBadge;

  return (
    <Badge data-sedap-badge-tag={tag} {...{ className, style }}>
      <Wrap>
        <Icon icon={tag} />
        <Text>{text}</Text>
      </Wrap>
    </Badge>
  );
};

export default NodeBadge;
