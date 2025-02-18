import * as vscode from "vscode";
import { activateDebug } from "./debug";

export function activate(context: vscode.ExtensionContext) {
  activateDebug(context);
}

export function deactivate() {
  // nothing to do
}
