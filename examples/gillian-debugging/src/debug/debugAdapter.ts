/** Defines Gillian's Debug Adapter, which tells VSCode how to execute Gillian for debugging. */

import * as vscode from "vscode";
import { ProviderResult } from "vscode";
import { expandPath } from "../util/vscodeVariables";

export class DebugAdapterExecutableFactory implements vscode.DebugAdapterDescriptorFactory {
  createDebugAdapterDescriptor(
    _session: vscode.DebugSession,
  ): ProviderResult<vscode.DebugAdapterDescriptor> {
    const fileExtension = _session.configuration.program.split(".").pop();
    let langCmd: string;
    // Match of the file extension first
    switch (fileExtension) {
      case "c":
        langCmd = "gillian-c2";
        break;
      case "js":
        langCmd = "gillian-js";
        break;
      case "wisl":
        langCmd = "wisl";
        break;
      case "gil":
        // Check the target language if it is a GIL file
        switch (_session.configuration.targetLanguage) {
          case "js":
            langCmd = "gillian-js";
            break;
          case "c":
            langCmd = "gillian-c";
            break;
          case "c2":
            langCmd = "gillian-c2";
            break;
          case "wisl":
          default:
            // Default to WISL
            langCmd = "wisl";
            break;
        }
        break;
      default:
        // Default to WISL
        langCmd = "wisl";
        break;
    }

    const config = vscode.workspace.getConfiguration("gillianDebugger");
    const langConfig = vscode.workspace.getConfiguration(`gillianDebugger.${langCmd}`);
    console.log("Configuring debugger...", { config });

    const workspaceFolder = _session.workspaceFolder;
    const extraArgs: string[] = (langConfig.commandLineArguments || []).map((arg: string) =>
      expandPath(arg, workspaceFolder),
    );

    const mode = _session.configuration.execMode || "verify";

    const env = langConfig.environmentVariables || {};
    let args = ["debug", mode, "-r", "db", ...extraArgs];
    if (config.useManualProof) {
      args.push("-m");
    }
    let cmd: string;
    let cwd: string;

    if (config.runMode === "installed") {
      cwd = expandPath(config.outputDirectory || "./.gillian", workspaceFolder);
      const binDirectory = config.binDirectory;
      const path = binDirectory ? expandPath(binDirectory, workspaceFolder) + "/" : "";
      vscode.workspace.fs.createDirectory(vscode.Uri.file(cwd));
      cmd = `${path}${langCmd}`;
    } else {
      let sourceDirectory = config.sourceDirectory;
      if (!sourceDirectory) {
        throw Error("Please specify the location of Gillian source code");
      }
      sourceDirectory = expandPath(sourceDirectory, workspaceFolder);
      cwd = sourceDirectory;
      cmd = "opam";
      args = ["exec", "--", "dune", "exec", "--", langCmd].concat(args);
    }

    console.log("Starting debugger...", { cmd, args, cwd });
    const options = { cwd, env };
    return new vscode.DebugAdapterExecutable(cmd, args, options);
  }
}
