const Fs = require('fs');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const schema = JSON.parse(Fs.readFileSync(argv._[0]));

const requests = [];
const events = [];

function getRequestId(request) {
  if (request.allOf) {
    for (const schema of request.allOf) {
      const enum_ = schema.properties?.command?.enum || [];
      if (enum_.length >= 1) {
        return schema.properties.command.enum[0];
      }
    }
  }
  throw new Error(`Invalid request\n${JSON.stringify(request, null, 2)}`);
}

function getEventId(event) {
  if (event.allOf) {
    for (const schema of event.allOf) {
      const enum_ = schema.properties?.event?.enum || [];
      if (enum_.length >= 1) {
        return schema.properties.event.enum[0];
      }
    }
  }
  throw new Error(`Invalid event\n${JSON.stringify(event, null, 2)}`);
}

// Sort schema definitions into events, requests, and misc. types
for (let key of Object.keys(schema.definitions)) {
  let def = schema.definitions[key];
  if (key.endsWith('Request') && key !== 'Request') {
    const request = key.slice(0, -'Request'.length);
    requests.push([ request, getRequestId(def) ]);
  } else if (key.endsWith('Event') && key !== 'Event') {
    const event = key.slice(0, -'Event'.length);
    events.push([ event, getEventId(def) ]);
  }
}

let out = ``;
function emit(str) {
  out += str;
}

emit(`/* eslint-disable */\n`);
emit(`/** Auto-generated from json schema. Do not edit manually. */\n\n`);
emit(`import * as sedap from "./sedapTypes";\n\n`)

function withBuffer(emit, f) {
  let buf = '';
  f((str) => {
    buf += str;
  });
  emit(buf);
}

function withIndent(emit, f) {
  withBuffer((buf) => {
    emit(buf.split(/\n/g).map(it => it && '  ' + it).join('\n'));
  }, f);
}

function emitRequestEnum() {
  emit(`export type SEDAPCommandType =`)
  for (const [, id] of requests) {
    emit(`\n| "${id}"`)
  }
  emit(`;\n`);
}

function emitRequestArgsType() {
  emit(`export type SEDAPCommandArgs<T extends SEDAPCommandType = SEDAPCommandType> =`)
  withIndent(emit, (emit) => {
    for (const [request, id] of requests) {
      emit(`\nT extends "${id}" ? sedap.${request}Arguments :`);
    }
    emit(`\nnever;`)
  })
  emit(`\n`);
}

function emitRequestResponseType() {
  emit(`export type SEDAPCommandResponse<T extends SEDAPCommandType = SEDAPCommandType> =`)
  withIndent(emit, (emit) => {
    for (const [request, id] of requests) {
      emit(`\nT extends "${id}" ? sedap.${request}Response["body"] :`);
    }
    emit(`\nnever;`)
  })
  emit(`\n`);
}

function emitRequestTypes() {
  emit(`\n// === REQUEST TYPES ===\n\n`)
  emitRequestEnum();
  emit(`\n`);
  emitRequestArgsType();
  emit(`\n`);
  emitRequestResponseType();
}

function emitEventEnum() {
  emit(`export type SEDAPEventType =`)
  for (const [, id] of events) {
    emit(`\n| "${id}"`)
  }
  emit(`;\n`);
}

function emitEventBodyType() {
  emit(`export type SEDAPEventBody<T extends SEDAPEventType = SEDAPEventType> =`)
  withIndent(emit, (emit) => {
    for (const [event, id] of events) {
      emit(`\nT extends "${id}" ? sedap.${event}EventBody :`);
    }
    emit(`\nnever;`)
  })
  emit(`\n`);
}

function emitEventTypes() {
  emit(`\n// === EVENT TYPES ===\n\n`)
  emitEventEnum();
  emit(`\n`);
  emitEventBodyType();
}

emitRequestTypes();
emit(`\n`);
emitEventTypes();

const outFile = argv._[1];
if (outFile) {
  Fs.writeFileSync(outFile, out);
} else {
  process.stdout.write(out);
}
