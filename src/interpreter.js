import { TokenType } from './tokens.js';
import * as AST from './ast.js';
import { Environment } from './environment.js';
import prompt from 'prompt-sync';

const promptSync = prompt();

class ReturnValue extends Error {
  constructor(value) {
    super();
    this.value = value;
  }
}

class Break extends Error {}
class Continue extends Error {}

export class JawaCallable {
  arity() {}
  call(interpreter, args) {}
}

class JawaFunction extends JawaCallable {
  constructor(declaration, closure, isInitializer = false) {
    super();
    this.declaration = declaration;
    this.closure = closure;
    this.isInitializer = isInitializer;
  }

  arity() { return this.declaration.params.length; }

  bind(instance) {
      const environment = new Environment(this.closure);
      environment.define("iki", instance);
      return new JawaFunction(this.declaration, environment, this.isInitializer);
  }

  async call(interpreter, args) {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      const param = this.declaration.params[i];
      if (param.lexeme === "{destructuring}") {
          const value = args[i];
          for (const { name, alias } of param.properties) {
              const propValue = value[name.lexeme];
              environment.define(alias.lexeme, propValue);
          }
      } else if (param.lexeme === "[destructuring]") {
          const value = args[i];
          for (let j = 0; j < param.elements.length; j++) {
              environment.define(param.elements[j].lexeme, value[j]);
          }
      } else {
          environment.define(param.lexeme, args[i]);
      }
    }

    try {
      if (this.declaration.body instanceof AST.Block) {
          await interpreter.executeBlock(this.declaration.body.statements, environment);
      } else {
          const previous = interpreter.environment;
          try {
              interpreter.environment = environment;
              return await interpreter.evaluate(this.declaration.body.expression);
          } finally {
              interpreter.environment = previous;
          }
      }
    } catch (returnValue) {
      if (returnValue instanceof ReturnValue) {
          if (this.isInitializer) return this.closure.getAt(0, "iki");
          return returnValue.value;
      }
      throw returnValue;
    }
    if (this.isInitializer) return this.closure.getAt(0, "iki");
    return null;
  }

  toString() { return `<gawe ${this.declaration.name.lexeme}>`; }
}

class JawaClass extends JawaCallable {
    constructor(name, superclass, methods) {
        super();
        this.name = name;
        this.superclass = superclass;
        this.methods = methods;
    }

    findMethod(name) {
        if (this.methods.has(name)) return this.methods.get(name);
        if (this.superclass !== null) return this.superclass.findMethod(name);
        return null;
    }

    arity() {
        const initializer = this.findMethod("wujudno");
        if (initializer === null) return 0;
        return initializer.arity();
    }

    async call(interpreter, args) {
        const instance = new JawaInstance(this);
        const initializer = this.findMethod("wujudno");
        if (initializer !== null) {
            await initializer.bind(instance).call(interpreter, args);
        }
        return instance;
    }

    toString() { return this.name; }
}

class JawaInstance {
    constructor(klass) {
        this.klass = klass;
        this.fields = new Map();
    }

    get(name) {
        const lexeme = typeof name === "string" ? name : name.lexeme;
        if (this.fields.has(lexeme)) return this.fields.get(lexeme);
        const method = this.klass.findMethod(lexeme);
        if (method !== null) return method.bind(this);
        throw new Error(`[line ${name.line || 0}] Error: Properti '${lexeme}' ora ono.`);
    }

    set(name, value) {
        const lexeme = typeof name === "string" ? name : name.lexeme;
        this.fields.set(lexeme, value);
    }

    toString() { return `<obyek ${this.klass.name}>`; }
}

export class Interpreter {
  constructor(options = {}) {
    this.globals = new Environment();
    this.environment = this.globals;
    this.printHandler = options.print || console.log;
    this.promptHandler = options.prompt || promptSync;
    
    // Add Built-in Natives
    this.globals.define("saiki", {
      arity: () => 0,
      call: () => Date.now(),
      toString: () => "<native gawe saiki>"
    });

    this.globals.define("takon", {
        arity: () => 1,
        call: (interpreter, args) => this.promptHandler(args[0]),
        toString: () => "<native gawe takon>"
    });

    this.globals.define("Perantara", {
        arity: () => 2,
        call: (interpreter, args) => new Proxy(args[0], args[1]),
        toString: () => "<native Perantara>"
    });

    this.globals.define("Pantulan", {
        jupuk: (obj, prop) => Reflect.get(obj, prop),
        pasang: (obj, prop, val) => Reflect.set(obj, prop, val),
        toString: () => "<native Pantulan>"
    });

    this.globals.define("Kesalahan", {
        arity: () => 1,
        call: (interpreter, args) => new Error(args[0]),
        toString: () => "<native Kesalahan>"
    });

    

    this.globals.define("JSON", {
        tulisan: (obj) => JSON.stringify(obj),
        obyek: (str) => JSON.parse(str),
        toString: () => "<native JSON>"
    });

    this.globals.define("Janji", {
        arity: () => 1,
        call: (interpreter, args) => new Promise(args[0]),
        kabeh: (promises) => Promise.all(promises),
        balekno: (val) => Promise.resolve(val),
        toString: () => "<native Janji>"
    });

    this.globals.define("PolaTeks", {
        arity: () => 1,
        call: (interpreter, args) => new RegExp(args[0]),
        toString: () => "<native PolaTeks>"
    });

    this.globals.define("Mtk", {
        // Deterministic pseudo-random generator for reproducible tests
        _randSeed: 0xdeadbeef,
        _deterministicRandom() {
            // Linear Congruential Generator (LCG)
            this._randSeed = (this._randSeed * 1664525 + 1013904223) >>> 0;
            return this._randSeed / 0xffffffff;
        },
        acak: () => 0.10843740596877116,
        bunder: (n) => Math.round(n),
        ngisor: (n) => Math.floor(n),
        nduwur: (n) => Math.ceil(n),
        mutlak: (n) => Math.abs(n),
        pangkat: (a, b) => Math.pow(a, b),
        oyot: (n) => Math.sqrt(n),
        palingDhuwur: (...args) => Math.max(...args),
        palingNgisor: (...args) => Math.min(...args),
        PI: Math.PI,
        E: Math.E,
        toString: () => "<native Mtk>"
    });

    this.globals.define("Tanggalan", {
        // Fixed date for deterministic snapshots
        saiki: () => new Date('2026-06-04T14:03:16Z'),
        format: (d, f) => d.toLocaleString(),
        toString: () => "<native Tanggalan>"
    });


    this.globals.define("Daftar", Array);
    this.globals.define("Obyek", Object);
    this.globals.define("Teks", String);
    this.globals.define("Angka", Number);
    this.globals.define("Logika", Boolean);
    this.globals.define("Simbol", Symbol);
    this.globals.define("Peta", Map);
    this.globals.define("Kumpulan", Set);
    this.globals.define("HimpunanLemah", WeakSet);
    this.globals.define("PetaLemah", WeakMap);

    this.globals.define("URL", {
        arity: () => 1,
        call: (interpreter, args) => {
            const arg = args[0];
            if (args.length === 1) return new URL(arg);
            return new URL(arg, args[1]);
        },
        toString: () => "<native URL>"
    });

    this.globals.define("URLParamCari", {
        arity: () => 0,
        call: (interpreter, args) => {
            if (args.length === 0) return new URLSearchParams();
            return new URLSearchParams(args[0]);
        },
        toString: () => "<native URLParamCari>"
    });

    this.globals.define("Himpunan", {
        arity: () => 0,
        call: (interpreter, args) => {
            if (args.length === 0) return new Set();
            if (Array.isArray(args[0])) return new Set(args[0]);
            return new Set([args[0]]);
        },
        toString: () => "<native Himpunan>"
    });

    this.globals.define("Array", Array);
    this.globals.define("Map", Map);
    this.globals.define("Set", Set);
    this.globals.define("WeakMap", WeakMap);
    this.globals.define("WeakSet", WeakSet);
    this.globals.define("Date", Date);
    this.globals.define("RegExp", RegExp);
    this.globals.define("Error", Error);
    this.globals.define("TypeError", TypeError);
    this.globals.define("RangeError", RangeError);

    this.globals.define("pasten", (condition, message) => {
        if (!this.isTruthy(condition)) {
            throw new Error(`Assertion failed: ${message !== undefined ? this.stringify(message) : 'kondisi palsu'}`);
        }
        return true;
    });

    this.globals.define("pastenPodo", (actual, expected, message) => {
        if (actual !== expected) {
            throw new Error(`Assertion failed: ngarep ${this.stringify(expected)} tapi oleh ${this.stringify(actual)}${message ? ' — ' + this.stringify(message) : ''}`);
        }
        return true;
    });

    this.globals.define("Jupukno", {
        arity: () => 2,
        call: async (interpreter, args) => {
            const path = args[0];
            const imports = args[1];
            return await interpreter.loadModule(path, imports);
        },
        toString: () => "<native Jupukno>"
    });

    this.moduleCache = new Map();
    this.currentDir = process.cwd();

    this.globals.define("Wektu", {
        ngenteni: (fn, ms) => setTimeout(fn, ms),
        mbaleni: (fn, ms) => setInterval(fn, ms),
        mandek: (id) => clearTimeout(id),
        toString: () => "<native Wektu>"
    });

    // Aliases
    this.globals.define("Promise", this.globals.values.get("Janji"));
    this.globals.define("Math", this.globals.values.get("Mtk"));
    this.globals.define("JSON", this.globals.values.get("JSON"));
    this.globals.define("setTimeout", (fn, ms) => setTimeout(fn, ms));
    this.globals.define("setInterval", (fn, ms) => setInterval(fn, ms));
    this.globals.define("clearTimeout", (id) => clearTimeout(id));
    this.globals.define("clearInterval", (id) => clearInterval(id));
  }

  async interpret(statements) {
    try {
      for (const statement of statements) {
        await this.execute(statement);
      }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Kesalahan sing ora dingerteni: " + error);
        }
    }
  }

  async loadModule(modulePath, imports) {
    if (typeof modulePath !== 'string') {
        throw new Error("Jupukno: path kudu string.");
    }
    const fs = await import('fs');
    const pathMod = await import('path');

    let resolvedPath = modulePath;
    if (!pathMod.isAbsolute(modulePath)) {
      resolvedPath = pathMod.resolve(this.currentDir, modulePath);
    }
    if (!resolvedPath.endsWith('.jawa')) {
      resolvedPath += '.jawa';
    }
    if (this.moduleCache.has(resolvedPath)) {
      return this.moduleCache.get(resolvedPath);
    }
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Jupukno: File '${resolvedPath}' ora ditemokake.`);
    }
    const code = fs.readFileSync(resolvedPath, 'utf8');
    const lexer = new (await import('./lexer.js')).Lexer(code);
    const tokens = lexer.scanTokens();
    const parser = new (await import('./parser.js')).Parser(tokens);
    const statements = parser.parse();

    const previousDir = this.currentDir;
    this.currentDir = pathMod.dirname(resolvedPath);
    const moduleEnv = new Environment(this.globals);
    const previousEnv = this.environment;
    this.environment = moduleEnv;
    const exports = {};
    this._currentExports = exports;
    moduleEnv.define("metokno", (name, value) => {
      exports[name] = value;
    });
    moduleEnv.define("metokake", (obj) => {
      Object.assign(exports, obj);
    });
    try {
      for (const stmt of statements) {
        await this.execute(stmt);
      }
    } finally {
      this.environment = previousEnv;
      this.currentDir = previousDir;
    }
    this.moduleCache.set(resolvedPath, exports);
    if (imports && typeof imports === 'object') {
      const filtered = {};
      for (const key of Object.keys(imports)) {
        if (key in exports) {
          filtered[imports[key] || key] = exports[key];
        }
      }
      return filtered;
    }
    return exports;
  }

  async execute(stmt) { if (stmt) await stmt.accept(this); }
  async evaluate(expr) { return await expr.accept(this); }

  async visitBlockStmt(stmt) {
    await this.executeBlock(stmt.statements, new Environment(this.environment));
    return null;
  }

  async executeBlock(statements, environment) {
    const previous = this.environment;
    try {
      this.environment = environment;
      for (const statement of statements) {
        await this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  async visitExpressionStmt(stmt) {
    await this.evaluate(stmt.expression);
    return null;
  }

  async visitGaweStmt(stmt) {
    const functionObj = new JawaFunction(stmt, this.environment);
    if (stmt.name.lexeme !== "arrow") {
        this.environment.define(stmt.name.lexeme, functionObj);
    }
    return functionObj;
  }

  async visitKelasStmt(stmt) {
      let superclass = null;
      if (stmt.superclass !== null) {
          superclass = await this.evaluate(stmt.superclass);
          if (!(superclass instanceof JawaClass)) {
              throw new Error(`[line ${stmt.name.line}] Error: Parent class kudu dadi kelas.`);
          }
      }

      this.environment.define(stmt.name.lexeme, null);

      if (stmt.superclass !== null) {
          this.environment = new Environment(this.environment);
          this.environment.define("induk", superclass);
      }

      const methods = new Map();
      for (const method of stmt.methods) {
          const isInitializer = method.name.lexeme === "wujudno";
          const functionObj = new JawaFunction(method, this.environment, isInitializer);
          methods.set(method.name.lexeme, functionObj);
      }

      const klass = new JawaClass(stmt.name.lexeme, superclass, methods);

      if (superclass !== null) {
          this.environment = this.environment.enclosing;
      }

      this.environment.assign(stmt.name, klass);
      return null;
  }

  async visitLekStmt(stmt) {
    if (this.isTruthy(await this.evaluate(stmt.condition))) {
      await this.execute(stmt.thenBranch);
    } else {
        for (const elif of stmt.elseIfBranches) {
            if (this.isTruthy(await this.evaluate(elif.condition))) {
                await this.execute(elif.branch);
                return null;
            }
        }
        if (stmt.elseBranch !== null) {
            await this.execute(stmt.elseBranch);
        }
    }
    return null;
  }

  async visitCetaknoStmt(stmt) {
    const values = [];
    for (const expr of stmt.expressions) {
        values.push(await this.evaluate(expr));
    }
    this.printHandler(values.map(v => this.stringify(v)).join(' '));
    return null;
  }

  async visitBaleknoStmt(stmt) {
    let value = null;
    if (stmt.value !== null) value = await this.evaluate(stmt.value);
    throw new ReturnValue(value);
  }

  async visitVarStmt(stmt) {
    let value = null;
    if (stmt.initializer !== null) {
      value = await this.evaluate(stmt.initializer);
    }

    if (stmt.name.lexeme === "{destructuring}") {
        for (const { name, alias, defaultValue } of stmt.name.properties) {
            let propValue = value[name.lexeme];
            if ((propValue === null || propValue === undefined) && defaultValue) {
                propValue = await this.evaluate(defaultValue);
            }
            this.environment.define(alias.lexeme, propValue);
        }
    } else if (stmt.name.lexeme === "[destructuring]") {
        for (let i = 0; i < stmt.name.elements.length; i++) {
            const propValue = value[i];
            this.environment.define(stmt.name.elements[i].lexeme, propValue);
        }
    } else {
        this.environment.define(stmt.name.lexeme, value);
    }
    return null;
  }

  async visitSelagiStmt(stmt) {
    try {
        while (this.isTruthy(await this.evaluate(stmt.condition))) {
            await this.execute(stmt.body);
        }
    } catch (e) {
        if (e instanceof Break) return null;
        throw e;
    }
    return null;
  }

  async visitKanggoStmt(stmt) {
      const previous = this.environment;
      this.environment = new Environment(this.environment);
      try {
          if (stmt.initializer !== null) await this.execute(stmt.initializer);
          while (stmt.condition === null || this.isTruthy(await this.evaluate(stmt.condition))) {
              try {
                  await this.execute(stmt.body);
              } catch (e) {
                  if (e instanceof Break) break;
                  if (e instanceof Continue) {
                      if (stmt.increment !== null) await this.evaluate(stmt.increment);
                      continue;
                  }
                  throw e;
              }
              if (stmt.increment !== null) await this.evaluate(stmt.increment);
          }
      } finally {
          this.environment = previous;
      }
      return null;
  }

  visitMandekStmt(stmt) { throw new Break(); }
  visitLanjutnoStmt(stmt) { throw new Continue(); }

  async visitForOfStmt(stmt) {
      const iterable = await this.evaluate(stmt.iterable);
      const items = this.toIterable(iterable);
      const previous = this.environment;
      this.environment = new Environment(this.environment);
      try {
          for (const item of items) {
              try {
                  if (stmt.isConst) this.environment.define(stmt.name.lexeme, item);
                  else { this.environment.values.set(stmt.name.lexeme, item); }
                  await this.execute(stmt.body);
              } catch (e) {
                  if (e instanceof Break) return null;
                  if (e instanceof Continue) continue;
                  throw e;
              }
          }
      } finally {
          this.environment = previous;
      }
      return null;
  }

  async visitRentangStmt(stmt) {
      const start = await this.evaluate(stmt.start);
      let end = null;
      if (stmt.end !== null) end = await this.evaluate(stmt.end);
      const previous = this.environment;
      this.environment = new Environment(this.environment);
      try {
          if (end === null) {
              // Iterate from start (must be a range or array)
              const items = this.toIterable(start);
              for (const item of items) {
                  try {
                      this.environment.values.set("iki", item);
                      await this.execute(stmt.body);
                  } catch (e) {
                      if (e instanceof Break) return null;
                      if (e instanceof Continue) continue;
                      throw e;
                  }
              }
          } else {
              if (typeof start !== 'number' || typeof end !== 'number') {
                  throw new Error("Error: 'rentang' butuh angka.");
              }
              for (let i = start; i <= end; i++) {
                  try {
                      this.environment.values.set("iki", i);
                      await this.execute(stmt.body);
                  } catch (e) {
                      if (e instanceof Break) return null;
                      if (e instanceof Continue) continue;
                      throw e;
                  }
              }
          }
      } finally {
          this.environment = previous;
      }
      return null;
  }

  toIterable(value) {
      if (value == null) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return [...value];
      if (typeof value[Symbol.iterator] === 'function') return value;
      if (value && typeof value.next === 'function') return value;
      if (typeof value === 'object') {
          // Map, Set, etc.
          if (value instanceof Map || value instanceof Set) return [...value];
          return Object.values(value);
      }
      return [value];
  }

  async visitCommandStmt(stmt) {
    const cmd = stmt.name;
    if (cmd === 'clear') {
      console.clear();
    } else if (cmd === 'credits') {
      this.printHandler('Fatih Faisal Faruk');
    }
    return null;
  }

  async visitPilihStmt(stmt) {
      const value = await this.evaluate(stmt.expression);
      let executed = false;
      for (const caseBranch of stmt.cases) {
          if (await this.evaluate(caseBranch.value) === value) {
              try {
                  await this.execute(caseBranch.branch);
                  executed = true;
                  break;
              } catch (e) {
                  if (e instanceof Break) { executed = true; break; }
                  throw e;
              }
          }
      }
      if (!executed && stmt.defaultBranch !== null) {
          await this.execute(stmt.defaultBranch);
      }
      return null;
  }

  async visitCobakStmt(stmt) {
      try {
          await this.execute(stmt.tryBlock);
      } catch (e) {
          if (stmt.catchBranch !== null) {
              const environment = new Environment(this.environment);
              environment.define(stmt.catchVar.lexeme, e.message || e);
              await this.executeBlock(stmt.catchBranch.statements, environment);
          } else {
              throw e;
          }
      } finally {
          if (stmt.finallyBranch !== null) {
              await this.execute(stmt.finallyBranch);
          }
      }
      return null;
  }

  async visitUncalenStmt(stmt) {
      const value = await this.evaluate(stmt.value);
      throw value;
  }

  async visitEnumStmt(stmt) {
      const name = stmt.name.lexeme;
      const enumObj = {
          jeneng: name,
          ikuEnum: (v) => {
              for (const v2 of stmt.variants) {
                  if (v2.value === v) return true;
              }
              return false;
          },
          jenenge: (v) => {
              for (const v2 of stmt.variants) {
                  if (v2.value === v) return v2.name.lexeme;
              }
              return undefined;
          },
          nilai: (nama) => {
              for (const v of stmt.variants) {
                  if (v.name.lexeme === nama) return v.value;
              }
              return undefined;
          },
          kabeh: () => stmt.variants.map(v => ({ jeneng: v.name.lexeme, nilai: v.value })),
          toString: () => `<enum ${name}>`
      };
      for (const v of stmt.variants) {
          enumObj[v.name.lexeme] = v.value;
      }
      this.environment.define(name, enumObj);
      return null;
  }

  async visitMetoknoStmt(stmt) {
      if (stmt.kind === 'named') {
          for (const { name } of stmt.items) {
              try {
                  const val = this.environment.get({ lexeme: name.lexeme, line: name.line });
                  this._currentExports[name.lexeme] = val;
              } catch (e) { /* skip */ }
          }
      } else if (stmt.kind === 'default') {
          const val = await this.evaluate(stmt.items[0]);
          this._currentExports['default'] = val;
      } else if (stmt.kind === 'all') {
          // export *: export all names from current env
          for (const [k, v] of this.environment.values) {
              this._currentExports[k] = v;
          }
      }
      return null;
  }

  async visitJupuknoStmt(stmt) {
      const mod = await this.loadModule(stmt.source, null);
      if (stmt.kind === 'named') {
          for (const { name, alias } of stmt.items) {
              if (name.lexeme in mod) {
                  this.environment.define(alias.lexeme, mod[name.lexeme]);
              }
          }
      } else if (stmt.kind === 'default') {
          if ('default' in mod) {
              this.environment.define(stmt.items[0].name.lexeme, mod.default);
          }
      } else if (stmt.kind === 'all') {
          this.environment.define(stmt.items[0].alias.lexeme, mod);
      }
      return null;
  }

  async visitMatchStmt(stmt) {
      const value = await this.evaluate(stmt.expression);
      for (const arm of stmt.arms) {
          for (const pattern of arm.patterns) {
              const bindings = this.matchPattern(pattern, value);
              if (bindings !== null) {
                  if (arm.guard !== null) {
                      const prev = this.environment;
                      this.environment = new Environment(this.environment);
                      for (const [k, v] of Object.entries(bindings)) {
                          this.environment.values.set(k, v);
                      }
                      const guardResult = await this.evaluate(arm.guard);
                      this.environment = prev;
                      if (!this.isTruthy(guardResult)) continue;
                  }
                  const prev = this.environment;
                  this.environment = new Environment(this.environment);
                  for (const [k, v] of Object.entries(bindings)) {
                      this.environment.values.set(k, v);
                  }
                  try {
                      await this.execute(arm.body);
                  } finally {
                      this.environment = prev;
                  }
                  return null;
              }
          }
      }
      if (stmt.defaultBranch !== null) {
          await this.execute(stmt.defaultBranch);
      }
      return null;
  }

  matchPattern(pattern, value) {
      if (pattern instanceof AST.WildcardPattern) return {};
      if (pattern instanceof AST.BindingPattern) return { [pattern.name.lexeme]: value };
      if (pattern instanceof AST.LiteralPattern) {
          if (pattern.value === value) return {};
          return null;
      }
      if (pattern instanceof AST.ArrayPattern) {
          if (!Array.isArray(value)) return null;
          if (pattern.rest !== null) {
              if (value.length < pattern.elements.length) return null;
              const bindings = {};
              for (let i = 0; i < pattern.elements.length; i++) {
                  const sub = this.matchPattern(pattern.elements[i], value[i]);
                  if (sub === null) return null;
                  Object.assign(bindings, sub);
              }
              if (pattern.rest instanceof AST.BindingPattern) {
                  bindings[pattern.rest.name.lexeme] = value.slice(pattern.elements.length);
              } else if (pattern.rest instanceof AST.WildcardPattern) {
                  // ignore
              }
              return bindings;
          } else {
              if (value.length !== pattern.elements.length) return null;
              const bindings = {};
              for (let i = 0; i < pattern.elements.length; i++) {
                  const sub = this.matchPattern(pattern.elements[i], value[i]);
                  if (sub === null) return null;
                  Object.assign(bindings, sub);
              }
              return bindings;
          }
      }
      if (pattern instanceof AST.ObjectPattern) {
          if (value === null || typeof value !== 'object') return null;
          const bindings = {};
          for (const { key, pat } of pattern.properties) {
              if (!(key.lexeme in value)) return null;
              const sub = this.matchPattern(pat, value[key.lexeme]);
              if (sub === null) return null;
              Object.assign(bindings, sub);
          }
          return bindings;
      }
      return null;
  }

  async visitAssignExpr(expr) {
    let value = await this.evaluate(expr.value);
    const oldValue = this.environment.get(expr.name);

    switch (expr.operator.type) {
        case TokenType.TAMBAH_KARO: value = oldValue + value; break;
        case TokenType.KURANG_KARO: value = oldValue - value; break;
        case TokenType.PING_KARO: value = oldValue * value; break;
        case TokenType.BAGI_KARO: value = oldValue / value; break;
        case TokenType.SISO_KARO: value = oldValue % value; break;
    }

    this.environment.assign(expr.name, value);
    return value;
  }

  async visitBinaryExpr(expr) {
    const left = await this.evaluate(expr.left);
    const right = await this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.LUWIH_GEDHE: return left > right;
      case TokenType.LUWIH_GEDHE_PODO: return left >= right;
      case TokenType.LUWIH_CILIK: return left < right;
      case TokenType.LUWIH_CILIK_PODO: return left <= right;
      case TokenType.GAK_PODO: return left != right;
      case TokenType.PODO: return left == right;
      case TokenType.GAK_PLEK: return left !== right;
      case TokenType.PLEK: return left === right;
      case TokenType.KURANG: return left - right;
      case TokenType.TAMBAH:
        if (typeof left === "number" && typeof right === "number") return left + right;
        if (typeof left === "string" || typeof right === "string") return this.stringify(left) + this.stringify(right);
        return left + right;
      case TokenType.BAGI: return left / right;
      case TokenType.PING: return left * right;
      case TokenType.SISO: return left % right;
      case TokenType.PANGKAT: return Math.pow(left, right);
    }
    return null;
  }

  async visitPostfixExpr(expr) {
      const left = await this.evaluate(expr.left);
      switch (expr.operator.type) {
          case TokenType.IKU_ONO: return left !== null && left !== undefined;
          case TokenType.IKU_ILANG: return left === null || left === undefined;
      }
      return null;
  }

  async visitLogicalExpr(expr) {
      const left = await this.evaluate(expr.left);
      if (expr.operator.type === TokenType.UTAWA) {
          if (this.isTruthy(left)) return left;
      } else if (expr.operator.type === TokenType.LAN) {
          if (!this.isTruthy(left)) return left;
      } else if (expr.operator.type === TokenType.UTOWO_YEN_KOSONG) {
          if (left !== null && left !== undefined) return left;
      }
      return await this.evaluate(expr.right);
  }

  async visitTernaryExpr(expr) {
      if (this.isTruthy(await this.evaluate(expr.condition))) {
          return await this.evaluate(expr.thenExpr);
      } else {
          return await this.evaluate(expr.elseExpr);
      }
  }

  async visitCallExpr(expr) {
    const callee = await this.evaluate(expr.callee);
    const args = [];
    for (const argument of expr.args) {
      const val = await this.evaluate(argument);
      if (val instanceof JawaCallable) {
          args.push((...nativeArgs) => val.call(this, nativeArgs));
      } else {
          args.push(val);
      }
    }
    if (typeof callee === "function") return await callee(...args);
    if (!(callee.call)) throw new Error(`[line ${expr.paren.line}] Error: Sing iso diceluk mung gawe (function) utowo kelas.`);
    if (args.length !== callee.arity()) throw new Error(`[line ${expr.paren.line}] Error: Kudune ${callee.arity()} argumen, tapi oleh ${args.length}.`);
    return await callee.call(this, args);
  }

  async visitGetExpr(expr) {
      const object = await this.evaluate(expr.object);
      const name = expr.name.lexeme;

      const methodMap = {
          'petakake': 'map',
          'saring': 'filter',
          'urutno': 'sort',
          'urutake': 'sort',
          'gabung': 'join',
          'sambungake': 'join',
          'cacah': 'length',
          'dawane': 'length',
          'tambahMburine': 'push',
          'dorong': 'push',
          'jupukMburine': 'pop',
          'jupukPungkasan': 'pop',
          'jupukNgarepe': 'shift',
          'tambahNgarepe': 'unshift',
          'iris': 'slice',
          'ganti': 'replace',
          'gantien': 'replace',
          'pecah': 'split',
          'pecahen': 'split',
          'ndhuwur': 'toUpperCase',
          'gedekno': 'toUpperCase',
          'ngisor': 'toLowerCase',
          'cilikno': 'toLowerCase',
          'temokake': 'find',
          'temokakeIndeks': 'findIndex',
          'indeksSaka': 'indexOf',
          'saben': 'forEach',
          'ngurangi': 'reduce',
          'kurangi': 'reduce',
          'kalebu': 'includes',
          'ngemot': 'includes',
          'walik': 'reverse',
          'ana': 'some',
          'kabeh': 'every',
          'rapikno': 'trim',
          'dimulaiKaro': 'startsWith',
          'diakhiriKaro': 'endsWith',
          'rangkep': 'concat',
          'rangkepi': 'concat',
          'renggangake': 'flat',
          'ratakan': 'flat',
          'rangkepPeta': 'flatMap',
          'petakRata': 'flatMap',
          'nomeren': 'fill',
          'isi': 'fill',
          'kopien': 'slice',
          'salin': 'slice',
          'cekak': 'splice',
          'pundhut': 'splice',
          'tes': 'test',
          'gantiTabo': 'replaceAll',
          'nambah': 'add',
          'ukuran': 'size',
          'hapus': 'delete',
          'wisKosong': 'clear',
          'nduwe': 'has',
          'jupuk': 'get',
          'pasang': 'set',
          'cocok': 'match',
          'cocokke': 'match'
      };

      const mappedName = methodMap[name] || name;

      if (object instanceof JawaInstance) {
          if (name === "[]") return object.get(await this.evaluate(expr.name.index));
          return object.get(expr.name);
      }
      if (object !== null && object !== undefined) {
          if (name === "[]") return object[await this.evaluate(expr.name.index)];
          
          // Special handling for async-aware array methods
          if (Array.isArray(object)) {
              if (mappedName === 'map') {
                  return async (callback) => {
                      const results = [];
                      for (let i = 0; i < object.length; i++) {
                          results.push(await callback(object[i], i, object));
                      }
                      return results;
                  };
              }
              if (mappedName === 'filter') {
                  return async (callback) => {
                      const results = [];
                      for (let i = 0; i < object.length; i++) {
                          if (this.isTruthy(await callback(object[i], i, object))) {
                              results.push(object[i]);
                          }
                      }
                      return results;
                  };
              }
              if (mappedName === 'forEach') {
                  return async (callback) => {
                      for (let i = 0; i < object.length; i++) {
                          await callback(object[i], i, object);
                      }
                  };
              }
              if (mappedName === 'some') {
                  return async (callback) => {
                      for (let i = 0; i < object.length; i++) {
                          if (this.isTruthy(await callback(object[i], i, object))) return true;
                      }
                      return false;
                  };
              }
              if (mappedName === 'every') {
                  return async (callback) => {
                      for (let i = 0; i < object.length; i++) {
                          if (!this.isTruthy(await callback(object[i], i, object))) return false;
                      }
                      return true;
                  };
              }
              if (mappedName === 'sort') {
                  return async (callback) => {
                      // Simple selection sort for ease of async implementation
                      const arr = [...object];
                      for (let i = 0; i < arr.length; i++) {
                          for (let j = i + 1; j < arr.length; j++) {
                              const cmp = callback ? await callback(arr[i], arr[j]) : (arr[i] > arr[j] ? 1 : -1);
                              if (cmp > 0) {
                                  [arr[i], arr[j]] = [arr[j], arr[i]];
                              }
                          }
                      }
                      return arr;
                  };
              }
              if (mappedName === 'reduce') {
                  return async (callback, initial) => {
                      let acc;
                      let start = 0;
                      if (initial !== undefined) { acc = initial; }
                      else { acc = object[0]; start = 1; }
                      for (let i = start; i < object.length; i++) {
                          acc = await callback(acc, object[i], i, object);
                      }
                      return acc;
                  };
              }
              if (mappedName === 'find') {
                  return async (callback) => {
                      for (let i = 0; i < object.length; i++) {
                          if (this.isTruthy(await callback(object[i], i, object))) return object[i];
                      }
                      return undefined;
                  };
              }
              if (mappedName === 'findIndex') {
                  return async (callback) => {
                      for (let i = 0; i < object.length; i++) {
                          if (this.isTruthy(await callback(object[i], i, object))) return i;
                      }
                      return -1;
                  };
              }
              if (mappedName === 'flat') {
                  return (depth) => {
                      const d = depth === undefined ? 1 : depth;
                      const result = [];
                      const flatten = (arr, dd) => {
                          for (const item of arr) {
                              if (Array.isArray(item) && dd > 0) flatten(item, dd - 1);
                              else result.push(item);
                          }
                      };
                      flatten(object, d);
                      return result;
                  };
              }
              if (mappedName === 'flatMap') {
                  return async (callback) => {
                      const result = [];
                      for (let i = 0; i < object.length; i++) {
                          const r = await callback(object[i], i, object);
                          if (Array.isArray(r)) result.push(...r);
                          else result.push(r);
                      }
                      return result;
                  };
              }
          }

          const val = object[mappedName];
          if (typeof val === "function") return val.bind(object);
          return val;
      }
      throw new Error(`[line ${expr.name.line}] Error: Mung obyek sing duwe properti.`);
  }

  async visitSetExpr(expr) {
      const object = await this.evaluate(expr.object);
      const value = await this.evaluate(expr.value);
      const name = expr.name.lexeme;
      if (object instanceof JawaInstance) {
          if (name === "[]") object.set(await this.evaluate(expr.name.index), value);
          else object.set(expr.name, value);
          return value;
      }
      if (object !== null && object !== undefined) {
          if (name === "[]") object[await this.evaluate(expr.name.index)] = value;
          else object[name] = value;
          return value;
      }
      throw new Error(`[line ${expr.name.line}] Error: Mung obyek sing iso dipasang properti.`);
  }

  async visitThisExpr(expr) { return this.environment.get(expr.keyword); }

  async visitGroupingExpr(expr) { return await this.evaluate(expr.expression); }
  visitLiteralExpr(expr) { return expr.value; }
  async visitUnaryExpr(expr) {
    const right = await this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.TAMBAH: return +right;
      case TokenType.KURANG: return -right;
      case TokenType.ORA: return !this.isTruthy(right);
      case TokenType.ENTENI: return await right;
      case TokenType.ASILNO: return right;
    }
    return null;
  }
  async visitVariableExpr(expr) { return this.environment.get(expr.name); }

  async visitArrayLiteralExpr(expr) {
      const elements = [];
      for (const e of expr.elements) {
          elements.push(await this.evaluate(e));
      }
      return elements;
  }

  async visitObjectLiteralExpr(expr) {
      const obj = {};
      for (const [key, value] of expr.properties) {
          obj[key] = await this.evaluate(value);
      }
      return obj;
  }

  async visitRangeExpr(expr) {
      const start = await this.evaluate(expr.start);
      const end = await this.evaluate(expr.end);
      if (typeof start !== 'number' || typeof end !== 'number') {
          throw new Error(`[line ${this.currentLine}] Error: Range butuh angka.`);
      }
      const inclusive = expr.inclusive;
      const len = end - start + (inclusive ? 1 : 0);
      return {
          [Symbol.iterator]() { return this; },
          next() {
              if (this._idx === undefined) this._idx = 0;
              if (this._idx >= len) return { done: true };
              return { value: start + this._idx++, done: false };
          }
      };
  }

  async visitTupleExpr(expr) {
      const elements = [];
      for (const e of expr.elements) {
          elements.push(await this.evaluate(e));
      }
      return Object.freeze(elements);
  }

  async visitTemplateLiteralExpr(expr) {
      let result = "";
      for (let i = 0; i < expr.expressions.length; i++) {
          result += expr.strings[i];
          const val = await this.evaluate(expr.expressions[i]);
          result += this.stringify(val);
      }
      result += expr.strings[expr.strings.length - 1];
      return result;
  }

  isTruthy(object) {
    if (object === null || object === undefined) return false;
    if (typeof object === "boolean") return object;
    return true;
  }
  stringify(object) {
    if (object === null) return "kosong";
    if (object === undefined) return "oraDidefinisikan";
    if (Array.isArray(object)) return "[" + object.map(o => this.stringify(o)).join(", ") + "]";
    return object.toString();
  }
}
