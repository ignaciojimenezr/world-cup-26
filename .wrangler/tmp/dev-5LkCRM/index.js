var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");

// ../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../../../opt/homebrew/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
var unenvProcess = new Process({
  env: globalProcess.env,
  // `hrtime` is only available from workerd process v2
  hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  // Always implemented by workerd
  env,
  // Only implemented in workerd v2
  hrtime: hrtime3,
  // Always implemented by workerd
  nextTick
} = unenvProcess;
var {
  _channel,
  _disconnect,
  _events,
  _eventsCount,
  _handleQueue,
  _maxListeners,
  _pendingMessage,
  _send,
  assert,
  disconnect,
  mainModule
} = unenvProcess;
var {
  // @ts-expect-error `_debugEnd` is missing typings
  _debugEnd,
  // @ts-expect-error `_debugProcess` is missing typings
  _debugProcess,
  // @ts-expect-error `_exiting` is missing typings
  _exiting,
  // @ts-expect-error `_fatalException` is missing typings
  _fatalException,
  // @ts-expect-error `_getActiveHandles` is missing typings
  _getActiveHandles,
  // @ts-expect-error `_getActiveRequests` is missing typings
  _getActiveRequests,
  // @ts-expect-error `_kill` is missing typings
  _kill,
  // @ts-expect-error `_linkedBinding` is missing typings
  _linkedBinding,
  // @ts-expect-error `_preload_modules` is missing typings
  _preload_modules,
  // @ts-expect-error `_rawDebug` is missing typings
  _rawDebug,
  // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
  _startProfilerIdleNotifier,
  // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
  _stopProfilerIdleNotifier,
  // @ts-expect-error `_tickCallback` is missing typings
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  availableMemory,
  // @ts-expect-error `binding` is missing typings
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  // @ts-expect-error `domain` is missing typings
  domain,
  emit,
  emitWarning,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  // @ts-expect-error `initgroups` is missing typings
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  memoryUsage,
  // @ts-expect-error `moduleLoadList` is missing typings
  moduleLoadList,
  off,
  on,
  once,
  // @ts-expect-error `openStdin` is missing typings
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  // @ts-expect-error `reallyExit` is missing typings
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = isWorkerdProcessV2 ? workerdProcess : unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../../opt/homebrew/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// server/bracket-template.ts
var slot = /* @__PURE__ */ __name((id, round, label, source) => ({
  id,
  round,
  label,
  source
}), "slot");
var r32 = [
  // Match 1: 2A vs 2B (A2 vs B2)
  {
    id: "R32-M1",
    round: "R32",
    homeSlot: slot("R32-M1-H", "R32", "Group A 2nd", {
      type: "group-position",
      groupId: "A",
      position: 2
    }),
    awaySlot: slot("R32-M1-A", "R32", "Group B 2nd", {
      type: "group-position",
      groupId: "B",
      position: 2
    }),
    metadata: { city: "Los Angeles", stadium: "SoFi Stadium", date: "2026-06-13" }
  },
  // Match 2: 1C vs 2F (C1 vs F2)
  {
    id: "R32-M2",
    round: "R32",
    homeSlot: slot("R32-M2-H", "R32", "Group C 1st", {
      type: "group-position",
      groupId: "C",
      position: 1
    }),
    awaySlot: slot("R32-M2-A", "R32", "Group F 2nd", {
      type: "group-position",
      groupId: "F",
      position: 2
    }),
    metadata: { city: "Houston", stadium: "NRG Stadium", date: "2026-06-13" }
  },
  // Match 3: 1E vs 3ABCDF (E1 vs 3rd from ABCDF)
  {
    id: "R32-M3",
    round: "R32",
    homeSlot: slot("R32-M3-H", "R32", "Group E 1st", {
      type: "group-position",
      groupId: "E",
      position: 1
    }),
    awaySlot: slot("R32-M3-A", "R32", "3rd-ranked (ABCDF)", {
      type: "third-ranked",
      rankIndex: 0,
      groupCombination: "ABCDF"
    }),
    metadata: { city: "Boston", stadium: "Gillette Stadium", date: "2026-06-13" }
  },
  // Match 4: 1F vs 2C (F1 vs C2)
  {
    id: "R32-M4",
    round: "R32",
    homeSlot: slot("R32-M4-H", "R32", "Group F 1st", {
      type: "group-position",
      groupId: "F",
      position: 1
    }),
    awaySlot: slot("R32-M4-A", "R32", "Group C 2nd", {
      type: "group-position",
      groupId: "C",
      position: 2
    }),
    metadata: { city: "Monterrey", stadium: "Estadio BBVA", date: "2026-06-13" }
  },
  // Match 5: 2E vs 2I (E2 vs I2)
  {
    id: "R32-M5",
    round: "R32",
    homeSlot: slot("R32-M5-H", "R32", "Group E 2nd", {
      type: "group-position",
      groupId: "E",
      position: 2
    }),
    awaySlot: slot("R32-M5-A", "R32", "Group I 2nd", {
      type: "group-position",
      groupId: "I",
      position: 2
    }),
    metadata: { city: "Dallas", stadium: "AT&T Stadium", date: "2026-06-14" }
  },
  // Match 6: 1I vs 3CDFGH (I1 vs 3rd from CDFGH)
  {
    id: "R32-M6",
    round: "R32",
    homeSlot: slot("R32-M6-H", "R32", "Group I 1st", {
      type: "group-position",
      groupId: "I",
      position: 1
    }),
    awaySlot: slot("R32-M6-A", "R32", "3rd-ranked (CDFGH)", {
      type: "third-ranked",
      rankIndex: 1,
      groupCombination: "CDFGH"
    }),
    metadata: { city: "New York", stadium: "MetLife", date: "2026-06-14" }
  },
  // Match 7: 1A vs 3CEFHI (A1 vs 3rd from CEFHI)
  {
    id: "R32-M7",
    round: "R32",
    homeSlot: slot("R32-M7-H", "R32", "Group A 1st", {
      type: "group-position",
      groupId: "A",
      position: 1
    }),
    awaySlot: slot("R32-M7-A", "R32", "3rd-ranked (CEFHI)", {
      type: "third-ranked",
      rankIndex: 2,
      groupCombination: "CEFHI"
    }),
    metadata: { city: "Mexico City", stadium: "Azteca", date: "2026-06-14" }
  },
  // Match 8: 1L vs 3EHIJK (L1 vs 3rd from EHIJK)
  {
    id: "R32-M8",
    round: "R32",
    homeSlot: slot("R32-M8-H", "R32", "Group L 1st", {
      type: "group-position",
      groupId: "L",
      position: 1
    }),
    awaySlot: slot("R32-M8-A", "R32", "3rd-ranked (EHIJK)", {
      type: "third-ranked",
      rankIndex: 6,
      groupCombination: "EHIJK"
    }),
    metadata: { city: "Atlanta", stadium: "Mercedes-Benz", date: "2026-06-15" }
  },
  // Match 9: 1G vs 3AEHIJ (G1 vs 3rd from AEHIJ)
  {
    id: "R32-M9",
    round: "R32",
    homeSlot: slot("R32-M9-H", "R32", "Group G 1st", {
      type: "group-position",
      groupId: "G",
      position: 1
    }),
    awaySlot: slot("R32-M9-A", "R32", "3rd-ranked (AEHIJ)", {
      type: "third-ranked",
      rankIndex: 4,
      groupCombination: "AEHIJ"
    }),
    metadata: { city: "Seattle", stadium: "Lumen Field", date: "2026-06-15" }
  },
  // Match 10: 1D vs 3BEFIJ (D1 vs 3rd from BEFIJ)
  {
    id: "R32-M10",
    round: "R32",
    homeSlot: slot("R32-M10-H", "R32", "Group D 1st", {
      type: "group-position",
      groupId: "D",
      position: 1
    }),
    awaySlot: slot("R32-M10-A", "R32", "3rd-ranked (BEFIJ)", {
      type: "third-ranked",
      rankIndex: 3,
      groupCombination: "BEFIJ"
    }),
    metadata: { city: "San Francisco", stadium: "Levi's Stadium", date: "2026-06-15" }
  },
  // Match 11: 1H vs 2J (H1 vs J2)
  {
    id: "R32-M11",
    round: "R32",
    homeSlot: slot("R32-M11-H", "R32", "Group H 1st", {
      type: "group-position",
      groupId: "H",
      position: 1
    }),
    awaySlot: slot("R32-M11-A", "R32", "Group J 2nd", {
      type: "group-position",
      groupId: "J",
      position: 2
    }),
    metadata: { city: "Los Angeles", stadium: "SoFi Stadium", date: "2026-06-16" }
  },
  // Match 12: 2K vs 2L (K2 vs L2)
  {
    id: "R32-M12",
    round: "R32",
    homeSlot: slot("R32-M12-H", "R32", "Group K 2nd", {
      type: "group-position",
      groupId: "K",
      position: 2
    }),
    awaySlot: slot("R32-M12-A", "R32", "Group L 2nd", {
      type: "group-position",
      groupId: "L",
      position: 2
    }),
    metadata: { city: "Toronto", stadium: "BMO Field", date: "2026-06-16" }
  },
  // Match 13: 1B vs 3EFGIJ (B1 vs 3rd from EFGIJ)
  {
    id: "R32-M13",
    round: "R32",
    homeSlot: slot("R32-M13-H", "R32", "Group B 1st", {
      type: "group-position",
      groupId: "B",
      position: 1
    }),
    awaySlot: slot("R32-M13-A", "R32", "3rd-ranked (EFGIJ)", {
      type: "third-ranked",
      rankIndex: 5,
      groupCombination: "EFGIJ"
    }),
    metadata: { city: "Vancouver", stadium: "BC Place", date: "2026-06-16" }
  },
  // Match 14: 2D vs 2G (D2 vs G2)
  {
    id: "R32-M14",
    round: "R32",
    homeSlot: slot("R32-M14-H", "R32", "Group D 2nd", {
      type: "group-position",
      groupId: "D",
      position: 2
    }),
    awaySlot: slot("R32-M14-A", "R32", "Group G 2nd", {
      type: "group-position",
      groupId: "G",
      position: 2
    }),
    metadata: { city: "Dallas", stadium: "AT&T Stadium", date: "2026-06-17" }
  },
  // Match 15: 1J vs 2H (J1 vs H2)
  {
    id: "R32-M15",
    round: "R32",
    homeSlot: slot("R32-M15-H", "R32", "Group J 1st", {
      type: "group-position",
      groupId: "J",
      position: 1
    }),
    awaySlot: slot("R32-M15-A", "R32", "Group H 2nd", {
      type: "group-position",
      groupId: "H",
      position: 2
    }),
    metadata: { city: "Miami", stadium: "Hard Rock Stadium", date: "2026-06-17" }
  },
  // Match 16: 1K vs 3DEIJL (K1 vs 3rd from DEIJL)
  {
    id: "R32-M16",
    round: "R32",
    homeSlot: slot("R32-M16-H", "R32", "Group K 1st", {
      type: "group-position",
      groupId: "K",
      position: 1
    }),
    awaySlot: slot("R32-M16-A", "R32", "3rd-ranked (DEIJL)", {
      type: "third-ranked",
      rankIndex: 7,
      groupCombination: "DEIJL"
    }),
    metadata: { city: "Kansas City", stadium: "Arrowhead", date: "2026-06-17" }
  }
];
var r16 = [
  {
    id: "R16-M1",
    round: "R16",
    homeSlot: slot("R16-M1-H", "R16", "Winner R32-M1", { type: "winner-of-match", matchId: "R32-M1" }),
    awaySlot: slot("R16-M1-A", "R16", "Winner R32-M2", { type: "winner-of-match", matchId: "R32-M2" }),
    metadata: { city: "Los Angeles", stadium: "SoFi Stadium", date: "2026-06-23" }
  },
  {
    id: "R16-M2",
    round: "R16",
    homeSlot: slot("R16-M2-H", "R16", "Winner R32-M3", { type: "winner-of-match", matchId: "R32-M3" }),
    awaySlot: slot("R16-M2-A", "R16", "Winner R32-M4", { type: "winner-of-match", matchId: "R32-M4" }),
    metadata: { city: "Mexico City", stadium: "Azteca", date: "2026-06-23" }
  },
  {
    id: "R16-M3",
    round: "R16",
    homeSlot: slot("R16-M3-H", "R16", "Winner R32-M5", { type: "winner-of-match", matchId: "R32-M5" }),
    awaySlot: slot("R16-M3-A", "R16", "Winner R32-M6", { type: "winner-of-match", matchId: "R32-M6" }),
    metadata: { city: "Atlanta", stadium: "Mercedes-Benz", date: "2026-06-24" }
  },
  {
    id: "R16-M4",
    round: "R16",
    homeSlot: slot("R16-M4-H", "R16", "Winner R32-M7", { type: "winner-of-match", matchId: "R32-M7" }),
    awaySlot: slot("R16-M4-A", "R16", "Winner R32-M8", { type: "winner-of-match", matchId: "R32-M8" }),
    metadata: { city: "Houston", stadium: "NRG Stadium", date: "2026-06-24" }
  },
  {
    id: "R16-M5",
    round: "R16",
    homeSlot: slot("R16-M5-H", "R16", "Winner R32-M9", { type: "winner-of-match", matchId: "R32-M9" }),
    awaySlot: slot("R16-M5-A", "R16", "Winner R32-M10", { type: "winner-of-match", matchId: "R32-M10" }),
    metadata: { city: "Dallas", stadium: "AT&T Stadium", date: "2026-06-25" }
  },
  {
    id: "R16-M6",
    round: "R16",
    homeSlot: slot("R16-M6-H", "R16", "Winner R32-M11", { type: "winner-of-match", matchId: "R32-M11" }),
    awaySlot: slot("R16-M6-A", "R16", "Winner R32-M12", { type: "winner-of-match", matchId: "R32-M12" }),
    metadata: { city: "Toronto", stadium: "BMO Field", date: "2026-06-25" }
  },
  {
    id: "R16-M7",
    round: "R16",
    homeSlot: slot("R16-M7-H", "R16", "Winner R32-M13", { type: "winner-of-match", matchId: "R32-M13" }),
    awaySlot: slot("R16-M7-A", "R16", "Winner R32-M14", { type: "winner-of-match", matchId: "R32-M14" }),
    metadata: { city: "Seattle", stadium: "Lumen Field", date: "2026-06-26" }
  },
  {
    id: "R16-M8",
    round: "R16",
    homeSlot: slot("R16-M8-H", "R16", "Winner R32-M15", { type: "winner-of-match", matchId: "R32-M15" }),
    awaySlot: slot("R16-M8-A", "R16", "Winner R32-M16", { type: "winner-of-match", matchId: "R32-M16" }),
    metadata: { city: "San Francisco", stadium: "Levi's Stadium", date: "2026-06-26" }
  }
];
var qf = [
  {
    id: "QF-M1",
    round: "QF",
    homeSlot: slot("QF-M1-H", "QF", "Winner R16-M1", { type: "winner-of-match", matchId: "R16-M1" }),
    awaySlot: slot("QF-M1-A", "QF", "Winner R16-M2", { type: "winner-of-match", matchId: "R16-M2" }),
    metadata: { city: "Boston", stadium: "Gillette Stadium", date: "2026-06-29" }
  },
  {
    id: "QF-M2",
    round: "QF",
    homeSlot: slot("QF-M2-H", "QF", "Winner R16-M3", { type: "winner-of-match", matchId: "R16-M3" }),
    awaySlot: slot("QF-M2-A", "QF", "Winner R16-M4", { type: "winner-of-match", matchId: "R16-M4" }),
    metadata: { city: "Miami", stadium: "Hard Rock Stadium", date: "2026-06-29" }
  },
  {
    id: "QF-M3",
    round: "QF",
    homeSlot: slot("QF-M3-H", "QF", "Winner R16-M5", { type: "winner-of-match", matchId: "R16-M5" }),
    awaySlot: slot("QF-M3-A", "QF", "Winner R16-M6", { type: "winner-of-match", matchId: "R16-M6" }),
    metadata: { city: "Philadelphia", stadium: "Lincoln Financial Field", date: "2026-06-30" }
  },
  {
    id: "QF-M4",
    round: "QF",
    homeSlot: slot("QF-M4-H", "QF", "Winner R16-M7", { type: "winner-of-match", matchId: "R16-M7" }),
    awaySlot: slot("QF-M4-A", "QF", "Winner R16-M8", { type: "winner-of-match", matchId: "R16-M8" }),
    metadata: { city: "Toronto", stadium: "BMO Field", date: "2026-06-30" }
  }
];
var sf = [
  {
    id: "SF-M1",
    round: "SF",
    homeSlot: slot("SF-M1-H", "SF", "Winner QF-M1", { type: "winner-of-match", matchId: "QF-M1" }),
    awaySlot: slot("SF-M1-A", "SF", "Winner QF-M2", { type: "winner-of-match", matchId: "QF-M2" }),
    metadata: { city: "New York", stadium: "MetLife", date: "2026-07-04" }
  },
  {
    id: "SF-M2",
    round: "SF",
    homeSlot: slot("SF-M2-H", "SF", "Winner QF-M3", { type: "winner-of-match", matchId: "QF-M3" }),
    awaySlot: slot("SF-M2-A", "SF", "Winner QF-M4", { type: "winner-of-match", matchId: "QF-M4" }),
    metadata: { city: "Los Angeles", stadium: "SoFi Stadium", date: "2026-07-05" }
  }
];
var finals = [
  {
    id: "F-M1",
    round: "F",
    homeSlot: slot("F-M1-H", "F", "Winner SF-M1", { type: "winner-of-match", matchId: "SF-M1" }),
    awaySlot: slot("F-M1-A", "F", "Winner SF-M2", { type: "winner-of-match", matchId: "SF-M2" }),
    metadata: { city: "Miami", stadium: "Hard Rock Stadium", date: "2026-07-12" }
  }
];
var bracketTemplate = {
  matches: [...r32, ...r16, ...qf, ...sf, ...finals]
};

// server/teams.ts
var teams = [
  // CONCACAF
  { id: "mexico", name: "Mexico", shortName: "MEX", flagEmoji: "\u{1F1F2}\u{1F1FD}", confederation: "CONCACAF" },
  { id: "usa", name: "United States", shortName: "USA", flagEmoji: "\u{1F1FA}\u{1F1F8}", confederation: "CONCACAF" },
  { id: "canada", name: "Canada", shortName: "CAN", flagEmoji: "\u{1F1E8}\u{1F1E6}", confederation: "CONCACAF" },
  { id: "panama", name: "Panama", shortName: "PAN", flagEmoji: "\u{1F1F5}\u{1F1E6}", confederation: "CONCACAF" },
  { id: "haiti", name: "Haiti", shortName: "HAI", flagEmoji: "\u{1F1ED}\u{1F1F9}", confederation: "CONCACAF" },
  { id: "curacao", name: "Cura\xE7ao", shortName: "CUW", flagEmoji: "\u{1F1E8}\u{1F1FC}", confederation: "CONCACAF" },
  // CONMEBOL
  { id: "brazil", name: "Brazil", shortName: "BRA", flagEmoji: "\u{1F1E7}\u{1F1F7}", confederation: "CONMEBOL" },
  { id: "argentina", name: "Argentina", shortName: "ARG", flagEmoji: "\u{1F1E6}\u{1F1F7}", confederation: "CONMEBOL" },
  { id: "uruguay", name: "Uruguay", shortName: "URU", flagEmoji: "\u{1F1FA}\u{1F1FE}", confederation: "CONMEBOL" },
  { id: "colombia", name: "Colombia", shortName: "COL", flagEmoji: "\u{1F1E8}\u{1F1F4}", confederation: "CONMEBOL" },
  { id: "ecuador", name: "Ecuador", shortName: "ECU", flagEmoji: "\u{1F1EA}\u{1F1E8}", confederation: "CONMEBOL" },
  { id: "paraguay", name: "Paraguay", shortName: "PAR", flagEmoji: "\u{1F1F5}\u{1F1FE}", confederation: "CONMEBOL" },
  // UEFA - Qualified
  { id: "germany", name: "Germany", shortName: "GER", flagEmoji: "\u{1F1E9}\u{1F1EA}", confederation: "UEFA" },
  { id: "spain", name: "Spain", shortName: "ESP", flagEmoji: "\u{1F1EA}\u{1F1F8}", confederation: "UEFA" },
  { id: "france", name: "France", shortName: "FRA", flagEmoji: "\u{1F1EB}\u{1F1F7}", confederation: "UEFA" },
  { id: "england", name: "England", shortName: "ENG", flagEmoji: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", confederation: "UEFA" },
  { id: "portugal", name: "Portugal", shortName: "POR", flagEmoji: "\u{1F1F5}\u{1F1F9}", confederation: "UEFA" },
  { id: "netherlands", name: "Netherlands", shortName: "NED", flagEmoji: "\u{1F1F3}\u{1F1F1}", confederation: "UEFA" },
  { id: "belgium", name: "Belgium", shortName: "BEL", flagEmoji: "\u{1F1E7}\u{1F1EA}", confederation: "UEFA" },
  { id: "croatia", name: "Croatia", shortName: "CRO", flagEmoji: "\u{1F1ED}\u{1F1F7}", confederation: "UEFA" },
  { id: "switzerland", name: "Switzerland", shortName: "SUI", flagEmoji: "\u{1F1E8}\u{1F1ED}", confederation: "UEFA" },
  { id: "scotland", name: "Scotland", shortName: "SCO", flagEmoji: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", confederation: "UEFA" },
  { id: "austria", name: "Austria", shortName: "AUT", flagEmoji: "\u{1F1E6}\u{1F1F9}", confederation: "UEFA" },
  { id: "norway", name: "Norway", shortName: "NOR", flagEmoji: "\u{1F1F3}\u{1F1F4}", confederation: "UEFA" },
  // UEFA Playoff A candidates: Italy, Northern Ireland, Wales, Bosnia & Herzegovina
  { id: "italy", name: "Italy", shortName: "ITA", flagEmoji: "\u{1F1EE}\u{1F1F9}", confederation: "UEFA" },
  { id: "northern-ireland", name: "Northern Ireland", shortName: "NIR", flagEmoji: "\u{1F1EC}\u{1F1E7}", confederation: "UEFA" },
  { id: "wales", name: "Wales", shortName: "WAL", flagEmoji: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", confederation: "UEFA" },
  { id: "bosnia", name: "Bosnia & Herzegovina", shortName: "BIH", flagEmoji: "\u{1F1E7}\u{1F1E6}", confederation: "UEFA" },
  // UEFA Playoff B candidates: Ukraine, Sweden, Poland, Albania
  { id: "ukraine", name: "Ukraine", shortName: "UKR", flagEmoji: "\u{1F1FA}\u{1F1E6}", confederation: "UEFA" },
  { id: "sweden", name: "Sweden", shortName: "SWE", flagEmoji: "\u{1F1F8}\u{1F1EA}", confederation: "UEFA" },
  { id: "poland", name: "Poland", shortName: "POL", flagEmoji: "\u{1F1F5}\u{1F1F1}", confederation: "UEFA" },
  { id: "albania", name: "Albania", shortName: "ALB", flagEmoji: "\u{1F1E6}\u{1F1F1}", confederation: "UEFA" },
  // UEFA Playoff C candidates: Turkey, Romania, Slovakia, Kosovo
  { id: "turkey", name: "Turkey", shortName: "TUR", flagEmoji: "\u{1F1F9}\u{1F1F7}", confederation: "UEFA" },
  { id: "romania", name: "Romania", shortName: "ROU", flagEmoji: "\u{1F1F7}\u{1F1F4}", confederation: "UEFA" },
  { id: "slovakia", name: "Slovakia", shortName: "SVK", flagEmoji: "\u{1F1F8}\u{1F1F0}", confederation: "UEFA" },
  { id: "kosovo", name: "Kosovo", shortName: "KOS", flagEmoji: "\u{1F1FD}\u{1F1F0}", confederation: "UEFA" },
  // UEFA Playoff D candidates: Denmark, North Macedonia, Czechia, Ireland
  { id: "denmark", name: "Denmark", shortName: "DEN", flagEmoji: "\u{1F1E9}\u{1F1F0}", confederation: "UEFA" },
  { id: "north-macedonia", name: "North Macedonia", shortName: "MKD", flagEmoji: "\u{1F1F2}\u{1F1F0}", confederation: "UEFA" },
  { id: "czechia", name: "Czechia", shortName: "CZE", flagEmoji: "\u{1F1E8}\u{1F1FF}", confederation: "UEFA" },
  { id: "ireland", name: "Ireland", shortName: "IRL", flagEmoji: "\u{1F1EE}\u{1F1EA}", confederation: "UEFA" },
  // CAF
  { id: "morocco", name: "Morocco", shortName: "MAR", flagEmoji: "\u{1F1F2}\u{1F1E6}", confederation: "CAF" },
  { id: "south-africa", name: "South Africa", shortName: "RSA", flagEmoji: "\u{1F1FF}\u{1F1E6}", confederation: "CAF" },
  { id: "egypt", name: "Egypt", shortName: "EGY", flagEmoji: "\u{1F1EA}\u{1F1EC}", confederation: "CAF" },
  { id: "senegal", name: "Senegal", shortName: "SEN", flagEmoji: "\u{1F1F8}\u{1F1F3}", confederation: "CAF" },
  { id: "ivory-coast", name: "Ivory Coast", shortName: "CIV", flagEmoji: "\u{1F1E8}\u{1F1EE}", confederation: "CAF" },
  { id: "ghana", name: "Ghana", shortName: "GHA", flagEmoji: "\u{1F1EC}\u{1F1ED}", confederation: "CAF" },
  { id: "algeria", name: "Algeria", shortName: "ALG", flagEmoji: "\u{1F1E9}\u{1F1FF}", confederation: "CAF" },
  { id: "tunisia", name: "Tunisia", shortName: "TUN", flagEmoji: "\u{1F1F9}\u{1F1F3}", confederation: "CAF" },
  { id: "cape-verde", name: "Cape Verde", shortName: "CPV", flagEmoji: "\u{1F1E8}\u{1F1FB}", confederation: "CAF" },
  { id: "dr-congo", name: "DR Congo", shortName: "COD", flagEmoji: "\u{1F1E8}\u{1F1E9}", confederation: "CAF" },
  // AFC
  { id: "japan", name: "Japan", shortName: "JPN", flagEmoji: "\u{1F1EF}\u{1F1F5}", confederation: "AFC" },
  { id: "south-korea", name: "South Korea", shortName: "KOR", flagEmoji: "\u{1F1F0}\u{1F1F7}", confederation: "AFC" },
  { id: "australia", name: "Australia", shortName: "AUS", flagEmoji: "\u{1F1E6}\u{1F1FA}", confederation: "AFC" },
  { id: "saudi-arabia", name: "Saudi Arabia", shortName: "KSA", flagEmoji: "\u{1F1F8}\u{1F1E6}", confederation: "AFC" },
  { id: "iran", name: "Iran", shortName: "IRN", flagEmoji: "\u{1F1EE}\u{1F1F7}", confederation: "AFC" },
  { id: "qatar", name: "Qatar", shortName: "QAT", flagEmoji: "\u{1F1F6}\u{1F1E6}", confederation: "AFC" },
  { id: "uzbekistan", name: "Uzbekistan", shortName: "UZB", flagEmoji: "\u{1F1FA}\u{1F1FF}", confederation: "AFC" },
  { id: "jordan", name: "Jordan", shortName: "JOR", flagEmoji: "\u{1F1EF}\u{1F1F4}", confederation: "AFC" },
  { id: "iraq", name: "Iraq", shortName: "IRQ", flagEmoji: "\u{1F1EE}\u{1F1F6}", confederation: "AFC" },
  // OFC
  { id: "new-zealand", name: "New Zealand", shortName: "NZL", flagEmoji: "\u{1F1F3}\u{1F1FF}", confederation: "OFC" },
  { id: "new-caledonia", name: "New Caledonia", shortName: "NCL", flagEmoji: "\u{1F1F3}\u{1F1E8}", confederation: "OFC" },
  // Other playoff candidates
  { id: "jamaica", name: "Jamaica", shortName: "JAM", flagEmoji: "\u{1F1EF}\u{1F1F2}", confederation: "CONCACAF" },
  { id: "suriname", name: "Suriname", shortName: "SUR", flagEmoji: "\u{1F1F8}\u{1F1F7}", confederation: "CONMEBOL" },
  { id: "bolivia", name: "Bolivia", shortName: "BOL", flagEmoji: "\u{1F1E7}\u{1F1F4}", confederation: "CONMEBOL" }
];
var playoffSlots = {
  "euro-playoff-a": ["italy", "northern-ireland", "wales", "bosnia"],
  "euro-playoff-b": ["ukraine", "sweden", "poland", "albania"],
  "euro-playoff-c": ["turkey", "romania", "slovakia", "kosovo"],
  "euro-playoff-d": ["denmark", "north-macedonia", "czechia", "ireland"],
  "intercon-playoff-1": ["jamaica", "new-caledonia", "dr-congo"],
  "intercon-playoff-2": ["bolivia", "suriname", "iraq"]
};
var groups = [
  { id: "A", teams: ["mexico", "south-africa", "south-korea", "euro-playoff-d"] },
  { id: "B", teams: ["canada", "euro-playoff-a", "qatar", "switzerland"] },
  { id: "C", teams: ["brazil", "morocco", "haiti", "scotland"] },
  { id: "D", teams: ["usa", "paraguay", "australia", "euro-playoff-c"] },
  { id: "E", teams: ["germany", "curacao", "ivory-coast", "ecuador"] },
  { id: "F", teams: ["netherlands", "japan", "euro-playoff-b", "tunisia"] },
  { id: "G", teams: ["belgium", "egypt", "iran", "new-zealand"] },
  { id: "H", teams: ["spain", "cape-verde", "saudi-arabia", "uruguay"] },
  { id: "I", teams: ["france", "senegal", "intercon-playoff-2", "norway"] },
  { id: "J", teams: ["argentina", "algeria", "austria", "jordan"] },
  { id: "K", teams: ["portugal", "intercon-playoff-1", "uzbekistan", "colombia"] },
  { id: "L", teams: ["england", "croatia", "ghana", "panama"] }
];
var teamById = teams.reduce(
  (acc, team) => {
    acc[team.id] = team;
    return acc;
  },
  {}
);
var groupOrder = groups.map((g) => g.id);

// worker/index.ts
var defaultGroupPredictions = /* @__PURE__ */ __name(() => groups.map((group) => ({
  groupId: group.id,
  positions: {
    1: "",
    2: "",
    3: "",
    4: ""
  }
})), "defaultGroupPredictions");
var emptyKnockout = /* @__PURE__ */ __name(() => ({ winnersByMatchId: {} }), "emptyKnockout");
var defaultPrediction = /* @__PURE__ */ __name(() => ({
  groups: defaultGroupPredictions(),
  thirdPlaceSelection: { advancingThirdPlaceTeamIds: [] },
  knockout: emptyKnockout()
}), "defaultPrediction");
var assignThirdPlaceTeams = /* @__PURE__ */ __name((prediction) => {
  const thirdPlaceTeams = [];
  for (const group of prediction.groups) {
    const teamId = group.positions[3];
    if (teamId) {
      thirdPlaceTeams.push({ teamId, groupId: group.groupId });
    }
  }
  const ranked = prediction.thirdPlaceSelection.advancingThirdPlaceTeamIds.map((teamId) => {
    const team = thirdPlaceTeams.find((t) => t.teamId === teamId);
    return team ? { teamId, groupId: team.groupId } : null;
  }).filter((t) => t !== null);
  const thirdPlaceSlots = [];
  for (const match of bracketTemplate.matches) {
    if (match.homeSlot.source?.type === "third-ranked" && match.homeSlot.source.groupCombination) {
      thirdPlaceSlots.push({
        rankIndex: match.homeSlot.source.rankIndex,
        groupCombination: match.homeSlot.source.groupCombination
      });
    }
    if (match.awaySlot.source?.type === "third-ranked" && match.awaySlot.source.groupCombination) {
      thirdPlaceSlots.push({
        rankIndex: match.awaySlot.source.rankIndex,
        groupCombination: match.awaySlot.source.groupCombination
      });
    }
  }
  thirdPlaceSlots.sort((a, b) => a.rankIndex - b.rankIndex);
  const assignments = /* @__PURE__ */ new Map();
  const available = [...ranked];
  for (const slot2 of thirdPlaceSlots) {
    const teamIndex = available.findIndex(
      (t) => slot2.groupCombination.includes(t.groupId)
    );
    if (teamIndex !== -1) {
      const team = available[teamIndex];
      assignments.set(slot2.rankIndex, team.teamId);
      available.splice(teamIndex, 1);
    }
  }
  return assignments;
}, "assignThirdPlaceTeams");
var resolveSource = /* @__PURE__ */ __name((source, prediction, thirdPlaceAssignments) => {
  if (!source) return void 0;
  switch (source.type) {
    case "group-position": {
      const group = prediction.groups.find((g) => g.groupId === source.groupId);
      return group?.positions[source.position];
    }
    case "third-ranked": {
      if (!thirdPlaceAssignments) {
        return prediction.thirdPlaceSelection.advancingThirdPlaceTeamIds[source.rankIndex];
      }
      return thirdPlaceAssignments.get(source.rankIndex);
    }
    case "winner-of-match":
      return prediction.knockout.winnersByMatchId[source.matchId];
    default:
      return void 0;
  }
}, "resolveSource");
var resolveSlotTeamId = /* @__PURE__ */ __name((slot2, prediction, thirdPlaceAssignments) => resolveSource(slot2.source, prediction, thirdPlaceAssignments), "resolveSlotTeamId");
var resolveBracket = /* @__PURE__ */ __name((prediction) => {
  const thirdPlaceAssignments = assignThirdPlaceTeams(prediction);
  const matches = bracketTemplate.matches.map((match) => ({
    ...match,
    homeTeamId: resolveSlotTeamId(match.homeSlot, prediction, thirdPlaceAssignments),
    awayTeamId: resolveSlotTeamId(match.awaySlot, prediction, thirdPlaceAssignments)
  }));
  return { matches };
}, "resolveBracket");
var UI_RESOURCE_URI_KEY = "ui/resourceUri";
var mcpTools = [
  {
    name: "worldcup.getInitialData",
    description: "Return teams, groups, bracket template, and any saved prediction. Opens the World Cup prediction UI.",
    inputSchema: {
      type: "object",
      properties: {
        includeSaved: { type: "boolean", description: "Whether to include saved prediction" }
      }
    },
    _meta: { "ui/resourceUri": "ui://worldcup/groups" }
  },
  {
    name: "worldcup.savePrediction",
    description: "Persist a World Cup prediction (in-memory).",
    inputSchema: {
      type: "object",
      properties: {
        prediction: { type: "object", description: "The WorldCupPrediction object to save" }
      },
      required: ["prediction"]
    }
  },
  {
    name: "worldcup.computeBracket",
    description: "Compute a resolved bracket from group predictions and third-place selection. Opens the bracket view.",
    inputSchema: {
      type: "object",
      properties: {
        groups: { type: "array", description: "Group predictions" },
        thirdPlaceSelection: { type: "object", description: "Third place selection" },
        knockout: { type: "object", description: "Knockout predictions" }
      },
      required: ["groups", "thirdPlaceSelection"]
    },
    _meta: { "ui/resourceUri": "ui://worldcup/bracket" }
  },
  {
    name: "worldcup.getBracketTemplate",
    description: "Return the deterministic bracket template.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "worldcup.test",
    description: "Test tool to verify MCP App rendering. Opens a simple static test page.",
    inputSchema: { type: "object", properties: {} },
    _meta: { "ui/resourceUri": "ui://worldcup/test" }
  }
];
var savedPrediction = null;
var toolHandlers = {
  "worldcup.getInitialData": /* @__PURE__ */ __name(async () => {
    const prediction = savedPrediction ?? defaultPrediction();
    return {
      data: { teams, groups, bracketTemplate, prediction, playoffSlots },
      metadata: { [UI_RESOURCE_URI_KEY]: "ui://worldcup/groups" }
    };
  }, "worldcup.getInitialData"),
  "worldcup.getDataForWidget": /* @__PURE__ */ __name(async () => {
    const prediction = savedPrediction ?? defaultPrediction();
    return { data: { teams, groups, bracketTemplate, prediction, playoffSlots } };
  }, "worldcup.getDataForWidget"),
  "worldcup.savePrediction": /* @__PURE__ */ __name(async (args) => {
    const incoming = args.prediction;
    if (!incoming) throw new Error("Missing prediction parameter");
    savedPrediction = incoming;
    return { ok: true, summary: "Prediction saved", snapshot: incoming };
  }, "worldcup.savePrediction"),
  "worldcup.computeBracket": /* @__PURE__ */ __name(async (args) => {
    const nextPrediction = {
      groups: args.groups ?? defaultGroupPredictions(),
      thirdPlaceSelection: args.thirdPlaceSelection ?? { advancingThirdPlaceTeamIds: [] },
      knockout: args.knockout ?? emptyKnockout()
    };
    const bracket = resolveBracket(nextPrediction);
    return { bracket, metadata: { [UI_RESOURCE_URI_KEY]: "ui://worldcup/bracket" } };
  }, "worldcup.computeBracket"),
  "worldcup.getBracketTemplate": /* @__PURE__ */ __name(async () => ({ bracketTemplate }), "worldcup.getBracketTemplate"),
  "worldcup.test": /* @__PURE__ */ __name(async () => ({ message: "Test successful", time: (/* @__PURE__ */ new Date()).toISOString() }), "worldcup.test")
};
var SERVER_INFO = { name: "worldcup-2026", version: "1.0.0" };
var loadAssetText = /* @__PURE__ */ __name(async (env2, path) => {
  const url = new URL(path, "https://assets.invalid");
  const res = await env2.ASSETS.fetch(new Request(url.toString()));
  if (!res.ok) throw new Error(`Failed to load asset ${path}: ${res.status}`);
  return res.text();
}, "loadAssetText");
var buildMcpAppHtml = /* @__PURE__ */ __name(async (env2, resourceUri) => {
  let html = await loadAssetText(env2, "/index.html");
  html = html.replace(
    /<meta http-equiv="Content-Type" content="text\/html\+mcp"\s*\/?>/i,
    `<meta http-equiv="Content-Type" content="text/html;profile=mcp-app" />`
  );
  const jsMatch = html.match(/<script type="module" crossorigin src="(\/assets\/[^"]+\.js)"><\/script>/);
  if (jsMatch && jsMatch[1]) {
    let jsContent = await loadAssetText(env2, jsMatch[1]);
    jsContent = jsContent.replace(/<\/script/gi, "\\x3c/script");
    html = html.replace(jsMatch[0], () => `<script type="module">${jsContent}<\/script>`);
  }
  const cssMatch = html.match(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/);
  if (cssMatch && cssMatch[1]) {
    const cssContent = await loadAssetText(env2, cssMatch[1]);
    html = html.replace(cssMatch[0], `<style>${cssContent}</style>`);
  }
  html = html.replace(
    "</head>",
    `<script>window.__MCP_RESOURCE_URI__ = "${resourceUri}";<\/script></head>`
  );
  return html;
}, "buildMcpAppHtml");
var handleMcpRequest = /* @__PURE__ */ __name(async (req, env2) => {
  const id = req.id ?? null;
  switch (req.method) {
    case "initialize":
      return {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
            resources: {},
            prompts: {},
            extensions: { "io.modelcontextprotocol/ui": { mimeTypes: ["text/html;profile=mcp-app"] } }
          },
          serverInfo: SERVER_INFO
        }
      };
    case "notifications/initialized":
      return { jsonrpc: "2.0", id, result: {} };
    case "tools/list":
      return { jsonrpc: "2.0", id, result: { tools: mcpTools } };
    case "tools/call": {
      const params = req.params;
      const toolName = params?.name;
      const toolArgs = params?.arguments ?? {};
      const handler = toolHandlers[toolName];
      if (!handler) {
        return { jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown tool: ${toolName}` } };
      }
      try {
        const result = await handler(toolArgs);
        const toolDef = mcpTools.find((t) => t.name === toolName);
        const toolMeta = toolDef?._meta;
        const response = {
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            ...toolMeta ? { _meta: toolMeta } : {}
          }
        };
        return response;
      } catch (err) {
        return { jsonrpc: "2.0", id, error: { code: -32e3, message: err.message } };
      }
    }
    case "resources/list":
      return {
        jsonrpc: "2.0",
        id,
        result: {
          resources: [
            { uri: "ui://worldcup/groups", name: "World Cup Groups", mimeType: "text/html;profile=mcp-app" },
            { uri: "ui://worldcup/third-place", name: "Third Place Selection", mimeType: "text/html;profile=mcp-app" },
            { uri: "ui://worldcup/bracket", name: "Knockout Bracket", mimeType: "text/html;profile=mcp-app" },
            { uri: "ui://worldcup/test", name: "Test Page", mimeType: "text/html;profile=mcp-app" }
          ]
        }
      };
    case "resources/read": {
      const params = req.params;
      const uri = params?.uri;
      if (!uri) {
        return { jsonrpc: "2.0", id, error: { code: -32602, message: "Missing resource URI" } };
      }
      try {
        const html = uri === "ui://worldcup/test" ? "<!doctype html><html><body><h1>Test</h1></body></html>" : await buildMcpAppHtml(env2, uri);
        return {
          jsonrpc: "2.0",
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: "text/html;profile=mcp-app",
                text: html,
                _meta: {
                  ui: {
                    csp: { connectDomains: [], resourceDomains: [] },
                    prefersBorder: false
                  }
                }
              }
            ],
            _meta: {
              ui: {
                csp: { connectDomains: [], resourceDomains: [] },
                prefersBorder: false
              }
            }
          }
        };
      } catch (err) {
        return { jsonrpc: "2.0", id, error: { code: -32e3, message: err.message } };
      }
    }
    case "ping":
      return { jsonrpc: "2.0", id, result: {} };
    case "prompts/list":
      return { jsonrpc: "2.0", id, result: { prompts: [] } };
    case "logging/setLevel":
      return { jsonrpc: "2.0", id, result: {} };
    default:
      return { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${req.method}` } };
  }
}, "handleMcpRequest");
var handleDirectRpc = /* @__PURE__ */ __name(async (req, env2) => {
  const id = req.id ?? null;
  const handler = toolHandlers[req.method];
  if (!handler) return { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${req.method}` } };
  try {
    const result = await handler(req.params ?? {});
    return { jsonrpc: "2.0", id, result };
  } catch (err) {
    return { jsonrpc: "2.0", id, error: { code: -32e3, message: err.message } };
  }
}, "handleDirectRpc");
var parseJsonRpc = /* @__PURE__ */ __name((body) => {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}, "parseJsonRpc");
var worker_default = {
  async fetch(request, env2) {
    const url = new URL(request.url);
    const { pathname } = url;
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if ((pathname === "/mcp" || pathname === "/") && request.method === "POST") {
      const body = await request.text();
      const parsed = parseJsonRpc(body);
      if (!parsed) {
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (Array.isArray(parsed)) {
        const responses = await Promise.all(parsed.map((r) => handleMcpRequest(r, env2)));
        return new Response(JSON.stringify(responses), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      const response = await handleMcpRequest(parsed, env2);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (pathname === "/rpc" && request.method === "POST") {
      const body = await request.text();
      const parsed = parseJsonRpc(body);
      if (!parsed) {
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (Array.isArray(parsed)) {
        const responses = await Promise.all(parsed.map((r) => handleDirectRpc(r, env2)));
        return new Response(JSON.stringify(responses), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      const response = await handleDirectRpc(parsed, env2);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (pathname === "/ui/worldcup/groups" || pathname === "/ui/worldcup/groups/") {
      const html = await buildMcpAppHtml(env2, "ui://worldcup/groups");
      return new Response(html, { status: 200, headers: { ...corsHeaders, "Content-Type": "text/html;profile=mcp-app" } });
    }
    if (pathname === "/ui/worldcup/third-place" || pathname === "/ui/worldcup/third-place/") {
      const html = await buildMcpAppHtml(env2, "ui://worldcup/third-place");
      return new Response(html, { status: 200, headers: { ...corsHeaders, "Content-Type": "text/html;profile=mcp-app" } });
    }
    if (pathname === "/ui/worldcup/bracket" || pathname === "/ui/worldcup/bracket/") {
      const html = await buildMcpAppHtml(env2, "ui://worldcup/bracket");
      return new Response(html, { status: 200, headers: { ...corsHeaders, "Content-Type": "text/html;profile=mcp-app" } });
    }
    if (pathname === "/ui" || pathname === "/ui/" || pathname === "/ui/worldcup" || pathname === "/ui/worldcup/") {
      return Response.redirect(url.origin + "/ui/worldcup/groups", 302);
    }
    if (pathname.startsWith("/assets/") || pathname === "/index.html") {
      const assetResponse2 = await env2.ASSETS.fetch(request);
      return new Response(assetResponse2.body, {
        status: assetResponse2.status,
        headers: { ...Object.fromEntries(assetResponse2.headers), ...corsHeaders }
      });
    }
    if (pathname === "/" && request.method === "GET") {
      return Response.redirect(url.origin + "/ui/worldcup/groups", 302);
    }
    const assetResponse = await env2.ASSETS.fetch(request);
    if (assetResponse.ok) {
      return new Response(assetResponse.body, {
        status: assetResponse.status,
        headers: { ...Object.fromEntries(assetResponse.headers), ...corsHeaders }
      });
    }
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};

// ../../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-Ykn4Me/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-Ykn4Me/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
