import { SEDAPCommandArgs, SEDAPCommandResponse, SEDAPCommandType, SEDAPEventBody, SEDAPEventType } from "@sedap/types";

export type CommandId = {
  commandId: string;
}

export type MessageFromWebview<
  Command extends SEDAPCommandType = SEDAPCommandType,
> = {
  type: "debuggerCommand",
  body: {
    command: Command,
    args: SEDAPCommandArgs<Command>,
  } & CommandId;
} | {
  type: "setPanelTitle",
  body: string,
}

export type MessageToWebview<
  Command extends SEDAPCommandType = SEDAPCommandType,
  Event extends SEDAPEventType = SEDAPEventType
> = {
  type: "debuggerCommandResult";
  body: {
    result: SEDAPCommandResponse<Command>,
  } & CommandId;
} | {
  type: "debuggerEvent";
  body: {
    event: Event,
    body: SEDAPEventBody<Event>
  };
}
