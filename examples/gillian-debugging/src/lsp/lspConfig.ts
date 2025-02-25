import { Uri, workspace } from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions } from "vscode-languageclient/node";
import { expandPath } from "../util/vscodeVariables";

const clients: LanguageClient[] = [];

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
  let args = [mode, ...extraArgs];

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
    args = ["exec", "--", "dune", "exec", "--", langCmd, "lsp"].concat(args);
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

  const client = new LanguageClient(`gillian-lsp-${langCmd}`, name, serverOptions, clientOptions);
  clients.push(client);
  client.start();
}

function startWislLsp() {
  startLsp("wisl", "WISL Language Server", "wisl");
}

export function activateLsp() {
  startWislLsp();
  console.log("Started WISL lsp");
}

export function deactivateLSP() {
  clients.forEach((client) => client.stop());
}
