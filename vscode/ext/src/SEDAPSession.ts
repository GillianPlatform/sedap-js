import * as vscode from "vscode";
import {
  DebugSession,
  Disposable,
  ViewColumn,
  WebviewOptions,
  WebviewPanel,
  WebviewPanelOptions,
} from "vscode";
import {
  SEDAPCommandArgs,
  SEDAPCommandResponse,
  SEDAPCommandType,
} from "@gillianplatform/sedap-types";
import { MessageFromWebview, MessageToWebview } from "@gillianplatform/sedap-vscode-types";

export type SEDAPSessionPartialProps = {
  panelName?: string;
  panelIcon?: vscode.Uri;
  getWebviewHtml: (panel: WebviewPanel) => string;
  webviewOptions?: WebviewPanelOptions & WebviewOptions;
  webviewShowOptions?: ViewColumn | { viewColumn: ViewColumn; preserveFocus?: boolean };
  showPanel?: boolean;
  log?: boolean;
};

export type SEDAPSessionProps = SEDAPSessionPartialProps & {
  session: DebugSession;
};

export const defaultWebviewOptions: WebviewPanelOptions & WebviewOptions = {
  retainContextWhenHidden: true,
  enableScripts: true,
};

export default class SEDAPSession implements Disposable {
  // #region Fields
  private panelName: string;
  private panelIcon: vscode.Uri | undefined;
  private session: DebugSession;
  private debugType: string;
  private panel: WebviewPanel | undefined;
  private getWebviewHtml: (panel: WebviewPanel) => string;
  private webviewOptions: WebviewPanelOptions & WebviewOptions;
  private webviewShowOptions: ViewColumn | { viewColumn: ViewColumn; preserveFocus?: boolean };
  private disposables: Disposable[] = [];
  private disposed = false;
  private disposeListeners: ((session: SEDAPSession) => void)[] = [];
  private log_ = false;
  // #endregion

  private log(...data: unknown[]) {
    if (this.log_) {
      console.log("SEDAP:", ...data);
    }
  }

  private async cusomDebuggerCommand<T extends SEDAPCommandType>(
    command: T,
    args: SEDAPCommandArgs<T>,
  ): Promise<SEDAPCommandResponse<T>> {
    return await this.session.customRequest(command, args);
  }

  private async sendWebviewMessage<T extends SEDAPCommandType>(
    msg: MessageToWebview<T>,
  ): Promise<boolean> {
    if (!this.panel) {
      return false;
    }
    return this.panel.webview.postMessage(msg);
  }

  private handleCustomEvent(event: string, body: unknown) {
    this.panel?.webview?.postMessage({ type: "debuggerEvent", body: { event, body } });
  }

  private handleWebviewMessage({ type, body }: MessageFromWebview) {
    const panel = this.panel!;
    switch (type) {
      case "setPanelTitle":
        panel.title = body;
        return;
      case "debuggerCommand":
        if (body) {
          const { command, commandId, args } = body;
          if (typeof command === "string") {
            this.cusomDebuggerCommand(command as SEDAPCommandType, args).then((result) => {
              this.sendWebviewMessage({
                type: "debuggerCommandResult",
                body: {
                  commandId: commandId,
                  result,
                },
              });
            });
            return;
          }
        }
        break;
    }
    console.warn("Unknown or invalid webview message:", type, body);
  }

  // #region Webview handling

  public getWebviewPanel(): vscode.WebviewPanel | undefined {
    return this.panel;
  }

  private createWebview() {
    const panel = vscode.window.createWebviewPanel(
      this.debugType,
      this.panelName,
      this.webviewShowOptions,
      this.webviewOptions,
    );

    panel.webview.html = this.getWebviewHtml(panel);
    panel.iconPath = this.panelIcon;

    panel.webview.onDidReceiveMessage((msg) => {
      this.handleWebviewMessage(msg);
    });

    this.panel = panel;
    panel.onDidDispose(() => {
      this.panel = undefined;
    });
  }

  public showWebviewPanel(force: boolean = false) {
    if (!force && vscode.debug.activeDebugSession?.id !== this.session.id) {
      return;
    }
    if (this.panel) {
      this.log("SEDAP: Revealing existing panel", { this: this });
      this.panel.reveal();
    } else {
      this.createWebview();
      this.log("SEDAP: Created webview", { this: this });
    }
  }

  // #endregion

  public getSessionId() {
    return this.session.id;
  }

  public onDispose(listener: (session: SEDAPSession) => void): Disposable {
    this.disposeListeners.push(listener);
    return {
      dispose: () => {
        this.disposeListeners = this.disposeListeners.filter((x) => x !== listener);
      },
    };
  }

  public dispose() {
    if (!this.disposed) {
      this.log("SEDAP: Disposing...", { this: this });
      this.disposables.forEach((x) => x.dispose());
      this.panel?.dispose();
      this.disposeListeners.forEach((f) => f(this));
      this.disposed = true;
    } else {
      this.log("SEDAP: Already disposed!", { this: this });
    }
  }

  public constructor({
    panelName,
    panelIcon,
    session,
    getWebviewHtml,
    webviewOptions = {},
    webviewShowOptions = ViewColumn.Two,
    showPanel = false,
    log = false,
  }: SEDAPSessionProps) {
    this.panelName = panelName || session.name;
    this.panelIcon = panelIcon;
    this.session = session;
    this.debugType = session.type;
    this.webviewOptions = { ...defaultWebviewOptions, ...webviewOptions };
    this.webviewShowOptions = webviewShowOptions;
    this.getWebviewHtml = getWebviewHtml;
    this.log_ = log;

    this.log("SEDAP: Session started", { this: this });

    vscode.debug.onDidReceiveDebugSessionCustomEvent(
      ({ session, event, body }) => {
        if (session.id === this.session.id) {
          this.handleCustomEvent(event, body);
        }
      },
      this,
      this.disposables,
    );

    vscode.debug.onDidTerminateDebugSession(
      (session) => {
        this.log("SEDAP: Session terminated", { this: this, other: session });
        if (session.id === this.session.id) {
          this.dispose();
        }
      },
      this,
      this.disposables,
    );

    if (showPanel) {
      this.showWebviewPanel();
    }
  }

  public static autoAttachIf(
    p: (session: DebugSession) => SEDAPSessionPartialProps | null,
    onSessionCreated: (session: SEDAPSession) => void = () => {},
  ): Disposable {
    return vscode.debug.onDidStartDebugSession((session) => {
      const props = p(session);
      if (props) {
        const sedapSession = new SEDAPSession({ ...props, session });
        onSessionCreated(sedapSession);
      }
    });
  }

  public static autoAttachOnType(
    type: string,
    props: SEDAPSessionPartialProps,
    onSessionCreated: (session: SEDAPSession) => void = () => {},
  ): Disposable {
    return SEDAPSession.autoAttachIf(
      (session) => (session.type === type ? props : null),
      onSessionCreated,
    );
  }
}
