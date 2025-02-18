import { ExtensionContext } from "vscode";
import { activateDebugAdapter } from "./debugAdapterConfig";
import { activateCodeLens } from "./debugCodeLens";

export function activateDebug(context: ExtensionContext) {
  activateDebugAdapter(context);
  activateCodeLens(context);
}

export { startDebugging } from "./startDebugging";
