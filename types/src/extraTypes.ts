/* eslint-disable */
/** Auto-generated from json schema. Do not edit manually. */

import * as sedap from "./sedapTypes";


// === REQUEST TYPES ===

export type SEDAPCommandType =
| "stepSpecific"
| "jump"
| "getFullMap";

export type SEDAPCommandArgs<T extends SEDAPCommandType = SEDAPCommandType> =
  T extends "stepSpecific" ? sedap.StepSpecificArguments :
  T extends "jump" ? sedap.JumpArguments :
  T extends "getFullMap" ? sedap.GetFullMapArguments :
  never;

export type SEDAPCommandResponse<T extends SEDAPCommandType = SEDAPCommandType> =
  T extends "stepSpecific" ? sedap.StepSpecificResponse["body"] :
  T extends "jump" ? sedap.JumpResponse["body"] :
  T extends "getFullMap" ? sedap.GetFullMapResponse["body"] :
  never;


// === EVENT TYPES ===

export type SEDAPEventType =
| "mapUpdate";

export type SEDAPEventBody<T extends SEDAPEventType = SEDAPEventType> =
  T extends "mapUpdate" ? sedap.MapUpdateEventBody :
  never;
