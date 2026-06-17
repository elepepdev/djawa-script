import { Lexer } from '../src/lexer.js';
import { Parser } from '../src/parser.js';
import { TokenType } from '../src/tokens.js';
import * as AST from '../src/ast.js';

function parse(code) {
  const lexer = new Lexer(code);
  const tokens = lexer.scanTokens();
  const parser = new Parser(tokens);
  return parser.parse();
}

function first(code) {
  return parse(code)[0];
}

describe('Parser', () => {
  describe('variable declarations', () => {
    test('jarno with initializer', () => {
      const stmt = first('jarno x yoiku 5');
      expect(stmt).toBeInstanceOf(AST.Var);
      expect(stmt.name.lexeme).toBe('x');
      expect(stmt.initializer).toBeInstanceOf(AST.Literal);
      expect(stmt.isConst).toBe(false);
    });
    test('iki iku (const)', () => {
      const stmt = first('iki iku x yoiku 10');
      expect(stmt).toBeInstanceOf(AST.Var);
      expect(stmt.isConst).toBe(true);
    });
    test('without initializer', () => {
      const stmt = first('jarno x');
      expect(stmt).toBeInstanceOf(AST.Var);
      expect(stmt.initializer).toBeNull();
    });
    test('multiple vars without semicolon', () => {
      const stmts = parse('jarno x yoiku 1 jarno y yoiku 2');
      expect(stmts).toHaveLength(2);
    });
  });

  describe('expression statements', () => {
    test('binary expression', () => {
      const stmt = first('x + 5');
      expect(stmt).toBeInstanceOf(AST.Expression);
      expect(stmt.expression).toBeInstanceOf(AST.Binary);
    });
    test('assignment expression', () => {
      const stmt = first('x yoiku 5');
      expect(stmt).toBeInstanceOf(AST.Expression);
      expect(stmt.expression).toBeInstanceOf(AST.Assign);
    });
  });

  describe('block statements', () => {
    test('block with body', () => {
      const stmts = parse('terus jarno x yoiku 1 mbari');
      expect(stmts).toHaveLength(1);
      expect(stmts[0]).toBeInstanceOf(AST.Block);
      expect(stmts[0].statements).toHaveLength(1);
    });
    test('empty block', () => {
      const stmts = parse('terus mbari');
      expect(stmts[0]).toBeInstanceOf(AST.Block);
      expect(stmts[0].statements).toHaveLength(0);
    });
  });

  describe('conditional statements', () => {
    test('lek with parens', () => {
      const stmt = first('lek (x > 5) terus cetakno("ok") mbari');
      expect(stmt).toBeInstanceOf(AST.Lek);
      expect(stmt.condition).toBeInstanceOf(AST.Binary);
      expect(stmt.elseBranch).toBeNull();
    });
    test('lek without parens', () => {
      const stmt = first('lek x > 5 terus cetakno("ok") mbari');
      expect(stmt).toBeInstanceOf(AST.Lek);
    });
    test('lek misale (else if)', () => {
      const stmt = first('lek x > 5 terus cetakno(">5") mbari lek misale x > 3 terus cetakno(">3") mbari');
      expect(stmt.elseIfBranches).toHaveLength(1);
      expect(stmt.elseBranch).toBeNull();
    });
    test('liyane (else)', () => {
      const stmt = first('lek x > 5 terus cetakno(">5") mbari liyane terus cetakno("<=5") mbari');
      expect(stmt.elseBranch).not.toBeNull();
    });
  });

  describe('loops', () => {
    test('selagi (while)', () => {
      const stmt = first('selagi x < 10 terus x yoiku x + 1 mbari');
      expect(stmt).toBeInstanceOf(AST.Selagi);
    });
    test('kanggo (for)', () => {
      const stmt = first('kanggo (jarno i yoiku 0 banjur i luwihCilik 10 banjur i yoiku i tambah 1) terus cetakno(i) mbari');
      expect(stmt).toBeInstanceOf(AST.Kanggo);
    });
    test('kanggo soko (for-of with range)', () => {
      const stmt = first('kanggo jarno i soko 1..10 terus cetakno(i) mbari');
      expect(stmt).toBeInstanceOf(AST.ForOf);
    });
    test('kanggo soko with rentang prefix', () => {
      const stmt = first('kanggo jarno i soko rentang 1..10 terus cetakno(i) mbari');
      expect(stmt).toBeInstanceOf(AST.ForOf);
    });
    test('mandek (break)', () => {
      const stmt = first('mandek');
      expect(stmt).toBeInstanceOf(AST.Mandek);
    });
    test('lanjutno (continue)', () => {
      const stmt = first('lanjutno');
      expect(stmt).toBeInstanceOf(AST.Lanjutno);
    });
  });

  describe('function declaration', () => {
    test('gawe (function)', () => {
      const stmt = first('gawe tambah(a, b) terus balekno a + b mbari');
      expect(stmt).toBeInstanceOf(AST.Gawe);
      expect(stmt.name.lexeme).toBe('tambah');
      expect(stmt.params).toHaveLength(2);
    });
    test('balekno (return)', () => {
      const stmt = first('gawe f() terus balekno 5 mbari');
      const bodyStmts = stmt.body.statements;
      expect(bodyStmts[bodyStmts.length - 1]).toBeInstanceOf(AST.Balekno);
    });
  });

  describe('class declaration', () => {
    test('kelas (class)', () => {
      const stmt = first('kelas Mobil terus wujudno(merek) terus iki.merek yoiku merek mbari mbari');
      expect(stmt).toBeInstanceOf(AST.Kelas);
      expect(stmt.name.lexeme).toBe('Mobil');
    });
    test('katutup kelas (sealed class Javanese)', () => {
      const stmt = first('katutup kelas Bentuk terus wujudno() terus mbari mbari');
      expect(stmt).toBeInstanceOf(AST.Kelas);
      expect(stmt.isSealed).toBe(true);
    });
    test('non-sealed class', () => {
      const stmt = first('kelas Bar terus wujudno() terus mbari mbari');
      expect(stmt).toBeInstanceOf(AST.Kelas);
      expect(stmt.isSealed).toBe(false);
    });
    test('abstrak kelas (abstract class Javanese)', () => {
      const stmt = first('abstrak kelas Shape terus abstrak gawe area() mbari');
      expect(stmt).toBeInstanceOf(AST.Kelas);
      expect(stmt.isAbstract).toBe(true);
      expect(stmt.methods[0].isAbstract).toBe(true);
    });
    test('non-abstract class', () => {
      const stmt = first('kelas Bar terus wujudno() terus mbari mbari');
      expect(stmt).toBeInstanceOf(AST.Kelas);
      expect(stmt.isAbstract).toBe(false);
    });
    test('struktur (struct Javanese)', () => {
      const stmt = first('struktur Titik terus x, y mbari');
      expect(stmt).toBeInstanceOf(AST.Struktur);
      expect(stmt.name.lexeme).toBe('Titik');
      expect(stmt.fields.map(f => f.lexeme)).toEqual(['x', 'y']);
    });
    test('struktur with single field', () => {
      const stmt = first('struktur Box terus value mbari');
      expect(stmt).toBeInstanceOf(AST.Struktur);
      expect(stmt.fields.map(f => f.lexeme)).toEqual(['value']);
    });
  });

  describe('try/catch/throw', () => {
    test('cobak (try)', () => {
      const stmt = first('cobak terus uncalen "err" mbari nyekel e terus cetakno(e) mbari');
      expect(stmt).toBeInstanceOf(AST.Cobak);
      expect(stmt.catchVar.lexeme).toBe('e');
    });
    test('uncalen (throw)', () => {
      const stmt = first('uncalen "error"');
      expect(stmt).toBeInstanceOf(AST.Uncalen);
    });
  });

  describe('switch and match', () => {
    test('pilih (switch)', () => {
      const stmt = first('pilih x terus kalo 1: cetakno("siji") yowes: cetakno("liyane") mbari');
      expect(stmt).toBeInstanceOf(AST.Pilih);
    });
    test('cocok (match) with terus', () => {
      const stmt = first('cocok x terus kalo 1 terus cetakno("siji") mbari yowes terus cetakno("liyane") mbari mbari');
      expect(stmt).toBeInstanceOf(AST.MatchStmt);
    });
  });

  describe('expressions', () => {
    test('binary addition', () => {
      const expr = first('x + y');
      expect(expr.expression).toBeInstanceOf(AST.Binary);
    });
    test('unary negation', () => {
      const expr = first('-5');
      expect(expr.expression).toBeInstanceOf(AST.Unary);
    });
    test('grouping', () => {
      const expr = first('(x + 5)');
      expect(expr.expression).toBeInstanceOf(AST.Grouping);
    });
    test('ternary', () => {
      const expr = first('x ta 1 lek gak 2');
      expect(expr.expression).toBeInstanceOf(AST.Ternary);
    });
    test('array literal', () => {
      const expr = first('[1, 2, 3]');
      expect(expr.expression).toBeInstanceOf(AST.ArrayLiteral);
    });
    test('object literal', () => {
      const stmt = first('jarno x yoiku terus jeneng: "Joko" mbari');
      expect(stmt.initializer).toBeInstanceOf(AST.ObjectLiteral);
    });
    test('tuple', () => {
      const expr = first('tuple(1, 2)');
      expect(expr.expression).toBeInstanceOf(AST.Tuple);
    });
    test('template literal', () => {
      const expr = first('`halo ${nama}`');
      expect(expr.expression).toBeInstanceOf(AST.TemplateLiteral);
    });
    test('tagged template', () => {
      const stmt = first('func`halo ${nama}`');
      expect(stmt.expression).toBeInstanceOf(AST.TaggedTemplate);
      expect(stmt.expression.tag).toBeInstanceOf(AST.Variable);
      expect(stmt.expression.tag.name.lexeme).toBe('func');
      expect(stmt.expression.template).toBeInstanceOf(AST.TemplateLiteral);
    });
    test('tagged template with get expression', () => {
      const stmt = first('obj.method`halo ${nama}`');
      expect(stmt.expression).toBeInstanceOf(AST.TaggedTemplate);
      expect(stmt.expression.tag).toBeInstanceOf(AST.Get);
      expect(stmt.expression.template).toBeInstanceOf(AST.TemplateLiteral);
    });
    test('range', () => {
      const expr = first('1..10');
      expect(expr.expression).toBeInstanceOf(AST.RangeExpr);
    });
  });

  describe('precedence', () => {
    test('multiplication before addition', () => {
      const expr = first('1 + 2 * 3').expression;
      expect(expr).toBeInstanceOf(AST.Binary);
      expect(expr.operator.type).toBe(TokenType.TAMBAH);
      expect(expr.right).toBeInstanceOf(AST.Binary);
      expect(expr.right.operator.type).toBe(TokenType.PING);
    });
    test('comparison before logical', () => {
      const expr = first('x > 5 lan y < 3').expression;
      expect(expr).toBeInstanceOf(AST.Logical);
      expect(expr.left).toBeInstanceOf(AST.Binary);
    });
  });

  describe('paren-optional syntax', () => {
    test('lek without parens', () => {
      const stmt = first('lek x > 5 terus cetakno("ok") mbari');
      expect(stmt).toBeInstanceOf(AST.Lek);
    });
    test('selagi without parens', () => {
      const stmt = first('selagi x < 10 terus x yoiku x + 1 mbari');
      expect(stmt).toBeInstanceOf(AST.Selagi);
    });
    test('cetakno without parens', () => {
      const stmt = first('cetakno "halo"');
      expect(stmt).toBeInstanceOf(AST.Cetakno);
    });
    test('cetakno multi-arg without parens', () => {
      const stmt = first('cetakno "a", "b", "c"');
      expect(stmt.expressions).toHaveLength(3);
    });
  });

  describe('arrow functions', () => {
    test('lakoni (arrow) with expr body', () => {
      const stmt = first('jarno f yoiku x lakoni x * 2');
      expect(stmt.initializer).toBeInstanceOf(AST.Gawe);
    });
  });

  describe('destructuring', () => {
    test('object destructuring', () => {
      const stmt = first('jarno terus x, y mbari yoiku point');
      expect(stmt).toBeInstanceOf(AST.Var);
      expect(stmt.name.lexeme).toBe('{destructuring}');
    });
    test('array destructuring', () => {
      const stmt = first('jarno [a, b] yoiku arr');
      expect(stmt.name.lexeme).toBe('[destructuring]');
    });
  });

  describe('edge cases', () => {
    test('empty source', () => {
      const stmts = parse('');
      expect(stmts).toHaveLength(0);
    });
    test('only whitespace', () => {
      const stmts = parse('   \n  ');
      expect(stmts).toHaveLength(0);
    });
    test('optional semicolons between statements', () => {
      const stmts = parse('jarno x yoiku 1 jarno y yoiku 2');
      expect(stmts).toHaveLength(2);
    });
  });

  describe('label (break/continue)', () => {
    test('labeled loop', () => {
      const stmt = first('luar: selagi x < 10 terus x yoiku x + 1 mbari');
      expect(stmt).toBeInstanceOf(AST.LabeledStmt);
      expect(stmt.name.lexeme).toBe('luar');
      expect(stmt.stmt).toBeInstanceOf(AST.Selagi);
    });
    test('labeled break', () => {
      const stmt = first('kanggo (jarno i yoiku 0 banjur i luwihCilik 10 banjur i yoiku i tambah 1) terus'
          + ' mandek luar mbari');
      const body = stmt.body.statements;
      expect(body[0]).toBeInstanceOf(AST.Mandek);
      expect(body[0].label.lexeme).toBe('luar');
    });
    test('labeled continue', () => {
      const stmt = first('kanggo (jarno i yoiku 0 banjur i luwihCilik 10 banjur i yoiku i tambah 1) terus'
          + ' lanjutno luar mbari');
      const body = stmt.body.statements;
      expect(body[0]).toBeInstanceOf(AST.Lanjutno);
      expect(body[0].label.lexeme).toBe('luar');
    });
    test('unlabeled break', () => {
      const stmt = first('kanggo (jarno i yoiku 0 banjur i luwihCilik 10 banjur i yoiku i tambah 1) terus'
          + ' mandek mbari');
      const body = stmt.body.statements;
      expect(body[0]).toBeInstanceOf(AST.Mandek);
      expect(body[0].label).toBeNull();
    });
    test('labeled block', () => {
      const stmt = first('luar: terus cetakno("halo") mbari');
      expect(stmt).toBeInstanceOf(AST.LabeledStmt);
      expect(stmt.name.lexeme).toBe('luar');
    });
  });

  describe('interface (wangun)', () => {
    test('wangun declaration', () => {
      const stmt = first('wangun Kendaraan terus'
          + ' gawe nyopir() terus balekno Teks mbari'
          + ' gawe mandek() terus balekno Teks mbari mbari');
      expect(stmt).toBeInstanceOf(AST.WangunStmt);
      expect(stmt.name.lexeme).toBe('Kendaraan');
      expect(stmt.methods).toHaveLength(2);
      expect(stmt.methods[0].name.lexeme).toBe('nyopir');
      expect(stmt.methods[1].name.lexeme).toBe('mandek');
    });
    test('class implements interface (nurut)', () => {
      const stmts = parse('wangun IFace terus'
          + ' gawe foo() terus balekno Kosong mbari mbari '
          + 'kelas MyClass nurut IFace terus'
          + ' gawe foo() terus balekno kosong mbari mbari');
      expect(stmts[0]).toBeInstanceOf(AST.WangunStmt);
      expect(stmts[1]).toBeInstanceOf(AST.Kelas);
      expect(stmts[1].interfaces).toHaveLength(1);
      expect(stmts[1].interfaces[0].name.lexeme).toBe('IFace');
    });
    test('class implements multiple interfaces', () => {
      const stmts = parse('wangun A terus gawe a() terus balekno Kosong mbari mbari '
          + 'wangun B terus gawe b() terus balekno Kosong mbari mbari '
          + 'kelas C nurut A, B terus'
          + ' gawe a() terus balekno kosong mbari'
          + ' gawe b() terus balekno kosong mbari mbari');
      expect(stmts[2].interfaces).toHaveLength(2);
    });
  });

  describe('ngenteni (sleep)', () => {
    test('ngenteni with parens (seconds default)', () => {
      const stmt = first('ngenteni(1000)');
      expect(stmt).toBeInstanceOf(AST.Ngenteni);
      expect(stmt.amount).toBeInstanceOf(AST.Literal);
      expect(stmt.amount.value).toBe(1000);
      expect(stmt.unit).toBeNull();
    });
    test('ngenteni without parens (seconds default)', () => {
      const stmt = first('ngenteni 500');
      expect(stmt).toBeInstanceOf(AST.Ngenteni);
      expect(stmt.amount).toBeInstanceOf(AST.Literal);
      expect(stmt.amount.value).toBe(500);
      expect(stmt.unit).toBeNull();
    });
    test('ngenteni with detik unit', () => {
      const stmt = first('ngenteni 5 detik');
      expect(stmt).toBeInstanceOf(AST.Ngenteni);
      expect(stmt.amount.value).toBe(5);
      expect(stmt.unit).not.toBeNull();
      expect(stmt.unit.lexeme).toBe('detik');
    });
    test('ngenteni with menit unit', () => {
      const stmt = first('ngenteni 2 menit');
      expect(stmt).toBeInstanceOf(AST.Ngenteni);
      expect(stmt.unit.lexeme).toBe('menit');
    });
    test('ngenteni with jam unit', () => {
      const stmt = first('ngenteni 1 jam');
      expect(stmt).toBeInstanceOf(AST.Ngenteni);
      expect(stmt.unit.lexeme).toBe('jam');
    });
    test('ngenteni with dino unit', () => {
      const stmt = first('ngenteni 3 dino');
      expect(stmt).toBeInstanceOf(AST.Ngenteni);
      expect(stmt.unit.lexeme).toBe('dino');
    });
    test('ngenteni with expression amount', () => {
      const stmt = first('ngenteni (1 tambah 2) detik');
      expect(stmt).toBeInstanceOf(AST.Ngenteni);
      expect(stmt.amount).toBeInstanceOf(AST.Binary);
      expect(stmt.unit.lexeme).toBe('detik');
    });
    test('ngenteni with variable amount', () => {
      const stmt = first('ngenteni waktu detik');
      expect(stmt).toBeInstanceOf(AST.Ngenteni);
      expect(stmt.amount).toBeInstanceOf(AST.Variable);
      expect(stmt.unit.lexeme).toBe('detik');
    });
  });
});
