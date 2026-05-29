import { TokenType } from './tokens.js';
import * as AST from './ast.js';
import { Environment } from './environment.js';

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

  call(interpreter, args) {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }

    try {
      interpreter.executeBlock(this.declaration.body.statements, environment);
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

    call(interpreter, args) {
        const instance = new JawaInstance(this);
        const initializer = this.findMethod("wujudno");
        if (initializer !== null) {
            initializer.bind(instance).call(interpreter, args);
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
        if (this.fields.has(name.lexeme)) return this.fields.get(name.lexeme);
        const method = this.klass.findMethod(name.lexeme);
        if (method !== null) return method.bind(this);
        throw new Error(`[line ${name.line}] Error: Properti '${name.lexeme}' ora ono.`);
    }

    set(name, value) {
        this.fields.set(name.lexeme, value);
    }

    toString() { return `<obyek ${this.klass.name}>`; }
}

export class Interpreter {
  constructor() {
    this.globals = new Environment();
    this.environment = this.globals;
    
    // Add Built-in Natives
    this.globals.define("saiki", {
      arity: () => 0,
      call: () => Date.now(),
      toString: () => "<native gawe saiki>"
    });
  }

  interpret(statements) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Kesalahan sing ora dingerteni.");
        }
    }
  }

  execute(stmt) { stmt.accept(this); }
  evaluate(expr) { return expr.accept(this); }

  visitBlockStmt(stmt) {
    this.executeBlock(stmt.statements, new Environment(this.environment));
    return null;
  }

  executeBlock(statements, environment) {
    const previous = this.environment;
    try {
      this.environment = environment;
      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  visitExpressionStmt(stmt) {
    this.evaluate(stmt.expression);
    return null;
  }

  visitGaweStmt(stmt) {
    const functionObj = new JawaFunction(stmt, this.environment);
    this.environment.define(stmt.name.lexeme, functionObj);
    return null;
  }

  visitKelasStmt(stmt) {
      let superclass = null;
      if (stmt.superclass !== null) {
          superclass = this.evaluate(stmt.superclass);
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

  visitLekStmt(stmt) {
    if (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else {
        for (const elif of stmt.elseIfBranches) {
            if (this.isTruthy(this.evaluate(elif.condition))) {
                this.execute(elif.branch);
                return null;
            }
        }
        if (stmt.elseBranch !== null) {
            this.execute(stmt.elseBranch);
        }
    }
    return null;
  }

  visitCetaknoStmt(stmt) {
    const value = this.evaluate(stmt.expression);
    console.log(this.stringify(value));
    return null;
  }

  visitBaleknoStmt(stmt) {
    let value = null;
    if (stmt.value !== null) value = this.evaluate(stmt.value);
    throw new ReturnValue(value);
  }

  visitVarStmt(stmt) {
    let value = null;
    if (stmt.initializer !== null) {
      value = this.evaluate(stmt.initializer);
    }
    this.environment.define(stmt.name.lexeme, value);
    return null;
  }

  visitSelagiStmt(stmt) {
    try {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }
    } catch (e) {
        if (e instanceof Break) return null;
        throw e;
    }
    return null;
  }

  visitKanggoStmt(stmt) {
      const previous = this.environment;
      this.environment = new Environment(this.environment);
      try {
          if (stmt.initializer !== null) this.execute(stmt.initializer);
          while (stmt.condition === null || this.isTruthy(this.evaluate(stmt.condition))) {
              try {
                  this.execute(stmt.body);
              } catch (e) {
                  if (e instanceof Break) break;
                  if (e instanceof Continue) {
                      if (stmt.increment !== null) this.evaluate(stmt.increment);
                      continue;
                  }
                  throw e;
              }
              if (stmt.increment !== null) this.evaluate(stmt.increment);
          }
      } finally {
          this.environment = previous;
      }
      return null;
  }

  visitMandekStmt(stmt) { throw new Break(); }
  visitLanjutnoStmt(stmt) { throw new Continue(); }

  visitAssignExpr(expr) {
    let value = this.evaluate(expr.value);
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

  visitBinaryExpr(expr) {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

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

  visitLogicalExpr(expr) {
      const left = this.evaluate(expr.left);
      if (expr.operator.type === TokenType.UTAWA) {
          if (this.isTruthy(left)) return left;
      } else {
          if (!this.isTruthy(left)) return left;
      }
      return this.evaluate(expr.right);
  }

  visitTernaryExpr(expr) {
      if (this.isTruthy(this.evaluate(expr.condition))) {
          return this.evaluate(expr.thenExpr);
      } else {
          return this.evaluate(expr.elseExpr);
      }
  }

  visitCallExpr(expr) {
    const callee = this.evaluate(expr.callee);
    const args = [];
    for (const argument of expr.args) {
      args.push(this.evaluate(argument));
    }
    if (!(callee.call)) throw new Error(`[line ${expr.paren.line}] Error: Sing iso diceluk mung gawe (function) utowo kelas.`);
    if (args.length !== callee.arity()) throw new Error(`[line ${expr.paren.line}] Error: Kudune ${callee.arity()} argumen, tapi oleh ${args.length}.`);
    return callee.call(this, args);
  }

  visitGetExpr(expr) {
      const object = this.evaluate(expr.object);
      if (object instanceof JawaInstance) return object.get(expr.name);
      // Handle native JS objects if needed (KISS: for now assume JawaInstance or throw)
      throw new Error(`[line ${expr.name.line}] Error: Mung obyek sing duwe properti.`);
  }

  visitSetExpr(expr) {
      const object = this.evaluate(expr.object);
      if (!(object instanceof JawaInstance)) throw new Error(`[line ${expr.name.line}] Error: Mung obyek sing iso dipasang properti.`);
      const value = this.evaluate(expr.value);
      object.set(expr.name, value);
      return value;
  }

  visitThisExpr(expr) { return this.environment.get(expr.keyword); }

  visitGroupingExpr(expr) { return this.evaluate(expr.expression); }
  visitLiteralExpr(expr) { return expr.value; }
  visitUnaryExpr(expr) {
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.TAMBAH: return +right;
      case TokenType.KURANG: return -right;
      case TokenType.ORA: return !this.isTruthy(right);
    }
    return null;
  }
  visitVariableExpr(expr) { return this.environment.get(expr.name); }

  isTruthy(object) {
    if (object === null || object === undefined) return false;
    if (typeof object === "boolean") return object;
    return true;
  }
  stringify(object) {
    if (object === null) return "kosong";
    if (object === undefined) return "oraDidefinisikan";
    return object.toString();
  }
}
