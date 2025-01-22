import { Fragment } from "react";
import { MapNodeExtra } from "@sedap/types";
import renderExtras from "./renderExtras";
import styled from "styled-components";

type NodeItemsProps = {
  items?: Record<string, React.ReactNode>;
  extras?: MapNodeExtra[];
};

const NodeItemRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.25em;
`;

const NodeItems: React.FC<NodeItemsProps> = ({ items = {}, extras = [] }) => {
  const filteredItems = Object.entries(items).filter(([, v]) => v);
  const renderedExtras = renderExtras(extras).map((e, i) => [`extra-${i}`, e] as const);
  const allItems = [...renderedExtras, ...filteredItems];
  if (allItems.length === 0) return null;
  return (
    <NodeItemRow>
      {allItems.map(([key, item]) => (
        <Fragment key={key}>{item}</Fragment>
      ))}
    </NodeItemRow>
  );
};

export default NodeItems;
