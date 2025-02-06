import { MapNode, MapRoot, MapUpdateEventBody } from "@sedap/types";
import { debuggerCommand, useVSCode } from "./vscode";
import { useCallback, useEffect, useState } from "react";
import { NodePrev } from "@sedap/react";
import { MessageToWebview } from "@sedap/vscode-types";

export type Nodes = {
  [k: string]: MapNode;
};

export type Roots = MapRoot[];

export type CurrentSteps = NonNullable<MapUpdateEventBody["currentSteps"]>;

export type MapState<T> = {
  roots: Roots;
  nodes: Nodes;
  selectedNodes: CurrentSteps;
  onNodeSelected: (id: string) => void;
  onNextStepSelected: (prev: NodePrev) => void;
  ext: T | undefined;
};

const DEFAULT_SELECTED_NODES: CurrentSteps = { primary: [], secondary: [] };

export function useSEDAPMap<T = unknown>(): MapState<T> {
  const [initCommandSent, setInitCommandSent] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const [nodes, setNodes] = useState<Nodes>({});
  const [roots, setRoots] = useState<Roots>([]);
  const [selectedNodes, setSelectedNodes] = useState(DEFAULT_SELECTED_NODES);
  const [ext, setExt] = useState<T | undefined>(undefined);

  const handleMapUpdate = useCallback(
    (body: MapUpdateEventBody) => {
      if (!initialised && !body.reset) {
        return;
      }
      setRoots(body.roots || []);
      setSelectedNodes(body.currentSteps || DEFAULT_SELECTED_NODES);
      const newNodes = body.reset ? {} : { ...nodes };
      Object.entries(body.nodes || {}).forEach(([id, node]) => {
        if (node === null) {
          delete newNodes[id];
        } else {
          newNodes[id] = node;
        }
      });
      setNodes(newNodes);
      setExt(body.ext as T | undefined);
      console.log("State updated", body);
    },
    [initialised, nodes],
  );

  const onMessageReceived = (message: MessageToWebview) => {
    if (message && message.type === "debuggerEvent") {
      const body = message.body;
      if (body.event === "mapUpdate") {
        handleMapUpdate(body.body);
      }
    }
  };
  useVSCode(onMessageReceived);

  useEffect(() => {
    if (!initCommandSent) {
      debuggerCommand("getFullMap", {}).then((result) => {
        console.log("RESULT!", { result });
        handleMapUpdate(result);
        setInitialised(true);
      });
      setInitCommandSent(true);
    }
  }, [initCommandSent, handleMapUpdate]);

  const onNodeSelected = (stepId: string) => {
    debuggerCommand("jump", { stepId });
  };

  const onNextStepSelected = (prev: NodePrev) => {
    debuggerCommand("stepSpecific", { stepId: prev.id, branchCase: prev.case });
  };

  return { nodes, roots, selectedNodes, onNodeSelected, onNextStepSelected, ext };
}
