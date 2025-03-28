import { NodePrev, TraceView, TraceViewProps } from "@gillianplatform/sedap-react";
import IconButton from "./IconButton";
import Badge from "./Badge";
import styled from "styled-components";
import Sidebar, { Subst } from "./Sidebar";
import { CurrentSteps, Nodes } from "@gillianplatform/sedap-vscode-ui";

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  @media (max-width: 500px) {
    flex-direction: column;
  }
`;
const MapWrap = styled.div`
  flex-grow: 4;
`;

export type MapViewProps = {
  root: string;
  nodes: Nodes;
  substs: Subst[];
  selectedNodes: CurrentSteps;
  onNodeSelected: (id: string) => void;
  onNextStepSelected: (prev: NodePrev) => void;
  onZoomNode: (id: string, name: string) => void;
};

function MapView({
  root,
  nodes,
  substs,
  selectedNodes,
  onNodeSelected,
  onNextStepSelected,
  onZoomNode,
}: MapViewProps) {
  const traceViewProps: TraceViewProps = {
    root,
    nodes,
    selectedNodes,
    onNodeSelected,
    onNextStepSelected,
    onZoomNode,
    componentOverrides: {
      button: IconButton,
      badge: Badge,
    },
  };

  return (
    <Wrap>
      <MapWrap>
        <TraceView {...traceViewProps} />
      </MapWrap>
      <Sidebar {...{ substs, selectedNodes: selectedNodes.primary || [], onNodeSelected }} />
    </Wrap>
  );
}

export default MapView;
