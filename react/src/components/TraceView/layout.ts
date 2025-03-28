import * as Flow from "@xyflow/react";
import ELK, { ElkExtendedEdge, ElkNode, LayoutOptions } from "elkjs";
import { MapNode } from "@gillianplatform/sedap-types";
import { NodeComponent, FlowNodeData, NodePrev } from "../../types";
import { Set } from "immutable";

type Nodes = {
  [k: string]: MapNode;
};

type Elem = {
  id: string;
  prev?: NodePrev | undefined;
  edgeLabel?: string;
  layer: number;
  ixInLayer: number;
  isEmpty: boolean;
};

const elk = new ELK();

interface ElkNodeExt extends ElkNode {
  children?: ElkNodeExt[];
  edges?: ElkEdgeExt[];
  zIndex?: number;
  type: string;
  data: FlowNodeData;
}
interface ElkEdgeExt extends ElkExtendedEdge {
  zIndex?: number;
  label?: string;
}

export default async function computeLayout(
  root: string,
  nodes: Nodes,
  nodeKinds: Record<string, NodeComponent>,
  expandedNodes: Set<string>,
  layoutOptions: LayoutOptions,
): Promise<[Flow.Node[], Flow.Edge[]]> {
  function structureNodesAndEdges(firstId: string, parents: string[] = []): ElkNodeExt {
    const submapDepth = parents.length;
    const children: ElkNodeExt[] = [];
    const edges: ElkEdgeExt[] = [];
    const layerCounts: number[] = [];
    const ixInLayer = (layer: number) => {
      const ix = layerCounts[layer] || 0;
      layerCounts[layer] = ix + 1;
      return ix;
    };

    const getNodeId = (id: string) => `N_${parents.join("_")}_${id}`;
    const getEdgeId = (ix: number, prev: NodePrev) => `E_${prev.id}_#${ix}`;

    const push = (
      nextId: string | null,
      prev: NodePrev,
      currentLayer: number,
      edgeLabel?: string | undefined,
      edgeIx: number = 0,
    ): string => {
      let isEmpty = false;
      let nextNodeId = nextId;
      if (!nextNodeId) {
        nextNodeId = `${prev.id}_emp${edgeLabel === undefined ? "" : "_" + edgeLabel}`;
        isEmpty = true;
      }
      const layer = currentLayer + 1;
      queue.push({
        id: nextNodeId,
        prev,
        edgeLabel,
        layer,
        ixInLayer: ixInLayer(layer),
        isEmpty,
      });
      edges.push({
        id: getEdgeId(edgeIx, prev),
        sources: [getNodeId(prev.id)],
        targets: [getNodeId(nextNodeId)],
        zIndex: submapDepth,
        label: edgeLabel,
      });
      return nextNodeId as string;
    };

    const queue: Elem[] = [{ id: firstId, layer: 0, ixInLayer: 0, isEmpty: false }];

    while (queue.length > 0) {
      const { id, prev, layer, ixInLayer, isEmpty } = queue.shift()!;
      const node = isEmpty ? undefined : nodes[id];
      const subChildren: ElkNodeExt[] = [];
      const subEdges: ElkEdgeExt[] = [];
      let nodeKind = "empty";
      if (node) {
        switch (node.next.kind) {
          case "single":
            push(node.next.id, { id }, layer);
            break;
          case "branch": {
            const { cases } = node.next;
            for (let i = 0; i < cases.length; i++) {
              const branch = cases[i];
              push(branch.id, { id, case: branch.branchCase }, layer, branch.branchLabel, i);
            }
            break;
          }
          case "final":
            break;
        }

        const submaps = (expandedNodes.has(id) && node.submaps) || [];
        for (const submapId of submaps) {
          const subgraph = structureNodesAndEdges(submapId, [...parents, id]);
          subChildren.push(...(subgraph.children || []));
          subEdges.push(...(subgraph.edges || []));
        }

        const kind = node.options.kind === "custom" ? node.options.customKind : node.options.kind;
        nodeKind = nodeKinds[kind] ? kind : "fallback";
      }

      children.push({
        id: getNodeId(id),
        data: { node, prev },
        children: subChildren,
        edges: subEdges,
        type: nodeKind,
        ...nodeKinds[nodeKind].baseSize,
        zIndex: submapDepth,
        layoutOptions: {
          "elk.position": `(${ixInLayer}, 0)`,
        },
      });
    }

    return {
      id: "root",
      children,
      edges,
      type: "",
      data: {},
      layoutOptions: {
        "elk.padding": "[top=0,left=0,bottom=0,right=0]",
      },
    };
  }

  function flattenGraph(
    graph: ElkNodeExt,
    parentX: number = 0,
    parentY: number = 0,
  ): [Flow.Node[], Flow.Edge[]] {
    const nodes: Flow.Node[] = [];
    const edges: Flow.Edge[] = [];
    for (const edge of graph.edges || []) {
      edges.push({
        ...edge,
        source: edge.sources[0],
        target: edge.targets[0],
      });
    }
    for (const node of graph.children || []) {
      const x = node.x! + parentX;
      const y = node.y! + parentY;
      nodes.push({
        ...node,
        position: { x, y },
      });
      const [childNodes, childEdges] = flattenGraph(node, x, y);
      nodes.push(...childNodes);
      edges.push(...childEdges);
    }
    return [nodes, edges];
  }

  const graph = structureNodesAndEdges(root);
  const layoutedGraph = (await elk.layout(graph, {
    layoutOptions,
  })) as ElkNodeExt;
  const [layoutedNodes, layoutedEdges] = flattenGraph(layoutedGraph);
  console.log({ graph, layoutedGraph, layoutedNodes, layoutedEdges });
  return [layoutedNodes, layoutedEdges];
}
