import { ExtensionContext, Uri, workspace, commands } from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions } from "vscode-languageclient/node";
import { expandPath } from "../util/vscodeVariables";

const clients: Record<string, LanguageClient> = {};

function startLsp(langCmd: string, name: string, language: string) {
  const config = workspace.getConfiguration("gillianDebugger");
  const langConfig = workspace.getConfiguration(`gillianDebugger.${langCmd}`);

  const mode = "verify";
  const workspaceFolder = workspace.workspaceFolders?.[0];
  const extraArgs: string[] = (langConfig.commandLineArguments || []).map((arg: string) =>
    expandPath(arg, workspaceFolder),
  );

  let command: string;
  let cwd: string;
  let args = ["lsp", mode, ...(config.useManualProof ? ["-m"] : []), ...extraArgs];

  if (config.runMode === "installed") {
    cwd = expandPath(config.outputDirectory || "./.gillian", workspaceFolder);
    const binDirectory = config.binDirectory;
    const path = binDirectory ? expandPath(binDirectory, workspaceFolder) + "/" : "";
    workspace.fs.createDirectory(Uri.file(cwd));
    command = `${path}${langCmd}`;
  } else {
    let sourceDirectory = config.sourceDirectory;
    if (!sourceDirectory) {
      throw Error("Please specify the location of Gillian source code");
    }
    sourceDirectory = expandPath(sourceDirectory, workspaceFolder);
    cwd = sourceDirectory;
    command = "opam";
    args = ["exec", "--", "dune", "exec", "--", langCmd].concat(args);
  }

  const serverOptions: ServerOptions = {
    command,
    args,
    options: {
      cwd,
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: language }],
  };

  const id = `gillian-lsp-${langCmd}`;
  console.log("Launching LSP client", { id, name, serverOptions, clientOptions });
  const client = new LanguageClient(id, name, serverOptions, clientOptions);
  clients.langCmd = client;
  client.start();
}

async function stopLsp(langCmd: string) {
  const client = clients[langCmd];
  if (!client || !client.isRunning()) return false;
  await client.stop();
  return true;
}

async function restartLsp(langCmd: string, name: string, language: string) {
  await stopLsp(langCmd);
  startLsp(langCmd, name, language);
}

function startWislLsp() {
  startLsp("wisl", "WISL Language Server", "wisl");
}

function restartWislLsp() {
  restartLsp("wisl", "WISL Language Server", "wisl");
}

export function activateLsp(context: ExtensionContext) {
  startWislLsp();

  context.subscriptions.push(
    commands.registerCommand("extension.gillian-debug.restartWislLSP", () => {
      restartWislLsp();
    }),
  );
}

export function deactivateLSP() {
  for (const [lang, client] of Object.entries(clients)) {
    if (client.isRunning()) client.stop();
    delete clients[lang];
  }
}
