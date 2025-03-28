import { SEDAPCommandArgs, SEDAPCommandResponse, SEDAPCommandType } from "@gillianplatform/sedap-types";
import { useEffect } from "react";
import { WebviewApi } from "vscode-webview";
import { MessageToWebview } from "@gillianplatform/sedap-vscode-types";

type MessageHandler = (message: MessageToWebview) => void;

export const vscodeApi = acquireVsCodeApi();

function onMessage(f: MessageHandler): () => void {
  function callback(event: MessageEvent<MessageToWebview>) {
    f(event.data);
  }
  window.addEventListener("message", callback);
  return () => {
    window.removeEventListener("message", callback);
  };
}

export function useVSCode(messageHandler: MessageHandler): WebviewApi<unknown>["postMessage"] {
  useEffect(() => {
    onMessage(messageHandler);
  });

  return vscodeApi.postMessage;
}

let commandCount = 0;
export function debuggerCommand<T extends SEDAPCommandType>(
  command: T,
  args: SEDAPCommandArgs<T>,
): Promise<SEDAPCommandResponse<T>> {
  return new Promise((resolve) => {
    const commandId = `${commandCount++}`;

    const cancelListener = onMessage((message: MessageToWebview) => {
      if (message && message.type === "debuggerCommandResult") {
        const { body } = message;
        if (body.commandId === commandId) {
          cancelListener();
          resolve(body.result as unknown as SEDAPCommandResponse<T>);
        }
      }
    });

    vscodeApi.postMessage({ type: "debuggerCommand", body: { command, commandId, args } });
  });
}
