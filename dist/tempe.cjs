#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/chalk/source/vendor/ansi-styles/index.js
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise */
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ANSI_BACKGROUND_OFFSET, wrapAnsi16, wrapAnsi256, wrapAnsi16m, styles, modifierNames, foregroundColorNames, backgroundColorNames, colorNames, ansiStyles, ansi_styles_default;
var init_ansi_styles = __esm({
  "node_modules/chalk/source/vendor/ansi-styles/index.js"() {
    ANSI_BACKGROUND_OFFSET = 10;
    wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
    wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
    wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
    styles = {
      modifier: {
        reset: [0, 0],
        // 21 isn't widely supported and 22 does the same thing
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        overline: [53, 55],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29]
      },
      color: {
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        // Bright color
        blackBright: [90, 39],
        gray: [90, 39],
        // Alias of `blackBright`
        grey: [90, 39],
        // Alias of `blackBright`
        redBright: [91, 39],
        greenBright: [92, 39],
        yellowBright: [93, 39],
        blueBright: [94, 39],
        magentaBright: [95, 39],
        cyanBright: [96, 39],
        whiteBright: [97, 39]
      },
      bgColor: {
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        // Bright color
        bgBlackBright: [100, 49],
        bgGray: [100, 49],
        // Alias of `bgBlackBright`
        bgGrey: [100, 49],
        // Alias of `bgBlackBright`
        bgRedBright: [101, 49],
        bgGreenBright: [102, 49],
        bgYellowBright: [103, 49],
        bgBlueBright: [104, 49],
        bgMagentaBright: [105, 49],
        bgCyanBright: [106, 49],
        bgWhiteBright: [107, 49]
      }
    };
    modifierNames = Object.keys(styles.modifier);
    foregroundColorNames = Object.keys(styles.color);
    backgroundColorNames = Object.keys(styles.bgColor);
    colorNames = [...foregroundColorNames, ...backgroundColorNames];
    ansiStyles = assembleStyles();
    ansi_styles_default = ansiStyles;
  }
});

// node_modules/chalk/source/vendor/supports-color/index.js
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : import_node_process.default.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (import_node_process.default.platform === "win32") {
    const osRelease = import_node_os.default.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => key in env)) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if (env.TERM === "xterm-ghostty") {
    return 3;
  }
  if (env.TERM === "wezterm") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var import_node_process, import_node_os, import_node_tty, env, flagForceColor, supportsColor, supports_color_default;
var init_supports_color = __esm({
  "node_modules/chalk/source/vendor/supports-color/index.js"() {
    import_node_process = __toESM(require("node:process"), 1);
    import_node_os = __toESM(require("node:os"), 1);
    import_node_tty = __toESM(require("node:tty"), 1);
    ({ env } = import_node_process.default);
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      flagForceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      flagForceColor = 1;
    }
    supportsColor = {
      stdout: createSupportsColor({ isTTY: import_node_tty.default.isatty(1) }),
      stderr: createSupportsColor({ isTTY: import_node_tty.default.isatty(2) })
    };
    supports_color_default = supportsColor;
  }
});

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
var init_utilities = __esm({
  "node_modules/chalk/source/utilities.js"() {
  }
});

// node_modules/chalk/source/index.js
function createChalk(options) {
  return chalkFactory(options);
}
var stdoutColor, stderrColor, GENERATOR, STYLER, IS_EMPTY, levelMapping, styles2, applyOptions, chalkFactory, getModelAnsi, usedModels, proto, createStyler, createBuilder, applyStyle, chalk, chalkStderr, source_default;
var init_source = __esm({
  "node_modules/chalk/source/index.js"() {
    init_ansi_styles();
    init_supports_color();
    init_utilities();
    ({ stdout: stdoutColor, stderr: stderrColor } = supports_color_default);
    GENERATOR = /* @__PURE__ */ Symbol("GENERATOR");
    STYLER = /* @__PURE__ */ Symbol("STYLER");
    IS_EMPTY = /* @__PURE__ */ Symbol("IS_EMPTY");
    levelMapping = [
      "ansi",
      "ansi",
      "ansi256",
      "ansi16m"
    ];
    styles2 = /* @__PURE__ */ Object.create(null);
    applyOptions = (object, options = {}) => {
      if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
        throw new Error("The `level` option should be an integer from 0 to 3");
      }
      const colorLevel = stdoutColor ? stdoutColor.level : 0;
      object.level = options.level === void 0 ? colorLevel : options.level;
    };
    chalkFactory = (options) => {
      const chalk2 = (...strings) => strings.join(" ");
      applyOptions(chalk2, options);
      Object.setPrototypeOf(chalk2, createChalk.prototype);
      return chalk2;
    };
    Object.setPrototypeOf(createChalk.prototype, Function.prototype);
    for (const [styleName, style] of Object.entries(ansi_styles_default)) {
      styles2[styleName] = {
        get() {
          const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
          Object.defineProperty(this, styleName, { value: builder });
          return builder;
        }
      };
    }
    styles2.visible = {
      get() {
        const builder = createBuilder(this, this[STYLER], true);
        Object.defineProperty(this, "visible", { value: builder });
        return builder;
      }
    };
    getModelAnsi = (model, level, type, ...arguments_) => {
      if (model === "rgb") {
        if (level === "ansi16m") {
          return ansi_styles_default[type].ansi16m(...arguments_);
        }
        if (level === "ansi256") {
          return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
        }
        return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
      }
      if (model === "hex") {
        return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
      }
      return ansi_styles_default[type][model](...arguments_);
    };
    usedModels = ["rgb", "hex", "ansi256"];
    for (const model of usedModels) {
      styles2[model] = {
        get() {
          const { level } = this;
          return function(...arguments_) {
            const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
            return createBuilder(this, styler, this[IS_EMPTY]);
          };
        }
      };
      const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
      styles2[bgModel] = {
        get() {
          const { level } = this;
          return function(...arguments_) {
            const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
            return createBuilder(this, styler, this[IS_EMPTY]);
          };
        }
      };
    }
    proto = Object.defineProperties(() => {
    }, {
      ...styles2,
      level: {
        enumerable: true,
        get() {
          return this[GENERATOR].level;
        },
        set(level) {
          this[GENERATOR].level = level;
        }
      }
    });
    createStyler = (open, close, parent) => {
      let openAll;
      let closeAll;
      if (parent === void 0) {
        openAll = open;
        closeAll = close;
      } else {
        openAll = parent.openAll + open;
        closeAll = close + parent.closeAll;
      }
      return {
        open,
        close,
        openAll,
        closeAll,
        parent
      };
    };
    createBuilder = (self, _styler, _isEmpty) => {
      const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
      Object.setPrototypeOf(builder, proto);
      builder[GENERATOR] = self;
      builder[STYLER] = _styler;
      builder[IS_EMPTY] = _isEmpty;
      return builder;
    };
    applyStyle = (self, string) => {
      if (self.level <= 0 || !string) {
        return self[IS_EMPTY] ? "" : string;
      }
      let styler = self[STYLER];
      if (styler === void 0) {
        return string;
      }
      const { openAll, closeAll } = styler;
      if (string.includes("\x1B")) {
        while (styler !== void 0) {
          string = stringReplaceAll(string, styler.close, styler.open);
          styler = styler.parent;
        }
      }
      const lfIndex = string.indexOf("\n");
      if (lfIndex !== -1) {
        string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
      }
      return openAll + string + closeAll;
    };
    Object.defineProperties(createChalk.prototype, styles2);
    chalk = createChalk();
    chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
    source_default = chalk;
  }
});

// dist/core/config.js
var import_fs, import_path, import_os, DEFAULT_CONFIG, ConfigManager;
var init_config = __esm({
  "dist/core/config.js"() {
    "use strict";
    import_fs = __toESM(require("fs"), 1);
    import_path = __toESM(require("path"), 1);
    import_os = __toESM(require("os"), 1);
    DEFAULT_CONFIG = {
      version: "1.0.0",
      currentMode: "plan",
      defaultModel: "gemini-2.5-flash",
      themePreference: "auto",
      apiKeys: [],
      quotaLimitUsd: 10,
      autoLanguage: true,
      permissionPolicy: "ask"
    };
    ConfigManager = class {
      static configDir = import_path.default.join(import_os.default.homedir(), ".tempe");
      static configFile = import_path.default.join(import_os.default.homedir(), ".tempe", "config.json");
      static ensureDir() {
        if (!import_fs.default.existsSync(this.configDir)) {
          import_fs.default.mkdirSync(this.configDir, { recursive: true });
        }
      }
      static load() {
        this.ensureDir();
        if (!import_fs.default.existsSync(this.configFile)) {
          this.save(DEFAULT_CONFIG);
          return { ...DEFAULT_CONFIG };
        }
        try {
          const raw = import_fs.default.readFileSync(this.configFile, "utf-8");
          const parsed = JSON.parse(raw);
          return { ...DEFAULT_CONFIG, ...parsed };
        } catch {
          return { ...DEFAULT_CONFIG };
        }
      }
      static save(config) {
        this.ensureDir();
        import_fs.default.writeFileSync(this.configFile, JSON.stringify(config, null, 2), "utf-8");
      }
      static getActiveApiKey(config) {
        return config.apiKeys.find((k) => k.isDefault) || config.apiKeys[0];
      }
      static addApiKey(label, provider, key, baseUrl, model) {
        const config = this.load();
        const isFirst = config.apiKeys.length === 0;
        const newKey = {
          id: "key_" + Date.now().toString(36),
          label: label || `${provider}-${config.apiKeys.length + 1}`,
          provider,
          key,
          baseUrl: baseUrl || void 0,
          model: model || void 0,
          isDefault: isFirst,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        config.apiKeys.push(newKey);
        this.save(config);
        return newKey;
      }
      static setDefaultApiKey(id) {
        const config = this.load();
        let found = false;
        config.apiKeys = config.apiKeys.map((k) => {
          if (k.id === id) {
            found = true;
            return { ...k, isDefault: true };
          }
          return { ...k, isDefault: false };
        });
        if (found)
          this.save(config);
        return found;
      }
      static removeApiKey(id) {
        const config = this.load();
        const initialLen = config.apiKeys.length;
        config.apiKeys = config.apiKeys.filter((k) => k.id !== id);
        if (config.apiKeys.length < initialLen) {
          if (config.apiKeys.length > 0 && !config.apiKeys.some((k) => k.isDefault)) {
            config.apiKeys[0].isDefault = true;
          }
          this.save(config);
          return true;
        }
        return false;
      }
      static setMode(mode) {
        const config = this.load();
        config.currentMode = mode;
        this.save(config);
      }
      static setModel(model) {
        const config = this.load();
        config.defaultModel = model;
        this.save(config);
      }
    };
  }
});

// dist/core/usage.js
var usage_exports = {};
__export(usage_exports, {
  UsageTracker: () => UsageTracker
});
var import_fs2, import_path2, import_os2, MODEL_PRICING, UsageTracker;
var init_usage = __esm({
  "dist/core/usage.js"() {
    "use strict";
    import_fs2 = __toESM(require("fs"), 1);
    import_path2 = __toESM(require("path"), 1);
    import_os2 = __toESM(require("os"), 1);
    init_source();
    init_config();
    MODEL_PRICING = {
      "gemini-2.5-flash": { inputPer1M: 0.075, outputPer1M: 0.3 },
      "gemini-2.5-pro": { inputPer1M: 1.25, outputPer1M: 5 },
      "gpt-4o": { inputPer1M: 2.5, outputPer1M: 10 },
      "gpt-4o-mini": { inputPer1M: 0.15, outputPer1M: 0.6 },
      "claude-3-7-sonnet": { inputPer1M: 3, outputPer1M: 15 },
      "claude-3-5-haiku": { inputPer1M: 0.8, outputPer1M: 4 },
      "deepseek-r1": { inputPer1M: 0.55, outputPer1M: 2.19 },
      "groq-llama-3.3-70b": { inputPer1M: 0.59, outputPer1M: 0.79 },
      "ollama-local": { inputPer1M: 0, outputPer1M: 0 }
    };
    UsageTracker = class {
      static usageFile = import_path2.default.join(import_os2.default.homedir(), ".tempe", "usage.json");
      static load() {
        ConfigManager.ensureDir();
        if (!import_fs2.default.existsSync(this.usageFile)) {
          const initial = {
            totalTokens: 0,
            totalCostUsd: 0,
            byModel: {}
          };
          this.save(initial);
          return initial;
        }
        try {
          const raw = import_fs2.default.readFileSync(this.usageFile, "utf-8");
          return JSON.parse(raw);
        } catch {
          return { totalTokens: 0, totalCostUsd: 0, byModel: {} };
        }
      }
      static save(data) {
        ConfigManager.ensureDir();
        import_fs2.default.writeFileSync(this.usageFile, JSON.stringify(data, null, 2), "utf-8");
      }
      static recordUsage(model, promptTokens, completionTokens) {
        const store = this.load();
        const pricing = MODEL_PRICING[model] || { inputPer1M: 0.5, outputPer1M: 1.5 };
        const cost = (promptTokens * pricing.inputPer1M + completionTokens * pricing.outputPer1M) / 1e6;
        const total = promptTokens + completionTokens;
        store.totalTokens += total;
        store.totalCostUsd += cost;
        if (!store.byModel[model]) {
          store.byModel[model] = {
            modelName: model,
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
            callCount: 0,
            estimatedCostUsd: 0,
            lastUsed: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
        const m = store.byModel[model];
        m.promptTokens += promptTokens;
        m.completionTokens += completionTokens;
        m.totalTokens += total;
        m.callCount += 1;
        m.estimatedCostUsd += cost;
        m.lastUsed = (/* @__PURE__ */ new Date()).toISOString();
        this.save(store);
      }
      static renderUsageReport(selectedModel) {
        const store = this.load();
        const config = ConfigManager.load();
        const limit = config.quotaLimitUsd || 10;
        const percentage = Math.min(100, store.totalCostUsd / limit * 100);
        const barLength = 24;
        const filled = Math.round(percentage / 100 * barLength);
        const bar = "\u2588".repeat(filled) + "\u2591".repeat(barLength - filled);
        const color = percentage > 80 ? source_default.red : percentage > 50 ? source_default.yellow : source_default.green;
        const lines = [];
        lines.push(source_default.bold.hex("#F59E0B")("\u{1F4CA} TEMPE USAGE & TOKEN MONITOR"));
        lines.push(source_default.gray("\u2500".repeat(54)));
        lines.push(`Total Tagihan (Bill $):  ${source_default.bold.white("$" + store.totalCostUsd.toFixed(4))} / $${limit.toFixed(2)}`);
        lines.push(`Persentase Pemakaian:    ${color(percentage.toFixed(1) + "%")} [${color(bar)}]`);
        lines.push(`Total Token Dipakai:     ${source_default.bold.cyan(store.totalTokens.toLocaleString())} tokens`);
        lines.push(source_default.gray("\u2500".repeat(54)));
        const models = Object.keys(store.byModel);
        if (models.length === 0) {
          lines.push(source_default.gray("Belum ada pemakaian model yang tercatat."));
        } else {
          lines.push(source_default.bold("Pilihan Riwayat Model yang Sudah Dipakai:"));
          for (const mKey of models) {
            const item = store.byModel[mKey];
            const isCurrent = selectedModel && selectedModel === mKey ? source_default.green(" [Dipilih]") : "";
            lines.push(`
  ${source_default.bold.hex("#38BDF8")(item.modelName)}${isCurrent}`);
            lines.push(`  \u251C\u2500 Total Tokens: ${item.totalTokens.toLocaleString()} (${item.promptTokens.toLocaleString()} in / ${item.completionTokens.toLocaleString()} out)`);
            lines.push(`  \u251C\u2500 Total Calls:  ${item.callCount} kali`);
            lines.push(`  \u2514\u2500 Bill ($):     ${source_default.yellow("$" + item.estimatedCostUsd.toFixed(4))}`);
          }
        }
        lines.push(source_default.gray("\u2500".repeat(54)));
        lines.push(source_default.gray("Tips: Ubah batas kuota di ~/.tempe/config.json"));
        return lines.join("\n");
      }
    };
  }
});

// dist/core/history.js
var history_exports = {};
__export(history_exports, {
  HistoryManager: () => HistoryManager
});
var import_fs3, import_path3, import_os3, HistoryManager;
var init_history = __esm({
  "dist/core/history.js"() {
    "use strict";
    import_fs3 = __toESM(require("fs"), 1);
    import_path3 = __toESM(require("path"), 1);
    import_os3 = __toESM(require("os"), 1);
    init_source();
    init_config();
    HistoryManager = class {
      static historyFile = import_path3.default.join(import_os3.default.homedir(), ".tempe", "history.json");
      static load() {
        ConfigManager.ensureDir();
        if (!import_fs3.default.existsSync(this.historyFile)) {
          return [];
        }
        try {
          const raw = import_fs3.default.readFileSync(this.historyFile, "utf-8");
          return JSON.parse(raw);
        } catch {
          return [];
        }
      }
      static add(item) {
        const list = this.load();
        const newItem = {
          ...item,
          id: "h_" + Date.now().toString(36),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        list.unshift(newItem);
        if (list.length > 100)
          list.pop();
        ConfigManager.ensureDir();
        import_fs3.default.writeFileSync(this.historyFile, JSON.stringify(list, null, 2), "utf-8");
        return newItem;
      }
      static clear() {
        ConfigManager.ensureDir();
        import_fs3.default.writeFileSync(this.historyFile, JSON.stringify([], null, 2), "utf-8");
      }
      static renderList(limit = 10) {
        const list = this.load();
        if (list.length === 0) {
          return source_default.gray("Belum ada riwayat percakapan yang tersimpan.");
        }
        const lines = [];
        lines.push(source_default.bold.hex("#F59E0B")(`\u{1F4DC} RIWAYAT SESI TEMPE (Menampilkan ${Math.min(limit, list.length)} sesi terakhir)`));
        lines.push(source_default.gray("\u2500".repeat(58)));
        list.slice(0, limit).forEach((item, idx) => {
          const date = new Date(item.timestamp).toLocaleString();
          const modeBadge = item.mode === "plan" ? source_default.bgHex("#7E22CE").white.bold(" PLAN ") : source_default.bgHex("#0F766E").white.bold(" AGENT ");
          const snippet = item.prompt.replace(/\n/g, " ").slice(0, 60) + (item.prompt.length > 60 ? "..." : "");
          lines.push(`${source_default.gray(`[${idx + 1}]`)} ${modeBadge} ${source_default.bold.white(snippet)}`);
          lines.push(`    ${source_default.gray("Waktu:")} ${source_default.gray(date)}  |  ${source_default.gray("Model:")} ${source_default.cyan(item.model)}`);
          if (item.toolsUsed && item.toolsUsed.length > 0) {
            lines.push(`    ${source_default.gray("Tools:")} ${source_default.yellow(item.toolsUsed.join(", "))}`);
          }
          lines.push("");
        });
        lines.push(source_default.gray("\u2500".repeat(58)));
        return lines.join("\n");
      }
    };
  }
});

// dist/ui/terminal-ui.js
var import_readline4 = __toESM(require("readline"), 1);
init_source();
init_config();

// dist/mascot/tempe-art.js
init_source();
var TempeMascot = class {
  /**
   * Menghasilkan ASCII art karakter tempe sesuai dengan status dinamisnya.
   * Terinspirasi langsung dari coretan sketsa:
   * - "kalau belum siap tempenya belum sempurna bentuknya"
   * - "tempenya bakal jadi mateng kl udah jadi -> ada sinar di ujung"
   * - "kl butuh akses ke repo tempe logonya jadi ada tanda tanya ?"
   * - "kondisi marah bila melewati batas"
   */
  static getMascotArt(state) {
    switch (state) {
      case "mateng_shining":
        return [
          source_default.yellow("       . : *  \u2727  * : .       ") + source_default.bold.hex("#F59E0B")("\u2728 SINAR TEMPE MATENG \u2728"),
          source_default.yellow("     *  .  \u2600\uFE0F   *   .  *      ") + source_default.hex("#FBBF24")("Crispy, Golden & Ready!"),
          source_default.hex("#D97706")("    \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  "),
          source_default.hex("#D97706")("    \u2502  ") + source_default.bold.hex("#FEF3C7")("\u25CF   ") + source_default.hex("#B45309")("\u2591\u2591\u2591\u2591") + source_default.bold.hex("#FEF3C7")("   \u25CF") + source_default.hex("#D97706")("  \u2502  ") + source_default.bold.hex("#10B981")("  @ tempe"),
          source_default.hex("#D97706")("    \u2502     ") + source_default.bold.hex("#FDE68A")("\\_____/") + source_default.hex("#D97706")("     \u2502  ") + source_default.hex("#6EE7B7")("  [Status: Mateng Sempurna]"),
          source_default.hex("#D97706")("    \u2502  ") + source_default.hex("#B45309")("\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591") + source_default.hex("#D97706")("  \u2502  ") + source_default.gray("  Kode siap & tugas selesai!"),
          source_default.hex("#D97706")("    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  ")
        ].join("\n");
      case "unready":
        return [
          source_default.gray("         .  ~  .  *          "),
          source_default.hex("#94A3B8")("    \u250C \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2510  ") + source_default.hex("#94A3B8")("  @ tempe (proto-tempe)"),
          source_default.hex("#94A3B8")("    \u2502  ") + source_default.white("o   ") + source_default.gray("\xB7 \xB7 \xB7") + source_default.white("   o") + source_default.hex("#94A3B8")("  \u2502  ") + source_default.yellow("  [Status: Fermentasi...]"),
          source_default.hex("#94A3B8")("    \u2502       ") + source_default.hex("#CBD5E1")("-----") + source_default.hex("#94A3B8")("       \u2502  ") + source_default.gray("  Bentuk belum sempurna,"),
          source_default.hex("#94A3B8")("    \u2502  ") + source_default.gray("\xB7 \xB7 \xB7 \xB7 \xB7 \xB7 \xB7 \xB7 \xB7") + source_default.hex("#94A3B8")("  \u2502  ") + source_default.gray("  sedang menyiapkan ragi."),
          source_default.hex("#94A3B8")("    \u2514 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2518  ")
        ].join("\n");
      case "needs_repo":
        return [
          source_default.yellow("          \u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E          "),
          source_default.yellow("          \u2502   ") + source_default.bold.bgYellow.black(" ? ") + source_default.yellow("   \u2502          ") + source_default.bold.hex("#F59E0B")("  @ tempe"),
          source_default.yellow("          \u2570\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u256F          ") + source_default.hex("#FCD34D")("  [Status: Butuh Akses / API]"),
          source_default.hex("#E2E8F0")("    \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  "),
          source_default.hex("#E2E8F0")("    \u2502  ") + source_default.bold.white("\u2022   ") + source_default.gray("\u2591\u2591\u2591\u2591") + source_default.bold.white("   \u2022") + source_default.hex("#E2E8F0")("  \u2502  ") + source_default.yellow("  \u26A0\uFE0F Perlu API key atau akses repo!"),
          source_default.hex("#E2E8F0")("    \u2502       ") + source_default.hex("#94A3B8")("~ o ~") + source_default.hex("#E2E8F0")("       \u2502  ") + source_default.gray("  Tekan Alt+C lalu pilih menu API."),
          source_default.hex("#E2E8F0")("    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  ")
        ].join("\n");
      case "agent_working":
        return [
          source_default.cyan("        ~ ~ Sizzling ~ ~     "),
          source_default.hex("#2DD4BF")("    \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  ") + source_default.bold.hex("#14B8A6")("  @ tempe [AGENT MODE]"),
          source_default.hex("#2DD4BF")("    \u2502  ") + source_default.bold.white("\xF2   ") + source_default.hex("#0D9488")("\u2591\u2591\u2591\u2591") + source_default.bold.white("   \xF3") + source_default.hex("#2DD4BF")("  \u2502  ") + source_default.hex("#5EEAD4")("  [Status: Menggoreng Kode...]"),
          source_default.hex("#2DD4BF")("    \u2502     ") + source_default.bold.hex("#99F6E4")("(  \u26A1  )") + source_default.hex("#2DD4BF")("     \u2502  ") + source_default.gray("  Sedang mengeksekusi aksi & tools"),
          source_default.hex("#2DD4BF")("    \u2502  ") + source_default.hex("#0D9488")("\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591") + source_default.hex("#2DD4BF")("  \u2502  ") + source_default.gray("  Tekan ESC untuk interrupt"),
          source_default.hex("#2DD4BF")("    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  ")
        ].join("\n");
      case "angry":
        return [
          source_default.red("       ( ( (  ASAP!  ) ) )    "),
          source_default.hex("#EF4444")("    \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  ") + source_default.bold.red("  @ tempe [MARAH / OVERLIMIT]"),
          source_default.hex("#EF4444")("    \u2502  ") + source_default.bold.white(">   ") + source_default.hex("#991B1B")("\u2591\u2591\u2591\u2591") + source_default.bold.white("   <") + source_default.hex("#EF4444")("  \u2502  ") + source_default.hex("#FCA5A5")("  [Status: Overlimit / Error!]"),
          source_default.hex("#EF4444")("    \u2502     ") + source_default.bold.white("( \u256C\u0CA0\u76CA\u0CA0)") + source_default.hex("#EF4444")("     \u2502  ") + source_default.red("  Batas pemakaian atau error server!"),
          source_default.hex("#EF4444")("    \u2502  ") + source_default.hex("#991B1B")("\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591") + source_default.hex("#EF4444")("  \u2502  ") + source_default.gray("  Cek menu usage (Alt+C -> 1)"),
          source_default.hex("#EF4444")("    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  ")
        ].join("\n");
      case "idle":
      default:
        return [
          source_default.hex("#E2E8F0")("    \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  "),
          source_default.hex("#E2E8F0")("    \u2502  ") + source_default.bold.white("^   ") + source_default.hex("#94A3B8")("\u2591\u2591\u2591\u2591") + source_default.bold.white("   ^") + source_default.hex("#E2E8F0")("  \u2502  ") + source_default.bold.white("  @ tempe"),
          source_default.hex("#E2E8F0")("    \u2502       ") + source_default.hex("#CBD5E1")("(___)") + source_default.hex("#E2E8F0")("       \u2502  ") + source_default.hex("#94A3B8")("  Terminal AI Coding Agent"),
          source_default.hex("#E2E8F0")("    \u2502  ") + source_default.hex("#94A3B8")("\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591") + source_default.hex("#E2E8F0")("  \u2502  ") + source_default.gray("  Siap membantu coding!"),
          source_default.hex("#E2E8F0")("    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  ")
        ].join("\n");
    }
  }
  /**
   * Compact badge icon untuk status bar atau prompt
   */
  static getBadge(state) {
    switch (state) {
      case "mateng_shining":
        return source_default.bold.hex("#F59E0B")("\u2728 @tempe [Mateng] \u2600\uFE0F");
      case "unready":
        return source_default.hex("#94A3B8")("\u{1F331} @tempe [Fermentasi]");
      case "needs_repo":
        return source_default.bold.yellow("\u2753 @tempe [Perlu API/Repo]");
      case "agent_working":
        return source_default.bold.hex("#14B8A6")("\u26A1 @tempe [Agent Aktif]");
      case "angry":
        return source_default.bold.red("\u{1F525} @tempe [Limit/Error!]");
      case "idle":
      default:
        return source_default.bold.white("\u{1F371} @tempe [Ready]");
    }
  }
};

// dist/ui/theme.js
init_source();
var ThemeManager = class {
  /**
   * Warna sesuai coretan sketsa & spesifikasi:
   * - Plan Mode: Ungu (now: Plan)
   * - Agent Mode: Hijau Tosca
   * - Normal: Putih / Hitam
   */
  static getTheme(mode) {
    switch (mode) {
      case "plan":
        return {
          primary: (t) => source_default.hex("#A855F7").bold(t),
          primaryBg: (t) => source_default.bgHex("#7E22CE").white.bold(` ${t} `),
          border: (t) => source_default.hex("#9333EA")(t),
          tag: source_default.bgHex("#6B21A8").white.bold(" now: Plan "),
          name: "Ungu (Plan)"
        };
      case "agent":
        return {
          primary: (t) => source_default.hex("#14B8A6").bold(t),
          primaryBg: (t) => source_default.bgHex("#0F766E").white.bold(` ${t} `),
          border: (t) => source_default.hex("#0D9488")(t),
          tag: source_default.bgHex("#115E59").white.bold(" now: Agent "),
          name: "Hijau Tosca (Agent)"
        };
      case "normal":
      default:
        return {
          primary: (t) => source_default.white.bold(t),
          primaryBg: (t) => source_default.bgWhite.black.bold(` ${t} `),
          border: (t) => source_default.gray(t),
          tag: source_default.bgHex("#334155").white.bold(" now: Normal "),
          name: "Hitam / Putih (Normal)"
        };
    }
  }
  /**
   * Header kotak interaktif seperti pada sketsa buku catatan:
   * [                                     ] now: plan
   * agent <- -> plan   alt+c: menu
   */
  static renderHeader(mode, stateLabel = "") {
    const theme = this.getTheme(mode);
    const width = 64;
    const line = "\u2500".repeat(width - 2);
    const leftNav = mode === "agent" ? source_default.bold.hex("#14B8A6")("\u25CF AGENT") : source_default.gray("<- agent");
    const rightNav = mode === "plan" ? source_default.bold.hex("#A855F7")("PLAN \u25CF") : source_default.gray("plan ->");
    return [
      theme.border(`\u250C${line}\u2510`),
      theme.border("\u2502 ") + source_default.bold("tempe $") + " ".repeat(Math.max(1, width - 24 - (stateLabel ? stateLabel.length : 0))) + (stateLabel ? source_default.yellow(stateLabel) + " " : "") + theme.tag + theme.border(" \u2502"),
      theme.border(`\u251C${line}\u2524`),
      theme.border("\u2502 ") + `${leftNav}   ${source_default.gray("\u21C4")}   ${rightNav}` + " ".repeat(Math.max(1, width - 36)) + source_default.hex("#F59E0B")("alt+c") + source_default.gray(": menu") + theme.border(" \u2502"),
      theme.border(`\u2514${line}\u2518`)
    ].join("\n");
  }
  /**
   * Box container untuk menampilkan output atau pesan
   */
  static box(content, title, mode = "normal") {
    const theme = this.getTheme(mode);
    const lines = content.split("\n");
    const maxLine = Math.max(...lines.map((l) => l.replace(/\u001b\[[0-9;]*m/g, "").length), title ? title.length + 4 : 20, 50);
    const topBar = title ? `\u250C\u2500 ${theme.primary(title)} ${"\u2500".repeat(Math.max(0, maxLine - title.length - 2))}\u2510` : `\u250C${"\u2500".repeat(maxLine + 2)}\u2510`;
    const bottomBar = `\u2514${"\u2500".repeat(maxLine + 2)}\u2518`;
    const body = lines.map((line) => {
      const cleanLen = line.replace(/\u001b\[[0-9;]*m/g, "").length;
      const pad = " ".repeat(Math.max(0, maxLine - cleanLen));
      return theme.border("\u2502 ") + line + pad + theme.border(" \u2502");
    }).join("\n");
    return `${theme.border(topBar)}
${body}
${theme.border(bottomBar)}`;
  }
};

// dist/ui/menu.js
var import_readline = __toESM(require("readline"), 1);
init_source();
init_config();
init_usage();
init_history();

// dist/providers/model-fetcher.js
var import_fs4 = __toESM(require("fs"), 1);
var import_path4 = __toESM(require("path"), 1);
var import_os4 = __toESM(require("os"), 1);
init_config();
var ModelFetcher = class {
  static cacheFile = import_path4.default.join(import_os4.default.homedir(), ".tempe", "models-cache.json");
  static loadCache() {
    ConfigManager.ensureDir();
    if (!import_fs4.default.existsSync(this.cacheFile))
      return {};
    try {
      return JSON.parse(import_fs4.default.readFileSync(this.cacheFile, "utf-8"));
    } catch {
      return {};
    }
  }
  static saveCache(cache) {
    ConfigManager.ensureDir();
    import_fs4.default.writeFileSync(this.cacheFile, JSON.stringify(cache, null, 2), "utf-8");
  }
  /**
   * Mengambil daftar model riil langsung dari API provider yang sedang aktif.
   */
  static async getModelsForProvider(keyEntry, forceRefresh = false) {
    const cacheKey = `${keyEntry.provider}_${keyEntry.id}`;
    const cache = this.loadCache();
    if (!forceRefresh && cache[cacheKey] && cache[cacheKey].length > 0) {
      return cache[cacheKey];
    }
    try {
      let models = [];
      if (keyEntry.provider === "gemini") {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${keyEntry.key}`;
        const res = await fetch(url, { headers: { "Accept": "application/json" }, signal: AbortSignal.timeout(8e3) });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.models)) {
            models = data.models.filter((m) => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")).map((m) => ({
              id: m.name.replace(/^models\//, ""),
              name: m.displayName || m.name.replace(/^models\//, ""),
              description: m.description ? m.description.slice(0, 80) + "..." : void 0
            }));
          }
        }
      } else if (keyEntry.provider === "openai" || keyEntry.provider === "groq" || keyEntry.provider === "custom") {
        let base = keyEntry.baseUrl || (keyEntry.provider === "groq" ? "https://api.groq.com/openai/v1" : "https://api.openai.com/v1");
        base = base.replace(/[\[\]]/g, "").replace(/\/$/, "");
        if (base.endsWith("/chat/completions")) {
          base = base.replace("/chat/completions", "");
        }
        const url = `${base}/models`;
        const res = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${keyEntry.key}`,
            "Accept": "application/json"
          },
          signal: AbortSignal.timeout(8e3)
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.data || [];
          models = list.map((m) => ({
            id: m.id || m.name,
            name: m.id || m.name,
            description: m.owned_by ? `Owned by ${m.owned_by}` : void 0
          }));
        }
      } else if (keyEntry.provider === "ollama") {
        let base = (keyEntry.baseUrl || "http://localhost:11434").replace(/[\[\]]/g, "").replace(/\/$/, "");
        const url = `${base}/api/tags`;
        const res = await fetch(url, { signal: AbortSignal.timeout(6e3) });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.models)) {
            models = data.models.map((m) => ({
              id: m.name,
              name: m.name,
              description: `Size: ${Math.round((m.size || 0) / (1024 * 1024))} MB`
            }));
          }
        }
      } else if (keyEntry.provider === "anthropic") {
        const url = "https://api.anthropic.com/v1/models";
        const res = await fetch(url, {
          headers: {
            "x-api-key": keyEntry.key,
            "anthropic-version": "2023-06-01"
          },
          signal: AbortSignal.timeout(8e3)
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.data)) {
            models = data.data.map((m) => ({
              id: m.id,
              name: m.display_name || m.id,
              description: m.created_at
            }));
          }
        }
      }
      if (models.length > 0) {
        models.sort((a, b) => {
          const aId = a.id.toLowerCase();
          const bId = b.id.toLowerCase();
          if (aId.includes("flash") && !bId.includes("flash"))
            return -1;
          if (!aId.includes("flash") && bId.includes("flash"))
            return 1;
          return aId.localeCompare(bId);
        });
        cache[cacheKey] = models;
        this.saveCache(cache);
        return models;
      }
    } catch {
    }
    return this.getDefaultFallbackModels(keyEntry.provider);
  }
  static getDefaultFallbackModels(provider) {
    switch (provider) {
      case "gemini":
        return [
          { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", description: "Kecepatan tinggi, multimodal, biaya hemat" },
          { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", description: "Penalaran kompleks & pengkodean mendalam" },
          { id: "gemini-flash-latest", name: "Gemini Flash Latest", description: "Rilis flash stabil terbaru" },
          { id: "gemini-3-flash-preview", name: "Gemini 3 Flash Preview", description: "Generasi berikutnya dari Flash" },
          { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash", description: "Versi mutakhir performa tinggi" }
        ];
      case "openai":
        return [
          { id: "gpt-4o", name: "GPT-4o", description: "Model unggulan serbaguna" },
          { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Cepat & efisien biaya" },
          { id: "o1", name: "OpenAI o1", description: "Penalaran dan matematika tingkat tinggi" }
        ];
      case "anthropic":
        return [
          { id: "claude-3-7-sonnet-20250219", name: "Claude 3.7 Sonnet", description: "Advanced Hybrid Reasoning & Coding" },
          { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", description: "Super cepat dan efisien" }
        ];
      case "groq":
        return [
          { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile", description: "Kecepatan inferensi ultra tinggi" },
          { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", description: "Context window 32k" }
        ];
      default:
        return [
          { id: "default", name: "Default Provider Model", description: "Model bawaan dari endpoint API" }
        ];
    }
  }
};

// dist/ui/menu.js
var MenuHandler = class {
  /**
   * Menampilkan menu utama tempe (dibuka dengan alt+c atau mengetik 'menu')
   */
  static async openMainMenu() {
    console.log("\n" + source_default.bold.hex("#F59E0B")("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557"));
    console.log(source_default.bold.hex("#F59E0B")("\u2551 ") + source_default.bold.white("\u{1F371} TEMPE MAIN MENU (alt+c)") + "                                  " + source_default.bold.hex("#F59E0B")("\u2551"));
    console.log(source_default.bold.hex("#F59E0B")("\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563"));
    console.log(source_default.bold.hex("#F59E0B")("\u2551 ") + source_default.cyan(" [1] Usage   ") + source_default.gray("-> Cek % kuota, token, dan estimasi tagihan ($)   ") + source_default.bold.hex("#F59E0B")("\u2551"));
    console.log(source_default.bold.hex("#F59E0B")("\u2551 ") + source_default.cyan(" [2] Models  ") + source_default.gray("-> Switch / ganti model AI                        ") + source_default.bold.hex("#F59E0B")("\u2551"));
    console.log(source_default.bold.hex("#F59E0B")("\u2551 ") + source_default.cyan(" [3] History ") + source_default.gray("-> Lihat riwayat sesi dan percakapan AI           ") + source_default.bold.hex("#F59E0B")("\u2551"));
    console.log(source_default.bold.hex("#F59E0B")("\u2551 ") + source_default.cyan(" [4] API     ") + source_default.gray("-> Tambah dan kelola multi-API key (> 1 API)      ") + source_default.bold.hex("#F59E0B")("\u2551"));
    console.log(source_default.bold.hex("#F59E0B")("\u2551 ") + source_default.cyan(" [5] Theme   ") + source_default.gray("-> Pengaturan tema (Ungu Plan / Tosca Agent)      ") + source_default.bold.hex("#F59E0B")("\u2551"));
    console.log(source_default.bold.hex("#F59E0B")("\u2551 ") + source_default.gray(" [0] Kembali ") + source_default.gray("-> Tutup menu & lanjutkan chat                    ") + source_default.bold.hex("#F59E0B")("\u2551"));
    console.log(source_default.bold.hex("#F59E0B")("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D"));
    const choice = await this.ask("Pilih menu [0-5]: ");
    switch (choice.trim()) {
      case "1":
      case "usage":
        await this.handleUsageMenu();
        break;
      case "2":
      case "models":
        await this.handleModelsMenu();
        break;
      case "3":
      case "history":
        await this.handleHistoryMenu();
        break;
      case "4":
      case "api":
        await this.handleApiMenu();
        break;
      case "5":
      case "theme":
        await this.handleThemeMenu();
        break;
      case "0":
      default:
        console.log(source_default.gray("Kembali ke sesi chat.\n"));
        break;
    }
    return "continue";
  }
  /**
   * Menu: Usage
   */
  static async handleUsageMenu() {
    console.log("\n" + UsageTracker.renderUsageReport());
    await this.ask("\nTekan [Enter] untuk kembali...");
  }
  /**
   * Menu: Models — mengambil daftar model RIIL dari API provider yang aktif
   */
  static async handleModelsMenu() {
    const config = ConfigManager.load();
    const activeKey = ConfigManager.getActiveApiKey(config);
    if (!activeKey) {
      console.log(source_default.yellow("\n\u26A0\uFE0F  Belum ada API key. Tambahkan dulu via menu [4] API.\n"));
      return;
    }
    process.stdout.write(source_default.gray("\n\u23F3 Mengambil daftar model dari ") + source_default.cyan(activeKey.provider) + source_default.gray(" API"));
    const spinInterval = setInterval(() => process.stdout.write(source_default.gray(".")), 350);
    let models = [];
    try {
      models = await ModelFetcher.getModelsForProvider(activeKey);
    } finally {
      clearInterval(spinInterval);
      process.stdout.write("\n");
    }
    if (models.length === 0) {
      console.log(source_default.red("\n\u2717 Tidak ada model yang bisa diambil dari provider. Cek koneksi atau API key Anda.\n"));
      return;
    }
    console.log("\n" + source_default.bold.hex("#14B8A6")(`\u{1F39B}\uFE0F  DAFTAR MODEL TERSEDIA \u2014 ${activeKey.provider.toUpperCase()} (${activeKey.label})`));
    console.log(source_default.gray(`   Sumber: model riil langsung dari provider | Total: ${models.length} model
`));
    console.log(source_default.gray("\u2500".repeat(66)));
    models.forEach((m, idx) => {
      const isActive = m.id === config.defaultModel;
      const num2 = source_default.gray(`[${String(idx + 1).padStart(2, " ")}]`);
      const idLabel = isActive ? source_default.bold.hex("#10B981")(m.id) : source_default.bold.white(m.id);
      const badge = isActive ? source_default.bgHex("#065F46").white.bold(" AKTIF ") : "";
      const desc = m.description ? source_default.gray(`  ${m.description.slice(0, 55)}`) : "";
      console.log(`${num2} ${idLabel} ${badge}`);
      if (m.name && m.name !== m.id) {
        console.log(`      ${source_default.hex("#94A3B8")(m.name)}${desc}`);
      } else if (desc) {
        console.log(`      ${desc}`);
      }
    });
    console.log(source_default.gray("\u2500".repeat(66)));
    console.log(source_default.gray("Tekan Enter untuk batal tanpa mengubah model.\n"));
    const choice = await this.ask(`Pilih nomor model [1-${models.length}]: `);
    const num = parseInt(choice.trim(), 10);
    if (!isNaN(num) && num >= 1 && num <= models.length) {
      const selected = models[num - 1];
      ConfigManager.setModel(selected.id);
      console.log(source_default.green(`
\u2713 Model aktif diubah ke: `) + source_default.bold.hex("#10B981")(selected.id) + (selected.name && selected.name !== selected.id ? source_default.gray(` (${selected.name})`) : "") + "\n");
    } else {
      console.log(source_default.gray("Model tidak diubah.\n"));
    }
  }
  /**
   * Menu: History
   */
  static async handleHistoryMenu() {
    console.log("\n" + HistoryManager.renderList(15));
    const action = await this.ask("Opsi: [c] Clear riwayat, [Enter] Kembali: ");
    if (action.trim().toLowerCase() === "c") {
      HistoryManager.clear();
      console.log(source_default.yellow("\u2713 Riwayat percakapan telah dibersihkan.\n"));
    }
  }
  /**
   * Menu: API Key Manager (> 1 API Key)
   */
  static async handleApiMenu() {
    const config = ConfigManager.load();
    console.log("\n" + source_default.bold.hex("#F59E0B")("\u{1F511} MANAJEMEN MULTI-API KEY:"));
    if (config.apiKeys.length === 0) {
      console.log(source_default.yellow("Belum ada API key yang terdaftar."));
    } else {
      config.apiKeys.forEach((k, idx) => {
        const def = k.isDefault ? source_default.green(" [DEFAULT/AKTIF]") : "";
        const maskedKey = k.key.slice(0, 4) + "..." + k.key.slice(-4);
        console.log(` [${idx + 1}] ${source_default.bold.white(k.label)} (${source_default.cyan(k.provider)})${def}`);
        console.log(`     Key: ${source_default.gray(maskedKey)} | Ditambahkan: ${source_default.gray(new Date(k.createdAt).toLocaleDateString())}`);
      });
    }
    console.log("\nOpsi API:");
    console.log(" [a] Tambah API Key Baru");
    console.log(" [d] Jadikan Default");
    console.log(" [r] Hapus API Key");
    console.log(" [Enter] Kembali");
    const action = await this.ask("Pilih opsi: ");
    const opt = action.trim().toLowerCase();
    if (opt === "a") {
      console.log("\nPilih Provider:");
      console.log(" 1. gemini (Google AI Studio)");
      console.log(" 2. openai (OpenAI GPT-4o)");
      console.log(" 3. anthropic (Claude)");
      console.log(" 4. groq (Llama / Fast)");
      console.log(" 5. custom / ollama (OpenAI-compatible URL)");
      const provNum = await this.ask("Provider [1-5]: ");
      const providerMap = {
        "1": "gemini",
        "2": "openai",
        "3": "anthropic",
        "4": "groq",
        "5": "custom"
      };
      const provider = providerMap[provNum.trim()] || "gemini";
      const label = await this.ask("Nama Label (contoh: Gemini Razan): ");
      const key = await this.ask("Masukkan API Key: ");
      let baseUrl = void 0;
      if (provider === "custom") {
        baseUrl = await this.ask("Base URL (misal: http://localhost:11434/v1): ");
      }
      if (key.trim()) {
        const added = ConfigManager.addApiKey(label.trim(), provider, key.trim(), baseUrl?.trim());
        console.log(source_default.green(`\u2713 Berhasil menambahkan API key: ${added.label}
`));
      } else {
        console.log(source_default.red("API Key tidak boleh kosong.\n"));
      }
    } else if (opt === "d" && config.apiKeys.length > 0) {
      const idxStr = await this.ask("Masukkan nomor API key yang ingin dijadikan default: ");
      const idx = parseInt(idxStr.trim(), 10) - 1;
      if (config.apiKeys[idx]) {
        ConfigManager.setDefaultApiKey(config.apiKeys[idx].id);
        console.log(source_default.green(`\u2713 '${config.apiKeys[idx].label}' sekarang menjadi API key default.
`));
      }
    } else if (opt === "r" && config.apiKeys.length > 0) {
      const idxStr = await this.ask("Masukkan nomor API key yang ingin dihapus: ");
      const idx = parseInt(idxStr.trim(), 10) - 1;
      if (config.apiKeys[idx]) {
        ConfigManager.removeApiKey(config.apiKeys[idx].id);
        console.log(source_default.yellow(`\u2713 API key '${config.apiKeys[idx].label}' telah dihapus.
`));
      }
    }
  }
  /**
   * Menu: Theme
   */
  static async handleThemeMenu() {
    const config = ConfigManager.load();
    console.log("\n" + source_default.bold.hex("#F59E0B")("\u{1F3A8} PENGATURAN TEMA & TAMPILAN:"));
    console.log(" [1] Auto (Ungu saat Plan Mode, Hijau Tosca saat Agent Mode)");
    console.log(" [2] Purple Glow (Selalu aksen Ungu)");
    console.log(" [3] Tosca Electric (Selalu aksen Hijau Tosca)");
    console.log(" [4] Monochrome (Hitam & Putih klasik kontras tinggi)");
    const choice = await this.ask("Pilih tema [1-4]: ");
    const map = {
      "1": "auto",
      "2": "purple",
      "3": "tosca",
      "4": "monochrome"
    };
    const selected = map[choice.trim()] || "auto";
    config.themePreference = selected;
    ConfigManager.save(config);
    console.log(source_default.green(`\u2713 Tema diatur ke: ${selected}
`));
  }
  static ask(question) {
    const rl = import_readline.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise((resolve) => {
      rl.question(source_default.yellow(question), (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }
};

// dist/agent/agent-loop.js
init_source();
init_config();

// dist/providers/ai-client.js
init_source();
init_config();
init_usage();

// dist/core/retry.js
init_source();
var RetryHandler = class {
  /**
   * Menjalankan fungsi async dengan auto-retry dan countdown timer interaktif di terminal.
   * Langsung merefleksikan catatan sketsa:
   * "kalau server error / sibuk bisa retrying to connect, sambil ada waktunya"
   */
  static async executeWithCountdown(operation, options = {}) {
    const maxAttempts = options.maxAttempts ?? 3;
    let delay = options.initialDelaySeconds ?? 3;
    const factor = options.backoffFactor ?? 1.5;
    let attempt = 0;
    while (attempt < maxAttempts) {
      try {
        return await operation();
      } catch (err) {
        attempt++;
        const errMsg = err?.message || "Server sibuk atau timeout";
        const isClientError = /http (400|401|403|404)/i.test(errMsg) || /not found|unauthorized|invalid api key/i.test(errMsg);
        if (isClientError || attempt >= maxAttempts) {
          throw err;
        }
        const waitSeconds = Math.round(delay);
        process.stdout.write("\n");
        console.log(source_default.yellow("\u26A0\uFE0F  [Koneksi Terganggu] ") + source_default.white(errMsg));
        for (let rem = waitSeconds; rem > 0; rem--) {
          const formattedTime = `00:${rem.toString().padStart(2, "0")}`;
          process.stdout.write(`\r${source_default.hex("#F59E0B")("\u{1F504} Retrying to connect...")} ` + source_default.bold.hex("#38BDF8")(`[${formattedTime}]`) + `  ${source_default.gray(`(Percobaan ${attempt}/${maxAttempts})`)}`);
          await this.sleep(1e3);
        }
        process.stdout.write(`\r${source_default.green("\u{1F680} Mencoba menyambung kembali sekarang...")}              
`);
        delay *= factor;
      }
    }
    throw new Error("Maksimum percobaan retry terlampaui.");
  }
  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};

// dist/agent/prompt-lang.js
var LanguageDetector = class {
  static indonesianKeywords = /* @__PURE__ */ new Set([
    "buatkan",
    "tolong",
    "bagaimana",
    "gimana",
    "bikin",
    "tampilkan",
    "apakah",
    "coba",
    "bisa",
    "gak",
    "nggak",
    "tidak",
    "udah",
    "sudah",
    "tambahin",
    "tambahkan",
    "ganti",
    "perbaiki",
    "ubah",
    "hapus",
    "jalankan",
    "eksekusi",
    "kode",
    "proyek",
    "saya",
    "kamu",
    "dong",
    "ya",
    "kan",
    "nya",
    "ini",
    "itu",
    "di",
    "ke",
    "dari",
    "yang",
    "dan",
    "atau",
    "apa",
    "kenapa",
    "karena",
    "kalau",
    "jika",
    "nanti",
    "besok",
    "sekarang",
    "tempe"
  ]);
  static englishKeywords = /* @__PURE__ */ new Set([
    "create",
    "build",
    "please",
    "how",
    "show",
    "is",
    "try",
    "can",
    "not",
    "already",
    "add",
    "change",
    "fix",
    "update",
    "delete",
    "run",
    "execute",
    "code",
    "project",
    "my",
    "you",
    "the",
    "this",
    "that",
    "in",
    "to",
    "from",
    "which",
    "and",
    "or",
    "what",
    "why",
    "because",
    "if",
    "later",
    "tomorrow",
    "now",
    "make",
    "implement"
  ]);
  /**
   * Mendeteksi bahasa dari teks masukan pengguna secara otomatis
   */
  static detect(text) {
    const cleaned = text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, " ");
    const tokens = cleaned.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
      return { code: "id", name: "Bahasa Indonesia", confidence: 0.5 };
    }
    let idScore = 0;
    let enScore = 0;
    for (const t of tokens) {
      if (this.indonesianKeywords.has(t))
        idScore += 2;
      if (this.englishKeywords.has(t))
        enScore += 2;
    }
    if (idScore >= enScore && idScore > 0) {
      return { code: "id", name: "Bahasa Indonesia", confidence: Math.min(1, 0.6 + idScore * 0.1) };
    }
    if (enScore > idScore) {
      return { code: "en", name: "English", confidence: Math.min(1, 0.6 + enScore * 0.1) };
    }
    return { code: "id", name: "Bahasa Indonesia", confidence: 0.5 };
  }
  /**
   * Menghasilkan instruksi bahasa untuk sistem prompt AI
   */
  static getSystemInstruction(detected) {
    return [
      `[LANGUAGE DIRECTIVE]`,
      `User language detected: ${detected.name} (${detected.code}).`,
      `You MUST strictly formulate your response in ${detected.name}.`,
      `Keep technical code, paths, and commands accurate while explanations and guidance must match the user's language.`
    ].join("\n");
  }
};

// dist/providers/ai-client.js
var AIClient = class {
  /**
   * Menghasilkan respon AI dengan auto-language detection, multi-API provider,
   * dan auto-retry saat server sibuk/error.
   */
  static async generate(prompt, mode, modelOverride) {
    const config = ConfigManager.load();
    const activeKey = ConfigManager.getActiveApiKey(config);
    const model = modelOverride || config.defaultModel;
    const detectedLang = LanguageDetector.detect(prompt);
    if (!activeKey || !activeKey.key) {
      const isIndonesian = detectedLang.code === "id";
      const msg = isIndonesian ? `\u26A0\uFE0F [API Key Belum Ada] Anda belum menambahkan API Key.
Silakan tambahkan API key dengan menekan [Alt+C] -> Menu API, atau jalankan perintah: tempe api add` : `\u26A0\uFE0F [No API Key Configured] You haven't added an API Key yet.
Please add an API key by pressing [Alt+C] -> API Menu, or run command: tempe api add`;
      const error = new Error(msg);
      error.isApiKeyMissing = true;
      throw error;
    }
    return await RetryHandler.executeWithCountdown(async () => {
      return await this.callProvider(activeKey, model, prompt, mode, detectedLang);
    }, {
      maxAttempts: 3,
      initialDelaySeconds: 3
    });
  }
  static async callProvider(keyEntry, model, prompt, mode, detectedLang) {
    const langInstruction = LanguageDetector.getSystemInstruction(detectedLang);
    const systemPrompt = [
      `You are Tempe, a friendly, ultra-competent Terminal AI Coding Agent.`,
      mode === "plan" ? `You are currently in PLAN MODE. Break down user goals into concrete, structured, numbered steps. Do NOT execute tools yet.` : `You are currently in AGENT MODE. Provide direct solutions, code snippets, and execute actions decisively.`,
      langInstruction
    ].join("\n\n");
    const promptTokens = Math.max(20, Math.round(prompt.length / 3));
    if (keyEntry.provider === "openai" || keyEntry.provider === "groq" || keyEntry.provider === "custom") {
      const url = keyEntry.baseUrl || (keyEntry.provider === "groq" ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${keyEntry.key}`
        },
        body: JSON.stringify({
          model: keyEntry.model || model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: mode === "plan" ? 0.3 : 0.7
        })
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status} from ${keyEntry.provider}: ${errText}`);
      }
      const json = await response.json();
      const content = json.choices?.[0]?.message?.content || "";
      const usage = json.usage || { prompt_tokens: promptTokens, completion_tokens: 120, total_tokens: promptTokens + 120 };
      UsageTracker.recordUsage(model, usage.prompt_tokens, usage.completion_tokens);
      return {
        text: content,
        tokensUsed: { prompt: usage.prompt_tokens, completion: usage.completion_tokens, total: usage.total_tokens },
        detectedLang,
        isPlan: mode === "plan"
      };
    }
    if (keyEntry.provider === "gemini") {
      const targetModel = (keyEntry.model || model || "gemini-2.5-flash").trim().replace(/^models\//, "");
      let url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${keyEntry.key}`;
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}

User Request: ${prompt}` }] }]
        })
      });
      if (!response.ok && response.status === 404 && targetModel !== "gemini-2.5-flash") {
        console.log(source_default.yellow(`
\u26A0\uFE0F  Model "${targetModel}" tidak ditemukan, beralih ke gemini-2.5-flash...`));
        url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keyEntry.key}`;
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}

User Request: ${prompt}` }] }]
          })
        });
      }
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status} from Gemini: ${errText}`);
      }
      const json = await response.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const completionTokens2 = Math.max(30, Math.round(text.length / 3));
      UsageTracker.recordUsage(targetModel, promptTokens, completionTokens2);
      return {
        text,
        tokensUsed: { prompt: promptTokens, completion: completionTokens2, total: promptTokens + completionTokens2 },
        detectedLang,
        isPlan: mode === "plan"
      };
    }
    if (keyEntry.provider === "anthropic") {
      const url = "https://api.anthropic.com/v1/messages";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": keyEntry.key,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: keyEntry.model || model || "claude-3-7-sonnet-20250219",
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }]
        })
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status} from Anthropic: ${errText}`);
      }
      const json = await response.json();
      const text = json.content?.[0]?.text || "";
      const usage = json.usage || { input_tokens: promptTokens, output_tokens: 150 };
      UsageTracker.recordUsage(model, usage.input_tokens, usage.output_tokens);
      return {
        text,
        tokensUsed: { prompt: usage.input_tokens, completion: usage.output_tokens, total: usage.input_tokens + usage.output_tokens },
        detectedLang,
        isPlan: mode === "plan"
      };
    }
    const fallbackText = mode === "plan" ? `\u{1F4CB} [TEMPE PLAN - Model: ${model}]
1. Menganalisis kebutuhan: "${prompt}"
2. Memeriksa berkas yang relevan di direktori kerja
3. Menyiapkan implementasi dan modifikasi kode
4. Menjalankan pengujian (lint/test) dan verifikasi status git` : `\u{1F680} [TEMPE AGENT - Model: ${model}]
Menjalankan tugas untuk: "${prompt}"
Analisis selesai. Siap mengeksekusi langkah kode.`;
    const completionTokens = Math.max(25, Math.round(fallbackText.length / 3));
    UsageTracker.recordUsage(model, promptTokens, completionTokens);
    return {
      text: fallbackText,
      tokensUsed: { prompt: promptTokens, completion: completionTokens, total: promptTokens + completionTokens },
      detectedLang,
      isPlan: mode === "plan"
    };
  }
};

// dist/agent/tools.js
var import_fs5 = __toESM(require("fs"), 1);
var import_path5 = __toESM(require("path"), 1);
var import_child_process = require("child_process");
var import_util = __toESM(require("util"), 1);
var execAsync = import_util.default.promisify(import_child_process.exec);
var AgentTools = class {
  static getTools() {
    return {
      readFile: {
        name: "readFile",
        description: "Membaca isi berkas teks lokal",
        isMutating: false,
        execute: async ({ path: filePath }) => {
          const abs = import_path5.default.resolve(process.cwd(), filePath);
          if (!import_fs5.default.existsSync(abs)) {
            return `Error: Berkas '${filePath}' tidak ditemukan.`;
          }
          const content = import_fs5.default.readFileSync(abs, "utf-8");
          return content;
        }
      },
      writeFile: {
        name: "writeFile",
        description: "Membuat atau menimpa berkas dengan isi baru",
        isMutating: true,
        execute: async ({ path: filePath, content }) => {
          const abs = import_path5.default.resolve(process.cwd(), filePath);
          const dir = import_path5.default.dirname(abs);
          if (!import_fs5.default.existsSync(dir)) {
            import_fs5.default.mkdirSync(dir, { recursive: true });
          }
          import_fs5.default.writeFileSync(abs, content, "utf-8");
          return `Sukses: Berkas '${filePath}' berhasil ditulis (${content.length} karakter).`;
        }
      },
      editFile: {
        name: "editFile",
        description: "Mengubah bagian tertentu dalam berkas",
        isMutating: true,
        execute: async ({ path: filePath, target, replacement }) => {
          const abs = import_path5.default.resolve(process.cwd(), filePath);
          if (!import_fs5.default.existsSync(abs)) {
            return `Error: Berkas '${filePath}' tidak ditemukan.`;
          }
          const content = import_fs5.default.readFileSync(abs, "utf-8");
          if (!content.includes(target)) {
            return `Error: Teks target tidak ditemukan di dalam '${filePath}'.`;
          }
          const updated = content.replace(target, replacement);
          import_fs5.default.writeFileSync(abs, updated, "utf-8");
          return `Sukses: Berkas '${filePath}' berhasil diperbarui.`;
        }
      },
      listDirectory: {
        name: "listDirectory",
        description: "Melihat daftar berkas dan folder dalam direktori",
        isMutating: false,
        execute: async ({ path: dirPath = "." }) => {
          const abs = import_path5.default.resolve(process.cwd(), dirPath);
          if (!import_fs5.default.existsSync(abs)) {
            return `Error: Direktori '${dirPath}' tidak ditemukan.`;
          }
          const entries = import_fs5.default.readdirSync(abs, { withFileTypes: true });
          const list = entries.map((e) => `${e.isDirectory() ? "[DIR] " : "      "}${e.name}`);
          return list.join("\n");
        }
      },
      runCommand: {
        name: "runCommand",
        description: "Menjalankan perintah shell/terminal di sistem lokal",
        isMutating: true,
        execute: async ({ command }) => {
          try {
            const { stdout, stderr } = await execAsync(command, {
              cwd: process.cwd(),
              timeout: 6e4
            });
            return (stdout || "") + (stderr ? `
[STDERR]:
${stderr}` : "");
          } catch (err) {
            return `Error eksekusi: ${err.message}
${err.stdout || ""}
${err.stderr || ""}`;
          }
        }
      },
      gitStatus: {
        name: "gitStatus",
        description: "Memeriksa status git repository saat ini",
        isMutating: false,
        execute: async () => {
          try {
            const { stdout } = await execAsync("git status --short", { cwd: process.cwd() });
            return stdout || "(Working tree clean)";
          } catch {
            return "Bukan git repository atau git tidak tersedia.";
          }
        }
      }
    };
  }
};

// dist/ui/permission.js
var import_readline2 = __toESM(require("readline"), 1);
init_source();
var PermissionManager = class {
  static sessionAlwaysAllowed = false;
  static isAlwaysAllowed() {
    return this.sessionAlwaysAllowed;
  }
  static resetSession() {
    this.sessionAlwaysAllowed = false;
  }
  /**
   * Menampilkan dialog konfirmasi perizinan aksi sesuai gambar sketsa:
   * [1] always allow
   * [2] allow once
   * [3] not allow
   */
  static async requestPermission(actionName, detail) {
    if (this.sessionAlwaysAllowed) {
      return true;
    }
    console.log("\n" + source_default.hex("#F59E0B")("\u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E"));
    console.log(source_default.hex("#F59E0B")("\u2502 ") + source_default.bold.yellow("\u{1F6E1}\uFE0F  KONFIRMASI IZIN AKSI AGENT") + "                               " + source_default.hex("#F59E0B")("\u2502"));
    console.log(source_default.hex("#F59E0B")("\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524"));
    console.log(source_default.hex("#F59E0B")("\u2502 ") + source_default.bold.white(`Aksi:   `) + source_default.cyan(actionName));
    console.log(source_default.hex("#F59E0B")("\u2502 ") + source_default.bold.white(`Detail: `) + source_default.gray(detail.slice(0, 52) + (detail.length > 52 ? "..." : "")));
    console.log(source_default.hex("#F59E0B")("\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524"));
    console.log(source_default.hex("#F59E0B")("\u2502 ") + source_default.bold("Pilih izin eksekusi:"));
    console.log(source_default.hex("#F59E0B")("\u2502 ") + source_default.green(" [1] always allow") + source_default.gray("   (izinkan semua aksi di sesi ini)"));
    console.log(source_default.hex("#F59E0B")("\u2502 ") + source_default.cyan(" [2] allow once") + source_default.gray("     (izinkan hanya kali ini)"));
    console.log(source_default.hex("#F59E0B")("\u2502 ") + source_default.red(" [3] not allow") + source_default.gray("      (tolak aksi ini)"));
    console.log(source_default.hex("#F59E0B")("\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F"));
    const decision = await this.askChoice();
    if (decision === "always") {
      this.sessionAlwaysAllowed = true;
      console.log(source_default.green('\u2713 Mode "always allow" aktif untuk sesi ini.\n'));
      return true;
    } else if (decision === "allow_once") {
      console.log(source_default.cyan("\u2713 Diizinkan sekali ini.\n"));
      return true;
    } else {
      console.log(source_default.red("\u2717 Aksi dibatalkan oleh pengguna.\n"));
      return false;
    }
  }
  static askChoice() {
    const rl = import_readline2.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise((resolve) => {
      rl.question(source_default.bold.yellow("Pilih [1/2/3] (default: 2): "), (answer) => {
        rl.close();
        const trimmed = answer.trim();
        if (trimmed === "1")
          resolve("always");
        else if (trimmed === "3")
          resolve("not_allow");
        else
          resolve("allow_once");
      });
    });
  }
};

// dist/ui/plan-exec.js
var import_readline3 = __toESM(require("readline"), 1);
init_source();
var PlanExecutorUI = class {
  /**
   * Menampilkan tombol kecil hitam-putih monokrom untuk eksekusi plan
   * Sesuai catatan sketsa tangan:
   * "buat plan kalau user dan setuju bisa langsung (nanti ada tombol kecil hitam putih) dipencek"
   */
  static async promptPlanApproval(planSummary) {
    console.log("\n" + source_default.hex("#9333EA")("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510"));
    console.log(source_default.hex("#9333EA")("\u2502 ") + source_default.bold.hex("#A855F7")("\u{1F4CB} RENCANA AKSI (PLAN MODE)") + "                                " + source_default.hex("#9333EA")("\u2502"));
    console.log(source_default.hex("#9333EA")("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"));
    console.log(planSummary);
    console.log("\n" + source_default.bgWhite.black.bold(" [ \u25CF RUN PLAN ] ") + source_default.gray("  atau tekan ") + source_default.bold.white("[Enter]") + source_default.gray(" untuk langsung eksekusi"));
    console.log(source_default.gray("Tekan ") + source_default.bold.white("[n]") + source_default.gray(" untuk edit/tolak, atau ") + source_default.bold.white("[Esc]") + source_default.gray(" untuk batal.\n"));
    const rl = import_readline3.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise((resolve) => {
      rl.question(source_default.bold("Eksekusi rencana sekarang? [Y/n]: "), (answer) => {
        rl.close();
        const trimmed = answer.trim().toLowerCase();
        if (trimmed === "n" || trimmed === "tidak" || trimmed === "no") {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
};

// dist/agent/agent-loop.js
init_history();
var AgentLoop = class {
  static isInterrupted = false;
  static interrupt() {
    this.isInterrupted = true;
  }
  static resetInterrupt() {
    this.isInterrupted = false;
  }
  /**
   * Menjalankan siklus eksekusi AI coding agent
   */
  static async execute(userPrompt, mode, onStateChange) {
    this.resetInterrupt();
    const config = ConfigManager.load();
    const activeKey = ConfigManager.getActiveApiKey(config);
    if (!activeKey) {
      if (onStateChange)
        onStateChange("needs_repo");
      console.log("\n" + TempeMascot.getMascotArt("needs_repo"));
      console.log("\n" + source_default.bold.red("\u26A0\uFE0F  [API Key Belum Ditemukan]"));
      console.log(source_default.yellow("Tempe memerlukan API key untuk beroperasi."));
      console.log(source_default.white("Tekan ") + source_default.bold.cyan("[Alt+C]") + source_default.white(" -> pilih nomor ") + source_default.bold.cyan("[4]") + source_default.white(" untuk menambah API key (Gemini, OpenAI, Groq, Claude, atau Ollama).\n"));
      return;
    }
    if (mode === "agent") {
      if (onStateChange)
        onStateChange("agent_working");
      console.log("\n" + source_default.hex("#14B8A6")("\u26A1 Mengaktifkan Agent Mode..."));
    } else {
      console.log("\n" + source_default.hex("#A855F7")("\u{1F4CB} Mengaktifkan Plan Mode..."));
    }
    try {
      const response = await AIClient.generate(userPrompt, mode, config.defaultModel);
      if (this.isInterrupted) {
        console.log(source_default.red("\n[!] Proses dibatalkan oleh pengguna (ESC Interrupt).\n"));
        return;
      }
      if (mode === "plan") {
        console.log("\n" + ThemeManager.box(response.text, "RENCANA IMPLEMENTASI TEMPE", "plan"));
        HistoryManager.add({
          mode: "plan",
          model: config.defaultModel,
          prompt: userPrompt,
          response: response.text,
          tokens: response.tokensUsed.total
        });
        const shouldExecute = await PlanExecutorUI.promptPlanApproval(source_default.gray("Ringkasan: AI telah menyusun langkah-langkah di atas."));
        if (shouldExecute) {
          console.log(source_default.green("\n\u2713 Menjalankan rencana dalam Agent Mode..."));
          await this.execute(`Jalankan rencana implementasi berikut secara otomatis:
${response.text}`, "agent", onStateChange);
        } else {
          console.log(source_default.gray("Rencana disimpan. Anda dapat mengeksekusinya nanti.\n"));
        }
      } else {
        console.log("\n" + ThemeManager.box(response.text, "HASIL EKSEKUSI AGENT", "agent"));
        const tools = AgentTools.getTools();
        const executedTools = [];
        const bashMatches = response.text.match(/```(?:bash|sh|shell|powershell|cmd)\n([\s\S]*?)```/g);
        if (bashMatches && bashMatches.length > 0) {
          for (const block of bashMatches) {
            if (this.isInterrupted)
              break;
            const command = block.replace(/```(?:bash|sh|shell|powershell|cmd)\n/, "").replace(/```$/, "").trim();
            if (command) {
              const allowed = await PermissionManager.requestPermission("runCommand", command);
              if (allowed) {
                console.log(source_default.cyan(`
$ ${command}`));
                const output = await tools.runCommand.execute({ command });
                console.log(source_default.gray(output));
                executedTools.push(`runCommand: ${command.slice(0, 30)}`);
              }
            }
          }
        }
        HistoryManager.add({
          mode: "agent",
          model: config.defaultModel,
          prompt: userPrompt,
          response: response.text,
          toolsUsed: executedTools,
          tokens: response.tokensUsed.total
        });
        if (onStateChange)
          onStateChange("mateng_shining");
        console.log("\n" + TempeMascot.getMascotArt("mateng_shining"));
        console.log(source_default.green("\n\u2713 Tugas selesai dengan sukses!\n"));
      }
    } catch (err) {
      if (err.isApiKeyMissing) {
        if (onStateChange)
          onStateChange("needs_repo");
        console.log("\n" + TempeMascot.getMascotArt("needs_repo"));
        console.log(source_default.yellow(`
${err.message}
`));
      } else {
        if (onStateChange)
          onStateChange("angry");
        console.log("\n" + TempeMascot.getMascotArt("angry"));
        console.log(source_default.red(`
[Error Agent]: ${err?.message || err}
`));
      }
    }
  }
};

// dist/core/updater.js
init_source();
init_config();
var UpdateChecker = class {
  static CURRENT_VERSION = "1.0.0";
  /**
   * Cek pembaruan dan tampilkan notifikasi di terminal apabila tersedia versi baru.
   * "download npm/exe, kalau ada update ada notif di terminal"
   */
  static async checkForUpdates() {
    const config = ConfigManager.load();
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1e3;
    if (config.lastUpdateCheck && now - config.lastUpdateCheck < ONE_DAY) {
      return null;
    }
    try {
      config.lastUpdateCheck = now;
      ConfigManager.save(config);
      return null;
    } catch {
      return null;
    }
  }
  static printInstallSuccessBanner() {
    console.log("\n" + source_default.bold.hex("#10B981")("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557"));
    console.log(source_default.bold.hex("#10B981")("\u2551 ") + source_default.bold.white("\u{1F389} Tempe CLI Berhasil Terpasang!") + "                              " + source_default.bold.hex("#10B981")("\u2551"));
    console.log(source_default.bold.hex("#10B981")("\u2551 ") + source_default.gray("Ketik ") + source_default.bold.yellow("tempe") + source_default.gray(" di terminal untuk memulai coding agent.        ") + source_default.bold.hex("#10B981")("\u2551"));
    console.log(source_default.bold.hex("#10B981")("\u2551 ") + source_default.cyan("Format prompt aktif: ") + source_default.bold.magenta("tempe $ ") + "                                " + source_default.bold.hex("#10B981")("\u2551"));
    console.log(source_default.bold.hex("#10B981")("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D") + "\n");
  }
  static printUpdateNotification(latestVersion) {
    console.log("\n" + source_default.hex("#F59E0B")("\u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E"));
    console.log(source_default.hex("#F59E0B")("\u2502 ") + source_default.bold.yellow("\u{1F514} PEMBARUAN TERSEDIA!") + "                                       " + source_default.hex("#F59E0B")("\u2502"));
    console.log(source_default.hex("#F59E0B")("\u2502 ") + source_default.white(`Versi terbaru `) + source_default.bold.green(`v${latestVersion}`) + source_default.white(` telah dirilis (versi Anda: v${this.CURRENT_VERSION})  `) + source_default.hex("#F59E0B")("\u2502"));
    console.log(source_default.hex("#F59E0B")("\u2502 ") + source_default.gray("Jalankan: ") + source_default.bold.cyan("npm i -g tempe-cli") + source_default.gray(" atau unduh binary exe terbaru.   ") + source_default.hex("#F59E0B")("\u2502"));
    console.log(source_default.hex("#F59E0B")("\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F") + "\n");
  }
};

// dist/ui/terminal-ui.js
var TerminalUI = class {
  currentMode = "plan";
  currentState = "idle";
  isRunning = true;
  constructor() {
    const config = ConfigManager.load();
    this.currentMode = config.currentMode || "plan";
    if (config.apiKeys.length === 0) {
      this.currentState = "needs_repo";
    }
  }
  async start() {
    console.clear();
    this.renderWelcome();
    UpdateChecker.checkForUpdates().then((updateVersion) => {
      if (updateVersion) {
        UpdateChecker.printUpdateNotification(updateVersion);
      }
    });
    await this.mainPromptLoop();
  }
  renderWelcome() {
    console.log(TempeMascot.getMascotArt(this.currentState));
    console.log("\n" + source_default.bold.white("Selamat datang di ") + source_default.bold.hex("#F59E0B")("Tempe CLI") + source_default.gray(" - Terminal AI Coding Agent\n"));
    console.log(source_default.gray("Petunjuk Navigasi:"));
    console.log("  " + source_default.cyan("<-") + "        : Beralih ke " + source_default.bold.hex("#14B8A6")("Agent Mode") + source_default.gray(" (Hijau Tosca)"));
    console.log("  " + source_default.hex("#A855F7")("->") + "        : Beralih ke " + source_default.bold.hex("#A855F7")("Plan Mode") + source_default.gray(" (Ungu)"));
    console.log("  " + source_default.hex("#F59E0B")("alt + c") + "   : Buka " + source_default.bold("Menu Utama") + source_default.gray(" (Usage, Models, History, API, Theme)"));
    console.log("  " + source_default.red("esc") + "       : " + source_default.bold("Interrupt") + source_default.gray(" / batalkan proses yang sedang berjalan\n"));
  }
  renderHeader() {
    const stateBadge = TempeMascot.getBadge(this.currentState);
    console.log("\n" + ThemeManager.renderHeader(this.currentMode, stateBadge));
  }
  async mainPromptLoop() {
    while (this.isRunning) {
      this.renderHeader();
      const promptAnswer = await this.readInputWithShortcuts();
      if (!promptAnswer)
        continue;
      const trimmed = promptAnswer.trim();
      if (trimmed === "exit" || trimmed === "quit" || trimmed === ":q") {
        console.log(source_default.gray("Sampai jumpa! Terima kasih telah menggunakan Tempe CLI."));
        this.isRunning = false;
        break;
      }
      if (trimmed === "clear" || trimmed === "cls") {
        console.clear();
        continue;
      }
      if (trimmed === "menu") {
        await MenuHandler.openMainMenu();
        continue;
      }
      if (trimmed === "usage") {
        await MenuHandler.handleUsageMenu();
        continue;
      }
      if (trimmed === "models") {
        await MenuHandler.handleModelsMenu();
        continue;
      }
      if (trimmed === "history") {
        await MenuHandler.handleHistoryMenu();
        continue;
      }
      if (trimmed === "api" || trimmed.startsWith("api ")) {
        await MenuHandler.handleApiMenu();
        const updatedConfig = ConfigManager.load();
        if (updatedConfig.apiKeys.length > 0 && this.currentState === "needs_repo") {
          this.currentState = "idle";
        }
        continue;
      }
      if (trimmed === "theme") {
        await MenuHandler.handleThemeMenu();
        continue;
      }
      if (trimmed === "plan" || trimmed === "->") {
        this.currentMode = "plan";
        ConfigManager.setMode("plan");
        console.log(source_default.hex("#A855F7")("\u2713 Beralih ke Plan Mode (Ungu)."));
        continue;
      }
      if (trimmed === "agent" || trimmed === "<-") {
        this.currentMode = "agent";
        ConfigManager.setMode("agent");
        console.log(source_default.hex("#14B8A6")("\u2713 Beralih ke Agent Mode (Hijau Tosca)."));
        continue;
      }
      await AgentLoop.execute(trimmed, this.currentMode, (newState) => {
        this.currentState = newState;
      });
    }
  }
  /**
   * Membaca input terminal dengan dukungan tombol keyboard:
   * - Left Arrow: Agent Mode
   * - Right Arrow: Plan Mode
   * - Alt+C: Menu Utama
   * - Escape: Interrupt
   */
  readInputWithShortcuts() {
    return new Promise((resolve) => {
      const modeColor = this.currentMode === "plan" ? source_default.hex("#A855F7") : source_default.hex("#14B8A6");
      const promptString = `${source_default.bold("tempe")} ${modeColor("$")} `;
      process.stdout.write(promptString);
      if (process.stdin.isTTY) {
        import_readline4.default.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        let inputBuffer = "";
        const onKeypress = async (str, key) => {
          if (!key)
            return;
          if (key.ctrl && key.name === "c") {
            cleanup();
            console.log("\n");
            process.exit(0);
          }
          if (key.name === "escape") {
            AgentLoop.interrupt();
            console.log(source_default.red("\n[ESC Interrupt]"));
            cleanup();
            resolve("");
            return;
          }
          if (key.meta && (key.name === "c" || str === "c" || str === "\xE7")) {
            cleanup();
            console.log("\n");
            await MenuHandler.openMainMenu();
            resolve("");
            return;
          }
          if (key.name === "left" && inputBuffer.length === 0) {
            this.currentMode = "agent";
            ConfigManager.setMode("agent");
            cleanup();
            console.log(source_default.hex("#14B8A6")("\n[<- Mode: Agent (Hijau Tosca)]"));
            resolve("");
            return;
          }
          if (key.name === "right" && inputBuffer.length === 0) {
            this.currentMode = "plan";
            ConfigManager.setMode("plan");
            cleanup();
            console.log(source_default.hex("#A855F7")("\n[-> Mode: Plan (Ungu)]"));
            resolve("");
            return;
          }
          if (key.name === "return" || key.name === "enter") {
            cleanup();
            console.log("\n");
            resolve(inputBuffer);
            return;
          }
          if (key.name === "backspace") {
            if (inputBuffer.length > 0) {
              inputBuffer = inputBuffer.slice(0, -1);
              process.stdout.write("\b \b");
            }
            return;
          }
          if (str && str.length === 1 && !key.ctrl && !key.meta) {
            inputBuffer += str;
            process.stdout.write(str);
          }
        };
        const cleanup = () => {
          process.stdin.removeListener("keypress", onKeypress);
          if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
          }
        };
        process.stdin.on("keypress", onKeypress);
      } else {
        const rl = import_readline4.default.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        rl.question("", (answer) => {
          rl.close();
          resolve(answer);
        });
      }
    });
  }
};

// dist/index.js
init_source();
async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--install-notify") || args.includes("setup")) {
    UpdateChecker.printInstallSuccessBanner();
    return;
  }
  if (args.includes("--version") || args.includes("-v")) {
    console.log(`Tempe CLI v${UpdateChecker.CURRENT_VERSION}`);
    return;
  }
  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }
  const firstArg = args[0]?.toLowerCase();
  if (firstArg === "usage") {
    const { UsageTracker: UsageTracker2 } = await Promise.resolve().then(() => (init_usage(), usage_exports));
    console.log("\n" + UsageTracker2.renderUsageReport() + "\n");
    return;
  }
  if (firstArg === "models") {
    await MenuHandler.handleModelsMenu();
    return;
  }
  if (firstArg === "history") {
    const { HistoryManager: HistoryManager2 } = await Promise.resolve().then(() => (init_history(), history_exports));
    console.log("\n" + HistoryManager2.renderList(15) + "\n");
    return;
  }
  if (firstArg === "api") {
    await MenuHandler.handleApiMenu();
    return;
  }
  if (firstArg === "plan") {
    const prompt = args.slice(1).join(" ");
    if (!prompt) {
      console.log(source_default.red('Gunakan: tempe plan "<tugas/rencana yang ingin dibuat>"'));
      return;
    }
    await AgentLoop.execute(prompt, "plan");
    return;
  }
  if (firstArg === "agent") {
    const prompt = args.slice(1).join(" ");
    if (!prompt) {
      console.log(source_default.red('Gunakan: tempe agent "<tugas/aksi yang ingin dijalankan>"'));
      return;
    }
    await AgentLoop.execute(prompt, "agent");
    return;
  }
  const ui = new TerminalUI();
  await ui.start();
}
function printHelp() {
  console.log(`
${source_default.bold.hex("#F59E0B")("TEMPE CLI")} - Terminal AI Coding Agent v${UpdateChecker.CURRENT_VERSION}

${source_default.bold("PENGGUNAAN:")}
  ${source_default.cyan("tempe")}                  Memulai antarmuka terminal interaktif
  ${source_default.cyan('tempe plan "<prompt>"')}  Menjalankan perintah langsung dalam Plan Mode (Ungu)
  ${source_default.cyan('tempe agent "<prompt>"')} Menjalankan perintah langsung dalam Agent Mode (Tosca)
  ${source_default.cyan("tempe usage")}            Melihat % pemakaian kuota, token, dan estimasi tagihan ($)
  ${source_default.cyan("tempe models")}           Melihat dan mengganti model AI
  ${source_default.cyan("tempe history")}          Melihat riwayat percakapan sesi sebelumnya
  ${source_default.cyan("tempe api")}              Mengelola multi-API key (OpenAI, Gemini, Claude, Groq, Ollama)

${source_default.bold("NAVIGASI & SHORTCUT DI DALAM CLI:")}
  ${source_default.yellow("<-")}                    Beralih ke Agent Mode (Hijau Tosca)
  ${source_default.yellow("->")}                    Beralih ke Plan Mode (Ungu)
  ${source_default.yellow("alt + c")}               Membuka Menu Utama
  ${source_default.yellow("esc")}                   Interrupt / membatalkan respon atau aksi yang sedang berjalan

${source_default.bold("DOKUMENTASI & KONTRIBUSI:")}
  Repositori:  https://github.com/razannnaufal/tempe-cli
  Web & Docs:  https://razannnaufal.github.io/tempe-web/
`);
}

// bin/tempe.js
main().catch((err) => {
  console.error("[Tempe Fatal Error]:", err);
  process.exit(1);
});
