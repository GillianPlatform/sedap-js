import { ExtensionContext, Uri, WebviewPanel } from "vscode";
import { randomUUID } from "crypto";

export const getWebviewResourceRoot = (context: ExtensionContext) => {
  return Uri.joinPath(context.extensionUri, "debug-ui/dist");
};

export const getWebviewHtml =
  (context: ExtensionContext) =>
  ({ webview }: WebviewPanel): string => {
    const nonce = randomUUID();

    const res = getWebviewResourceRoot(context);
    const scriptSrcs = [Uri.joinPath(res, "index.js")];
    const styleSrcs = [Uri.joinPath(res, "index.css")];

    const scripts = scriptSrcs
      .map((src) => {
        const script = webview.asWebviewUri(src);
        return `<script nonce="${nonce}" src="${script}"></script>`;
      })
      .join("\n");
    const styles = styleSrcs
      .map((src) => {
        const style = webview.asWebviewUri(src);
        return `<link rel="stylesheet" href="${style}">`;
      })
      .join("\n");

    const html = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />

          <!--
            Use a content security policy to only allow loading images from https or from our extension directory,
            and only allow scripts that have a specific nonce.
          -->
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} 'self' data:; style-src ${webview.cspSource} 'self' 'unsafe-inline'; script-src 'nonce-${nonce}'; font-src ${webview.cspSource};">

          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${styles}
          <script nonce="${nonce}">
            window.acquireVsCodeApi = acquireVsCodeApi;
          </script>
        </head>
        <body>
          <div id="root"></div>
          ${scripts}
        </body>
      </html>
    `;

    return html;
  };
