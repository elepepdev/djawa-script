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
      case '{': this.addToken(TokenType.TERUS); break;
      case '}': this.addToken(TokenType.MBARI); break;
      case '[': this.addToken(TokenType.LEFT_BRACKET); break;
      case ']': this.addToken(TokenType.RIGHT_BRACKET); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case ':': this.addToken(TokenType.COLON); break;
      case '.': this.addToken(TokenType.DOT); break;
      case '-': this.addToken(this.match('=') ? TokenType.KURANG_KARO : TokenType.KURANG); break;
      case '+': this.addToken(this.match('=') ? TokenType.TAMBAH_KARO : TokenType.TAMBAH); break;
      case '*': this.addToken(this.match('=') ? TokenType.PING_KARO : TokenType.PING); break;
      case '/':
        if (this.match('/')) {
          while (this.peek() !== '\n' && !this.isAtEnd()) this.advance();
        } else if (this.match('*')) {
          this.addToken(TokenType.SLASH_COMMAND);
        } else {
          // Check for slash commands like /clear or /credits
          const cmdStart = this.current;
          while (this.isAlpha(this.peek())) this.advance();
          const cmd = this.source.substring(this.start + 1, this.current);
          if (cmd === 'clear') {
            this.addToken(TokenType.CLEAR);
          } else if (cmd === 'credits') {
            this.addToken(TokenType.CREDITS);
          } else {
            this.addToken(this.match('=') ? TokenType.BAGI_KARO : TokenType.BAGI);
          }
        }
        break;
      case '=':
        if (this.match('=')) {
          this.addToken(this.match('=') ? TokenType.PLEK : TokenType.PODO);
        } else {
          this.addToken(TokenType.YOIKU);
        }
        break;
      case '<': this.addToken(this.match('=') ? TokenType.LUWIH_CILIK_PODO : TokenType.LUWIH_CILIK); break;
      case '>': this.addToken(this.match('=') ? TokenType.LUWIH_GEDHE_PODO : TokenType.LUWIH_GEDHE); break;
      case '!':
        if (this.match('=')) {
          this.addToken(this.match('=') ? TokenType.GAK_PLEK : TokenType.GAK_PODO);
        } else {
          this.addToken(TokenType.ORA);
        }
        break;
      case '?':
        if (this.match('?')) {
          this.addToken(TokenType.UTOWO_YEN_KOSONG);
        } else {
          this.addToken(TokenType.TA);
        }
        break;
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
          throw new Error(`[line ${this.line}] Error: Unexpected character '${c}'`);
        }
        break;
    }
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    let text = this.source.substring(this.start, this.current);
    
    // Check for multi-word keywords
    const savedCurrent = this.current;
    const savedTokensLength = this.tokens.length;
    
    let tempCurrent = this.current;
    let combinedText = text;
    
    // Greedily try to match longer multi-word keywords
    while (this.source.charAt(tempCurrent) === ' ') {
        tempCurrent++;
        let nextWordStart = tempCurrent;
        while (this.isAlphaNumeric(this.source.charAt(tempCurrent))) tempCurrent++;
        let nextWord = this.source.substring(nextWordStart, tempCurrent);
        if (!nextWord) break;
        
        combinedText += " " + nextWord;
        if (Keywords[combinedText]) {
            text = combinedText;
            this.current = tempCurrent;
        } else {
            // Keep looking if it might be part of a longer one? 
            // For JPL, 2 words is usually max, but let's be safe.
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

  template() {
    const strings = [];
    const expressions = []; // These will be strings of code to be parsed later
    let currentString = "";

    while (this.peek() !== '`' && !this.isAtEnd()) {
      if (this.peek() === '$' && this.peekNext() === '{') {
        strings.push(currentString);
        currentString = "";
        this.advance(); // $
        this.advance(); // {
        
        let exprCode = "";
        let braceCount = 1;
        while (braceCount > 0 && !this.isAtEnd()) {
          if (this.peek() === '{') braceCount++;
          if (this.peek() === '}') braceCount--;
          if (braceCount > 0) exprCode += this.advance();
        }
        if (this.isAtEnd()) throw new Error("Unterminated template interpolation.");
        this.advance(); // }
        expressions.push(exprCode);
      } else {
        if (this.peek() === '\n') this.line++;
        currentString += this.advance();
      }
    }

    if (this.isAtEnd()) throw new Error("Unterminated template literal.");
    strings.push(currentString);
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
  }
}
