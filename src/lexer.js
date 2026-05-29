import { TokenType, Keywords } from './tokens.js';

export class Token {
  constructor(type, lexeme, literal, line) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }
}

export class Lexer {
  constructor(source) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
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
      case '[': this.addToken(TokenType.LEFT_BRACKET); break;
      case ']': this.addToken(TokenType.RIGHT_BRACKET); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case ':': this.addToken(TokenType.COLON); break;
      case '.': this.addToken(TokenType.DOT); break;
      case '-': this.addToken(this.match('=') ? TokenType.KURANG_KARO : TokenType.MINUS); break;
      case '+': this.addToken(this.match('=') ? TokenType.TAMBAH_KARO : TokenType.TAMBAH); break;
      case '*': this.addToken(this.match('=') ? TokenType.PING_KARO : TokenType.PING); break;
      case '/':
        if (this.match('/')) {
          while (this.peek() !== '\n' && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(this.match('=') ? TokenType.BAGI_KARO : TokenType.BAGI);
        }
        break;
      case '=': this.addToken(this.match('=') ? TokenType.PODO : TokenType.YOIKU); break;
      case '<': this.addToken(this.match('=') ? TokenType.LUWIH_CILIK_PODO : TokenType.LUWIH_CILIK); break;
      case '>': this.addToken(this.match('=') ? TokenType.LUWIH_GEDHE_PODO : TokenType.LUWIH_GEDHE); break;
      case '!': this.addToken(this.match('=') ? TokenType.GAK_PODO : TokenType.ORA); break;
      case ' ':
      case '\r':
      case '\t':
        break;
      case '\n':
        this.line++;
        break;
      case '"': this.string(); break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          throw new Error(`[line ${this.line}] Error: Unexpected character '${c}'`);
        }
        break;
    }
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    let text = this.source.substring(this.start, this.current);
    
    // Check for multi-word keywords
    const currentLexeme = text;
    if (this.peek() === ' ') {
        const saved = this.current;
        this.advance(); // consume space
        let nextWord = "";
        while (this.isAlpha(this.peek())) nextWord += this.advance();
        const combined = `${currentLexeme} ${nextWord}`;
        if (Keywords[combined]) {
            text = combined;
        } else {
            this.current = saved; // put back the space and whatever followed
        }
    }

    let type = Keywords[text];
    if (type === undefined) type = TokenType.IDENTIFIER;
    this.addToken(type);
  }

  number() {
    while (this.isDigit(this.peek())) this.advance();
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance();
      while (this.isDigit(this.peek())) this.advance();
    }
    this.addToken(TokenType.NUMBER, parseFloat(this.source.substring(this.start, this.current)));
  }

  string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      this.advance();
    }
    if (this.isAtEnd()) throw new Error("Unterminated string.");
    this.advance();
    const value = this.source.substring(this.start + 1, this.current - 1);
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
  }
}
