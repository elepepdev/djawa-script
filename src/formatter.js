import * as AST from './ast.js';
import { TokenType } from './tokens.js';

const OP_LEXEME = {
  [TokenType.TAMBAH]: 'tambah',
  [TokenType.KURANG]: 'kurang',
  [TokenType.PING]: 'ping',
  [TokenType.BAGI]: 'bagi',
  [TokenType.SISO]: 'siso',
  [TokenType.PANGKAT]: 'pangkat',
  [TokenType.YOIKU]: 'yoiku',
  [TokenType.TAMBAH_KARO]: 'tambahKaro',
  [TokenType.KURANG_KARO]: 'kurangKaro',
  [TokenType.PING_KARO]: 'pingKaro',
  [TokenType.BAGI_KARO]: 'bagiKaro',
  [TokenType.SISO_KARO]: 'sisoKaro',
  [TokenType.PLEK]: 'plek',
  [TokenType.PODO]: 'podo',
  [TokenType.GAK_PLEK]: 'gakPlek',
  [TokenType.GAK_PODO]: 'gakPodo',
  [TokenType.LUWIH_GEDHE]: 'luwihGedhe',
  [TokenType.LUWIH_CILIK]: 'luwihCilik',
  [TokenType.LUWIH_GEDHE_PODO]: 'luwihGedhePodo',
  [TokenType.LUWIH_CILIK_PODO]: 'luwihCilikPodo',
  [TokenType.LAN]: 'lan',
  [TokenType.UTAWA]: 'utawa',
  [TokenType.ORA]: 'ora',
  [TokenType.LANBIT]: 'lanbit',
  [TokenType.UTAWABIT]: 'utawabit',
  [TokenType.XOR]: 'xor',
  [TokenType.WALIK]: 'walik',
  [TokenType.GESER_KIWO]: 'geserKiwo',
  [TokenType.GESER_TENGEN]: 'geserTengen',
  [TokenType.GESER_TENGEN_NOL]: 'geserTengenNol',
  [TokenType.UTOWO_YEN_KOSONG]: 'utowoYenKosong',
};

const KEYWORD = {
  gawe: 'gawe',
  balekno: 'balekno',
  cetakno: 'cetakno',
  lek: 'lek',
  lekMisale: 'lek misale',
  liyane: 'liyane',
  selagi: 'selagi',
  kanggo: 'kanggo',
  terus: 'terus',
  mbari: 'mbari',
  mbariLiyane: 'mbari liyane',
  jarno: 'jarno',
  ikiIku: 'iki iku',
  tenan: 'tenan',
  gak: 'gak',
  kosong: 'kosong',
  oraDidefinisikan: 'oraDidefinisikan',
  takon: 'takon',
  anyar: 'anyar',
  mandek: 'mandek',
  lanjutno: 'lanjutno',
  pilih: 'pilih',
  kalo: 'kalo',
  yowes: 'yowes',
  cocok: 'cocok',
  cobak: 'cobak',
  nyekel: 'nyekel',
  pungkasan: 'pungkasan',
  uncalen: 'uncalen',
  tenangan: 'tenangan',
  enteni: 'enteni',
  asilno: 'asilno',
  soko: 'soko',
  ing: 'ing',
  dadi: 'dadi',
  biasane: 'biasane',
  kabeh: 'kabeh',
  ta: 'ta',
  lekGak: 'lek gak',
  turunanSoko: 'turunan soko',
  entuk: 'entuk',
  pasang: 'pasang',
  tetep: 'tetep',
  nurut: 'nurut',
  induk: 'induk',
  abstrak: 'abstrak',
  katutup: 'katutup',
  wangun: 'wangun',
  struktur: 'struktur',
  tuple: 'tuple',
  metokno: 'metokno',
  jupukno: 'jupukno',
};

export class Formatter {
  constructor() {
    this.indent = 0;
    this.output = '';
  }

  format(statements) {
    this.output = '';
    this.indent = 0;
    for (const stmt of statements) {
      this.stmt(stmt);
    }
    return this.output;
  }

  stmt(node) {
    if (node instanceof AST.Expression) {
      this.line(this.expr(node.expression));
      this.nl();
    } else if (node instanceof AST.Cetakno) {
      const args = node.expressions.map(e => this.expr(e)).join(', ');
      this.line(KEYWORD.cetakno + ' ' + args);
      this.nl();
    } else if (node instanceof AST.Var) {
      const kw = node.isConst ? KEYWORD.ikiIku : KEYWORD.jarno;
      let s = kw + ' ' + node.name.lexeme;
      if (node.initializer) {
        s += ' ' + OP_LEXEME[TokenType.YOIKU] + ' ' + this.expr(node.initializer);
      }
      this.line(s);
      this.nl();
    } else if (node instanceof AST.Block) {
      this.blockStmt(node);
    } else if (node instanceof AST.Lek) {
      this.lekStmt(node);
    } else if (node instanceof AST.Selagi) {
      this.line(KEYWORD.selagi + ' (' + this.expr(node.condition) + ') ' + KEYWORD.terus);
      this.nl();
      this.indent++;
      this.bodyStmt(node.body);
      this.indent--;
      this.line(KEYWORD.mbari);
      this.nl();
    } else if (node instanceof AST.Kanggo) {
      const parts = [];
      if (node.initializer) parts.push(this.forInitExpr(node.initializer));
      if (node.condition) parts.push(this.expr(node.condition));
      if (node.increment) parts.push(this.expr(node.increment));
      this.line(KEYWORD.kanggo + ' (' + parts.join('; ') + ') ' + KEYWORD.terus);
      this.nl();
      this.indent++;
      this.bodyStmt(node.body);
      this.indent--;
      this.line(KEYWORD.mbari);
      this.nl();
    } else if (node instanceof AST.ForOf) {
      const asyncKw = node.isAsync ? KEYWORD.tenangan + ' ' : '';
      const constKw = node.isConst ? KEYWORD.ikiIku + ' ' : '';
      this.line(KEYWORD.kanggo + ' ' + asyncKw + constKw + node.name.lexeme + ' ' + KEYWORD.soko + ' ' + this.expr(node.iterable) + ' ' + KEYWORD.terus);
      this.nl();
      this.indent++;
      this.bodyStmt(node.body);
      this.indent--;
      this.line(KEYWORD.mbari);
      this.nl();
    } else if (node instanceof AST.Gawe) {
      this.gaweStmt(node);
    } else if (node instanceof AST.Balekno) {
      this.line(KEYWORD.balekno + ' ' + this.expr(node.value));
      this.nl();
    } else if (node instanceof AST.Kelas) {
      this.kelasStmt(node);
    } else if (node instanceof AST.Struktur) {
      const fields = node.fields.map(f => f.lexeme).join(', ');
      this.line(KEYWORD.struktur + ' ' + node.name.lexeme + ' ' + KEYWORD.terus + ' ' + fields + ' ' + KEYWORD.mbari);
      this.nl();
    } else if (node instanceof AST.WangunStmt) {
      this.line(KEYWORD.wangun + ' ' + node.name.lexeme + ' ' + KEYWORD.terus);
      this.nl();
      this.indent++;
      for (const m of node.methods) {
        const params = m.params ? m.params.map(p => p.lexeme).join(', ') : '';
        this.line(KEYWORD.gawe + ' ' + m.name.lexeme + '(' + params + ') ' + KEYWORD.terus + ' ' + KEYWORD.balekno + ' ' + m.returnType + ' ' + KEYWORD.mbari);
        this.nl();
      }
      this.indent--;
      this.line(KEYWORD.mbari);
      this.nl();
    } else if (node instanceof AST.Cobak) {
      this.cobakStmt(node);
    } else if (node instanceof AST.Uncalen) {
      this.line(KEYWORD.uncalen + ' ' + this.expr(node.value));
      this.nl();
    } else if (node instanceof AST.Mandek) {
      let s = KEYWORD.mandek;
      if (node.label) s += ' ' + node.label.lexeme;
      this.line(s);
      this.nl();
    } else if (node instanceof AST.Lanjutno) {
      let s = KEYWORD.lanjutno;
      if (node.label) s += ' ' + node.label.lexeme;
      this.line(s);
      this.nl();
    } else if (node instanceof AST.LabeledStmt) {
      this.line(node.name.lexeme + ':');
      this.indent++;
      this.stmt(node.stmt);
      this.indent--;
    } else if (node instanceof AST.Command) {
      this.line('/' + node.name);
      this.nl();
    } else if (node instanceof AST.Pilih) {
      this.pilihStmt(node);
    } else if (node instanceof AST.EnumStmt) {
      this.line('cacah ' + node.name.lexeme + ' yoiku');
      this.nl();
      this.indent++;
      for (let i = 0; i < node.variants.length; i++) {
        const v = node.variants[i];
        let s = v.name.lexeme;
        if (v.explicit) s += ' ' + OP_LEXEME[TokenType.YOIKU] + ' ' + this.expr(v.value);
        if (i < node.variants.length - 1) s += ',';
        this.line(s);
        this.nl();
      }
      this.indent--;
      this.line(KEYWORD.mbari);
      this.nl();
    } else if (node instanceof AST.MatchStmt) {
      this.line(KEYWORD.cocok + ' ' + this.expr(node.expression) + ' ' + KEYWORD.terus);
      this.nl();
      this.indent++;
      for (const arm of node.arms) {
        const patternsStr = arm.patterns.map(p => this.pattern(p)).join(', ');
        let s = KEYWORD.kalo + ' ' + patternsStr;
        if (arm.guard) s += ' ' + KEYWORD.lek + ' ' + this.expr(arm.guard);
        s += ' ' + KEYWORD.dadi + ' ' + this.expr(arm.body);
        this.line(s);
        this.nl();
      }
      if (node.defaultBranch) {
        this.line(KEYWORD.kalo + ' _ ' + KEYWORD.dadi + ' ' + this.expr(node.defaultBranch));
        this.nl();
      }
      this.indent--;
      this.line(KEYWORD.mbari);
      this.nl();
    } else if (node instanceof AST.MetoknoStmt) {
      this.metoknoStmt(node);
    } else if (node instanceof AST.JupuknoStmt) {
      this.jupuknoStmt(node);
    } else {
      this.line('// <unknown statement>');
      this.nl();
    }
  }

  forInitExpr(node) {
    if (node instanceof AST.Var) {
      const kw = node.isConst ? KEYWORD.ikiIku : KEYWORD.jarno;
      let s = kw + ' ' + node.name.lexeme;
      if (node.initializer) {
        s += ' ' + OP_LEXEME[TokenType.YOIKU] + ' ' + this.expr(node.initializer);
      }
      return s;
    }
    if (node instanceof AST.Expression) {
      return this.expr(node.expression);
    }
    return this.expr(node);
  }

  bodyStmt(node) {
    if (node instanceof AST.Block) {
      for (const s of node.statements) {
        this.stmt(s);
      }
    } else {
      this.stmt(node);
    }
  }

  expr(node) {
    if (node instanceof AST.Binary) {
      return this.expr(node.left) + ' ' + OP_LEXEME[node.operator.type] + ' ' + this.expr(node.right);
    } else if (node instanceof AST.Grouping) {
      return '(' + this.expr(node.expression) + ')';
    } else if (node instanceof AST.Literal) {
      return this.formatLiteral(node.value);
    } else if (node instanceof AST.Unary) {
      const op = OP_LEXEME[node.operator.type];
      if (node.operator.type === TokenType.TAMBAH || node.operator.type === TokenType.KURANG) {
        return op + this.expr(node.right);
      }
      return OP_LEXEME[node.operator.type] + ' ' + this.expr(node.right);
    } else if (node instanceof AST.Postfix) {
      if (node.operator.type === TokenType.TAMBAH_TAMBAH) {
        return this.expr(node.left) + '++';
      } else if (node.operator.type === TokenType.KURANG_KURANG) {
        return this.expr(node.left) + '--';
      }
      return this.expr(node.left) + ' ' + OP_LEXEME[node.operator.type];
    } else if (node instanceof AST.Variable) {
      return node.name.lexeme;
    } else if (node instanceof AST.Assign) {
      const op = node.operator.type === TokenType.YOIKU ? OP_LEXEME[TokenType.YOIKU] : OP_LEXEME[node.operator.type];
      return node.name.lexeme + ' ' + op + ' ' + this.expr(node.value);
    } else if (node instanceof AST.Call) {
      return this.expr(node.callee) + '(' + node.args.map(a => this.expr(a)).join(', ') + ')';
    } else if (node instanceof AST.Get) {
      return this.expr(node.object) + '.' + (typeof node.name === 'string' ? node.name : node.name.lexeme);
    } else if (node instanceof AST.Set) {
      const prop = typeof node.name === 'string' ? node.name : node.name.lexeme;
      return this.expr(node.object) + '.' + prop + ' ' + OP_LEXEME[TokenType.YOIKU] + ' ' + this.expr(node.value);
    } else if (node instanceof AST.This) {
      return 'iki';
    } else if (node instanceof AST.Super) {
      return KEYWORD.induk + '.' + node.method.lexeme;
    } else if (node instanceof AST.Ternary) {
      return this.expr(node.condition) + ' ' + KEYWORD.ta + ' ' + this.expr(node.thenExpr) + ' ' + KEYWORD.lekGak + ' ' + this.expr(node.elseExpr);
    } else if (node instanceof AST.Logical) {
      return this.expr(node.left) + ' ' + OP_LEXEME[node.operator.type] + ' ' + this.expr(node.right);
    } else if (node instanceof AST.Tuple) {
      return 'tuple(' + node.elements.map(e => this.expr(e)).join(', ') + ')';
    } else if (node instanceof AST.ArrayLiteral) {
      const elems = node.elements.map(e => this.expr(e)).join(', ');
      return '[' + elems + ']';
    } else if (node instanceof AST.ObjectLiteral) {
      const props = [];
      if (node.properties instanceof Map) {
        for (const [key, val] of node.properties) {
          props.push(key + ': ' + this.expr(val));
        }
      }
      return KEYWORD.terus + ' ' + props.join(', ') + ' ' + KEYWORD.mbari;
    } else if (node instanceof AST.RangeExpr) {
      const op = node.inclusive ? '..' : '...';
      return this.expr(node.start) + op + this.expr(node.end);
    } else if (node instanceof AST.TemplateLiteral) {
      let s = '`';
      for (let i = 0; i < node.strings.length; i++) {
        s += node.strings[i];
        if (i < node.expressions.length) {
          s += '${' + this.expr(node.expressions[i]) + '}';
        }
      }
      s += '`';
      return s;
    } else if (node instanceof AST.TaggedTemplate) {
      return this.expr(node.tag) + this.expr(node.template);
    }
    return '// <unknown expr>';
  }

  pattern(p) {
    if (p instanceof AST.LiteralPattern) {
      return this.formatLiteral(p.value);
    } else if (p instanceof AST.BindingPattern) {
      return p.name.lexeme;
    } else if (p instanceof AST.WildcardPattern) {
      return '_';
    } else if (p instanceof AST.ArrayPattern) {
      let s = '[';
      const elems = p.elements.map(e => this.pattern(e));
      if (p.rest) {
        elems.push('...' + this.pattern(p.rest));
      }
      s += elems.join(', ') + ']';
      return s;
    } else if (p instanceof AST.ObjectPattern) {
      let s = '{ ';
      const props = p.properties.map(pp => pp.name.lexeme);
      if (p.rest) {
        props.push('...' + this.pattern(p.rest));
      }
      s += props.join(', ') + ' }';
      return s;
    }
    return '// <unknown pattern>';
  }

  formatLiteral(val) {
    if (val === null) return KEYWORD.kosong;
    if (val === undefined) return KEYWORD.oraDidefinisikan;
    if (typeof val === 'boolean') return val ? KEYWORD.tenan : KEYWORD.gak;
    if (typeof val === 'string') {
      if (val.includes("'") && !val.includes('"')) return '"' + val + '"';
      return "'" + val + "'";
    }
    return String(val);
  }

  line(s) {
    this.output += '  '.repeat(this.indent) + s;
  }

  nl() {
    this.output += '\n';
  }

  blockStmt(node) {
    this.line(KEYWORD.terus);
    this.nl();
    this.indent++;
    for (const s of node.statements) {
      this.stmt(s);
    }
    this.indent--;
    this.line(KEYWORD.mbari);
    this.nl();
  }

  lekStmt(node) {
    this.line(KEYWORD.lek + ' (' + this.expr(node.condition) + ') ' + KEYWORD.terus);
    this.nl();
    this.indent++;
    this.bodyStmt(node.thenBranch);
    this.indent--;
    if (node.elseIfBranches && node.elseIfBranches.length > 0) {
      for (const ei of node.elseIfBranches) {
        this.line(KEYWORD.mbari + ' ' + KEYWORD.lekMisale + ' (' + this.expr(ei.condition) + ') ' + KEYWORD.terus);
        this.nl();
        this.indent++;
        this.bodyStmt(ei.branch);
        this.indent--;
      }
    }
    if (node.elseBranch) {
      this.line(KEYWORD.mbari + ' ' + KEYWORD.liyane + ' ' + KEYWORD.terus);
      this.nl();
      this.indent++;
      this.bodyStmt(node.elseBranch);
      this.indent--;
    }
    this.line(KEYWORD.mbari);
    this.nl();
  }

  gaweStmt(node) {
    let s = '';
    if (node.isAbstract) s += KEYWORD.abstrak + ' ';
    if (node.isAsync && node.isGenerator) {
      s += KEYWORD.gawe + ' ' + KEYWORD.tenangan + ' ';
    } else if (node.isAsync) {
      s += KEYWORD.tenangan + ' ' + KEYWORD.gawe + ' ';
    } else if (node.isGenerator) {
      s += KEYWORD.gawe + ' ' + KEYWORD.tenangan + ' ';
    } else {
      s += KEYWORD.gawe + ' ';
    }
    s += node.name.lexeme + '(';
    s += node.params.map(p => p.lexeme).join(', ');
    s += ') ' + KEYWORD.terus;
    this.line(s);
    this.nl();
    this.indent++;
    this.bodyStmt(node.body);
    this.indent--;
    this.line(KEYWORD.mbari);
    this.nl();
  }

  kelasStmt(node) {
    let s = '';
    if (node.isSealed) s += KEYWORD.katutup + ' ';
    if (node.isAbstract) s += KEYWORD.abstrak + ' ';
    s += KEYWORD.kelas + ' ' + node.name.lexeme;
    if (node.superclass) {
      s += ' ' + KEYWORD.turunanSoko + ' ' + this.expr(node.superclass);
    }
    if (node.interfaces && node.interfaces.length > 0) {
      s += ' ' + KEYWORD.nurut + ' ' + node.interfaces.map(i => i.name.lexeme).join(', ');
    }
    s += ' ' + KEYWORD.terus;
    this.line(s);
    this.nl();
    this.indent++;
    for (const m of node.methods) {
      let ms = '';
      if (m.isAbstract) ms += KEYWORD.abstrak + ' ';
      if (m.isStatic) ms += KEYWORD.tetep + ' ';
      if (m.isGetter) ms += KEYWORD.entuk + ' ';
      if (m.isSetter) ms += KEYWORD.pasang + ' ';
      ms += KEYWORD.gawe + ' ' + m.name.lexeme + '(';
      ms += m.params.map(p => p.lexeme).join(', ');
      ms += ') ' + KEYWORD.terus;
      this.line(ms);
      this.nl();
      this.indent++;
      this.bodyStmt(m.body);
      this.indent--;
      this.line(KEYWORD.mbari);
      this.nl();
    }
    this.indent--;
    this.line(KEYWORD.mbari);
    this.nl();
  }

  cobakStmt(node) {
    this.line(KEYWORD.cobak + ' ' + KEYWORD.terus);
    this.nl();
    this.indent++;
    this.bodyStmt(node.tryBlock);
    this.indent--;
    if (node.catchVar) {
      this.line(KEYWORD.mbari + ' ' + KEYWORD.nyekel + ' (' + node.catchVar.lexeme + ') ' + KEYWORD.terus);
      this.nl();
      this.indent++;
      this.bodyStmt(node.catchBranch);
      this.indent--;
    }
    if (node.finallyBranch) {
      this.line(KEYWORD.mbari + ' ' + KEYWORD.pungkasan + ' ' + KEYWORD.terus);
      this.nl();
      this.indent++;
      this.bodyStmt(node.finallyBranch);
      this.indent--;
    }
    this.line(KEYWORD.mbari);
    this.nl();
  }

  pilihStmt(node) {
    this.line(KEYWORD.pilih + ' (' + this.expr(node.expression) + ') ' + KEYWORD.terus);
    this.nl();
    this.indent++;
    for (const c of node.cases) {
      this.line(KEYWORD.kalo + ' ' + this.expr(c.value) + ':');
      this.nl();
      this.indent++;
      this.bodyStmt(c.branch);
      this.indent--;
    }
    if (node.defaultBranch) {
      this.line(KEYWORD.yowes + ':');
      this.nl();
      this.indent++;
      this.bodyStmt(node.defaultBranch);
      this.indent--;
    }
    this.indent--;
    this.line(KEYWORD.mbari);
    this.nl();
  }

  metoknoStmt(node) {
    if (node.kind === 'named') {
      const items = node.items.map(i => i.name.lexeme).join(', ');
      this.line(KEYWORD.metokno + ' { ' + items + ' }');
    } else if (node.kind === 'default') {
      this.line(KEYWORD.metokno + ' ' + KEYWORD.biasane + ' ' + node.items[0].lexeme);
    } else if (node.kind === 'all') {
      this.line(KEYWORD.metokno + ' ' + KEYWORD.kabeh + ' ' + KEYWORD.dadi + ' ' + node.items[0].lexeme);
    }
    this.nl();
  }

  jupuknoStmt(node) {
    let s = KEYWORD.jupukno + ' ';
    if (node.kind === 'named') {
      const items = node.items.map(i => {
        if (i.alias && i.alias !== i.name) return i.name.lexeme + ' ' + KEYWORD.dadi + ' ' + i.alias.lexeme;
        return i.name.lexeme;
      }).join(', ');
      s += items + ' ';
      s += KEYWORD.soko + " '" + node.source + "'";
    } else if (node.kind === 'default') {
      s += KEYWORD.biasane + ' ' + node.items[0].name.lexeme;
      s += ' ' + KEYWORD.soko + " '" + node.source + "'";
    } else if (node.kind === 'all') {
      if (node.items.length > 0 && node.items[0].alias) {
        s += KEYWORD.kabeh + ' ' + KEYWORD.dadi + ' ' + node.items[0].alias.lexeme;
      } else {
        s += KEYWORD.kabeh;
      }
      s += ' ' + KEYWORD.soko + " '" + node.source + "'";
    } else if (node.kind === 'simple') {
      const item = node.items[0];
      s += item.name.lexeme;
      if (item.alias && item.alias !== item.name) {
        s += ' ' + KEYWORD.dadi + ' ' + item.alias.lexeme;
      }
    }
    this.line(s);
    this.nl();
  }
}
