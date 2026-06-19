import { TokenType } from './tokens.js';
import * as AST from './ast.js';
import { Environment } from './environment.js';
import {
    ReturnValue, Break, Continue,
    JawaCallable, JawaFunction, JawaClass, JawaStruct, JawaInstance,
    isTruthy, stringify, methodMap, createBuiltins
} from './runtime.js';
import { createArrayMethodTable } from './array-methods.js';
import prompt from 'prompt-sync';

const promptSync = prompt();

export class Interpreter {
  constructor(options = {}) {
    this.globals = new Environment();
    this.environment = this.globals;
    this.printHandler = options.print || console.log;
    this.promptHandler = options.prompt || promptSync;
    this._destroyed = false;
    this._activeTimers = [];

    createBuiltins(this);

    this.moduleCache = new Map();
    this.currentDir = process.cwd();

    // Initialize array method dispatch table for O(1) lookup
    this.arrayMethodTable = createArrayMethodTable();
  }

  destroy() {
    this._destroyed = true;
    for (const id of this._activeTimers) {
      clearTimeout(id);
      clearInterval(id);
    }
    this._activeTimers = [];
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
    const parser = new (await import('./parser.js')).Parser(tokens, { recover: true });
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

  async visitWangunStmt(stmt) {
    const interfaceDef = {
      name: stmt.name.lexeme,
      methods: stmt.methods.map(m => ({
        name: m.name.lexeme,
        params: m.params.map(p => p.name.lexeme),
        returnType: m.returnType
      })),
      properties: stmt.properties.map(p => ({
        name: p.name.lexeme,
        type: p.type,
        isReadOnly: p.isReadOnly
      }))
    };
    this.environment.define(stmt.name.lexeme, interfaceDef);
    return null;
  }

  async visitKelasStmt(stmt) {
      let superclass = null;
      if (stmt.superclass !== null) {
          superclass = await this.evaluate(stmt.superclass);
          if (!(superclass instanceof JawaClass)) {
              throw new Error(`[line ${stmt.name.line}] Error: Parent class kudu dadi kelas.`);
          }
          if (superclass.isSealed) {
              throw new Error(`[line ${stmt.name.line}] Error: Ora iso ngextend kelas katutup '${superclass.name}'.`);
          }
      }

      // Resolve implemented interfaces
      const interfaces = [];
      for (const ifaceRef of stmt.interfaces) {
          const iface = this.environment.get(ifaceRef.name);
          if (!iface || !iface.methods) {
              throw new Error(`[line ${stmt.name.line}] Error: Interface '${ifaceRef.name.lexeme}' ora ditemokake.`);
          }
          interfaces.push(iface);
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

      const klass = new JawaClass(stmt.name.lexeme, superclass, methods, stmt.isSealed, stmt.isAbstract);

      // Validate abstract method implementation
      if (superclass !== null) {
        for (const [name, method] of superclass.methods) {
          if (method.isAbstract && !methods.has(name)) {
            throw new Error(`[line ${stmt.name.line}] Error: Kelas '${stmt.name.lexeme}' kudu implementasi method abstrak '${name}' soko '${superclass.name}'.`);
          }
        }
      }

      // Validate interface compliance
      for (const iface of interfaces) {
          for (const imethod of iface.methods) {
              if (!methods.has(imethod.name)) {
                  throw new Error(`[line ${stmt.name.line}] Error: Kelas '${stmt.name.lexeme}' kudu implementasi method '${imethod.name}' soko interface '${iface.name}'.`);
              }
          }
          for (const iprop of iface.properties) {
              // Check if class has a matching getter method
              if (!methods.has(iprop.name) && !iprop.name.startsWith('_')) {
                  throw new Error(`[line ${stmt.name.line}] Error: Kelas '${stmt.name.lexeme}' kudu duwe properti '${iprop.name}' soko interface '${iface.name}'.`);
              }
          }
      }

      // Store interfaces on the class for instanceof checks
      klass.interfaces = interfaces;

      if (superclass !== null) {
          this.environment = this.environment.enclosing;
      }

      this.environment.assign(stmt.name, klass);
      return null;
  }

  async visitStrukturStmt(stmt) {
      const struct = new JawaStruct(stmt.name.lexeme, stmt.fields.map(f => f.lexeme));
      this.environment.define(stmt.name.lexeme, struct);
      return null;
  }

  async visitLekStmt(stmt) {
    if (isTruthy(await this.evaluate(stmt.condition))) {
      await this.execute(stmt.thenBranch);
    } else {
        for (const elif of stmt.elseIfBranches) {
            if (isTruthy(await this.evaluate(elif.condition))) {
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
    this.printHandler(values.map(v => stringify(v)).join(' '));
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
        while (isTruthy(await this.evaluate(stmt.condition))) {
            if (this._destroyed) return null;
            try {
                await this.execute(stmt.body);
            } catch (e) {
                if (e instanceof Break) {
                    if (e.label === null || e.label === stmt._label) return null;
                    throw e;
                }
                if (e instanceof Continue) {
                    if (e.label === null || e.label === stmt._label) continue;
                    throw e;
                }
                throw e;
            }
        }
    } catch (e) {
        if (e instanceof Break) {
            if (e.label === null || e.label === stmt._label) return null;
            throw e;
        }
        throw e;
    }
    return null;
  }

  async visitKanggoStmt(stmt) {
      const previous = this.environment;
      this.environment = new Environment(this.environment);
      try {
          if (stmt.initializer !== null) await this.execute(stmt.initializer);
          while (stmt.condition === null || isTruthy(await this.evaluate(stmt.condition))) {
              if (this._destroyed) return null;
              try {
                  await this.execute(stmt.body);
              } catch (e) {
                  if (e instanceof Break) {
                      if (e.label === null || e.label === stmt._label) break;
                      throw e;
                  }
                  if (e instanceof Continue) {
                      if (e.label === null || e.label === stmt._label) {
                          if (stmt.increment !== null) await this.evaluate(stmt.increment);
                          continue;
                      }
                      throw e;
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

  async visitLabeledStmt(stmt) {
    try {
      if (stmt.stmt instanceof AST.Selagi || stmt.stmt instanceof AST.Kanggo ||
          stmt.stmt instanceof AST.ForOf || stmt.stmt instanceof AST.RentangStmt) {
        stmt.stmt._label = stmt.name.lexeme;
      }
      await this.execute(stmt.stmt);
    } catch (e) {
      if ((e instanceof Break || e instanceof Continue) && e.label === stmt.name.lexeme) {
        return null;
      }
      throw e;
    }
    return null;
  }

  visitMandekStmt(stmt) { throw new Break(stmt.label ? stmt.label.lexeme : null); }
  visitLanjutnoStmt(stmt) { throw new Continue(stmt.label ? stmt.label.lexeme : null); }

  async visitNgenteniStmt(stmt) {
    const amount = await this.evaluate(stmt.amount);
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error("Error: Ngenteni kudu angka positif.");
    }
    
    let ms;
    if (stmt.unit) {
      const unit = stmt.unit.lexeme;
      switch (unit) {
        case 'detik': ms = amount * 1000; break;
        case 'menit': ms = amount * 60 * 1000; break;
        case 'jam': ms = amount * 60 * 60 * 1000; break;
        case 'dino': ms = amount * 24 * 60 * 60 * 1000; break;
      }
    } else {
      ms = amount * 1000;
    }
    
    return new Promise(resolve => {
      const id = setTimeout(() => {
        const idx = this._activeTimers.indexOf(id);
        if (idx > -1) this._activeTimers.splice(idx, 1);
        resolve();
      }, ms);
      this._activeTimers.push(id);
    });
  }

  async _callValue(fn, args) {
    if (typeof fn === 'function') return await fn(...args);
    if (fn instanceof JawaCallable) return await fn.call(this, args);
    throw new Error("Error: dudu fungsi.");
  }

  async visitForOfStmt(stmt) {
      const iterable = await this.evaluate(stmt.iterable);

      if (stmt.isAsync) {
        const asyncIterFn = iterable && iterable[Symbol.asyncIterator]
          ? iterable[Symbol.asyncIterator]
          : null;
        if (!asyncIterFn) {
          throw new Error("Error: Obyek ora support async iteration (butuh Symbol.asyncIterator).");
        }
        const asyncIter = await this._callValue(asyncIterFn, []);
        if (!asyncIter || typeof asyncIter.next === 'undefined') {
          throw new Error("Error: Obyek ora support async iteration (butuh Symbol.asyncIterator).");
        }
        const previous = this.environment;
        this.environment = new Environment(this.environment);
        const _next = asyncIter.next;
        try {
          let result = await this._callValue(_next, []);
          while (!result.done) {
            if (this._destroyed) return null;
            try {
              if (stmt.isConst) this.environment.define(stmt.name.lexeme, result.value);
              else { this.environment.values.set(stmt.name.lexeme, result.value); }
              await this.execute(stmt.body);
            } catch (e) {
              if (e instanceof Break) {
                if (e.label === null || e.label === stmt._label) return null;
                throw e;
              }
              if (e instanceof Continue) {
                if (e.label === null || e.label === stmt._label) continue;
                throw e;
              }
              throw e;
            }
            result = await this._callValue(_next, []);
          }
        } finally {
          this.environment = previous;
        }
        return null;
      }

      const items = this.toIterable(iterable);
      const previous = this.environment;
      this.environment = new Environment(this.environment);
      try {
          for (const item of items) {
              if (this._destroyed) return null;
              try {
                  if (stmt.isConst) this.environment.define(stmt.name.lexeme, item);
                  else { this.environment.values.set(stmt.name.lexeme, item); }
                  await this.execute(stmt.body);
              } catch (e) {
                  if (e instanceof Break) {
                      if (e.label === null || e.label === stmt._label) return null;
                      throw e;
                  }
                  if (e instanceof Continue) {
                      if (e.label === null || e.label === stmt._label) continue;
                      throw e;
                  }
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
                  if (this._destroyed) return null;
                  try {
                      this.environment.values.set("iki", item);
                      await this.execute(stmt.body);
                  } catch (e) {
                      if (e instanceof Break) {
                          if (e.label === null || e.label === stmt._label) return null;
                          throw e;
                      }
                      if (e instanceof Continue) {
                          if (e.label === null || e.label === stmt._label) continue;
                          throw e;
                      }
                      throw e;
                  }
              }
          } else {
              if (typeof start !== 'number' || typeof end !== 'number') {
                  throw new Error("Error: 'rentang' butuh angka.");
              }
              for (let i = start; i <= end; i++) {
                  if (this._destroyed) return null;
                  try {
                      this.environment.values.set("iki", i);
                      await this.execute(stmt.body);
                  } catch (e) {
                      if (e instanceof Break) {
                          if (e.label === null || e.label === stmt._label) return null;
                          throw e;
                      }
                      if (e instanceof Continue) {
                          if (e.label === null || e.label === stmt._label) continue;
                          throw e;
                      }
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
      this.printHandler('Made by Fatih Faisal Faruk');
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
                      if (!isTruthy(guardResult)) continue;
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
        if (typeof left === "string" || typeof right === "string") return stringify(left) + stringify(right);
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
          if (isTruthy(left)) return left;
      } else if (expr.operator.type === TokenType.LAN) {
          if (!isTruthy(left)) return left;
      } else if (expr.operator.type === TokenType.UTOWO_YEN_KOSONG) {
          if (left !== null && left !== undefined) return left;
      }
      return await this.evaluate(expr.right);
  }

  async visitTernaryExpr(expr) {
      if (isTruthy(await this.evaluate(expr.condition))) {
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

      const mappedName = methodMap[name] || name;

      if (object instanceof JawaInstance) {
          if (name === "[]") return object.get(await this.evaluate(expr.name.index));
          return object.get(expr.name);
      }
      if (object !== null && object !== undefined) {
          if (name === "[]") return object[await this.evaluate(expr.name.index)];
          
          // Optimized array method dispatch using Map lookup (O(1) instead of O(n))
          if (Array.isArray(object)) {
              const methodFactory = this.arrayMethodTable.get(mappedName);
              if (methodFactory) {
                  return methodFactory(object);
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
      case TokenType.ORA: return !isTruthy(right);
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
          result += stringify(val);
      }
      result += expr.strings[expr.strings.length - 1];
      return result;
  }

  async visitTaggedTemplateExpr(expr) {
      const tag = await this.evaluate(expr.tag);
      const template = expr.template;
      const strings = template.strings;
      const evaluated = [];
      for (const e of template.expressions) {
          evaluated.push(await this.evaluate(e));
      }
      if (typeof tag === 'function') {
          return tag(strings, ...evaluated);
      }
      if (tag instanceof JawaCallable) {
          return await tag.call(this, [strings, ...evaluated]);
      }
      throw new Error("Tag kudu function.");
  }
}
