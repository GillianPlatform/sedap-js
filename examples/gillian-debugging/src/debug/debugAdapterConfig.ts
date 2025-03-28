/** Configures and registers Gillian's debug adapter with VSCode. */

import * as vscode from "vscode";
import {
  DebugConfiguration,
  Disposable,
  ProviderResult,
  WebviewOptions,
  WebviewPanelOptions,
  WorkspaceFolder,
} from "vscode";
import { DEBUG_TYPE } from "../util/consts";
import { defaultWebviewOptions, SEDAPSession } from "@gillianplatform/sedap-vscode-ext";
import { getWebviewHtml, getWebviewResourceRoot } from "./webviewHtml";
import { DebugAdapterExecutableFactory } from "./debugAdapter";

type LogEvent = {
  msg: string;
  json: Record<string, unknown>;
};

const sessions: Record<string, SEDAPSession> = {};

function handleCustomDebugEvent({ session, body, event }: vscode.DebugSessionCustomEvent) {
  if (session.type === DEBUG_TYPE && event === "log") {
    const { msg, json } = body as LogEvent;
    if (Object.keys(json).length === 0) {
      console.log(`<D> ${msg}`);
    } else {
      console.log(`<D> ${msg}`, json);
    }
  }
  console.log("Custom debug event", { session, body, event });
}

export function activateDebugAdapter(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.debug.onDidStartDebugSession((session) => {
      if (session.type !== DEBUG_TYPE) {
        return;
      }
      const panelIcon = vscode.Uri.joinPath(context.extensionUri, "gillian.svg");
      const webviewOptions: WebviewPanelOptions & WebviewOptions = {
        ...defaultWebviewOptions,
        localResourceRoots: [getWebviewResourceRoot(context)],
      };
      const sedapSession = new SEDAPSession({
        panelName: "Gillian Debugging",
        panelIcon,
        session,
        getWebviewHtml: getWebviewHtml(context),
        webviewOptions,
      });
      sessions[session.id] = sedapSession;
      sedapSession.showWebviewPanel();
      sedapSession.onDispose(() => {
        delete sessions[session.id];
      });
    }),
    vscode.commands.registerCommand("extension.gillian-debug.showDebuggerWebview", () => {
      Object.values(sessions).forEach((s) => s.showWebviewPanel());
    }),
    vscode.debug.onDidReceiveDebugSessionCustomEvent(handleCustomDebugEvent),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.gillian-debug.getProgramName", () => {
      return vscode.window.showInputBox({
        placeHolder: "Please enter the name of a file",
      });
    }),
  );

  // register a configuration provider for our debug type
  const provider = new ConfigurationProvider();
  const factory = new DebugAdapterExecutableFactory();
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider(DEBUG_TYPE, provider),
    vscode.debug.registerDebugAdapterDescriptorFactory(DEBUG_TYPE, factory),
    ...("dispose" in factory ? [factory as Disposable] : []),
  );
}

class ConfigurationProvider implements vscode.DebugConfigurationProvider {
  /**
   * Massage a debug configuration just before a debug session is being launched,
   * e.g. add all missing attributes to the debug configuration.
   */
  resolveDebugConfiguration(
    _: WorkspaceFolder | undefined,
    config: DebugConfiguration,
  ): ProviderResult<DebugConfiguration> {
    // if launch.json is missing or empty
    if (!config.type && !config.request && !config.name) {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        config.type = DEBUG_TYPE;
        config.name = "Launch";
        config.request = "launch";
        config.program = "${file}";
        config.stopOnEntry = true;
      }
    }

    if (!config.program) {
      return vscode.window.showInformationMessage("Cannot find a program to debug").then(() => {
        return undefined; // abort launch
      });
    }

    return config;
  }
}
