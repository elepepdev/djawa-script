/* ===========================
   JPL Playground — Browser-Compatible Interpreter
   Bundled from src/ (tokens, ast, environment, lexer, parser, interpreter)
   =========================== */

// ============= TOKENS =============
const TokenType = {
  GUDUK: 'GUDUK', CACAH: 'CACAH', IKI_IKU: 'IKI_IKU', JARNO: 'JARNO',
  GAWE: 'GAWE', BALEKNO: 'BALEKNO', CETAKNO: 'CETAKNO', LEK: 'LEK',
  LEK_MISALE: 'LEK_MISALE', LIYANE: 'LIYANE', SELAGI: 'SELAGI', KANGGO: 'KANGGO',
  RENTANG: 'RENTANG', TERUS: 'TERUS', MBARI: 'MBARI', TENAN: 'TENAN', GAK: 'GAK',
  KOSONG: 'KOSONG', ORADIDEFINISIKAN: 'ORADIDEFINISIKAN', TAKON: 'TAKON', ANYAR: 'ANYAR',
  MANDEK: 'MANDEK', LANJUTNO: 'LANJUTNO', NGENTENI: 'NGENTENI', DETIK: 'DETIK',
  MENIT: 'MENIT', JAM: 'JAM', DINO: 'DINO', PILIH: 'PILIH', KALO: 'KALO', YOWES: 'YOWES',
  COCOK: 'COCOK', COBAK: 'COBAK', NYEKEL: 'NYEKEL', PUNGKASAN: 'PUNGKASAN',
  UNCALEN: 'UNCALEN', TENANGAN: 'TENANGAN', ENTENI: 'ENTENI', ASILNO: 'ASILNO',
  LAKONI: 'LAKONI', KELAS: 'KELAS', ABSTRAK: 'ABSTRAK', KATUTUP: 'KATUTUP',
  TURUNAN_SOKO: 'TURUNAN_SOKO', WUJUDNO: 'WUJUDNO', INDUK: 'INDUK', IKI: 'IKI',
  WANGUN: 'WANGUN', STRUKTUR: 'STRUKTUR', NURUT: 'NURUT', TETEP: 'TETEP',
  ENTUK: 'ENTUK', PASANG: 'PASANG', IKU_ONO: 'IKU_ONO', IKU_ILANG: 'IKU_ILANG',
  IKU: 'IKU', ONO: 'ONO', ILANG: 'ILANG', TUPLE: 'TUPLE', JUPUKNO: 'JUPUKNO',
  METOKNO: 'METOKNO', SOKO: 'SOKO', ING: 'ING', DADI: 'DADI', BIASANE: 'BIASANE',
  KABEH: 'KABEH', TA: 'TA', LEK_GAK: 'LEK_GAK',
  IDENTIFIER: 'IDENTIFIER', NUMBER: 'NUMBER', STRING: 'STRING',
  RAW_STRING: 'RAW_STRING', REGEX: 'REGEX',
  YOIKU: 'YOIKU', TAMBAH: 'TAMBAH', KURANG: 'KURANG', PING: 'PING',
  BAGI: 'BAGI', SISO: 'SISO', PANGKAT: 'PANGKAT',
  TAMBAH_KARO: 'TAMBAH_KARO', KURANG_KARO: 'KURANG_KARO', PING_KARO: 'PING_KARO',
  BAGI_KARO: 'BAGI_KARO', SISO_KARO: 'SISO_KARO',
  PLEK: 'PLEK', PODO: 'PODO', GAK_PLEK: 'GAK_PLEK', GAK_PODO: 'GAK_PODO',
  LUWIH_GEDHE: 'LUWIH_GEDHE', LUWIH_CILIK: 'LUWIH_CILIK',
  LUWIH_GEDHE_PODO: 'LUWIH_GEDHE_PODO', LUWIH_CILIK_PODO: 'LUWIH_CILIK_PODO',
  LAN: 'LAN', UTAWA: 'UTAWA', ORA: 'ORA', UTOWO_YEN_KOSONG: 'UTOWO_YEN_KOSONG',
  LANBIT: 'LANBIT', UTAWABIT: 'UTAWABIT', XOR: 'XOR', WALIK: 'WALIK',
  GESER_KIWO: 'GESER_KIWO', GESER_TENGEN: 'GESER_TENGEN', GESER_TENGEN_NOL: 'GESER_TENGEN_NOL',
  LEFT_PAREN: 'LEFT_PAREN', RIGHT_PAREN: 'RIGHT_PAREN', LEFT_BRACKET: 'LEFT_BRACKET',
  RIGHT_BRACKET: 'RIGHT_BRACKET', COMMA: 'COMMA', DOT: 'DOT', DOT_DOT: 'DOT_DOT',
  COLON: 'COLON', SEMICOLON: 'SEMICOLON', BANJUR: 'BANJUR', MUNGKIN: 'MUNGKIN',
  TEMPLATE: 'TEMPLATE', CLEAR: 'CLEAR', CREDITS: 'CREDITS', EOF: 'EOF'
};

const Keywords = {
  'cacah': TokenType.CACAH, 'iki iku': TokenType.IKI_IKU, 'jarno': TokenType.JARNO,
  'gawe': TokenType.GAWE, 'balekno': TokenType.BALEKNO, 'cetakno': TokenType.CETAKNO,
  'lek': TokenType.LEK, 'liyane': TokenType.LIYANE, 'selagi': TokenType.SELAGI,
  'kanggo': TokenType.KANGGO, 'rentang': TokenType.RENTANG, 'terus': TokenType.TERUS,
  'mbari': TokenType.MBARI, 'tenan': TokenType.TENAN, 'gak': TokenType.GAK,
  'kosong': TokenType.KOSONG, 'oraDidefinisikan': TokenType.ORADIDEFINISIKAN,
  'takon': TokenType.TAKON, 'anyar': TokenType.ANYAR, 'mandek': TokenType.MANDEK,
  'lanjutno': TokenType.LANJUTNO, 'ngenteni': TokenType.NGENTENI, 'detik': TokenType.DETIK,
  'menit': TokenType.MENIT, 'jam': TokenType.JAM, 'dino': TokenType.DINO,
  'pilih': TokenType.PILIH, 'kalo': TokenType.KALO,
  'cocok': TokenType.COCOK, 'yowes': TokenType.YOWES, 'guduk': TokenType.GUDUK,
  'cobak': TokenType.COBAK, 'nyekel': TokenType.NYEKEL, 'pungkasan': TokenType.PUNGKASAN,
  'uncalen': TokenType.UNCALEN, 'tenangan': TokenType.TENANGAN, 'enteni': TokenType.ENTENI,
  'asilno': TokenType.ASILNO, 'lakoni': TokenType.LAKONI, 'kelas': TokenType.KELAS,
  'abstrak': TokenType.ABSTRAK, 'katutup': TokenType.KATUTUP, 'turunan soko': TokenType.TURUNAN_SOKO,
  'wujudno': TokenType.WUJUDNO, 'induk': TokenType.INDUK, 'iki': TokenType.IKI,
  'wangun': TokenType.WANGUN, 'struktur': TokenType.STRUKTUR, 'nurut': TokenType.NURUT,
  'tetep': TokenType.TETEP, 'entuk': TokenType.ENTUK, 'pasang': TokenType.PASANG,
  'tuple': TokenType.TUPLE, 'jupukno': TokenType.JUPUKNO, 'metokno': TokenType.METOKNO,
  'soko': TokenType.SOKO, 'ing': TokenType.ING, 'dadi': TokenType.DADI,
  'biasane': TokenType.BIASANE, 'kabeh': TokenType.KABEH, 'ta': TokenType.TA,
  'tambah': TokenType.TAMBAH, 'kurang': TokenType.KURANG, 'ping': TokenType.PING,
  'bagi': TokenType.BAGI, 'siso': TokenType.SISO, 'pangkat': TokenType.PANGKAT,
  'yoiku': TokenType.YOIKU, 'tambahKaro': TokenType.TAMBAH_KARO,
  'kurangKaro': TokenType.KURANG_KARO, 'pingKaro': TokenType.PING_KARO,
  'bagiKaro': TokenType.BAGI_KARO, 'sisoKaro': TokenType.SISO_KARO,
  'plek': TokenType.PLEK, 'podo': TokenType.PODO, 'gakPlek': TokenType.GAK_PLEK,
  'gakPodo': TokenType.GAK_PODO, 'luwihGedhe': TokenType.LUWIH_GEDHE,
  'luwihCilik': TokenType.LUWIH_CILIK, 'luwihGedhePodo': TokenType.LUWIH_GEDHE_PODO,
  'luwihCilikPodo': TokenType.LUWIH_CILIK_PODO, 'lan': TokenType.LAN,
  'utawa': TokenType.UTAWA, 'ora': TokenType.ORA, 'lanbit': TokenType.LANBIT,
  'utawabit': TokenType.UTAWABIT, 'xor': TokenType.XOR, 'walik': TokenType.WALIK,
  'geserKiwo': TokenType.GESER_KIWO, 'geserTengen': TokenType.GESER_TENGEN,
  'geserTengenNol': TokenType.GESER_TENGEN_NOL, 'utowoYenKosong': TokenType.UTOWO_YEN_KOSONG,
  'iku': TokenType.IKU, 'ono': TokenType.ONO, 'ilang': TokenType.ILANG,
  'lek misale': TokenType.LEK_MISALE, 'lek gak': TokenType.LEK_GAK, 'banjur': TokenType.BANJUR,
  'carane': TokenType.GAWE, 'susuk': TokenType.BALEKNO, 'ngomong': TokenType.CETAKNO,
  'yo': TokenType.TERUS, 'mari': TokenType.MBARI, 'saestu': TokenType.TENAN,
  'iyo': TokenType.TENAN, 'mbelgedhes': TokenType.GAK, 'muspro': TokenType.KOSONG,
  'luput': TokenType.UNCALEN, 'yen': TokenType.LEK, 'menawi': TokenType.LEK,
  'utowo': TokenType.LIYANE, 'saksuwene': TokenType.SELAGI, 'mbaleni': TokenType.KANGGO,
};

// ============= AST =============
class Expr { accept(visitor) {} }
class Binary extends Expr { constructor(l,o,r){super();this.left=l;this.operator=o;this.right=r;} accept(v){return v.visitBinaryExpr(this);} }
class Grouping extends Expr { constructor(e){super();this.expression=e;} accept(v){return v.visitGroupingExpr(this);} }
class Literal extends Expr { constructor(v){super();this.value=v;} accept(v){return v.visitLiteralExpr(this);} }
class Unary extends Expr { constructor(o,r){super();this.operator=o;this.right=r;} accept(v){return v.visitUnaryExpr(this);} }
class Postfix extends Expr { constructor(l,o){super();this.left=l;this.operator=o;} accept(v){return v.visitPostfixExpr(this);} }
class Variable extends Expr { constructor(n){super();this.name=n;} accept(v){return v.visitVariableExpr(this);} }
class Assign extends Expr { constructor(n,o,v){super();this.name=n;this.operator=o;this.value=v;} accept(v){return v.visitAssignExpr(this);} }
class Call extends Expr { constructor(c,p,a){super();this.callee=c;this.paren=p;this.args=a;} accept(v){return v.visitCallExpr(this);} }
class Get extends Expr { constructor(o,n){super();this.object=o;this.name=n;} accept(v){return v.visitGetExpr(this);} }
class Set extends Expr { constructor(o,n,v){super();this.object=o;this.name=n;this.value=v;} accept(v){return v.visitSetExpr(this);} }
class This extends Expr { constructor(k){super();this.keyword=k;} accept(v){return v.visitThisExpr(this);} }
class Ternary extends Expr { constructor(c,t,e){super();this.condition=c;this.thenExpr=t;this.elseExpr=e;} accept(v){return v.visitTernaryExpr(this);} }
class Logical extends Expr { constructor(l,o,r){super();this.left=l;this.operator=o;this.right=r;} accept(v){return v.visitLogicalExpr(this);} }
class TupleExpr extends Expr { constructor(k,e){super();this.keyword=k;this.elements=e;} accept(v){return v.visitTupleExpr(this);} }
class ArrayLiteral extends Expr { constructor(e){super();this.elements=e;} accept(v){return v.visitArrayLiteralExpr(this);} }
class ObjectLiteral extends Expr { constructor(p){super();this.properties=p;} accept(v){return v.visitObjectLiteralExpr(this);} }
class RangeExpr extends Expr { constructor(s,e,i){super();this.start=s;this.end=e;this.inclusive=i;} accept(v){return v.visitRangeExpr(this);} }
class TemplateLiteral extends Expr { constructor(s,e){super();this.strings=s;this.expressions=e;} accept(v){return v.visitTemplateLiteralExpr(this);} }
class TaggedTemplate extends Expr { constructor(t,tp){super();this.tag=t;this.template=tp;} accept(v){return v.visitTaggedTemplateExpr(this);} }

class Stmt { accept(visitor) {} }
class Expression extends Stmt { constructor(e){super();this.expression=e;} accept(v){return v.visitExpressionStmt(this);} }
class Cetakno extends Stmt { constructor(e){super();this.expressions=e;} accept(v){return v.visitCetaknoStmt(this);} }
class Var extends Stmt { constructor(n,i,c=false){super();this.name=n;this.initializer=i;this.isConst=c;} accept(v){return v.visitVarStmt(this);} }
class Block extends Stmt { constructor(s){super();this.statements=s;} accept(v){return v.visitBlockStmt(this);} }
class Lek extends Stmt { constructor(c,t,el,el2){super();this.condition=c;this.thenBranch=t;this.elseIfBranches=el;this.elseBranch=el2;} accept(v){return v.visitLekStmt(this);} }
class Selagi extends Stmt { constructor(c,b){super();this.condition=c;this.body=b;} accept(v){return v.visitSelagiStmt(this);} }
class Kanggo extends Stmt { constructor(i,c,inc,b){super();this.initializer=i;this.condition=c;this.increment=inc;this.body=b;} accept(v){return v.visitKanggoStmt(this);} }
class ForOf extends Stmt { constructor(n,i,b,c=false,a=false){super();this.name=n;this.iterable=i;this.body=b;this.isConst=c;this.isAsync=a;} accept(v){return v.visitForOfStmt(this);} }
class RentangStmt extends Stmt { constructor(s,e,b){super();this.start=s;this.end=e;this.body=b;} accept(v){return v.visitRentangStmt(this);} }
class Gawe extends Stmt { constructor(n,p,b,ag=false,ge=false,ab=false){super();this.name=n;this.params=p;this.body=b;this.isAsync=ag;this.isGenerator=ge;this.isAbstract=ab;} accept(v){return v.visitGaweStmt(this);} }
class Balekno extends Stmt { constructor(k,v){super();this.keyword=k;this.value=v;} accept(v){return v.visitBaleknoStmt(this);} }
class Kelas extends Stmt { constructor(n,s,m,i=[],se=false,ab=false){super();this.name=n;this.superclass=s;this.methods=m;this.interfaces=i;this.isSealed=se;this.isAbstract=ab;} accept(v){return v.visitKelasStmt(this);} }
class Struktur extends Stmt { constructor(n,f){super();this.name=n;this.fields=f;} accept(v){return v.visitStrukturStmt(this);} }
class Cobak extends Stmt { constructor(t,c,cb,fb){super();this.tryBlock=t;this.catchVar=c;this.catchBranch=cb;this.finallyBranch=fb;} accept(v){return v.visitCobakStmt(this);} }
class Uncalen extends Stmt { constructor(k,v){super();this.keyword=k;this.value=v;} accept(v){return v.visitUncalenStmt(this);} }
class Mandek extends Stmt { constructor(k,l=null){super();this.keyword=k;this.label=l;} accept(v){return v.visitMandekStmt(this);} }
class Lanjutno extends Stmt { constructor(k,l=null){super();this.keyword=k;this.label=l;} accept(v){return v.visitLanjutnoStmt(this);} }
class Ngenteni extends Stmt { constructor(k,a,u=null){super();this.keyword=k;this.amount=a;this.unit=u;} accept(v){return v.visitNgenteniStmt(this);} }
class LabeledStmt extends Stmt { constructor(n,s){super();this.name=n;this.stmt=s;} accept(v){return v.visitLabeledStmt(this);} }
class Command extends Stmt { constructor(n){super();this.name=n;} accept(v){return v.visitCommandStmt(this);} }
class Pilih extends Stmt { constructor(e,c,d){super();this.expression=e;this.cases=c;this.defaultBranch=d;} accept(v){return v.visitPilihStmt(this);} }
class EnumStmt extends Stmt { constructor(n,v){super();this.name=n;this.variants=v;} accept(v){return v.visitEnumStmt(this);} }
class MatchStmt extends Stmt { constructor(e,a,d){super();this.expression=e;this.arms=a;this.defaultBranch=d;} accept(v){return v.visitMatchStmt(this);} }
class LiteralPattern { constructor(v){this.value=v;} }
class BindingPattern { constructor(n){this.name=n;} }
class WildcardPattern {}
class ArrayPattern { constructor(e,r){this.elements=e;this.rest=r;} }
class ObjectPattern { constructor(p,r){this.properties=p;this.rest=r;} }

const AST = { Expr, Binary, Grouping, Literal, Unary, Postfix, Variable, Assign, Call, Get, Set, This, Ternary, Logical, Tuple: TupleExpr, ArrayLiteral, ObjectLiteral, RangeExpr, TemplateLiteral, TaggedTemplate, Stmt, Expression, Cetakno, Var, Block, Lek, Selagi, Kanggo, ForOf, RentangStmt, Gawe, Balekno, Kelas, Struktur, Cobak, Uncalen, Mandek, Lanjutno, Ngenteni, LabeledStmt, Command, Pilih, EnumStmt, MatchStmt, LiteralPattern, BindingPattern, WildcardPattern, ArrayPattern, ObjectPattern };

// ============= ENVIRONMENT =============
class Environment {
  constructor(enclosing = null) { this.values = new Map(); this.enclosing = enclosing; }
  get(name) {
    if (this.values.has(name.lexeme)) return this.values.get(name.lexeme);
    if (this.enclosing !== null) return this.enclosing.get(name);
    throw new Error(`[line ${name.line}] Error: Variabel '${name.lexeme}' ora ono (undefined).`);
  }
  assign(name, value) {
    if (this.values.has(name.lexeme)) { this.values.set(name.lexeme, value); return; }
    if (this.enclosing !== null) { this.enclosing.assign(name, value); return; }
    throw new Error(`[line ${name.line}] Error: Gak iso pasang nilai menyang variabel '${name.lexeme}' sing durung ono.`);
  }
  define(name, value) { this.values.set(name, value); }
  ancestor(distance) { let env = this; for (let i = 0; i < distance; i++) env = env.enclosing; return env; }
  getAt(distance, name) { return this.ancestor(distance).values.get(name); }
  assignAt(distance, name, value) { this.ancestor(distance).values.set(name, value); }
}

// ============= TOKEN CLASS =============
class Token {
  constructor(type, lexeme, literal, line) { this.type = type; this.lexeme = lexeme; this.literal = literal; this.line = line; }
}

// ============= LEXER =============
class Lexer {
  constructor(source) {
    this.source = source; this.tokens = []; this.start = 0; this.current = 0; this.line = 1; this.regexAllowed = true;
  }
  scanTokens() {
    while (!this.isAtEnd()) { this.start = this.current; this.scanToken(); }
    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }
  scanToken() {
    let c = this.advance();
    switch (c) {
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '{': throw new Error(`[line ${this.line}] Error: Gunakake 'terus' tinimbang '{' kanggo miwiti blok`);
      case '}': throw new Error(`[line ${this.line}] Error: Gunakake 'mbari' tinimbang '}' kanggo mungkasi blok`);
      case '[': this.addToken(TokenType.LEFT_BRACKET); break;
      case ']': this.addToken(TokenType.RIGHT_BRACKET); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case ';': throw new Error(`[line ${this.line}] Error: JPL ora migunakake titik koma (;). Mbusak wae.`);
      case ':': this.addToken(TokenType.COLON); break;
      case '.': this.addToken(this.match('.') ? TokenType.DOT_DOT : TokenType.DOT); break;
      case '-': if (this.match('-')) throw new Error(`[line ${this.line}] Error: Gunakake 'kurang 1' tinimbang '--'`); this.addToken(TokenType.KURANG); break;
      case '+': if (this.match('+')) throw new Error(`[line ${this.line}] Error: Gunakake 'tambah 1' tinimbang '++'`); this.addToken(TokenType.TAMBAH); break;
      case '*': this.addToken(TokenType.PING); break;
      case '/':
        if (this.match('/')) { while (this.peek() !== '\n' && !this.isAtEnd()) this.advance(); }
        else if (this.match('*')) { while (!this.isAtEnd()) { if (this.advance() === '*' && this.peek() === '/') { this.advance(); break; } } }
        else if (this.isAlpha(this.peek())) {
          const savedCurrent = this.current;
          while (this.isAlpha(this.peek())) this.advance();
          const word = this.source.substring(this.start + 1, this.current);
          if ((word === 'clear' || word === 'credits') && !this.isAlphaNumeric(this.peek())) {
            let temp = this.current;
            while (temp < this.source.length && (this.source[temp] === ' ' || this.source[temp] === '\t' || this.source[temp] === '\n')) temp++;
            if (temp < this.source.length && this.source[temp] === '/') { this.current = savedCurrent; this.regex(); }
            else { if (word === 'clear') this.addToken(TokenType.CLEAR); else this.addToken(TokenType.CREDITS); }
          } else { this.current = savedCurrent; if (this.regexAllowed) this.regex(); else this.addToken(TokenType.BAGI); }
        } else if (this.regexAllowed) { this.regex(); } else { this.addToken(TokenType.BAGI); }
        break;
      case '=': throw new Error(`[line ${this.line}] Error: Gunakake 'yoiku' tinimbang '=' kanggo assignment`);
      case '<': this.addToken(this.match('=') ? TokenType.LUWIH_CILIK_PODO : TokenType.LUWIH_CILIK); break;
      case '>': this.addToken(this.match('=') ? TokenType.LUWIH_GEDHE_PODO : TokenType.LUWIH_GEDHE); break;
      case '!': if (this.match('=')) throw new Error(`[line ${this.line}] Error: Gunakake 'gakPodo' / 'gakPlek' tinimbang '!=' / '!=='`); this.addToken(TokenType.ORA); break;
      case '?': if (this.match('?')) this.addToken(TokenType.UTOWO_YEN_KOSONG); else throw new Error(`[line ${this.line}] Error: Gunakake 'ta' tinimbang '?' kanggo ternary`); break;
      case '%': this.addToken(TokenType.SISO); break;
      case ' ': case '\r': case '\t': break;
      case '\n': this.line++; break;
      case '"': case "'": this.string(c); break;
      case '`': this.template(); break;
      default:
        if (this.isDigit(c)) this.number();
        else if (this.isAlpha(c)) this.identifier();
        else throw new Error(`[line ${this.line}] Error: Karakter '${c}' ora dingerteni`);
    }
  }
  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    let text = this.source.substring(this.start, this.current);
    if (text === 'r' && (this.peek() === '"' || this.peek() === "'")) { this.rawString(this.peek()); return; }
    const savedCurrent = this.current;
    let tempCurrent = this.current;
    let combinedText = text;
    while (this.source.charAt(tempCurrent) === ' ') {
      tempCurrent++; let nextWordStart = tempCurrent;
      while (this.isAlphaNumeric(this.source.charAt(tempCurrent))) tempCurrent++;
      let nextWord = this.source.substring(nextWordStart, tempCurrent);
      if (!nextWord) break;
      combinedText += " " + nextWord;
      if (Keywords[combinedText]) { text = combinedText; this.current = tempCurrent; }
    }
    let type = Keywords[text];
    if (type === undefined) type = TokenType.IDENTIFIER;
    this.addToken(type);
  }
  rawString(quote) {
    this.advance(); let value = "";
    while (this.peek() !== quote && !this.isAtEnd()) { if (this.peek() === '\n') this.line++; value += this.advance(); }
    if (this.isAtEnd()) throw new Error("Unterminated raw string.");
    this.advance(); this.addToken(TokenType.RAW_STRING, value);
  }
  regex() {
    let pattern = ""; let inClass = false; let closed = false;
    while (!this.isAtEnd()) {
      const c = this.peek(); if (c === '\n') this.line++;
      if (c === '\\') { pattern += this.advance(); if (!this.isAtEnd()) pattern += this.advance(); continue; }
      if (c === '[') inClass = true; else if (c === ']') inClass = false;
      else if (c === '/' && !inClass) { this.advance(); closed = true; break; }
      pattern += this.advance();
    }
    if (!closed) throw new Error("Unterminated regex literal.");
    let flags = ""; while (this.isAlpha(this.peek())) flags += this.advance();
    this.addToken(TokenType.REGEX, { pattern, flags });
  }
  number() {
    while (this.isDigit(this.peek()) || this.peek() === '_') this.advance();
    if (this.peek() === '.' && this.isDigit(this.peekNext())) { this.advance(); while (this.isDigit(this.peek()) || this.peek() === '_') this.advance(); }
    const raw = this.source.substring(this.start, this.current).replace(/_/g, '');
    this.addToken(TokenType.NUMBER, parseFloat(raw));
  }
  template() {
    const strings = []; const expressions = []; let currentString = "";
    while (this.peek() !== '`' && !this.isAtEnd()) {
      if (this.peek() === '$' && this.peekNext() === '{') {
        strings.push(currentString); currentString = ""; this.advance(); this.advance();
        let exprCode = ""; let braceCount = 1;
        while (braceCount > 0 && !this.isAtEnd()) { if (this.peek() === '{') braceCount++; if (this.peek() === '}') braceCount--; if (braceCount > 0) exprCode += this.advance(); }
        if (this.isAtEnd()) throw new Error("Unterminated template interpolation.");
        this.advance(); expressions.push(exprCode);
      } else { if (this.peek() === '\n') this.line++; currentString += this.advance(); }
    }
    if (this.isAtEnd()) throw new Error("Unterminated template literal.");
    strings.push(currentString); this.advance();
    this.addToken(TokenType.TEMPLATE, { strings, expressions });
  }
  string(quote) {
    let value = "";
    while (this.peek() !== quote && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      if (this.peek() === '\\') { this.advance(); const escaped = this.advance(); switch(escaped) { case 'n': value += '\n'; break; case 't': value += '\t'; break; case '\\': value += '\\'; break; case '"': value += '"'; break; case "'": value += "'"; break; default: value += escaped; } }
      else value += this.advance();
    }
    if (this.isAtEnd()) throw new Error("Unterminated string.");
    this.advance(); this.addToken(TokenType.STRING, value);
  }
  match(expected) { if (this.isAtEnd()) return false; if (this.source.charAt(this.current) !== expected) return false; this.current++; return true; }
  peek() { return this.isAtEnd() ? '\0' : this.source.charAt(this.current); }
  peekNext() { return this.current + 1 >= this.source.length ? '\0' : this.source.charAt(this.current + 1); }
  isAlpha(c) { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'; }
  isAlphaNumeric(c) { return this.isAlpha(c) || this.isDigit(c); }
  isDigit(c) { return c >= '0' && c <= '9'; }
  isAtEnd() { return this.current >= this.source.length; }
  advance() { return this.source.charAt(this.current++); }
  addToken(type, literal = null) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
    const closeTokens = [TokenType.IDENTIFIER, TokenType.NUMBER, TokenType.STRING, TokenType.RAW_STRING, TokenType.TEMPLATE, TokenType.REGEX, TokenType.RIGHT_PAREN, TokenType.RIGHT_BRACKET, TokenType.MBARI, TokenType.TENAN, TokenType.GAK, TokenType.KOSONG, TokenType.ORADIDEFINISIKAN, TokenType.IKI, TokenType.PING, TokenType.PING_KARO];
    this.regexAllowed = !closeTokens.includes(type);
  }
}

// ============= PARSER =============
class Parser {
  constructor(tokens) { this.tokens = tokens; this.current = 0; }
  parse() {
    const statements = [];
    while (!this.isAtEnd()) { const decl = this.declaration(); if (decl !== null) statements.push(decl); }
    return statements;
  }
  declaration() {
    try {
      let result = null;
      if (this.match(TokenType.ABSTRAK)) { if (this.match(TokenType.KELAS)) result = this.classDeclaration(false, true); else { this.current--; result = this.statement(); } }
      else if (this.match(TokenType.KATUTUP)) { if (this.match(TokenType.KELAS)) result = this.classDeclaration(true); else { this.current--; result = this.statement(); } }
      else if (this.match(TokenType.KELAS)) result = this.classDeclaration(false);
      else if (this.match(TokenType.STRUKTUR)) result = this.structDeclaration();
      else if (this.match(TokenType.CACAH)) result = this.enumDeclaration();
      else if (this.match(TokenType.WANGUN)) result = this.interfaceDeclaration();
      else if (this.match(TokenType.METOKNO)) result = this.metoknoStatement();
      else if (this.match(TokenType.JUPUKNO)) result = this.jupuknoStatement();
      else if (this.match(TokenType.GAWE)) { let isAsync = false; if (this.match(TokenType.TENANGAN)) isAsync = true; result = this.functionDeclaration("gawe", isAsync); }
      else if (this.match(TokenType.TENANGAN)) { if (this.match(TokenType.GAWE)) result = this.functionDeclaration("gawe", true); else result = this.statement(); }
      else if (this.match(TokenType.IKI_IKU)) result = this.varDeclaration(true);
      else if (this.match(TokenType.JARNO)) result = this.varDeclaration(false);
      else result = this.statement();
      this.match(TokenType.SEMICOLON);
      return result;
    } catch (error) { this.synchronize(); return null; }
  }
  classDeclaration(isSealed = false, isAbstract = false) {
    const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng kelas.");
    let superclass = null;
    if (this.match(TokenType.TURUNAN_SOKO)) { this.consume(TokenType.IDENTIFIER, "Kudune jeneng parent class."); superclass = new AST.Variable(this.previous()); }
    this.consume(TokenType.TERUS, "Kudune 'terus' sakdurunge body kelas.");
    const methods = [];
    while (!this.check(TokenType.MBARI) && !this.isAtEnd()) {
      const isStatic = this.match(TokenType.TETEP); const isAbstractMethod = this.match(TokenType.ABSTRAK);
      if (this.match(TokenType.GAWE)) methods.push(this.functionDeclaration("cara", false, isStatic, isAbstractMethod));
      else if (this.match(TokenType.WUJUDNO)) methods.push(this.functionDeclaration("wujudno", false, isStatic, isAbstractMethod));
      else this.advance();
    }
    this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise body kelas.");
    return new AST.Kelas(name, superclass, methods, [], isSealed, isAbstract);
  }
  interfaceDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng interface.");
    this.consume(TokenType.TERUS, "Kudune 'terus' sakwise 'wangun'.");
    const methods = []; const properties = [];
    while (!this.check(TokenType.MBARI) && !this.isAtEnd()) {
      if (this.match(TokenType.GAWE)) {
        const isAsync = this.match(TokenType.TENANGAN);
        let methodName = this.consumeNameLike("Kudune jeneng method ing interface.");
        this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise jeneng method.");
        const params = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
          do { const paramName = this.consume(TokenType.IDENTIFIER, "Kudune jeneng parameter."); let paramType = null; if (this.match(TokenType.COLON)) paramType = this.consume(TokenType.IDENTIFIER, "Kudune tipe data parameter.").lexeme; params.push({ name: paramName, type: paramType }); } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise parameter.");
        let returnType = null; if (this.match(TokenType.COLON)) returnType = this.consume(TokenType.IDENTIFIER, "Kudune tipe data balikan.").lexeme;
        this.consume(TokenType.TERUS, "Kudune 'terus' sakwise signature method.");
        if (this.match(TokenType.BALEKNO)) returnType = this.consume(TokenType.IDENTIFIER, "Kudune tipe data balikan.").lexeme;
        this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise signature method.");
        methods.push({ name: methodName, params, returnType, isAsync });
      } else if (this.match(TokenType.ENTUK)) {
        const propName = this.consume(TokenType.IDENTIFIER, "Kudune jeneng properti.");
        this.consume(TokenType.TERUS, "Kudune 'terus' sakwise jeneng properti.");
        const propType = this.consume(TokenType.IDENTIFIER, "Kudune tipe data properti.").lexeme;
        this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise tipe properti.");
        properties.push({ name: propName, type: propType, isReadOnly: true });
      } else this.advance();
    }
    this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise body interface.");
    return { type: 'Interface', name, methods, properties };
  }
  structDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng struct.");
    this.consume(TokenType.TERUS, "Kudune 'terus' sakdurunge body struct.");
    const fields = [];
    while (!this.check(TokenType.MBARI) && !this.isAtEnd()) { const fieldName = this.consume(TokenType.IDENTIFIER, "Kudune jeneng field."); if (this.match(TokenType.COMMA)) {} fields.push(fieldName); }
    this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise body struct.");
    return new AST.Struktur(name, fields);
  }
  metoknoStatement() { this.match(TokenType.TERUS); return null; }
  jupuknoStatement() { this.match(TokenType.TERUS); return null; }
  consumeNameLike(message) {
    if (this.check(TokenType.IDENTIFIER)) return this.advance();
    const t = this.peek();
    if (t.type === TokenType.EOF) throw this.error(t, message);
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(t.lexeme)) return this.advance();
    throw this.error(t, message);
  }
  enumDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng enum.");
    this.consume(TokenType.YOIKU, "Kudune 'yoiku' sakwise jeneng enum.");
    this.match(TokenType.TERUS);
    const variants = []; let autoValue = 0;
    while (!this.check(TokenType.MBARI) && !this.isAtEnd()) {
      const vname = this.consume(TokenType.IDENTIFIER, "Kudune jeneng varian enum.");
      let value = autoValue; let explicit = false;
      if (this.match(TokenType.YOIKU)) {
        if (this.match(TokenType.NUMBER, TokenType.STRING)) { value = this.previous().literal; }
        else if (this.match(TokenType.TENAN)) value = true; else if (this.match(TokenType.GAK)) value = false; else if (this.match(TokenType.KOSONG)) value = null;
        else throw this.error(this.peek(), "Nilai enum kudu literal.");
        explicit = true;
      }
      variants.push({ name: vname, value, explicit });
      autoValue = explicit ? (typeof value === 'number' ? value + 1 : autoValue) : autoValue + 1;
      if (!this.match(TokenType.COMMA)) break;
    }
    this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise body enum.");
    return new AST.EnumStmt(name, variants);
  }
  functionDeclaration(kind, isAsync = false, isStatic = false, isAbstract = false) {
    let name = null;
    if (kind !== "wujudno" && kind !== "arrow") name = this.consumeNameLike(`Kudune jeneng ${kind}.`);
    this.consume(TokenType.LEFT_PAREN, `Kudune '(' sakwise jeneng ${kind}.`);
    const parameters = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (this.match(TokenType.TERUS)) {
          const properties = [];
          if (!this.check(TokenType.MBARI)) { do { const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng properti."); let alias = name; if (this.match(TokenType.DADI)) alias = this.consume(TokenType.IDENTIFIER, "Kudune jeneng alias."); properties.push({ name, alias }); } while (this.match(TokenType.COMMA)); }
          this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise destructuring.");
          parameters.push({ lexeme: "{destructuring}", properties, line: this.previous().line });
        } else if (this.match(TokenType.LEFT_BRACKET)) {
          const elements = [];
          if (!this.check(TokenType.RIGHT_BRACKET)) { do { elements.push(this.consume(TokenType.IDENTIFIER, "Kudune jeneng elemen.")); } while (this.match(TokenType.COMMA)); }
          this.consume(TokenType.RIGHT_BRACKET, "Kudune ']' sakwise destructuring.");
          parameters.push({ lexeme: "[destructuring]", elements, line: this.previous().line });
        } else {
          const param = this.consume(TokenType.IDENTIFIER, "Kudune jeneng parameter.");
          if (this.match(TokenType.COLON)) this.consume(TokenType.IDENTIFIER, "Kudune tipe data.");
          parameters.push(param);
        }
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise parameter.");
    if (this.match(TokenType.COLON)) this.consume(TokenType.IDENTIFIER, "Kudune tipe data balikan.");
    if (isAbstract) { const finalName = name || { lexeme: kind === "wujudno" ? "wujudno" : "arrow", line: this.previous().line }; return new AST.Gawe(finalName, parameters, new AST.Block([]), false, false, true); }
    this.consume(TokenType.TERUS, `Kudune 'terus' sakdurunge body ${kind}.`);
    const body = this.block();
    const finalName = name || { lexeme: kind === "wujudno" ? "wujudno" : "arrow", line: this.previous().line };
    return new AST.Gawe(finalName, parameters, new AST.Block(body), isAsync, false);
  }
  varDeclaration(isConst) {
    if (this.match(TokenType.TERUS)) {
      const properties = [];
      if (!this.check(TokenType.MBARI)) { do { const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng properti."); let alias = name; if (this.match(TokenType.DADI)) alias = this.consume(TokenType.IDENTIFIER, "Kudune jeneng alias."); let defaultValue = null; if (this.match(TokenType.YOIKU)) defaultValue = this.expression(); properties.push({ name, alias, defaultValue }); } while (this.match(TokenType.COMMA)); }
      this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise destructuring.");
      this.consume(TokenType.YOIKU, "Kudune 'yoiku' sakwise destructuring.");
      const initializer = this.expression();
      return new AST.Var({ lexeme: "{destructuring}", properties, line: this.previous().line }, initializer, isConst);
    }
    if (this.match(TokenType.LEFT_BRACKET)) {
      const elements = [];
      if (!this.check(TokenType.RIGHT_BRACKET)) { do { elements.push(this.consume(TokenType.IDENTIFIER, "Kudune jeneng elemen.")); } while (this.match(TokenType.COMMA)); }
      this.consume(TokenType.RIGHT_BRACKET, "Kudune ']' sakwise destructuring.");
      this.consume(TokenType.YOIKU, "Kudune 'yoiku' sakwise destructuring.");
      const initializer = this.expression();
      return new AST.Var({ lexeme: "[destructuring]", elements, line: this.previous().line }, initializer, isConst);
    }
    const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng variabel.");
    if (this.match(TokenType.COLON)) this.consume(TokenType.IDENTIFIER, "Kudune tipe data.");
    let initializer = null;
    if (this.match(TokenType.YOIKU)) initializer = this.expression();
    return new AST.Var(name, initializer, isConst);
  }
  statement() {
    if (this.check(TokenType.IDENTIFIER) && !this.isAtEnd()) {
      const next = this.tokens[this.current + 1];
      if (next && next.type === TokenType.COLON) { const name = this.advance(); this.advance(); const stmt = this.statement(); return new AST.LabeledStmt(name, stmt); }
    }
    if (this.match(TokenType.CLEAR)) return new AST.Command('clear');
    if (this.match(TokenType.CREDITS)) return new AST.Command('credits');
    if (this.match(TokenType.LEK)) return this.lekStatement();
    if (this.match(TokenType.CETAKNO)) return this.cetaknoStatement();
    if (this.match(TokenType.BALEKNO)) return this.baleknoStatement();
    if (this.match(TokenType.SELAGI)) return this.selagiStatement();
    if (this.match(TokenType.KANGGO)) return this.kanggoStatement();
    if (this.match(TokenType.RENTANG)) return this.rentangStatement();
    if (this.match(TokenType.PILIH)) return this.pilihStatement();
    if (this.match(TokenType.COCOK)) return this.cocokStatement();
    if (this.match(TokenType.COBAK)) return this.cobakStatement();
    if (this.match(TokenType.UNCALEN)) return this.uncalenStatement();
    if (this.match(TokenType.MANDEK)) { const keyword = this.previous(); let label = null; if (this.check(TokenType.IDENTIFIER)) label = this.advance(); return new AST.Mandek(keyword, label); }
    if (this.match(TokenType.LANJUTNO)) { const keyword = this.previous(); let label = null; if (this.check(TokenType.IDENTIFIER)) label = this.advance(); return new AST.Lanjutno(keyword, label); }
    if (this.match(TokenType.NGENTENI)) return this.ngenteniStatement();
    if (this.match(TokenType.TERUS)) return new AST.Block(this.block());
    return this.expressionStatement();
  }
  lekStatement() {
    this.match(TokenType.LEFT_PAREN); const condition = this.expression(); if (this.check(TokenType.RIGHT_PAREN)) this.advance();
    this.consume(TokenType.TERUS, "Kudune 'terus' sakwise kondisi."); const thenBranch = new AST.Block(this.block());
    const elseIfBranches = [];
    while (this.match(TokenType.LEK_MISALE)) { this.match(TokenType.LEFT_PAREN); const elifCond = this.expression(); if (this.check(TokenType.RIGHT_PAREN)) this.advance(); this.consume(TokenType.TERUS, "Kudune 'terus' sakwise kondisi."); elseIfBranches.push({ condition: elifCond, branch: new AST.Block(this.block()) }); }
    let elseBranch = null;
    if (this.match(TokenType.LIYANE)) { this.consume(TokenType.TERUS, "Kudune 'terus' sakwise 'liyane'."); elseBranch = new AST.Block(this.block()); }
    return new AST.Lek(condition, thenBranch, elseIfBranches, elseBranch);
  }
  cetaknoStatement() {
    const expressions = [];
    if (this.match(TokenType.LEFT_PAREN)) {
      if (!this.check(TokenType.RIGHT_PAREN)) { do { expressions.push(this.expression()); } while (this.match(TokenType.COMMA)); }
      this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise nilai.");
    } else { do { expressions.push(this.expression()); } while (this.match(TokenType.COMMA)); }
    return new AST.Cetakno(expressions);
  }
  baleknoStatement() { const keyword = this.previous(); let value = null; if (!this.check(TokenType.MBARI) && !this.isAtEnd()) value = this.expression(); return new AST.Balekno(keyword, value); }
  selagiStatement() { this.match(TokenType.LEFT_PAREN); const condition = this.expression(); if (this.check(TokenType.RIGHT_PAREN)) this.advance(); this.consume(TokenType.TERUS, "Kudune 'terus' sakdurunge body loop."); const body = new AST.Block(this.block()); return new AST.Selagi(condition, body); }
  kanggoStatement() {
    const isAsync = this.match(TokenType.TENANGAN);
    if (!this.check(TokenType.LEFT_PAREN)) {
      let isConst = false; if (this.match(TokenType.JARNO)) isConst = false; else if (this.match(TokenType.IKI_IKU)) isConst = true;
      const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng variabel iterasi.");
      this.consume(TokenType.SOKO, "Kudune 'soko' sakwise jeneng variabel.");
      const iterable = this.expression();
      this.consume(TokenType.TERUS, "Kudune 'terus' sakdurunge body loop.");
      const body = new AST.Block(this.block());
      return new AST.ForOf(name, iterable, body, isConst, isAsync);
    }
    this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise 'kanggo'.");
    let initializer;
    if (this.match(TokenType.BANJUR)) initializer = null;
    else if (this.match(TokenType.JARNO)) { initializer = this.varDeclaration(false); this.consume(TokenType.BANJUR, "Kudune 'banjur' sakwise initializer."); }
    else { initializer = this.expressionStatement(); this.consume(TokenType.BANJUR, "Kudune 'banjur' sakwise initializer."); }
    let condition = null; if (!this.check(TokenType.BANJUR)) condition = this.expression();
    this.consume(TokenType.BANJUR, "Kudune 'banjur' sakwise kondisi loop.");
    let increment = null; if (!this.check(TokenType.RIGHT_PAREN)) increment = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise kanggo clause.");
    this.consume(TokenType.TERUS, "Kudune 'terus' sakdurunge body loop.");
    const body = new AST.Block(this.block());
    return new AST.Kanggo(initializer, condition, increment, body);
  }
  rentangStatement() {
    const start = this.expression(); let end = null;
    if (this.match(TokenType.DOT_DOT)) end = this.expression();
    this.consume(TokenType.TERUS, "Kudune 'terus' sakwise 'rentang'.");
    const body = new AST.Block(this.block());
    return new AST.RentangStmt(start, end, body);
  }
  ngenteniStatement() {
    const keyword = this.previous();
    let amount = null;
    let unit = null;
    if (this.match(TokenType.LEFT_PAREN)) {
      amount = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise nilai ngenteni.");
    } else {
      amount = this.expression();
    }
    if (this.check(TokenType.DETIK) || this.check(TokenType.MENIT) || 
        this.check(TokenType.JAM) || this.check(TokenType.DINO)) {
      unit = this.advance();
    }
    return new AST.Ngenteni(keyword, amount, unit);
  }
  pilihStatement() {
    this.match(TokenType.LEFT_PAREN); const expr = this.expression(); if (this.check(TokenType.RIGHT_PAREN)) this.advance();
    this.consume(TokenType.TERUS, "Kudune 'terus' sakwise 'pilih'.");
    const cases = [];
    while (this.match(TokenType.KALO)) {
      const val = this.expression(); this.consume(TokenType.COLON, "Kudune ':' sakwise nilai case.");
      const statements = [];
      while (!this.check(TokenType.KALO) && !this.check(TokenType.YOWES) && !this.check(TokenType.MBARI)) statements.push(this.declaration());
      cases.push({ value: val, branch: new AST.Block(statements) });
    }
    let defaultBranch = null;
    if (this.match(TokenType.YOWES)) {
      this.consume(TokenType.COLON, "Kudune ':' sakwise 'yowes'.");
      const statements = []; while (!this.check(TokenType.MBARI)) statements.push(this.declaration());
      defaultBranch = new AST.Block(statements);
    }
    this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise 'pilih'.");
    return new AST.Pilih(expr, cases, defaultBranch);
  }
  cobakStatement() {
    this.consume(TokenType.TERUS, "Kudune 'terus' sakwise 'cobak'.");
    const tryBlock = new AST.Block(this.block());
    let catchVar = null, catchBranch = null;
    if (this.match(TokenType.NYEKEL)) {
      this.match(TokenType.LEFT_PAREN); catchVar = this.consume(TokenType.IDENTIFIER, "Kudune jeneng variabel error.");
      if (this.check(TokenType.RIGHT_PAREN)) this.advance();
      this.consume(TokenType.TERUS, "Kudune 'terus' sakwise 'nyekel'.");
      catchBranch = new AST.Block(this.block());
    }
    let finallyBranch = null;
    if (this.match(TokenType.PUNGKASAN)) { this.consume(TokenType.TERUS, "Kudune 'terus' sakwise 'pungkasan'."); finallyBranch = new AST.Block(this.block()); }
    return new AST.Cobak(tryBlock, catchVar, catchBranch, finallyBranch);
  }
  cocokStatement() {
    const expr = this.expression(); this.match(TokenType.TERUS);
    const arms = []; let defaultBranch = null;
    while (!this.check(TokenType.MBARI) && !this.isAtEnd()) {
      if (this.match(TokenType.YOWES)) {
        let stmts; if (this.match(TokenType.TERUS)) stmts = this.block(); else stmts = [this.declaration()];
        defaultBranch = new AST.Block(stmts); continue;
      }
      if (!this.match(TokenType.KALO)) throw this.error(this.peek(), "Kudune 'kalo' utowo 'yowes' ing 'cocok'.");
      const patterns = [this.parsePattern()];
      while (this.match(TokenType.COMMA) || this.match(TokenType.UTAWA)) patterns.push(this.parsePattern());
      let guard = null; if (this.match(TokenType.LAN)) guard = this.expression();
      let stmts; if (this.match(TokenType.TERUS)) stmts = this.block(); else stmts = [this.declaration()];
      arms.push({ patterns, guard, body: new AST.Block(stmts) });
    }
    this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise 'cocok'.");
    return new AST.MatchStmt(expr, arms, defaultBranch);
  }
  parsePattern() {
    if (this.match(TokenType.IDENTIFIER)) { const tok = this.previous(); if (tok.lexeme === "_") return new AST.WildcardPattern(); return new AST.BindingPattern(tok); }
    if (this.match(TokenType.TENAN)) return new AST.LiteralPattern(true);
    if (this.match(TokenType.GAK)) return new AST.LiteralPattern(false);
    if (this.match(TokenType.KOSONG)) return new AST.LiteralPattern(null);
    if (this.match(TokenType.ORADIDEFINISIKAN)) return new AST.LiteralPattern(undefined);
    if (this.match(TokenType.NUMBER, TokenType.STRING)) return new AST.LiteralPattern(this.previous().literal);
    if (this.match(TokenType.LEFT_BRACKET)) {
      const elements = []; let rest = null;
      if (!this.check(TokenType.RIGHT_BRACKET)) { do { if (this.check(TokenType.DOT_DOT)) { this.advance(); if (this.check(TokenType.RIGHT_BRACKET)) { rest = new AST.WildcardPattern(); break; } if (this.check(TokenType.IDENTIFIER)) { rest = new AST.BindingPattern(this.advance()); break; } } elements.push(this.parsePattern()); } while (this.match(TokenType.COMMA)); }
      this.consume(TokenType.RIGHT_BRACKET, "Kudune ']' sakwise array pattern.");
      return new AST.ArrayPattern(elements, rest);
    }
    if (this.match(TokenType.TERUS)) {
      const properties = []; let rest = null;
      if (!this.check(TokenType.MBARI)) { do { if (this.check(TokenType.DOT_DOT)) { this.advance(); rest = new AST.WildcardPattern(); break; } const key = this.consume(TokenType.IDENTIFIER, "Kudune jeneng properti."); let pat; if (this.match(TokenType.COLON)) pat = this.parsePattern(); else pat = new AST.BindingPattern(key); properties.push({ key, pat }); } while (this.match(TokenType.COMMA)); }
      this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise object pattern.");
      return new AST.ObjectPattern(properties, rest);
    }
    throw this.error(this.peek(), "Pattern ora valid.");
  }
  uncalenStatement() { const keyword = this.previous(); const value = this.expression(); return new AST.Uncalen(keyword, value); }
  block() { const statements = []; while (!this.check(TokenType.MBARI) && !this.isAtEnd()) { const decl = this.declaration(); if (decl !== null) statements.push(decl); } this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise block."); return statements; }
  expressionStatement() { return new AST.Expression(this.expression()); }
  expression() { return this.assignment(); }
  assignment() {
    const expr = this.ternary();
    if (this.match(TokenType.YOIKU, TokenType.TAMBAH_KARO, TokenType.KURANG_KARO, TokenType.PING_KARO, TokenType.BAGI_KARO, TokenType.SISO_KARO)) {
      const operator = this.previous(); const value = this.assignment();
      if (expr instanceof AST.Variable) return new AST.Assign(expr.name, operator, value);
      else if (expr instanceof AST.Get) return new AST.Set(expr.object, expr.name, value);
      throw this.error(operator, "Target assignment ora valid.");
    }
    return expr;
  }
  ternary() { let expr = this.nullish(); if (this.match(TokenType.TA)) { const thenExpr = this.expression(); this.consume(TokenType.LEK_GAK, "Kudune 'lek gak' sakwise ekspresi true."); const elseExpr = this.ternary(); expr = new AST.Ternary(expr, thenExpr, elseExpr); } return expr; }
  nullish() { let expr = this.or(); while (this.match(TokenType.UTOWO_YEN_KOSONG)) { const operator = this.previous(); const right = this.or(); expr = new AST.Logical(expr, operator, right); } return expr; }
  or() { let expr = this.and(); while (this.match(TokenType.UTAWA)) { const operator = this.previous(); const right = this.and(); expr = new AST.Logical(expr, operator, right); } return expr; }
  and() { let expr = this.equality(); while (this.match(TokenType.LAN)) { const operator = this.previous(); const right = this.equality(); expr = new AST.Logical(expr, operator, right); } return expr; }
  equality() {
    let expr = this.comparison();
    while (this.match(TokenType.GAK_PLEK, TokenType.GAK_PODO, TokenType.PLEK, TokenType.PODO, TokenType.GUDUK)) {
      const operator = this.previous();
      if (operator.type === TokenType.GUDUK) { const right = this.comparison(); expr = new AST.Binary(expr, { type: TokenType.GAK_PODO, lexeme: "!=", line: operator.line }, right); }
      else { const right = this.comparison(); expr = new AST.Binary(expr, operator, right); }
    }
    return expr;
  }
  comparison() {
    let expr = this.term();
    while (this.match(TokenType.LUWIH_GEDHE, TokenType.LUWIH_GEDHE_PODO, TokenType.LUWIH_CILIK, TokenType.LUWIH_CILIK_PODO, TokenType.IKU_ONO, TokenType.IKU_ILANG, TokenType.IKU)) {
      const operator = this.previous();
      if (operator.type === TokenType.IKU_ONO || operator.type === TokenType.IKU_ILANG) expr = new AST.Postfix(expr, operator);
      else if (operator.type === TokenType.IKU) {
        if (this.match(TokenType.ONO)) expr = new AST.Postfix(expr, { type: TokenType.IKU_ONO, lexeme: "iku ono", line: operator.line });
        else if (this.match(TokenType.ILANG)) expr = new AST.Postfix(expr, { type: TokenType.IKU_ILANG, lexeme: "iku ilang", line: operator.line });
        else throw this.error(this.peek(), "Kudune 'ono' utowo 'ilang' sakwise 'iku'.");
      } else { const right = this.term(); expr = new AST.Binary(expr, operator, right); }
    }
    return expr;
  }
  term() { let expr = this.range(); while (this.match(TokenType.KURANG, TokenType.TAMBAH)) { const operator = this.previous(); const right = this.range(); expr = new AST.Binary(expr, operator, right); } return expr; }
  range() { let expr = this.factor(); if (this.match(TokenType.DOT_DOT)) { const inclusive = !this.match(TokenType.DOT_DOT); const end = this.factor(); expr = new AST.RangeExpr(expr, end, inclusive); } return expr; }
  factor() { let expr = this.unary(); while (this.match(TokenType.BAGI, TokenType.PING, TokenType.SISO, TokenType.PANGKAT)) { const operator = this.previous(); const right = this.unary(); expr = new AST.Binary(expr, operator, right); } return expr; }
  unary() { if (this.match(TokenType.ORA, TokenType.TAMBAH, TokenType.KURANG, TokenType.ENTENI, TokenType.ASILNO)) { const operator = this.previous(); const right = this.unary(); return new AST.Unary(operator, right); } return this.call(); }
  call() {
    let expr;
    if (this.match(TokenType.TEMPLATE)) expr = this.buildTemplateLiteral(this.previous());
    else expr = this.primary();
    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) expr = this.finishCall(expr);
      else if (this.match(TokenType.TEMPLATE)) expr = new AST.TaggedTemplate(expr, this.buildTemplateLiteral(this.previous()));
      else if (this.match(TokenType.DOT)) { if (this.check(TokenType.IDENTIFIER) || this.isKeyword(this.peek())) { const name = this.advance(); expr = new AST.Get(expr, name); } else throw this.error(this.peek(), "Kudune jeneng properti sakwise '."); }
      else if (this.match(TokenType.LEFT_BRACKET)) { const index = this.expression(); this.consume(TokenType.RIGHT_BRACKET, "Kudune ']' sakwise index."); expr = new AST.Get(expr, { lexeme: "[]", line: this.previous().line, index }); }
      else break;
    }
    return expr;
  }
  finishCall(callee) {
    const args = [];
    if (!this.check(TokenType.RIGHT_PAREN)) { do { args.push(this.expression()); } while (this.match(TokenType.COMMA)); }
    const paren = this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise argumen.");
    return new AST.Call(callee, paren, args);
  }
  buildTemplateLiteral(token) {
    const { strings, expressions } = token.literal;
    const parsedExpressions = expressions.map(code => { const lexer = new Lexer(code); const tokens = lexer.scanTokens(); const parser = new Parser(tokens); return parser.expression(); });
    return new AST.TemplateLiteral(strings, parsedExpressions);
  }
  primary() {
    if (this.match(TokenType.GAK)) return new AST.Literal(false);
    if (this.match(TokenType.TENAN)) return new AST.Literal(true);
    if (this.match(TokenType.KOSONG)) return new AST.Literal(null);
    if (this.match(TokenType.ORADIDEFINISIKAN)) return new AST.Literal(undefined);
    if (this.match(TokenType.NUMBER, TokenType.STRING, TokenType.RAW_STRING)) return new AST.Literal(this.previous().literal);
    if (this.match(TokenType.REGEX)) { const { pattern, flags } = this.previous().literal; return new AST.Literal(new RegExp(pattern, flags)); }
    if (this.match(TokenType.IKI)) return new AST.This(this.previous());
    if (this.match(TokenType.TUPLE)) {
      this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise 'tuple'.");
      const elements = [];
      if (!this.check(TokenType.RIGHT_PAREN)) { do { elements.push(this.expression()); } while (this.match(TokenType.COMMA)); }
      this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise elemen tuple.");
      return new AST.Tuple(this.previous(), elements);
    }
    if (this.match(TokenType.LEFT_BRACKET)) {
      const elements = [];
      if (!this.check(TokenType.RIGHT_BRACKET)) { do { elements.push(this.expression()); } while (this.match(TokenType.COMMA)); }
      this.consume(TokenType.RIGHT_BRACKET, "Kudune ']' sakwise elemen array.");
      return new AST.ArrayLiteral(elements);
    }
    if (this.match(TokenType.TERUS)) {
      const properties = new Map();
      if (!this.check(TokenType.MBARI)) { do { let key; if (this.match(TokenType.IDENTIFIER, TokenType.STRING)) key = this.previous().literal || this.previous().lexeme; else key = this.consume(TokenType.IDENTIFIER, "Kudune jeneng properti.").lexeme; this.consume(TokenType.COLON, "Kudune ':' sakwise jeneng properti."); const value = this.expression(); properties.set(key, value); } while (this.match(TokenType.COMMA)); }
      this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise properti obyek.");
      return new AST.ObjectLiteral(properties);
    }
    if (this.match(TokenType.ANYAR)) {
      const type = this.consume(TokenType.IDENTIFIER, "Kudune jeneng kelas sakwise 'anyar'.");
      this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise jeneng kelas.");
      const args = [];
      if (!this.check(TokenType.RIGHT_PAREN)) { do { args.push(this.expression()); } while (this.match(TokenType.COMMA)); }
      const paren = this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise argumen.");
      return new AST.Call(new AST.Variable(type), paren, args);
    }
    if (this.check(TokenType.IDENTIFIER)) {
      const next = this.tokens[this.current + 1];
      if (next && next.type === TokenType.LAKONI) {
        const param = this.advance(); this.advance();
        if (this.match(TokenType.TERUS)) return new AST.Gawe({ lexeme: "arrow", line: param.line }, [param], new AST.Block(this.block()));
        else return new AST.Gawe({ lexeme: "arrow", line: param.line }, [param], new AST.Expression(this.expression()));
      }
    }
    if (this.check(TokenType.LEFT_PAREN)) {
      let i = this.current + 1; let isArrow = false; let parenCount = 1;
      while (i < this.tokens.length && parenCount > 0) { if (this.tokens[i].type === TokenType.LEFT_PAREN) parenCount++; if (this.tokens[i].type === TokenType.RIGHT_PAREN) parenCount--; i++; }
      if (i < this.tokens.length && this.tokens[i].type === TokenType.LAKONI) isArrow = true;
      if (isArrow) {
        this.advance(); const parameters = [];
        if (!this.check(TokenType.RIGHT_PAREN)) { do { parameters.push(this.consume(TokenType.IDENTIFIER, "Kudune jeneng parameter.")); } while (this.match(TokenType.COMMA)); }
        this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise parameter.");
        this.consume(TokenType.LAKONI, "Kudune 'lakoni' sakwise parameter.");
        if (this.match(TokenType.TERUS)) return new AST.Gawe({ lexeme: "arrow", line: this.previous().line }, parameters, new AST.Block(this.block()));
        else return new AST.Gawe({ lexeme: "arrow", line: this.previous().line }, parameters, new AST.Expression(this.expression()));
      }
    }
    if (this.match(TokenType.IDENTIFIER) || this.match(TokenType.TAMBAH, TokenType.KURANG, TokenType.PING, TokenType.BAGI, TokenType.SISO)) return new AST.Variable(this.previous());
    if (this.match(TokenType.LEFT_PAREN)) { const expr = this.expression(); this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise ekspresi."); return new AST.Grouping(expr); }
    throw this.error(this.peek(), "Kudune ekspresi.");
  }
  isKeyword(token) { if (token.type === TokenType.EOF) return false; return !!Keywords[token.lexeme.toLowerCase()] || !!Keywords[token.lexeme]; }
  match(...types) { for (const type of types) { if (this.check(type)) { this.advance(); return true; } } return false; }
  consume(type, message) { if (this.check(type)) return this.advance(); throw this.error(this.peek(), message); }
  check(type) { return !this.isAtEnd() && this.peek().type === type; }
  advance() { if (!this.isAtEnd()) this.current++; return this.previous(); }
  isAtEnd() { return this.peek().type === TokenType.EOF; }
  peek() { return this.tokens[this.current]; }
  previous() { return this.tokens[this.current - 1]; }
  error(token, message) { return new Error(`[line ${token.line}] Error ing '${token.lexeme}': ${message}`); }
  synchronize() {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.MBARI) return;
      switch (this.peek().type) { case TokenType.KELAS: case TokenType.GAWE: case TokenType.JARNO: case TokenType.IKI_IKU: case TokenType.LEK: case TokenType.SELAGI: case TokenType.KANGGO: case TokenType.CETAKNO: case TokenType.BALEKNO: return; }
      this.advance();
    }
  }
}

// ============= INTERPRETER =============
class ReturnValue extends Error { constructor(v){super();this.value=v;} }
class Break extends Error { constructor(l=null){super();this.label=l;} }
class Continue extends Error { constructor(l=null){super();this.label=l;} }

class JawaCallable { arity(){} call(interpreter, args){} }

class JawaFunction extends JawaCallable {
  constructor(declaration, closure, isInitializer = false) { super(); this.declaration = declaration; this.closure = closure; this.isInitializer = isInitializer; }
  get isAbstract() { return this.declaration.isAbstract; }
  arity() { return this.declaration.params.length; }
  bind(instance) { const env = new Environment(this.closure); env.define("iki", instance); return new JawaFunction(this.declaration, env, this.isInitializer); }
  async call(interpreter, args) {
    const env = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      const param = this.declaration.params[i];
      if (param.lexeme === "{destructuring}") { const value = args[i]; for (const { name, alias } of param.properties) env.define(alias.lexeme, value[name.lexeme]); }
      else if (param.lexeme === "[destructuring]") { const value = args[i]; for (let j = 0; j < param.elements.length; j++) env.define(param.elements[j].lexeme, value[j]); }
      else env.define(param.lexeme, args[i]);
    }
    try {
      if (this.declaration.body instanceof AST.Block) await interpreter.executeBlock(this.declaration.body.statements, env);
      else { const prev = interpreter.environment; try { interpreter.environment = env; return await interpreter.evaluate(this.declaration.body.expression); } finally { interpreter.environment = prev; } }
    } catch (rv) { if (rv instanceof ReturnValue) { if (this.isInitializer) return this.closure.getAt(0, "iki"); return rv.value; } throw rv; }
    if (this.isInitializer) return this.closure.getAt(0, "iki");
    return null;
  }
  toString() { return `<gawe ${this.declaration.name.lexeme}>`; }
}

class JawaClass extends JawaCallable {
  constructor(name, superclass, methods, isSealed = false, isAbstract = false) { super(); this.name = name; this.superclass = superclass; this.methods = methods; this.isSealed = isSealed; this.isAbstract = isAbstract; this.interfaces = []; }
  findMethod(name) { if (this.methods.has(name)) return this.methods.get(name); if (this.superclass !== null) return this.superclass.findMethod(name); return null; }
  arity() { const init = this.findMethod("wujudno"); return init === null ? 0 : init.arity(); }
  async call(interpreter, args) {
    if (this.isAbstract) throw new Error(`Error: Ora iso instantiate kelas abstrak '${this.name}'.`);
    const instance = new JawaInstance(this);
    const initializer = this.findMethod("wujudno");
    if (initializer !== null) await initializer.bind(instance).call(interpreter, args);
    return instance;
  }
  toString() { return this.name; }
}

class JawaStruct extends JawaCallable {
  constructor(name, fields) { super(); this.name = name; this.fields = fields; }
  arity() { return this.fields.length; }
  async call(interpreter, args) { const instance = {}; for (let i = 0; i < this.fields.length; i++) instance[this.fields[i]] = args[i]; return Object.freeze(instance); }
  toString() { return `struktur ${this.name}`; }
}

class JawaInstance {
  constructor(klass) { this.klass = klass; this.fields = new Map(); }
  get(name) { const lexeme = typeof name === "string" ? name : name.lexeme; if (this.fields.has(lexeme)) return this.fields.get(lexeme); const method = this.klass.findMethod(lexeme); if (method !== null) return method.bind(this); throw new Error(`[line ${name.line || 0}] Error: Properti '${lexeme}' ora ono.`); }
  set(name, value) { this.fields.set(typeof name === "string" ? name : name.lexeme, value); }
  toString() { return `<obyek ${this.klass.name}>`; }
}

class Interpreter {
  constructor(options = {}) {
    this.globals = new Environment();
    this.environment = this.globals;
    this.printHandler = options.print || console.log;
    this.promptHandler = options.prompt || ((msg) => window.prompt(msg));

    this.globals.define("saiki", { arity: () => 0, call: () => Date.now(), toString: () => "<native gawe saiki>" });
    this.globals.define("takon", { arity: () => 1, call: (interp, args) => this.promptHandler(args[0]), toString: () => "<native gawe takon>" });
    this.globals.define("Perantara", { arity: () => 2, call: (interp, args) => new Proxy(args[0], args[1]), toString: () => "<native Perantara>" });
    this.globals.define("Pantulan", { jupuk: (obj, prop) => Reflect.get(obj, prop), pasang: (obj, prop, val) => Reflect.set(obj, prop, val), toString: () => "<native Pantulan>" });
    this.globals.define("Kesalahan", { arity: () => 1, call: (interp, args) => new Error(args[0]), toString: () => "<native Kesalahan>" });
    this.globals.define("JSON", { tulisan: (obj) => JSON.stringify(obj), obyek: (str) => JSON.parse(str), toString: () => "<native JSON>" });
    this.globals.define("Janji", { arity: () => 1, call: (interp, args) => new Promise(args[0]), kabeh: (promises) => Promise.all(promises), balekno: (val) => Promise.resolve(val), toString: () => "<native Janji>" });
    this.globals.define("PolaTeks", { arity: () => 1, call: (interp, args) => new RegExp(args[0]), toString: () => "<native PolaTeks>" });
    this.globals.define("Mtk", { acak: () => 0.10843740596877116, bunder: (n) => Math.round(n), ngisor: (n) => Math.floor(n), nduwur: (n) => Math.ceil(n), mutlak: (n) => Math.abs(n), pangkat: (a, b) => Math.pow(a, b), oyot: (n) => Math.sqrt(n), palingDhuwur: (...a) => Math.max(...a), palingNgisor: (...a) => Math.min(...a), PI: Math.PI, E: Math.E, toString: () => "<native Mtk>" });
    this.globals.define("Tanggalan", { saiki: () => new Date(), format: (d, f) => d.toLocaleString(), toString: () => "<native Tanggalan>" });
    this.globals.define("Daftar", Array); this.globals.define("Obyek", Object); this.globals.define("Teks", String);
    this.globals.define("Angka", Number); this.globals.define("Logika", Boolean); this.globals.define("Simbol", Symbol);
    this.globals.define("Peta", Map); this.globals.define("Kumpulan", Set);
    this.globals.define("HimpunanLemah", WeakSet); this.globals.define("PetaLemah", WeakMap);
    this.globals.define("pasten", (condition, message) => { if (!this.isTruthy(condition)) throw new Error(`Assertion failed: ${message !== undefined ? this.stringify(message) : 'kondisi palsu'}`); return true; });
    this.globals.define("pastenPodo", (actual, expected, message) => { if (actual !== expected) throw new Error(`Assertion failed: ngarep ${this.stringify(expected)} tapi oleh ${this.stringify(actual)}${message ? ' — ' + this.stringify(message) : ''}`); return true; });
    this.globals.define("Wektu", { ngenteni: (fn, ms) => setTimeout(fn, ms), mbaleni: (fn, ms) => setInterval(fn, ms), mandek: (id) => { clearTimeout(id); clearInterval(id); }, toString: () => "<native Wektu>" });
  }
  async interpret(statements) {
    try { for (const stmt of statements) await this.execute(stmt); }
    catch (error) { if (error instanceof Error) throw error; throw new Error("Kesalahan sing ora dingerteni: " + error); }
  }
  async execute(stmt) { if (stmt) await stmt.accept(this); }
  async evaluate(expr) { return await expr.accept(this); }
  async visitBlockStmt(stmt) { await this.executeBlock(stmt.statements, new Environment(this.environment)); return null; }
  async executeBlock(statements, env) { const prev = this.environment; try { this.environment = env; for (const s of statements) await this.execute(s); } finally { this.environment = prev; } }
  async visitExpressionStmt(stmt) { await this.evaluate(stmt.expression); return null; }
  async visitGaweStmt(stmt) { const fn = new JawaFunction(stmt, this.environment); if (stmt.name.lexeme !== "arrow") this.environment.define(stmt.name.lexeme, fn); return fn; }
  async visitKelasStmt(stmt) {
    let superclass = null;
    if (stmt.superclass !== null) { superclass = await this.evaluate(stmt.superclass); if (!(superclass instanceof JawaClass)) throw new Error(`[line ${stmt.name.line}] Error: Parent class kudu dadi kelas.`); if (superclass.isSealed) throw new Error(`[line ${stmt.name.line}] Error: Ora iso ngextend kelas katutup '${superclass.name}'.`); }
    this.environment.define(stmt.name.lexeme, null);
    if (stmt.superclass !== null) { this.environment = new Environment(this.environment); this.environment.define("induk", superclass); }
    const methods = new Map();
    for (const method of stmt.methods) { const isInitializer = method.name.lexeme === "wujudno"; methods.set(method.name.lexeme, new JawaFunction(method, this.environment, isInitializer)); }
    const klass = new JawaClass(stmt.name.lexeme, superclass, methods, stmt.isSealed, stmt.isAbstract);
    if (superclass !== null) this.environment = this.environment.enclosing;
    this.environment.assign(stmt.name, klass); return null;
  }
  async visitStrukturStmt(stmt) { const struct = new JawaStruct(stmt.name.lexeme, stmt.fields.map(f => f.lexeme)); this.environment.define(stmt.name.lexeme, struct); return null; }
  async visitLekStmt(stmt) {
    if (this.isTruthy(await this.evaluate(stmt.condition))) await this.execute(stmt.thenBranch);
    else { for (const elif of stmt.elseIfBranches) { if (this.isTruthy(await this.evaluate(elif.condition))) { await this.execute(elif.branch); return null; } } if (stmt.elseBranch !== null) await this.execute(stmt.elseBranch); }
    return null;
  }
  async visitCetaknoStmt(stmt) { const values = []; for (const expr of stmt.expressions) values.push(await this.evaluate(expr)); this.printHandler(values.map(v => this.stringify(v)).join(' ')); return null; }
  async visitBaleknoStmt(stmt) { let value = null; if (stmt.value !== null) value = await this.evaluate(stmt.value); throw new ReturnValue(value); }
  async visitVarStmt(stmt) {
    let value = null;
    if (stmt.initializer !== null) value = await this.evaluate(stmt.initializer);
    if (stmt.name.lexeme === "{destructuring}") { for (const { name, alias, defaultValue } of stmt.name.properties) { let propValue = value[name.lexeme]; if ((propValue === null || propValue === undefined) && defaultValue) propValue = await this.evaluate(defaultValue); this.environment.define(alias.lexeme, propValue); } }
    else if (stmt.name.lexeme === "[destructuring]") { for (let i = 0; i < stmt.name.elements.length; i++) this.environment.define(stmt.name.elements[i].lexeme, value[i]); }
    else this.environment.define(stmt.name.lexeme, value);
    return null;
  }
  async visitSelagiStmt(stmt) {
    try { while (this.isTruthy(await this.evaluate(stmt.condition))) { try { await this.execute(stmt.body); } catch (e) { if (e instanceof Break) { if (e.label === null || e.label === stmt._label) return null; throw e; } if (e instanceof Continue) { if (e.label === null || e.label === stmt._label) continue; throw e; } throw e; } } }
    catch (e) { if (e instanceof Break) { if (e.label === null || e.label === stmt._label) return null; throw e; } throw e; }
    return null;
  }
  async visitKanggoStmt(stmt) {
    const prev = this.environment; this.environment = new Environment(this.environment);
    try {
      if (stmt.initializer !== null) await this.execute(stmt.initializer);
      while (stmt.condition === null || this.isTruthy(await this.evaluate(stmt.condition))) {
        try { await this.execute(stmt.body); }
        catch (e) { if (e instanceof Break) { if (e.label === null || e.label === stmt._label) break; throw e; } if (e instanceof Continue) { if (e.label === null || e.label === stmt._label) { if (stmt.increment !== null) await this.evaluate(stmt.increment); continue; } throw e; } throw e; }
        if (stmt.increment !== null) await this.evaluate(stmt.increment);
      }
    } finally { this.environment = prev; }
    return null;
  }
  async visitLabeledStmt(stmt) {
    try { if (stmt.stmt instanceof AST.Selagi || stmt.stmt instanceof AST.Kanggo || stmt.stmt instanceof AST.ForOf || stmt.stmt instanceof AST.RentangStmt) stmt.stmt._label = stmt.name.lexeme; await this.execute(stmt.stmt); }
    catch (e) { if ((e instanceof Break || e instanceof Continue) && e.label === stmt.name.lexeme) return null; throw e; }
    return null;
  }
  visitMandekStmt(stmt) { throw new Break(stmt.label ? stmt.label.lexeme : null); }
  visitLanjutnoStmt(stmt) { throw new Continue(stmt.label ? stmt.label.lexeme : null); }
  async visitNgenteniStmt(stmt) {
    const amount = await this.evaluate(stmt.amount);
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error("Error: Ngenteni kudu angka positif.");
    }
    let ms = amount;
    if (stmt.unit) {
      const unit = stmt.unit.lexeme;
      switch (unit) {
        case 'detik': ms = amount * 1000; break;
        case 'menit': ms = amount * 60 * 1000; break;
        case 'jam': ms = amount * 60 * 60 * 1000; break;
        case 'dino': ms = amount * 24 * 60 * 60 * 1000; break;
      }
    }
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async _callValue(fn, args) { if (typeof fn === 'function') return await fn(...args); if (fn instanceof JawaCallable) return await fn.call(this, args); throw new Error("Error: dudu fungsi."); }
  async visitForOfStmt(stmt) {
    const iterable = await this.evaluate(stmt.iterable);
    const items = this.toIterable(iterable);
    const prev = this.environment; this.environment = new Environment(this.environment);
    try { for (const item of items) { try { if (stmt.isConst) this.environment.define(stmt.name.lexeme, item); else this.environment.values.set(stmt.name.lexeme, item); await this.execute(stmt.body); } catch (e) { if (e instanceof Break) { if (e.label === null || e.label === stmt._label) return null; throw e; } if (e instanceof Continue) { if (e.label === null || e.label === stmt._label) continue; throw e; } throw e; } } }
    finally { this.environment = prev; }
    return null;
  }
  async visitRentangStmt(stmt) {
    const start = await this.evaluate(stmt.start); let end = null;
    if (stmt.end !== null) end = await this.evaluate(stmt.end);
    const prev = this.environment; this.environment = new Environment(this.environment);
    try {
      if (end === null) { const items = this.toIterable(start); for (const item of items) { try { this.environment.values.set("iki", item); await this.execute(stmt.body); } catch (e) { if (e instanceof Break) { if (e.label === null || e.label === stmt._label) return null; throw e; } if (e instanceof Continue) { if (e.label === null || e.label === stmt._label) continue; throw e; } throw e; } } }
      else { for (let i = start; i <= end; i++) { try { this.environment.values.set("iki", i); await this.execute(stmt.body); } catch (e) { if (e instanceof Break) { if (e.label === null || e.label === stmt._label) return null; throw e; } if (e instanceof Continue) { if (e.label === null || e.label === stmt._label) continue; throw e; } throw e; } } }
    } finally { this.environment = prev; }
    return null;
  }
  toIterable(value) {
    if (value == null) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [...value];
    if (typeof value[Symbol.iterator] === 'function') return value;
    if (typeof value === 'object') { if (value instanceof Map || value instanceof Set) return [...value]; return Object.values(value); }
    return [value];
  }
  async visitCommandStmt(stmt) { return null; }
  async visitPilihStmt(stmt) {
    const value = await this.evaluate(stmt.expression); let executed = false;
    for (const cb of stmt.cases) { if (await this.evaluate(cb.value) === value) { try { await this.execute(cb.branch); executed = true; break; } catch (e) { if (e instanceof Break) { executed = true; break; } throw e; } } }
    if (!executed && stmt.defaultBranch !== null) await this.execute(stmt.defaultBranch);
    return null;
  }
  async visitCobakStmt(stmt) {
    try { await this.execute(stmt.tryBlock); }
    catch (e) { if (stmt.catchBranch !== null) { const env = new Environment(this.environment); env.define(stmt.catchVar.lexeme, e.message || e); await this.executeBlock(stmt.catchBranch.statements, env); } else throw e; }
    finally { if (stmt.finallyBranch !== null) await this.execute(stmt.finallyBranch); }
    return null;
  }
  async visitUncalenStmt(stmt) { const value = await this.evaluate(stmt.value); throw value; }
  async visitEnumStmt(stmt) {
    const name = stmt.name.lexeme;
    const enumObj = { jeneng: name, ikuEnum: (v) => stmt.variants.some(v2 => v2.value === v), jenenge: (v) => { for (const v2 of stmt.variants) if (v2.value === v) return v2.name.lexeme; return undefined; }, nilai: (nama) => { for (const v of stmt.variants) if (v.name.lexeme === nama) return v.value; return undefined; }, kabeh: () => stmt.variants.map(v => ({ jeneng: v.name.lexeme, nilai: v.value })), toString: () => `<enum ${name}>` };
    for (const v of stmt.variants) enumObj[v.name.lexeme] = v.value;
    this.environment.define(name, enumObj); return null;
  }
  async visitMetoknoStmt(stmt) { return null; }
  async visitJupuknoStmt(stmt) { return null; }
  async visitMatchStmt(stmt) {
    const value = await this.evaluate(stmt.expression);
    for (const arm of stmt.arms) { for (const pattern of arm.patterns) { const bindings = this.matchPattern(pattern, value); if (bindings !== null) {
      if (arm.guard !== null) { const prev = this.environment; this.environment = new Environment(this.environment); for (const [k, v] of Object.entries(bindings)) this.environment.values.set(k, v); const guardResult = await this.evaluate(arm.guard); this.environment = prev; if (!this.isTruthy(guardResult)) continue; }
      const prev = this.environment; this.environment = new Environment(this.environment); for (const [k, v] of Object.entries(bindings)) this.environment.values.set(k, v);
      try { await this.execute(arm.body); } finally { this.environment = prev; }
      return null;
    } } }
    if (stmt.defaultBranch !== null) await this.execute(stmt.defaultBranch);
    return null;
  }
  matchPattern(pattern, value) {
    if (pattern instanceof AST.WildcardPattern) return {};
    if (pattern instanceof AST.BindingPattern) return { [pattern.name.lexeme]: value };
    if (pattern instanceof AST.LiteralPattern) return pattern.value === value ? {} : null;
    if (pattern instanceof AST.ArrayPattern) {
      if (!Array.isArray(value)) return null;
      if (pattern.rest !== null) { if (value.length < pattern.elements.length) return null; const b = {}; for (let i = 0; i < pattern.elements.length; i++) { const s = this.matchPattern(pattern.elements[i], value[i]); if (s === null) return null; Object.assign(b, s); } if (pattern.rest instanceof AST.BindingPattern) b[pattern.rest.name.lexeme] = value.slice(pattern.elements.length); return b; }
      if (value.length !== pattern.elements.length) return null;
      const b = {}; for (let i = 0; i < pattern.elements.length; i++) { const s = this.matchPattern(pattern.elements[i], value[i]); if (s === null) return null; Object.assign(b, s); } return b;
    }
    if (pattern instanceof AST.ObjectPattern) {
      if (value === null || typeof value !== 'object') return null;
      const b = {}; for (const { key, pat } of pattern.properties) { if (!(key.lexeme in value)) return null; const s = this.matchPattern(pat, value[key.lexeme]); if (s === null) return null; Object.assign(b, s); } return b;
    }
    return null;
  }
  async visitAssignExpr(expr) {
    let value = await this.evaluate(expr.value); const oldValue = this.environment.get(expr.name);
    switch (expr.operator.type) { case TokenType.TAMBAH_KARO: value = oldValue + value; break; case TokenType.KURANG_KARO: value = oldValue - value; break; case TokenType.PING_KARO: value = oldValue * value; break; case TokenType.BAGI_KARO: value = oldValue / value; break; case TokenType.SISO_KARO: value = oldValue % value; break; }
    this.environment.assign(expr.name, value); return value;
  }
  async visitBinaryExpr(expr) {
    const left = await this.evaluate(expr.left); const right = await this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.LUWIH_GEDHE: return left > right; case TokenType.LUWIH_GEDHE_PODO: return left >= right;
      case TokenType.LUWIH_CILIK: return left < right; case TokenType.LUWIH_CILIK_PODO: return left <= right;
      case TokenType.GAK_PODO: return left != right; case TokenType.PODO: return left == right;
      case TokenType.GAK_PLEK: return left !== right; case TokenType.PLEK: return left === right;
      case TokenType.KURANG: return left - right; case TokenType.BAGI: return left / right;
      case TokenType.PING: return left * right; case TokenType.SISO: return left % right;
      case TokenType.PANGKAT: return Math.pow(left, right);
      case TokenType.TAMBAH: if (typeof left === "number" && typeof right === "number") return left + right; return this.stringify(left) + this.stringify(right);
    }
    return null;
  }
  async visitPostfixExpr(expr) { const left = await this.evaluate(expr.left); switch (expr.operator.type) { case TokenType.IKU_ONO: return left !== null && left !== undefined; case TokenType.IKU_ILANG: return left === null || left === undefined; } return null; }
  async visitLogicalExpr(expr) {
    const left = await this.evaluate(expr.left);
    if (expr.operator.type === TokenType.UTAWA) { if (this.isTruthy(left)) return left; }
    else if (expr.operator.type === TokenType.LAN) { if (!this.isTruthy(left)) return left; }
    else if (expr.operator.type === TokenType.UTOWO_YEN_KOSONG) { if (left !== null && left !== undefined) return left; }
    return await this.evaluate(expr.right);
  }
  async visitTernaryExpr(expr) { return this.isTruthy(await this.evaluate(expr.condition)) ? await this.evaluate(expr.thenExpr) : await this.evaluate(expr.elseExpr); }
  async visitCallExpr(expr) {
    const callee = await this.evaluate(expr.callee); const args = [];
    for (const argument of expr.args) { const val = await this.evaluate(argument); if (val instanceof JawaCallable) args.push((...nativeArgs) => val.call(this, nativeArgs)); else args.push(val); }
    if (typeof callee === "function") return await callee(...args);
    if (!(callee.call)) throw new Error(`[line ${expr.paren.line}] Error: Sing iso diceluk mung gawe (function) utowo kelas.`);
    if (args.length !== callee.arity()) throw new Error(`[line ${expr.paren.line}] Error: Kudune ${callee.arity()} argumen, tapi oleh ${args.length}.`);
    return await callee.call(this, args);
  }
  async visitGetExpr(expr) {
    const object = await this.evaluate(expr.object); const name = expr.name.lexeme;
    const methodMap = { 'petakake': 'map', 'saring': 'filter', 'urutake': 'sort', 'sambungake': 'join', 'dawane': 'length', 'dorong': 'push', 'jupukPungkasan': 'pop', 'geser': 'shift', 'tambahNgarep': 'unshift', 'iris': 'slice', 'gantien': 'replace', 'pecahen': 'split', 'gedekno': 'toUpperCase', 'cilikno': 'toLowerCase', 'temokake': 'find', 'temokakeIndeks': 'findIndex', 'indeksSaka': 'indexOf', 'saben': 'forEach', 'kurangi': 'reduce', 'ngemot': 'includes', 'walik': 'reverse', 'ana': 'some', 'kabeh': 'every', 'rapikno': 'trim', 'ratakan': 'flat', 'petakRata': 'flatMap', 'tes': 'test', 'cocokno': 'match', 'nambah': 'add', 'ukuran': 'size', 'hapus': 'delete', 'jupuk': 'get', 'pasang': 'set' };
    const mappedName = methodMap[name] || name;
    if (object instanceof JawaInstance) { if (name === "[]") return object.get(await this.evaluate(expr.name.index)); return object.get(expr.name); }
    if (object !== null && object !== undefined) {
      if (name === "[]") return object[await this.evaluate(expr.name.index)];
      if (Array.isArray(object) && ['map', 'filter', 'forEach', 'some', 'every', 'sort', 'reduce', 'find', 'findIndex', 'flat', 'flatMap'].includes(mappedName)) {
        if (mappedName === 'map') return async (cb) => { const r = []; for (let i = 0; i < object.length; i++) r.push(await cb(object[i], i, object)); return r; };
        if (mappedName === 'filter') return async (cb) => { const r = []; for (let i = 0; i < object.length; i++) { if (this.isTruthy(await cb(object[i], i, object))) r.push(object[i]); } return r; };
        if (mappedName === 'forEach') return async (cb) => { for (let i = 0; i < object.length; i++) await cb(object[i], i, object); };
        if (mappedName === 'some') return async (cb) => { for (let i = 0; i < object.length; i++) { if (this.isTruthy(await cb(object[i], i, object))) return true; } return false; };
        if (mappedName === 'every') return async (cb) => { for (let i = 0; i < object.length; i++) { if (!this.isTruthy(await cb(object[i], i, object))) return false; } return true; };
        if (mappedName === 'sort') return async (cb) => { const a = [...object]; for (let i = 0; i < a.length; i++) { for (let j = i + 1; j < a.length; j++) { const c = cb ? await cb(a[i], a[j]) : (a[i] > a[j] ? 1 : -1); if (c > 0) [a[i], a[j]] = [a[j], a[i]]; } } return a; };
        if (mappedName === 'reduce') return async (cb, init) => { let acc; let start = 0; if (init !== undefined) acc = init; else { acc = object[0]; start = 1; } for (let i = start; i < object.length; i++) acc = await cb(acc, object[i], i, object); return acc; };
        if (mappedName === 'find') return async (cb) => { for (let i = 0; i < object.length; i++) { if (this.isTruthy(await cb(object[i], i, object))) return object[i]; } return undefined; };
        if (mappedName === 'findIndex') return async (cb) => { for (let i = 0; i < object.length; i++) { if (this.isTruthy(await cb(object[i], i, object))) return i; } return -1; };
        if (mappedName === 'flat') return (d) => { const dd = d === undefined ? 1 : d; const r = []; const f = (a, dd) => { for (const i of a) { if (Array.isArray(i) && dd > 0) f(i, dd - 1); else r.push(i); } }; f(object, dd); return r; };
        if (mappedName === 'flatMap') return async (cb) => { const r = []; for (let i = 0; i < object.length; i++) { const res = await cb(object[i], i, object); if (Array.isArray(res)) r.push(...res); else r.push(res); } return r; };
      }
      const val = object[mappedName];
      if (typeof val === "function") return val.bind(object);
      return val;
    }
    throw new Error(`[line ${expr.name.line}] Error: Mung obyek sing duwe properti.`);
  }
  async visitSetExpr(expr) {
    const object = await this.evaluate(expr.object); const value = await this.evaluate(expr.value); const name = expr.name.lexeme;
    if (object instanceof JawaInstance) { if (name === "[]") object.set(await this.evaluate(expr.name.index), value); else object.set(expr.name, value); return value; }
    if (object !== null && object !== undefined) { if (name === "[]") object[await this.evaluate(expr.name.index)] = value; else object[name] = value; return value; }
    throw new Error(`[line ${expr.name.line}] Error: Mung obyek sing iso dipasang properti.`);
  }
  async visitThisExpr(expr) { return this.environment.get(expr.keyword); }
  async visitGroupingExpr(expr) { return await this.evaluate(expr.expression); }
  visitLiteralExpr(expr) { return expr.value; }
  async visitUnaryExpr(expr) {
    const right = await this.evaluate(expr.right);
    switch (expr.operator.type) { case TokenType.TAMBAH: return +right; case TokenType.KURANG: return -right; case TokenType.ORA: return !this.isTruthy(right); case TokenType.ENTENI: return await right; case TokenType.ASILNO: return right; }
    return null;
  }
  async visitVariableExpr(expr) { return this.environment.get(expr.name); }
  async visitArrayLiteralExpr(expr) { const els = []; for (const e of expr.elements) els.push(await this.evaluate(e)); return els; }
  async visitObjectLiteralExpr(expr) { const obj = {}; for (const [k, v] of expr.properties) obj[k] = await this.evaluate(v); return obj; }
  async visitRangeExpr(expr) {
    const start = await this.evaluate(expr.start); const end = await this.evaluate(expr.end);
    const inclusive = expr.inclusive; const len = end - start + (inclusive ? 1 : 0);
    return { [Symbol.iterator]() { return this; }, next() { if (this._idx === undefined) this._idx = 0; if (this._idx >= len) return { done: true }; return { value: start + this._idx++, done: false }; } };
  }
  async visitTupleExpr(expr) { const els = []; for (const e of expr.elements) els.push(await this.evaluate(e)); return Object.freeze(els); }
  async visitTemplateLiteralExpr(expr) {
    let result = "";
    for (let i = 0; i < expr.expressions.length; i++) { result += expr.strings[i]; const val = await this.evaluate(expr.expressions[i]); result += this.stringify(val); }
    result += expr.strings[expr.strings.length - 1]; return result;
  }
  async visitTaggedTemplateExpr(expr) {
    const tag = await this.evaluate(expr.tag); const template = expr.template; const strings = template.strings;
    const evaluated = []; for (const e of template.expressions) evaluated.push(await this.evaluate(e));
    if (typeof tag === 'function') return tag(strings, ...evaluated);
    if (tag instanceof JawaCallable) return await tag.call(this, [strings, ...evaluated]);
    throw new Error("Tag kudu function.");
  }
  isTruthy(object) { if (object === null || object === undefined) return false; if (typeof object === "boolean") return object; return true; }
  stringify(object) { if (object === null) return "kosong"; if (object === undefined) return "oraDidefinisikan"; if (Array.isArray(object)) return "[" + object.map(o => this.stringify(o)).join(", ") + "]"; return object.toString(); }
}

// ============= PUBLIC API =============
window.JPL = {
  run(code, outputCallback) {
    const outputLines = [];
    const printFn = (msg) => { outputLines.push(msg); if (outputCallback) outputCallback(msg); };
    try {
      const lexer = new Lexer(code);
      const tokens = lexer.scanTokens();
      const parser = new Parser(tokens);
      const statements = parser.parse();
      const interpreter = new Interpreter({ print: printFn, prompt: (msg) => window.prompt(msg) || "" });
      interpreter.interpret(statements);
      return { success: true, output: outputLines };
    } catch (error) {
      return { success: false, error: error.message, output: outputLines };
    }
  }
};
