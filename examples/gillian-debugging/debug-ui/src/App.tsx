import "./App.css";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { MapState, useSEDAPMap } from "@gillianplatform/sedap-vscode-ui";
import { TraceViewProps } from "@gillianplatform/sedap-react";
import MapView from "./components/MapView";
import { Subst } from "./components/Sidebar";
import Tabs, { Tab } from "./components/Tabs";
import { MapRoot } from "@gillianplatform/sedap-types";

type Ext = {
  substs: Record<string, Subst[] | undefined>;
};

type DerivedRoots = Record<string, Record<string, string>>;

type OnZoom = (parent: string) => NonNullable<TraceViewProps["onZoomNode"]>;

const EmptyTabWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function isEmpty(obj: Record<string, unknown>) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
}

const renderMapTab = (
  id: string,
  name_: string,
  onZoom: OnZoom,
  mapState: MapState<Ext>,
  onClose_?: (id: string) => void,
  parentRoot?: MapRoot,
): Tab => {
  const rootId = parentRoot?.id || id;
  const name = parentRoot ? `${parentRoot.name} > ${name_}` : name_;
  const { nodes, selectedNodes, onNodeSelected, onNextStepSelected, ext } = mapState;
  const substs = (ext && ext.substs && ext.substs[rootId]) || [];
  const mapViewProps = {
    nodes,
    substs,
    selectedNodes,
    onNodeSelected,
    onNextStepSelected,
    onZoomNode: onZoom(rootId),
  };
  const content = (
    <MapView
      {...{
        ...mapViewProps,
        root: id,
      }}
    />
  );
  const onClose = onClose_ ? () => onClose_(id) : undefined;
  return {
    id,
    name,
    content,
    onClose,
  };
};

function App() {
  const mapState = useSEDAPMap<Ext>();
  const { roots, nodes } = mapState;
  const [activeTab, setActiveTab] = useState<string | undefined>();
  const [derivedRoots, setDerivedRoots] = useState<DerivedRoots>({});

  useEffect(() => {
    let modified = false;
    const newDerivedRoots = { ...derivedRoots };
    const rootIds = roots.map(({ id }) => id);
    for (const parent of Object.keys(derivedRoots)) {
      if (!rootIds.includes(parent)) {
        delete newDerivedRoots[parent];
        modified = true;
      }
    }
    if (modified) {
      setDerivedRoots(newDerivedRoots);
    }
  }, [roots, derivedRoots]);

  useEffect(() => {
    if (roots.length === 0) {
      setActiveTab(undefined);
      return;
    }
    let tabExists = false;
    if (activeTab !== undefined) {
      for (const { id } of roots) {
        if (id === activeTab || derivedRoots[id][activeTab]) {
          tabExists = true;
          break;
        }
      }
    }
    if (!tabExists) {
      setActiveTab(roots[0].id);
    }
  }, [roots, activeTab, derivedRoots]);

  const onZoomNode = useCallback(
    (parent: string) => (childRoot: string, childName: string) => {
      setDerivedRoots({
        ...derivedRoots,
        [parent]: {
          ...derivedRoots[parent],
          [childRoot]: childName,
        },
      });
      setActiveTab(childRoot);
    },
    [derivedRoots],
  );

  const onTabClose = useCallback(
    (parent: string) => (childRoot: string) => {
      const newRoots = { ...derivedRoots[parent] };
      delete newRoots[childRoot];
      setDerivedRoots({
        ...derivedRoots,
        [parent]: newRoots,
      });
    },
    [derivedRoots],
  );

  if (roots.length === 0 || isEmpty(nodes)) {
    return (
      <b>
        <i>Empty map!</i>
      </b>
    );
  }

  const tabs: Tab[] = [];
  for (const { id: rootId, name: rootName } of roots) {
    const tab = renderMapTab(rootId, rootName, onZoomNode, mapState);
    tabs.push(tab);

    for (const [derivedId, derivedName] of Object.entries(derivedRoots[rootId] || {})) {
      const tab = renderMapTab(derivedId, derivedName, onZoomNode, mapState, onTabClose(rootId), {
        id: rootId,
        name: rootName,
      });
      tabs.push(tab);
    }
  }

  return (
    <Tabs activeId={activeTab} tabs={tabs} onChange={setActiveTab}>
      <EmptyTabWrap>
        <span>
          <i>No maps to show.</i>
        </span>
      </EmptyTabWrap>
    </Tabs>
  );
}

export default App;
