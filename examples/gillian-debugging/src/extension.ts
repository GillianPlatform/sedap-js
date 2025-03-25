import * as vscode from "vscode";
import { activateDebug } from "./debug";
import { activateLsp, deactivateLSP } from "./lsp";

export function activate(context: vscode.ExtensionContext) {
  activateDebug(context);
  activateLsp(context);
}

export function deactivate() {
  deactivateLSP();
}
