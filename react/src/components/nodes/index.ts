import BasicNode from "./BasicNode";
import EmptyNode from "./EmptyNode";
import FallbackNode from "./FallbackNode";
import RootNode from "./RootNode";

export { default as BasicNode } from "./BasicNode";
export { default as RootNode } from "./RootNode";
export { default as EmptyNode } from "./EmptyNode";
export { default as FallbackNode } from "./FallbackNode";

export default {
  basic: BasicNode,
  root: RootNode,
  empty: EmptyNode,
  fallback: FallbackNode,
};
