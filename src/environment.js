export class Environment {
  constructor(enclosing = null) {
    this.values = new Map();
    this.enclosing = enclosing;
  }

  get(name) {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }
    if (this.enclosing !== null) return this.enclosing.get(name);
    throw new Error(`[line ${name.line}] Error: Variabel '${name.lexeme}' ora ono (undefined).`);
  }

  assign(name, value) {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }
    if (this.enclosing !== null) {
      this.enclosing.assign(name, value);
      return;
    }
    throw new Error(`[line ${name.line}] Error: Gak iso pasang nilai menyang variabel '${name.lexeme}' sing durung ono.`);
  }

  define(name, value) {
    this.values.set(name, value);
  }

  ancestor(distance) {
    let environment = this;
    for (let i = 0; i < distance; i++) {
      environment = environment.enclosing;
    }
    return environment;
  }

  getAt(distance, name) {
    return this.ancestor(distance).values.get(name);
  }

  assignAt(distance, name, value) {
    this.ancestor(distance).values.set(name, value);
  }
}
