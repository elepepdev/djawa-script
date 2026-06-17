import { Environment } from './environment.js';
import * as AST from './ast.js';

export function isTruthy(object) {
    if (object === null || object === undefined) return false;
    if (typeof object === "boolean") return object;
    return true;
}

export function stringify(object) {
    if (object === null) return "kosong";
    if (object === undefined) return "oraDidefinisikan";
    if (Array.isArray(object)) return "[" + object.map(o => stringify(o)).join(", ") + "]";
    return object.toString();
}

export class ReturnValue extends Error {
    constructor(value) {
        super();
        this.value = value;
    }
}

export class Break extends Error {
    constructor(label = null) {
        super();
        this.label = label;
    }
}

export class Continue extends Error {
    constructor(label = null) {
        super();
        this.label = label;
    }
}

export class JawaCallable {
    arity() {}
    call(interpreter, args) {}
}

export class JawaFunction extends JawaCallable {
    constructor(declaration, closure, isInitializer = false) {
        super();
        this.declaration = declaration;
        this.closure = closure;
        this.isInitializer = isInitializer;
    }

    get isAbstract() { return this.declaration.isAbstract; }
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

export class JawaClass extends JawaCallable {
    constructor(name, superclass, methods, isSealed = false, isAbstract = false) {
        super();
        this.name = name;
        this.superclass = superclass;
        this.methods = methods;
        this.isSealed = isSealed;
        this.isAbstract = isAbstract;
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
        if (this.isAbstract) {
            throw new Error(`Error: Ora iso instantiate kelas abstrak '${this.name}'.`);
        }
        const instance = new JawaInstance(this);
        const initializer = this.findMethod("wujudno");
        if (initializer !== null) {
            await initializer.bind(instance).call(interpreter, args);
        }
        return instance;
    }

    toString() { return this.name; }
}

export class JawaStruct extends JawaCallable {
    constructor(name, fields) {
        super();
        this.name = name;
        this.fields = fields;
    }

    arity() { return this.fields.length; }

    async call(interpreter, args) {
        const instance = {};
        for (let i = 0; i < this.fields.length; i++) {
            instance[this.fields[i]] = args[i];
        }
        return Object.freeze(instance);
    }

    toString() { return `struktur ${this.name}`; }
}

export class JawaInstance {
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

export const methodMap = {
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
    'gabungno': 'concat',
    'gabungke': 'concat',
    'renggangake': 'flat',
    'ratakan': 'flat',
    'rangkepPeta': 'flatMap',
    'petakRata': 'flatMap',
    'nomeren': 'fill',
    'isi': 'fill',
    'isien': 'fill',
    'kopien': 'slice',
    'salin': 'slice',
    'cekak': 'splice',
    'pundhut': 'splice',
    'tes': 'test',
    'gantiKabeh': 'replaceAll',
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

export function createBuiltins(interpreter) {
    const globals = interpreter.globals;

    globals.define("saiki", {
        arity: () => 0,
        call: () => Date.now(),
        toString: () => "<native gawe saiki>"
    });

    globals.define("takon", {
        arity: () => 1,
        call: (interpreter, args) => interpreter.promptHandler(args[0]),
        toString: () => "<native gawe takon>"
    });

    globals.define("Perantara", {
        arity: () => 2,
        call: (interpreter, args) => new Proxy(args[0], args[1]),
        toString: () => "<native Perantara>"
    });

    globals.define("Pantulan", {
        jupuk: (obj, prop) => Reflect.get(obj, prop),
        pasang: (obj, prop, val) => Reflect.set(obj, prop, val),
        toString: () => "<native Pantulan>"
    });

    globals.define("Kesalahan", {
        arity: () => 1,
        call: (interpreter, args) => new Error(args[0]),
        toString: () => "<native Kesalahan>"
    });

    globals.define("JSON", {
        tulisan: (obj) => JSON.stringify(obj),
        obyek: (str) => JSON.parse(str),
        toString: () => "<native JSON>"
    });

    globals.define("Janji", {
        arity: () => 1,
        call: (interpreter, args) => new Promise(args[0]),
        kabeh: (promises) => Promise.all(promises),
        balekno: (val) => Promise.resolve(val),
        toString: () => "<native Janji>"
    });

    globals.define("PolaTeks", {
        arity: () => 1,
        call: (interpreter, args) => new RegExp(args[0]),
        toString: () => "<native PolaTeks>"
    });

    globals.define("Mtk", {
        _randSeed: 0xdeadbeef,
        _deterministicRandom() {
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

    globals.define("Tanggalan", {
        saiki: () => new Date('2026-06-04T14:03:16Z'),
        format: (d, f) => d.toLocaleString(),
        toString: () => "<native Tanggalan>"
    });

    globals.define("Daftar", Array);
    globals.define("Obyek", Object);
    globals.define("Teks", String);
    globals.define("Angka", Number);
    globals.define("Logika", Boolean);
    globals.define("Simbol", Symbol);
    globals.define("Peta", Map);
    globals.define("Kumpulan", Set);
    globals.define("HimpunanLemah", WeakSet);
    globals.define("PetaLemah", WeakMap);

    globals.define("URL", {
        arity: () => 1,
        call: (interpreter, args) => {
            const arg = args[0];
            if (args.length === 1) return new URL(arg);
            return new URL(arg, args[1]);
        },
        toString: () => "<native URL>"
    });

    globals.define("URLParamCari", {
        arity: () => 0,
        call: (interpreter, args) => {
            if (args.length === 0) return new URLSearchParams();
            return new URLSearchParams(args[0]);
        },
        toString: () => "<native URLParamCari>"
    });

    globals.define("Himpunan", {
        arity: () => 0,
        call: (interpreter, args) => {
            if (args.length === 0) return new Set();
            if (Array.isArray(args[0])) return new Set(args[0]);
            return new Set([args[0]]);
        },
        toString: () => "<native Himpunan>"
    });

    globals.define("pasten", (condition, message) => {
        if (!isTruthy(condition)) {
            throw new Error(`Assertion failed: ${message !== undefined ? stringify(message) : 'kondisi palsu'}`);
        }
        return true;
    });

    globals.define("pastenPodo", (actual, expected, message) => {
        if (actual !== expected) {
            throw new Error(`Assertion failed: ngarep ${stringify(expected)} tapi oleh ${stringify(actual)}${message ? ' — ' + stringify(message) : ''}`);
        }
        return true;
    });

    globals.define("Jupukno", {
        arity: () => 2,
        call: async (interpreter, args) => {
            const path = args[0];
            const imports = args[1];
            return await interpreter.loadModule(path, imports);
        },
        toString: () => "<native Jupukno>"
    });

    globals.define("Wektu", {
        ngenteni: (fn, ms) => { const id = setTimeout(fn, ms); interpreter._activeTimers.push(id); return id; },
        mbaleni: (fn, ms) => { const id = setInterval(fn, ms); interpreter._activeTimers.push(id); return id; },
        mandek: (id) => { clearTimeout(id); clearInterval(id); const idx = interpreter._activeTimers.indexOf(id); if (idx > -1) interpreter._activeTimers.splice(idx, 1); },
        toString: () => "<native Wektu>"
    });
}
