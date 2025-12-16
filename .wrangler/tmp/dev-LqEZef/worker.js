var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
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
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
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

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
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

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
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

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
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
  clearLine(dir3, callback) {
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
  hasColors(count3, env2) {
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

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
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

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
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
  assert: assert2,
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
  assert: assert2,
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

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// server/node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context2.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context2, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// server/node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// server/node_modules/hono/dist/utils/body.js
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// server/node_modules/hono/dist/utils/url.js
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups: groups2, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups2);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups2 = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups2.push([mark, match2]);
    return mark;
  });
  return { groups: groups2, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups2) => {
  for (let i = groups2.length - 1; i >= 0; i--) {
    const [mark] = groups2[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups2[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// server/node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// server/node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context2, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// server/node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// server/node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// server/node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// server/node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env2, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
    }
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env2,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context2 = await composed(c);
        if (!context2.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context2.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// server/node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// server/node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context2, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context2.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context2, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// server/node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups2 = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups2[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups2.length - 1; i >= 0; i--) {
      const [mark] = groups2[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups2[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// server/node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// server/node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// server/node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// server/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// server/node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// server/node_modules/hono/dist/middleware/cors/index.js
var cors = /* @__PURE__ */ __name((options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// server/bracket-template.ts
var slot = /* @__PURE__ */ __name((id, round, label, source) => ({
  id,
  round,
  label,
  source
}), "slot");
var r32 = [
  {
    id: "R32-M1",
    round: "R32",
    homeSlot: slot("R32-M1-H", "R32", "Group A 1st", {
      type: "group-position",
      groupId: "A",
      position: 1
    }),
    awaySlot: slot("R32-M1-A", "R32", "Group C 2nd", {
      type: "group-position",
      groupId: "C",
      position: 2
    }),
    metadata: { city: "New York", stadium: "MetLife", date: "2026-06-13" }
  },
  {
    id: "R32-M2",
    round: "R32",
    homeSlot: slot("R32-M2-H", "R32", "Group B 1st", {
      type: "group-position",
      groupId: "B",
      position: 1
    }),
    awaySlot: slot("R32-M2-A", "R32", "Group D 2nd", {
      type: "group-position",
      groupId: "D",
      position: 2
    }),
    metadata: { city: "Los Angeles", stadium: "Rose Bowl", date: "2026-06-13" }
  },
  {
    id: "R32-M3",
    round: "R32",
    homeSlot: slot("R32-M3-H", "R32", "Group C 1st", {
      type: "group-position",
      groupId: "C",
      position: 1
    }),
    awaySlot: slot("R32-M3-A", "R32", "Group E 2nd", {
      type: "group-position",
      groupId: "E",
      position: 2
    }),
    metadata: { city: "Vancouver", stadium: "BC Place", date: "2026-06-14" }
  },
  {
    id: "R32-M4",
    round: "R32",
    homeSlot: slot("R32-M4-H", "R32", "Group D 1st", {
      type: "group-position",
      groupId: "D",
      position: 1
    }),
    awaySlot: slot("R32-M4-A", "R32", "Group F 2nd", {
      type: "group-position",
      groupId: "F",
      position: 2
    }),
    metadata: { city: "Mexico City", stadium: "Azteca", date: "2026-06-14" }
  },
  {
    id: "R32-M5",
    round: "R32",
    homeSlot: slot("R32-M5-H", "R32", "Group E 1st", {
      type: "group-position",
      groupId: "E",
      position: 1
    }),
    awaySlot: slot("R32-M5-A", "R32", "Group G 2nd", {
      type: "group-position",
      groupId: "G",
      position: 2
    }),
    metadata: { city: "Houston", stadium: "NRG Stadium", date: "2026-06-15" }
  },
  {
    id: "R32-M6",
    round: "R32",
    homeSlot: slot("R32-M6-H", "R32", "Group F 1st", {
      type: "group-position",
      groupId: "F",
      position: 1
    }),
    awaySlot: slot("R32-M6-A", "R32", "Group H 2nd", {
      type: "group-position",
      groupId: "H",
      position: 2
    }),
    metadata: { city: "Seattle", stadium: "Lumen Field", date: "2026-06-15" }
  },
  {
    id: "R32-M7",
    round: "R32",
    homeSlot: slot("R32-M7-H", "R32", "Group G 1st", {
      type: "group-position",
      groupId: "G",
      position: 1
    }),
    awaySlot: slot("R32-M7-A", "R32", "Group A 2nd", {
      type: "group-position",
      groupId: "A",
      position: 2
    }),
    metadata: { city: "Atlanta", stadium: "Mercedes-Benz", date: "2026-06-16" }
  },
  {
    id: "R32-M8",
    round: "R32",
    homeSlot: slot("R32-M8-H", "R32", "Group H 1st", {
      type: "group-position",
      groupId: "H",
      position: 1
    }),
    awaySlot: slot("R32-M8-A", "R32", "Group B 2nd", {
      type: "group-position",
      groupId: "B",
      position: 2
    }),
    metadata: { city: "Dallas", stadium: "AT&T Stadium", date: "2026-06-16" }
  },
  {
    id: "R32-M9",
    round: "R32",
    homeSlot: slot("R32-M9-H", "R32", "Group I 1st", {
      type: "group-position",
      groupId: "I",
      position: 1
    }),
    awaySlot: slot("R32-M9-A", "R32", "3rd-ranked #1", {
      type: "third-ranked",
      rankIndex: 0
    }),
    metadata: { city: "Kansas City", stadium: "Arrowhead", date: "2026-06-17" }
  },
  {
    id: "R32-M10",
    round: "R32",
    homeSlot: slot("R32-M10-H", "R32", "Group J 1st", {
      type: "group-position",
      groupId: "J",
      position: 1
    }),
    awaySlot: slot("R32-M10-A", "R32", "3rd-ranked #2", {
      type: "third-ranked",
      rankIndex: 1
    }),
    metadata: { city: "Philadelphia", stadium: "Lincoln Financial Field", date: "2026-06-17" }
  },
  {
    id: "R32-M11",
    round: "R32",
    homeSlot: slot("R32-M11-H", "R32", "Group K 1st", {
      type: "group-position",
      groupId: "K",
      position: 1
    }),
    awaySlot: slot("R32-M11-A", "R32", "3rd-ranked #3", {
      type: "third-ranked",
      rankIndex: 2
    }),
    metadata: { city: "Guadalajara", stadium: "Akron Stadium", date: "2026-06-18" }
  },
  {
    id: "R32-M12",
    round: "R32",
    homeSlot: slot("R32-M12-H", "R32", "Group L 1st", {
      type: "group-position",
      groupId: "L",
      position: 1
    }),
    awaySlot: slot("R32-M12-A", "R32", "3rd-ranked #4", {
      type: "third-ranked",
      rankIndex: 3
    }),
    metadata: { city: "Miami", stadium: "Hard Rock Stadium", date: "2026-06-18" }
  },
  {
    id: "R32-M13",
    round: "R32",
    homeSlot: slot("R32-M13-H", "R32", "Group I 2nd", {
      type: "group-position",
      groupId: "I",
      position: 2
    }),
    awaySlot: slot("R32-M13-A", "R32", "3rd-ranked #5", {
      type: "third-ranked",
      rankIndex: 4
    }),
    metadata: { city: "Toronto", stadium: "BMO Field", date: "2026-06-19" }
  },
  {
    id: "R32-M14",
    round: "R32",
    homeSlot: slot("R32-M14-H", "R32", "Group J 2nd", {
      type: "group-position",
      groupId: "J",
      position: 2
    }),
    awaySlot: slot("R32-M14-A", "R32", "3rd-ranked #6", {
      type: "third-ranked",
      rankIndex: 5
    }),
    metadata: { city: "Boston", stadium: "Gillette Stadium", date: "2026-06-19" }
  },
  {
    id: "R32-M15",
    round: "R32",
    homeSlot: slot("R32-M15-H", "R32", "Group K 2nd", {
      type: "group-position",
      groupId: "K",
      position: 2
    }),
    awaySlot: slot("R32-M15-A", "R32", "3rd-ranked #7", {
      type: "third-ranked",
      rankIndex: 6
    }),
    metadata: { city: "Seattle", stadium: "Lumen Field", date: "2026-06-20" }
  },
  {
    id: "R32-M16",
    round: "R32",
    homeSlot: slot("R32-M16-H", "R32", "Group L 2nd", {
      type: "group-position",
      groupId: "L",
      position: 2
    }),
    awaySlot: slot("R32-M16-A", "R32", "3rd-ranked #8", {
      type: "third-ranked",
      rankIndex: 7
    }),
    metadata: { city: "San Francisco", stadium: "Levi's Stadium", date: "2026-06-20" }
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

// server/mcp-worker.ts
var UI_RESOURCE_URI_KEY = "ui/resourceUri";
var savedPrediction = null;
var defaultGroupPredictions = /* @__PURE__ */ __name(() => groups.map((group3) => ({
  groupId: group3.id,
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
  thirdPlaceSelection: {
    advancingThirdPlaceTeamIds: []
  },
  knockout: emptyKnockout()
}), "defaultPrediction");
var resolveSource = /* @__PURE__ */ __name((source, prediction) => {
  if (!source) return void 0;
  switch (source.type) {
    case "group-position": {
      const group3 = prediction.groups.find((g) => g.groupId === source.groupId);
      return group3?.positions[source.position];
    }
    case "third-ranked": {
      return prediction.thirdPlaceSelection.advancingThirdPlaceTeamIds[source.rankIndex];
    }
    case "winner-of-match": {
      return prediction.knockout.winnersByMatchId[source.matchId];
    }
    default:
      return void 0;
  }
}, "resolveSource");
var resolveSlotTeamId = /* @__PURE__ */ __name((slot2, prediction) => {
  return resolveSource(slot2.source, prediction);
}, "resolveSlotTeamId");
var resolveBracket = /* @__PURE__ */ __name((prediction) => {
  const matches = bracketTemplate.matches.map((match2) => ({
    ...match2,
    homeTeamId: resolveSlotTeamId(match2.homeSlot, prediction),
    awayTeamId: resolveSlotTeamId(match2.awaySlot, prediction)
  }));
  return { matches };
}, "resolveBracket");
async function loadHtml(assets, htmlPath) {
  if (!assets) {
    throw new Error("ASSETS binding not available");
  }
  const buildRequest = /* @__PURE__ */ __name((path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(normalizedPath, "https://assets.invalid").toString();
    console.log(`[MCP] Loading asset: ${normalizedPath} (full URL: ${url})`);
    return new Request(url);
  }, "buildRequest");
  const request = buildRequest(htmlPath);
  const htmlResponse = await assets.fetch(request);
  console.log(`[MCP] Asset fetch response for ${htmlPath}: ${htmlResponse.status} ${htmlResponse.statusText}`);
  if (!htmlResponse.ok) {
    const errorText = await htmlResponse.text().catch(() => "");
    console.error(`[MCP] Failed to fetch ${htmlPath}: ${htmlResponse.status} ${htmlResponse.statusText}`);
    console.error(`[MCP] Error response body: ${errorText.substring(0, 500)}`);
    throw new Error(`Failed to fetch ${htmlPath}: ${htmlResponse.status} ${htmlResponse.statusText}. ${errorText.substring(0, 200)}`);
  }
  const content = await htmlResponse.text();
  if (!content || content.trim().length === 0) {
    throw new Error(`Empty response for ${htmlPath}`);
  }
  console.log(`[MCP] Successfully loaded ${htmlPath}, content length: ${content.length}`);
  return content;
}
__name(loadHtml, "loadHtml");
async function buildMcpAppHtml(assets, resourceUri) {
  let html = await loadHtml(assets, "/widgets/worldcup-widget.html");
  const jsPattern = /<script[^>]*src=["'](\/assets\/[^"']+\.js)["'][^>]*>[\s\S]*?<\/script>/g;
  const jsMatches = Array.from(html.matchAll(jsPattern));
  if (jsMatches.length > 0) {
    const firstMatch = jsMatches[0];
    const jsPath = firstMatch[1];
    console.log(`[MCP] Found ${jsMatches.length} JS script tag(s) to inline, path: ${jsPath}`);
    try {
      const jsContent = await loadHtml(assets, jsPath);
      if (!jsContent || jsContent.trim().length === 0) {
        throw new Error(`Empty JS content for ${jsPath}`);
      }
      console.log(`[MCP] Loaded JS content, length: ${jsContent.length}`);
      let replacementCount = 0;
      for (const match2 of jsMatches) {
        html = html.replace(match2[0], `<script type="module">${jsContent}<\/script>`);
        replacementCount++;
      }
      console.log(`[MCP] Replaced ${replacementCount} JS tag(s), HTML length now: ${html.length}`);
      const remainingScripts = html.match(new RegExp(`<script[^>]*src=["']${jsPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>`, "g"));
      if (remainingScripts && remainingScripts.length > 0) {
        console.error(`[MCP] WARNING: ${remainingScripts.length} script tag(s) with src="${jsPath}" still remain after replacement`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[MCP] Failed to load JS asset ${jsPath}:`, errorMsg);
      throw new Error(`Failed to inline JS asset: ${errorMsg}`);
    }
  } else {
    const allScriptTags = html.match(/<script[^>]*>/g);
    console.warn(`[MCP] No JS script tag found matching pattern. Found ${allScriptTags?.length || 0} script tags total.`);
    if (allScriptTags) {
      console.warn(`[MCP] Script tags found:`, allScriptTags);
    }
    console.warn(`[MCP] HTML preview: ${html.substring(0, 800)}`);
  }
  const cssMatch = html.match(/<link\s+rel="stylesheet"\s+crossorigin\s+href="(\/assets\/[^"]+\.css)"\s*\/?>/);
  if (cssMatch && cssMatch[1]) {
    try {
      const cssPath = cssMatch[1];
      const cssContent = await loadHtml(assets, cssPath);
      if (!cssContent || cssContent.trim().length === 0) {
        throw new Error(`Empty CSS content for ${cssPath}`);
      }
      html = html.replace(cssMatch[0], `<style>${cssContent}</style>`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[MCP] Failed to load CSS asset ${cssMatch[1]}:`, errorMsg);
      throw new Error(`Failed to inline CSS asset: ${errorMsg}`);
    }
  }
  if (!html.includes("<!doctype html") && !html.includes("<html")) {
    throw new Error("Invalid HTML: missing doctype or html tag");
  }
  const remainingExternalScriptsPattern = /<script[^>]*src=["'](\/assets\/[^"']+\.(js|mjs))["'][^>]*>[\s\S]*?<\/script>/g;
  const remainingMatches = Array.from(html.matchAll(remainingExternalScriptsPattern));
  if (remainingMatches.length > 0) {
    const pathsToInline = /* @__PURE__ */ new Set();
    remainingMatches.forEach((match2) => {
      if (match2[1]) pathsToInline.add(match2[1]);
    });
    console.error(`[MCP] WARNING: Found ${remainingMatches.length} external script reference(s) that weren't inlined`);
    for (const jsPath of pathsToInline) {
      console.log(`[MCP] Attempting emergency inline for ${jsPath}`);
      try {
        const jsContent = await loadHtml(assets, jsPath);
        if (jsContent && jsContent.trim().length > 0) {
          const pathPattern = new RegExp(`<script[^>]*src=["']${jsPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>[\\s\\S]*?<\/script>`, "g");
          const beforeLength = html.length;
          html = html.replace(pathPattern, `<script type="module">${jsContent}<\/script>`);
          const afterLength = html.length;
          const replaced = beforeLength !== afterLength;
          if (replaced) {
            console.log(`[MCP] Emergency inline successful for ${jsPath}`);
          } else {
            console.warn(`[MCP] Emergency inline found no matches to replace for ${jsPath}`);
          }
        }
      } catch (err) {
        console.error(`[MCP] Emergency inline failed for ${jsPath}:`, err);
      }
    }
  }
  html = html.replace(
    "</head>",
    `<script>window.__MCP_RESOURCE_URI__ = "${resourceUri}";<\/script></head>`
  );
  const finalExternalScriptCheck = html.match(/<script[^>]*src=["']\/assets\/[^"']+["'][^>]*>/g);
  if (finalExternalScriptCheck && finalExternalScriptCheck.length > 0) {
    console.error(`[MCP] ERROR: Found ${finalExternalScriptCheck.length} script tag(s) with external src still remaining:`);
    finalExternalScriptCheck.forEach((tag, i) => {
      console.error(`[MCP]   Script tag ${i}: ${tag}`);
    });
  } else {
    const allScriptTags = html.match(/<script[^>]*>/g);
    console.log(`[MCP] Final HTML check - ${allScriptTags?.length || 0} script tag(s) found, all appear to be inlined (no external src)`);
  }
  return html;
}
__name(buildMcpAppHtml, "buildMcpAppHtml");
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
    return {
      data: { teams, groups, bracketTemplate, prediction, playoffSlots }
    };
  }, "worldcup.getDataForWidget"),
  "worldcup.savePrediction": /* @__PURE__ */ __name(async (args) => {
    const incoming = args.prediction;
    if (!incoming) throw new Error("Missing prediction parameter");
    if (incoming.thirdPlaceSelection.advancingThirdPlaceTeamIds.length !== 8) {
      throw new Error("thirdPlaceSelection must contain exactly 8 team ids");
    }
    savedPrediction = incoming;
    return { ok: true, summary: "Prediction saved", snapshot: incoming };
  }, "worldcup.savePrediction"),
  "worldcup.computeBracket": /* @__PURE__ */ __name(async (args) => {
    const nextPrediction = {
      groups: args.groups ?? defaultGroupPredictions(),
      thirdPlaceSelection: args.thirdPlaceSelection ?? {
        advancingThirdPlaceTeamIds: []
      },
      knockout: args.knockout ?? emptyKnockout()
    };
    if (nextPrediction.thirdPlaceSelection.advancingThirdPlaceTeamIds.length !== 8) {
      throw new Error("thirdPlaceSelection must contain exactly 8 team ids");
    }
    const bracket = resolveBracket(nextPrediction);
    return { bracket, metadata: { [UI_RESOURCE_URI_KEY]: "ui://worldcup/bracket" } };
  }, "worldcup.computeBracket"),
  "worldcup.getBracketTemplate": /* @__PURE__ */ __name(async () => ({ bracketTemplate }), "worldcup.getBracketTemplate"),
  "worldcup.test": /* @__PURE__ */ __name(async () => ({ message: "Test successful", time: (/* @__PURE__ */ new Date()).toISOString() }), "worldcup.test")
};
var mcpTools = [
  {
    name: "worldcup.getInitialData",
    description: "Return teams, groups, bracket template, and any saved prediction. Opens the World Cup prediction UI.",
    inputSchema: {
      type: "object",
      properties: {
        includeSaved: { type: "boolean" }
      }
    },
    _meta: {
      "ui/resourceUri": "ui://worldcup/groups"
    }
  },
  {
    name: "worldcup.getDataForWidget",
    description: "Return teams, groups, bracket template, and any saved prediction for the widget UI.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "worldcup.savePrediction",
    description: "Persist a World Cup prediction (in-memory).",
    inputSchema: {
      type: "object",
      properties: {
        prediction: { type: "object" }
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
        groups: { type: "array" },
        thirdPlaceSelection: { type: "object" },
        knockout: { type: "object" }
      },
      required: ["groups", "thirdPlaceSelection"]
    },
    _meta: {
      "ui/resourceUri": "ui://worldcup/bracket"
    }
  },
  {
    name: "worldcup.getBracketTemplate",
    description: "Return the deterministic bracket template.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "worldcup.test",
    description: "Test tool to verify MCP App rendering. Opens a simple static test page.",
    inputSchema: {
      type: "object",
      properties: {}
    },
    _meta: {
      "ui/resourceUri": "ui://worldcup/test"
    }
  }
];
var MCP_RESOURCES = [
  { uri: "ui://worldcup/groups", name: "World Cup Groups", mimeType: "text/html;profile=mcp-app" },
  { uri: "ui://worldcup/third-place", name: "Third Place Selection", mimeType: "text/html;profile=mcp-app" },
  { uri: "ui://worldcup/bracket", name: "Knockout Bracket", mimeType: "text/html;profile=mcp-app" },
  { uri: "ui://worldcup/test", name: "Test Page", mimeType: "text/html;profile=mcp-app" }
];
var TEST_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MCP App Test</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; background: #f5f5f5; }
    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; }
    p { color: #666; }
    .success { color: green; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h1>\u{1F3C6} MCP App Test</h1>
    <p class="success">\u2705 If you can see this, MCP Jam is rendering the HTML correctly!</p>
    <p>This is a simple static HTML page without JavaScript.</p>
    <p>Time: <span id="time">Loading...</span></p>
  </div>
  <script>
    document.getElementById('time').textContent = new Date().toLocaleTimeString();
    console.log('[MCP Test App] Static test page loaded successfully');
  <\/script>
</body>
</html>`;
var SERVER_INFO = {
  name: "worldcup-2026",
  version: "1.0.0"
};
var McpServer = class {
  static {
    __name(this, "McpServer");
  }
  assets;
  constructor(assets) {
    this.assets = assets;
  }
  async handleRequest(req) {
    if (Array.isArray(req)) {
      return Promise.all(req.map((r) => this.handleSingleRequest(r)));
    }
    return this.handleSingleRequest(req);
  }
  async handleSingleRequest(req) {
    const id = req.id ?? null;
    console.log(`[MCP] handleSingleRequest - method: ${req.method}, id: ${id}, params:`, JSON.stringify(req.params));
    switch (req.method) {
      case "initialize": {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {},
              resources: {},
              prompts: {},
              extensions: {
                "io.modelcontextprotocol/ui": {
                  mimeTypes: ["text/html;profile=mcp-app"]
                }
              }
            },
            serverInfo: SERVER_INFO
          }
        };
      }
      case "notifications/initialized": {
        return { jsonrpc: "2.0", id, result: {} };
      }
      case "tools/list": {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            tools: mcpTools.map((tool) => ({
              name: tool.name,
              description: tool.description,
              inputSchema: tool.inputSchema,
              _meta: tool._meta
            }))
          }
        };
      }
      case "tools/call": {
        const params = req.params;
        const toolName = params?.name;
        const toolArgs = params?.arguments ?? {};
        const handler = toolHandlers[toolName];
        if (!handler) {
          return {
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: `Unknown tool: ${toolName}` }
          };
        }
        try {
          const result = await handler(toolArgs);
          const toolDef = mcpTools.find((t) => t.name === toolName);
          const toolMeta = toolDef?._meta;
          return {
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
              ...toolMeta ? { _meta: toolMeta } : {}
            }
          };
        } catch (err) {
          return {
            jsonrpc: "2.0",
            id,
            error: { code: -32e3, message: err.message }
          };
        }
      }
      case "resources/list": {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            resources: MCP_RESOURCES.map((r) => ({
              uri: r.uri,
              name: r.name,
              mimeType: r.mimeType
            }))
          }
        };
      }
      case "resources/read": {
        const params = req.params;
        const uri = params?.uri;
        console.log(`[MCP] resources/read - URI: ${uri}`);
        const resource = MCP_RESOURCES.find((r) => r.uri === uri);
        if (!resource) {
          console.error(`[MCP] Unknown resource: ${uri}`);
          return {
            jsonrpc: "2.0",
            id,
            error: { code: -32602, message: `Unknown resource: ${uri}` }
          };
        }
        try {
          let html;
          if (uri === "ui://worldcup/test") {
            html = TEST_HTML;
            console.log(`[MCP] Using test HTML for ${uri}`);
          } else {
            console.log(`[MCP] Building HTML for ${uri}...`);
            html = await buildMcpAppHtml(this.assets, uri);
            if (!html.includes("<!doctype html") && !html.includes("<html")) {
              throw new Error(`Expected HTML but got: ${html.substring(0, 100)}...`);
            }
            console.log(`[MCP] Built HTML for ${uri}, length: ${html.length}`);
          }
          const response = {
            jsonrpc: "2.0",
            id,
            result: {
              contents: [
                {
                  uri: resource.uri,
                  mimeType: resource.mimeType,
                  text: html,
                  _meta: {
                    ui: {
                      csp: {
                        connectDomains: [],
                        resourceDomains: []
                      },
                      prefersBorder: false
                    }
                  }
                }
              ]
            }
          };
          console.log(`[MCP] Returning resource for ${uri}, mimeType: ${resource.mimeType}, html length: ${html.length}`);
          console.log(`[MCP] Response structure:`, JSON.stringify({
            jsonrpc: response.jsonrpc,
            id: response.id,
            result: {
              contents: response.result.contents.map((c) => ({
                uri: c.uri,
                mimeType: c.mimeType,
                textLength: c.text?.length,
                hasMeta: !!c._meta
              }))
            }
          }));
          return response;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error(`[MCP] Failed to build resource ${uri}:`, errorMessage);
          console.error(`[MCP] Error stack:`, err instanceof Error ? err.stack : String(err));
          return {
            jsonrpc: "2.0",
            id,
            error: {
              code: -32e3,
              message: `Failed to build resource: ${errorMessage}`,
              data: { uri, error: errorMessage }
            }
          };
        }
      }
      case "ping": {
        return { jsonrpc: "2.0", id, result: {} };
      }
      case "prompts/list": {
        return { jsonrpc: "2.0", id, result: { prompts: [] } };
      }
      case "logging/setLevel": {
        return { jsonrpc: "2.0", id, result: {} };
      }
      default: {
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Method not found: ${req.method}` }
        };
      }
    }
  }
};
function createMcpServer(assets) {
  return new McpServer(assets);
}
__name(createMcpServer, "createMcpServer");

// server/worker.ts
var app = new Hono2();
app.use("*", cors());
app.all("/mcp", async (c) => {
  const server = createMcpServer(c.env.ASSETS);
  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Parse error" }
    }, 400);
  }
  console.log(`[Worker] Received request:`, JSON.stringify(body, null, 2));
  const response = await server.handleRequest(body);
  console.log(`[Worker] Sending response:`, JSON.stringify(response, null, 2).substring(0, 500));
  return c.json(response);
});
app.get("/", (c) => {
  return c.json({
    name: "worldcup-2026-mcp",
    version: "1.0.0",
    status: "ok"
  });
});
var worker_default = app;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
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

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
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
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-HbOHfV/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
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

// .wrangler/tmp/bundle-HbOHfV/middleware-loader.entry.ts
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
//# sourceMappingURL=worker.js.map
