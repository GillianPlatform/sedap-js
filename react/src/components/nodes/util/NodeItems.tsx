import { Fragment } from "react";
import { MapNodeExtra } from "@gillianplatform/sedap-types";
import renderExtras from "./renderExtras";
import Row from "./Row";

type NodeItemsProps = {
  items?: [string, React.ReactNode][];
  extras?: MapNodeExtra[];
};

const NodeItems: React.FC<NodeItemsProps> = ({ items, extras }) => {
  const filteredItems = (items || []).filter(([, v]) => v);
  const renderedExtras = renderExtras(extras || []).map((e, i) => [`extra-${i}`, e] as const);
  const allItems = [...renderedExtras, ...filteredItems];
  if (allItems.length === 0) return null;
  return (
    <Row>
      {allItems.map(([key, item]) => (
        <Fragment key={key}>{item}</Fragment>
      ))}
    </Row>
  );
};

export default NodeItems;
