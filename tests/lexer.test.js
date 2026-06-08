import { Lexer } from '../src/lexer.js';
import { TokenType } from '../src/tokens.js';

function lex(code) {
  return new Lexer(code).scanTokens();
}

function types(code) {
  return lex(code).map(t => t.type);
}

function literal(code, index = 0) {
  return lex(code)[index].literal;
}

function error(code) {
  try { new Lexer(code).scanTokens(); return null; }
  catch (e) { return e.message; }
}

describe('Lexer', () => {
  describe('single character tokens', () => {
    test('parentheses', () => {
      expect(types('()')).toEqual([TokenType.LEFT_PAREN, TokenType.RIGHT_PAREN, TokenType.EOF]);
    });
    test('braces', () => {
      expect(types('{}')).toEqual([TokenType.TERUS, TokenType.MBARI, TokenType.EOF]);
    });
    test('brackets', () => {
      expect(types('[]')).toEqual([TokenType.LEFT_BRACKET, TokenType.RIGHT_BRACKET, TokenType.EOF]);
    });
    test('punctuation', () => {
      expect(types(',;:.')).toEqual([
        TokenType.COMMA, TokenType.SEMICOLON, TokenType.COLON, TokenType.DOT, TokenType.EOF
      ]);
    });
  });

  describe('operators', () => {
    test('arithmetic symbol', () => {
      const t = lex('+ - * /');
      expect(t[0].type).toBe(TokenType.TAMBAH);
      expect(t[1].type).toBe(TokenType.KURANG);
      expect(t[2].type).toBe(TokenType.PING);
      expect(t[3].type).toBe(TokenType.BAGI);
    });
    test('power via keyword', () => {
      const t = lex('2 pangkat 3');
      expect(t[0].type).toBe(TokenType.NUMBER);
      expect(t[1].type).toBe(TokenType.PANGKAT);
      expect(t[2].type).toBe(TokenType.NUMBER);
    });
    test('assignment', () => {
      expect(types('=')).toEqual([TokenType.YOIKU, TokenType.EOF]);
    });
    test('compound assignment', () => {
      const t = lex('+= -= *= /=');
      expect(t[0].type).toBe(TokenType.TAMBAH_KARO);
      expect(t[1].type).toBe(TokenType.KURANG_KARO);
      expect(t[2].type).toBe(TokenType.PING_KARO);
      expect(t[3].type).toBe(TokenType.BAGI_KARO);
    });
    test('modulo via keyword siso', () => {
      const t = lex('10 siso 3');
      expect(t[0].type).toBe(TokenType.NUMBER);
      expect(t[1].type).toBe(TokenType.SISO);
      expect(t[2].type).toBe(TokenType.NUMBER);
    });
    test('comparison', () => {
      const t = lex('=== = == != !== > < >=');
      expect(t[0].type).toBe(TokenType.PLEK);
      expect(t[2].type).toBe(TokenType.PODO);
      expect(t[3].type).toBe(TokenType.GAK_PODO);
    });
    test('logical via keywords', () => {
      const t = lex('lan utawa ora');
      expect(t[0].type).toBe(TokenType.LAN);
      expect(t[1].type).toBe(TokenType.UTAWA);
      expect(t[2].type).toBe(TokenType.ORA);
    });
    test('bitwise via keywords', () => {
      const t = lex('lanbit utawabit xor walik geserKiwo geserTengen geserTengenNol');
      expect(t[0].type).toBe(TokenType.LANBIT);
      expect(t[1].type).toBe(TokenType.UTAWABIT);
      expect(t[2].type).toBe(TokenType.XOR);
      expect(t[3].type).toBe(TokenType.WALIK);
      expect(t[4].type).toBe(TokenType.GESER_KIWO);
      expect(t[5].type).toBe(TokenType.GESER_TENGEN);
      expect(t[6].type).toBe(TokenType.GESER_TENGEN_NOL);
    });
    test('nullish coalescing', () => {
      const t = lex('??');
      expect(t[0].type).toBe(TokenType.UTOWO_YEN_KOSONG);
    });
    test('ternary', () => {
      expect(types('?')).toEqual([TokenType.TA, TokenType.EOF]);
    });
    test('dot dot', () => {
      expect(types('..')).toEqual([TokenType.DOT_DOT, TokenType.EOF]);
    });
  });

  describe('numbers', () => {
    test('integer', () => {
      const t = lex('42');
      expect(t[0].type).toBe(TokenType.NUMBER);
      expect(t[0].literal).toBe(42);
    });
    test('float', () => {
      expect(literal('3.14')).toBe(3.14);
    });
    test('numeric separator', () => {
      expect(literal('1_000_000')).toBe(1000000);
    });
    test('numeric separator in float', () => {
      expect(literal('1_000.5')).toBe(1000.5);
    });
    test('negative via operator', () => {
      const t = lex('-5');
      expect(t[0].type).toBe(TokenType.KURANG);
      expect(t[1].type).toBe(TokenType.NUMBER);
      expect(t[1].literal).toBe(5);
    });
  });

  describe('strings', () => {
    test('double quoted', () => {
      expect(literal('"halo"')).toBe('halo');
    });
    test('single quoted', () => {
      expect(literal("'dunia'")).toBe('dunia');
    });
    test('escape sequences', () => {
      expect(literal('"a\\nb"')).toBe('a\nb');
      expect(literal('"a\\tb"')).toBe('a\tb');
      expect(literal('"a\\\\b"')).toBe('a\\b');
      expect(literal('"a\\"b"')).toBe('a"b');
    });
    test('unterminated string', () => {
      expect(error('"no end')).toMatch(/Unterminated string/);
    });
  });

  describe('raw strings', () => {
    test('basic raw string', () => {
      const t = lex('r"C:\\path\\file"');
      expect(t[0].type).toBe(TokenType.RAW_STRING);
      expect(t[0].literal).toBe('C:\\path\\file');
    });
    test('unterminated raw string', () => {
      expect(error("r'no end")).toMatch(/Unterminated raw string/);
    });
  });

  describe('regex', () => {
    test('basic regex', () => {
      const t = lex('/abc/');
      expect(t[0].type).toBe(TokenType.REGEX);
      expect(t[0].literal.pattern).toBe('abc');
    });
    test('regex with flags', () => {
      const t = lex('/abc/gi');
      expect(t[0].literal.pattern).toBe('abc');
      expect(t[0].literal.flags).toBe('gi');
    });
    test('regex with special chars', () => {
      const t = lex('/\\d+/g');
      expect(t[0].literal.pattern).toBe('\\d+');
      expect(t[0].literal.flags).toBe('g');
    });
    test('regex after identifier becomes division', () => {
      // regexAllowed is false after identifier
      const t = lex('x / abc/');
      expect(t[0].type).toBe(TokenType.IDENTIFIER);
      expect(t[1].type).toBe(TokenType.BAGI);
      expect(t[2].type).toBe(TokenType.IDENTIFIER);
    });
    test('unterminated regex', () => {
      expect(error('/abc')).toMatch(/Unterminated regex/);
    });
    test('regex closing at end of input', () => {
      const t = lex('/abc/');
      expect(t[0].type).toBe(TokenType.REGEX);
    });
  });

  describe('template literals', () => {
    test('basic template', () => {
      const t = lex('`halo`');
      expect(t[0].type).toBe(TokenType.TEMPLATE);
    });
    test('template with interpolation', () => {
      const t = lex('`${x}`');
      expect(t[0].type).toBe(TokenType.TEMPLATE);
      expect(t[0].literal.expressions[0]).toBe('x');
    });
    test('unterminated template', () => {
      expect(error('`no end')).toMatch(/Unterminated template/);
    });
  });

  describe('identifiers and keywords', () => {
    test('identifier', () => {
      const t = lex('nama');
      expect(t[0].type).toBe(TokenType.IDENTIFIER);
      expect(t[0].lexeme).toBe('nama');
    });
    test('keywords', () => {
      expect(lex('jarno')[0].type).toBe(TokenType.JARNO);
      expect(lex('lek')[0].type).toBe(TokenType.LEK);
      expect(lex('selagi')[0].type).toBe(TokenType.SELAGI);
      expect(lex('kanggo')[0].type).toBe(TokenType.KANGGO);
      expect(lex('gawe')[0].type).toBe(TokenType.GAWE);
      expect(lex('balekno')[0].type).toBe(TokenType.BALEKNO);
      expect(lex('cetakno')[0].type).toBe(TokenType.CETAKNO);
      expect(lex('tenan')[0].type).toBe(TokenType.TENAN);
      expect(lex('gak')[0].type).toBe(TokenType.GAK);
      expect(lex('kosong')[0].type).toBe(TokenType.KOSONG);
      expect(lex('iki')[0].type).toBe(TokenType.IKI);
    });
    test('multi-word keywords', () => {
      const t1 = lex('iki iku');
      expect(t1[0].type).toBe(TokenType.IKI_IKU);
      const t2 = lex('lek misale');
      expect(t2[0].type).toBe(TokenType.LEK_MISALE);
      const t3 = lex('lek gak');
      expect(t3[0].type).toBe(TokenType.LEK_GAK);
    });
  });

  describe('slash commands', () => {
    test('/clear', () => {
      const t = lex('/clear');
      expect(t[0].type).toBe(TokenType.CLEAR);
    });
    test('/credits', () => {
      const t = lex('/credits');
      expect(t[0].type).toBe(TokenType.CREDITS);
    });
    test('/clear/gi is regex, not command', () => {
      const t = lex('/clear/gi');
      expect(t[0].type).toBe(TokenType.REGEX);
    });
    test('x / y is division', () => {
      const t = lex('x / y');
      expect(t[0].type).toBe(TokenType.IDENTIFIER);
      expect(t[1].type).toBe(TokenType.BAGI);
      expect(t[2].type).toBe(TokenType.IDENTIFIER);
    });
  });

  describe('line comments', () => {
    test('// comment', () => {
      const t = lex('// ini komentar\nx');
      expect(t).toHaveLength(2);
      expect(t[0].type).toBe(TokenType.IDENTIFIER);
    });
    test('// at end of input', () => {
      const t = lex('// only comment');
      expect(t).toHaveLength(1);
    });
    test('/* block comment', () => {
      const t = lex('/* block comment */ x');
      expect(t).toHaveLength(2);
      expect(t[0].type).toBe(TokenType.IDENTIFIER);
      expect(t[0].lexeme).toBe('x');
    });
    test('/* unclosed', () => {
      const t = lex('/* unclosed');
      expect(t).toHaveLength(1);
      expect(t[0].type).toBe(TokenType.EOF);
    });
  });

  describe('whitespace and newlines', () => {
    test('newlines increment line number', () => {
      const t = lex('x\ny');
      expect(t[1].line).toBe(2);
    });
    test('empty input', () => {
      const t = lex('');
      expect(t).toHaveLength(1);
      expect(t[0].type).toBe(TokenType.EOF);
    });
  });

  describe('errors', () => {
    test('unexpected character', () => {
      expect(error('@')).toMatch(/Unexpected character/);
    });
  });
});
