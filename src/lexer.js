import { TokenType, Keywords } from './tokens.js';

export class Token {
  constructor(type, lexeme, literal, line) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }
}

const JS_RESERVED = new Set([
  'let', 'const', 'var',
  'function',
  'if', 'else',
  'for', 'while', 'do',
  'class', 'extends',
  'new', 'this',
  'import', 'export',
  'switch',
  'typeof', 'instanceof', 'void',
  'async', 'await', 'yield',
  'true', 'false', 'null', 'undefined',
  'debugger',
  'interface', 'implements', 'package',
  'private', 'protected', 'public',
  'with',
]);

export class Lexer {
  constructor(source) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.regexAllowed = true; // true at start of expression
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
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
      case '-':
        if (this.match('-')) {
          throw new Error(`[line ${this.line}] Error: Gunakake 'kurang 1' tinimbang '--'`);
        }
        this.addToken(TokenType.KURANG);
        break;
      case '+':
        if (this.match('+')) {
          throw new Error(`[line ${this.line}] Error: Gunakake 'tambah 1' tinimbang '++'`);
        }
        this.addToken(TokenType.TAMBAH);
        break;
      case '*': this.addToken(TokenType.PING); break;
      case '/':
        if (this.match('/')) {
          while (this.peek() !== '\n' && !this.isAtEnd()) this.advance();
        } else if (this.match('*')) {
          while (!this.isAtEnd()) {
            if (this.advance() === '*' && this.peek() === '/') { this.advance(); break; }
          }
        } else if (this.isAlpha(this.peek())) {
          // Slash command (/clear, /credits) or regex /word/ or bare /
          const savedCurrent = this.current;
          while (this.isAlpha(this.peek())) this.advance();
          const word = this.source.substring(this.start + 1, this.current);

          if ((word === 'clear' || word === 'credits') && !this.isAlphaNumeric(this.peek())) {
            // Check for closing '/' — if present, it's regex /clear/gi, not a command
            let temp = this.current;
            while (temp < this.source.length && (this.source[temp] === ' ' || this.source[temp] === '\t' || this.source[temp] === '\n')) temp++;
            if (temp < this.source.length && this.source[temp] === '/') {
              this.current = savedCurrent;
              this.regex();
            } else {
              if (word === 'clear') this.addToken(TokenType.CLEAR);
              else this.addToken(TokenType.CREDITS);
            }
          } else {
            // Not a known command — backtrack and handle normally
            this.current = savedCurrent;
            if (this.regexAllowed) {
              this.regex();
            } else {
              this.addToken(TokenType.BAGI);
            }
          }
        } else if (this.regexAllowed) {
          this.regex();
        } else {
          this.addToken(TokenType.BAGI);
        }
        break;
      case '=': throw new Error(`[line ${this.line}] Error: Gunakake 'yoiku' tinimbang '=' kanggo assignment`);
      case '<': this.addToken(this.match('=') ? TokenType.LUWIH_CILIK_PODO : TokenType.LUWIH_CILIK); break;
      case '>': this.addToken(this.match('=') ? TokenType.LUWIH_GEDHE_PODO : TokenType.LUWIH_GEDHE); break;
      case '!':
        if (this.match('=')) {
          throw new Error(`[line ${this.line}] Error: Gunakake 'gakPodo' / 'gakPlek' tinimbang '!=' / '!=='`);
        }
        this.addToken(TokenType.ORA);
        break;
      case '?':
        if (this.match('?')) {
          this.addToken(TokenType.UTOWO_YEN_KOSONG);
        } else {
          throw new Error(`[line ${this.line}] Error: Gunakake 'ta' tinimbang '?' kanggo ternary`);
        }
        break;
      case '%': this.addToken(TokenType.SISO); break;
      case ' ':
      case '\r':
      case '\t':
        break;
      case '\n':
        this.line++;
        break;
      case '"':
      case "'":
        this.string(c); break;
      case '`':
        this.template(); break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          throw new Error(`[line ${this.line}] Error: Karakter '${c}' ora dingerteni`);
        }
        break;
    }
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    let text = this.source.substring(this.start, this.current);

    // Check for raw string literal: r"..." or r'...' (only single 'r' followed by quote)
    if (text === 'r' && (this.peek() === '"' || this.peek() === "'")) {
      this.rawString(this.peek());
      return;
    }

    // Check for multi-word keywords (bounded to 2 words max for JPL)
    const savedCurrent = this.current;
    const savedTokensLength = this.tokens.length;

    let tempCurrent = this.current;
    let combinedText = text;
    let wordCount = 1;
    const maxWords = 2; // JPL keywords max 2 words

    // Greedily try to match longer multi-word keywords with bounded lookahead
    while (wordCount < maxWords && this.source.charAt(tempCurrent) === ' ') {
        tempCurrent++;
        let nextWordStart = tempCurrent;
        while (this.isAlphaNumeric(this.source.charAt(tempCurrent))) tempCurrent++;
        let nextWord = this.source.substring(nextWordStart, tempCurrent);
        if (!nextWord) break;

        const candidate = combinedText + " " + nextWord;
        if (Keywords[candidate]) {
            text = candidate;
            combinedText = candidate;
            this.current = tempCurrent;
            wordCount++;
        } else {
            break; // Stop if not a valid keyword
        }
    }

    let type = Keywords[text];
    if (type === undefined) {
      if (JS_RESERVED.has(text)) {
        throw new Error(`[line ${this.line}] Error: '${text}' iku JavaScript, dudu DjawaScript. Gunakake padanan DjawaScript.`);
      }
      type = TokenType.IDENTIFIER;
    }
    this.addToken(type);
  }

  rawString(quote) {
    this.advance();
    let value = "";
    while (this.peek() !== quote && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      value += this.advance();
    }
    if (this.isAtEnd()) throw new Error("Unterminated raw string.");
    this.advance();
    this.addToken(TokenType.RAW_STRING, value);
  }

  regex() {
    let pattern = "";
    let inClass = false;
    let closed = false;
    while (!this.isAtEnd()) {
      const c = this.peek();
      if (c === '\n') { this.line++; }
      if (c === '\\') {
        pattern += this.advance();
        if (!this.isAtEnd()) pattern += this.advance();
        continue;
      }
      if (c === '[') inClass = true;
      else if (c === ']') inClass = false;
      else if (c === '/' && !inClass) { this.advance(); closed = true; break; }
      pattern += this.advance();
    }
    if (!closed) throw new Error("Unterminated regex literal.");
    let flags = "";
    while (this.isAlpha(this.peek())) flags += this.advance();
    try {
      this.addToken(TokenType.REGEX, { pattern, flags });
    } catch (e) {
      throw new Error(`Invalid regex: ${e.message}`);
    }
  }

  number() {
    while (this.isDigit(this.peek()) || this.peek() === '_') this.advance();
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance();
      while (this.isDigit(this.peek()) || this.peek() === '_') this.advance();
    }
    const raw = this.source.substring(this.start, this.current).replace(/_/g, '');
    this.addToken(TokenType.NUMBER, parseFloat(raw));
  }

  template() {
    const strings = [];
    const expressions = [];
    const stringBuffer = []; // Use array instead of string concatenation for performance

    while (this.peek() !== '`' && !this.isAtEnd()) {
      if (this.peek() === '$' && this.peekNext() === '{') {
        strings.push(stringBuffer.join('')); // Join buffer into string
        stringBuffer.length = 0; // Reuse buffer
        this.advance(); // $
        this.advance(); // {

        const exprBuffer = []; // Buffer for expression code
        let braceCount = 1;
        while (braceCount > 0 && !this.isAtEnd()) {
          if (this.peek() === '{') braceCount++;
          if (this.peek() === '}') braceCount--;
          if (braceCount > 0) exprBuffer.push(this.advance());
        }
        if (this.isAtEnd()) throw new Error("Unterminated template interpolation.");
        this.advance(); // }
        expressions.push(exprBuffer.join(''));
      } else {
        if (this.peek() === '\n') this.line++;
        stringBuffer.push(this.advance());
      }
    }

    if (this.isAtEnd()) throw new Error("Unterminated template literal.");
    strings.push(stringBuffer.join('')); // Join buffer
    this.advance(); // `

    this.addToken(TokenType.TEMPLATE, { strings, expressions });
  }

  string(quote) {
    let value = "";
    while (this.peek() !== quote && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      if (this.peek() === '\\') {
          this.advance();
          const escaped = this.advance();
          switch(escaped) {
              case 'n': value += '\n'; break;
              case 't': value += '\t'; break;
              case '\\': value += '\\'; break;
              case '"': value += '"'; break;
              case "'": value += "'"; break;
              default: value += escaped; break;
          }
      } else {
        value += this.advance();
      }
    }
    if (this.isAtEnd()) throw new Error("Unterminated string.");
    this.advance();
    this.addToken(TokenType.STRING, value);
  }

  match(expected) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    this.current++;
    return true;
  }

  peek() {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  isAlpha(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
  }

  isAlphaNumeric(c) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  isDigit(c) {
    return c >= '0' && c <= '9';
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  advance() {
    return this.source.charAt(this.current++);
  }

  addToken(type, literal = null) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
    // Update regex-allowed state
    // After an identifier, number, string, or closing bracket — regex NOT allowed
    // After operator, opening bracket, semicolon, etc. — regex IS allowed
    const closeTokens = [
      TokenType.IDENTIFIER, TokenType.NUMBER, TokenType.STRING, TokenType.RAW_STRING,
      TokenType.TEMPLATE, TokenType.REGEX,
      TokenType.RIGHT_PAREN, TokenType.RIGHT_BRACKET, TokenType.MBARI,
      TokenType.TENAN, TokenType.GAK, TokenType.KOSONG, TokenType.ORADIDEFINISIKAN,
      TokenType.IKI,
      TokenType.PING, TokenType.PING_KARO,
    ];
    this.regexAllowed = !closeTokens.includes(type);
  }
}
