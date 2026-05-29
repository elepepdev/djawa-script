import { TokenType } from './tokens.js';
import * as AST from './ast.js';

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    const statements = [];
    while (!this.isAtEnd()) {
      const decl = this.declaration();
      if (decl !== null) statements.push(decl);
    }
    return statements;
  }

  declaration() {
    try {
      if (this.match(TokenType.KELAS)) return this.classDeclaration();
      if (this.match(TokenType.TENANGAN)) {
        if (this.check(TokenType.GAWE)) {
          this.advance();
          return this.functionDeclaration("gawe", true);
        }
      }
      if (this.match(TokenType.GAWE)) return this.functionDeclaration("gawe");
      if (this.match(TokenType.IKI_IKU)) return this.varDeclaration(true);
      if (this.match(TokenType.JARNO)) return this.varDeclaration(false);

      return this.statement();
    } catch (error) {
      console.error(error.message);
      this.synchronize();
      return null;
    }
  }

  classDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng kelas.");
    let superclass = null;
    if (this.match(TokenType.TURUNAN_SOKO)) {
      this.consume(TokenType.IDENTIFIER, "Kudune jeneng parent class.");
      superclass = new AST.Variable(this.previous());
    }
    this.consume(TokenType.TERUS, "Kudune 'terus' sakdurunge body kelas.");
    const methods = [];
    while (!this.check(TokenType.MBARI) && !this.isAtEnd()) {
      const isStatic = this.match(TokenType.TETEP);
      if (this.match(TokenType.GAWE)) {
        methods.push(this.functionDeclaration("cara", false, isStatic));
      } else if (this.match(TokenType.WUJUDNO)) {
        methods.push(this.functionDeclaration("wujudno", false, isStatic));
      } else {
        this.advance();
      }
    }
    this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise body kelas.");
    return new AST.Kelas(name, superclass, methods);
  }

  functionDeclaration(kind, isAsync = false) {
    let name = null;
    if (kind !== "wujudno") {
      if (this.match(TokenType.IDENTIFIER) || 
          this.match(TokenType.TAMBAH, TokenType.KURANG, TokenType.PING, TokenType.BAGI, TokenType.SISO)) {
        name = this.previous();
      } else {
        throw this.error(this.peek(), `Kudune jeneng ${kind}.`);
      }
    }
    this.consume(TokenType.LEFT_PAREN, `Kudune '(' sakwise jeneng ${kind}.`);
    const parameters = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        parameters.push(this.consume(TokenType.IDENTIFIER, "Kudune jeneng parameter."));
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise parameter.");
    this.consume(TokenType.TERUS, `Kudune 'terus' sakdurunge body ${kind}.`);
    const body = this.block();
    const finalName = name || { lexeme: "wujudno", line: this.previous().line };
    return new AST.Gawe(finalName, parameters, new AST.Block(body), isAsync);
  }

  varDeclaration(isConst) {
    const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng variabel.");
    let initializer = null;
    if (this.match(TokenType.YOIKU)) {
      initializer = this.expression();
    }
    return new AST.Var(name, initializer, isConst);
  }

  statement() {
    if (this.match(TokenType.LEK)) return this.lekStatement();
    if (this.match(TokenType.CETAKNO)) return this.cetaknoStatement();
    if (this.match(TokenType.BALEKNO)) return this.baleknoStatement();
    if (this.match(TokenType.SELAGI)) return this.selagiStatement();
    if (this.match(TokenType.KANGGO)) return this.kanggoStatement();
    if (this.match(TokenType.PILIH)) return this.pilihStatement();
    if (this.match(TokenType.COBAK)) return this.cobakStatement();
    if (this.match(TokenType.UNCALEN)) return this.uncalenStatement();
    if (this.match(TokenType.MANDEK)) return new AST.Mandek(this.previous());
    if (this.match(TokenType.LANJUTNO)) return new AST.Lanjutno(this.previous());
    if (this.match(TokenType.TERUS)) return new AST.Block(this.block());
    return this.expressionStatement();
  }

  lekStatement() {
    this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise 'lek'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise kondisi.");
    this.consume(TokenType.TERUS, "Kudune 'terus' sakwise kondisi.");
    const thenBranch = new AST.Block(this.block());
    const elseIfBranches = [];
    while (this.match(TokenType.LEK_MISALE)) {
      this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise 'lek misale'.");
      const elifCond = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise kondisi.");
      this.consume(TokenType.TERUS, "Kudune 'terus' sakwise kondisi.");
      elseIfBranches.push({ condition: elifCond, branch: new AST.Block(this.block()) });
    }
    let elseBranch = null;
    if (this.match(TokenType.LIYANE)) {
      this.consume(TokenType.TERUS, "Kudune 'terus' sakwise 'liyane'.");
      elseBranch = new AST.Block(this.block());
    }
    return new AST.Lek(condition, thenBranch, elseIfBranches, elseBranch);
  }

  cetaknoStatement() {
    this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise 'cetakno'.");
    const value = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise nilai.");
    return new AST.Cetakno(value);
  }

  baleknoStatement() {
    const keyword = this.previous();
    let value = null;
    if (!this.check(TokenType.MBARI) && !this.isAtEnd()) {
      value = this.expression();
    }
    return new AST.Balekno(keyword, value);
  }

  selagiStatement() {
    this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise 'selagi'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise kondisi.");
    this.consume(TokenType.TERUS, "Kudune 'terus' sakdurunge body loop.");
    const body = new AST.Block(this.block());
    return new AST.Selagi(condition, body);
  }

  kanggoStatement() {
    this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise 'kanggo'.");
    let initializer;
    if (this.match(TokenType.SEMICOLON)) initializer = null;
    else if (this.match(TokenType.JARNO)) {
      initializer = this.varDeclaration(false);
      this.consume(TokenType.SEMICOLON, "Kudune ';' sakwise initializer.");
    } else {
      initializer = this.expressionStatement();
      this.consume(TokenType.SEMICOLON, "Kudune ';' sakwise initializer.");
    }
    let condition = null;
    if (!this.check(TokenType.SEMICOLON)) condition = this.expression();
    this.consume(TokenType.SEMICOLON, "Kudune ';' sakwise kondisi loop.");
    let increment = null;
    if (!this.check(TokenType.RIGHT_PAREN)) increment = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise kanggo clause.");
    this.consume(TokenType.TERUS, "Kudune 'terus' sakdurunge body loop.");
    const body = new AST.Block(this.block());
    return new AST.Kanggo(initializer, condition, increment, body);
  }

  pilihStatement() {
    this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise 'pilih'.");
    const expr = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise ekspresi.");
    this.consume(TokenType.TERUS, "Kudune 'terus' sakwise 'pilih'.");
    const cases = [];
    while (this.match(TokenType.KALO)) {
      const val = this.expression();
      this.consume(TokenType.COLON, "Kudune ':' sakwise nilai case.");
      const statements = [];
      while (!this.check(TokenType.KALO) && !this.check(TokenType.YOWES) && !this.check(TokenType.MBARI)) {
        statements.push(this.declaration());
      }
      cases.push({ value: val, branch: new AST.Block(statements) });
    }
    let defaultBranch = null;
    if (this.match(TokenType.YOWES)) {
      this.consume(TokenType.COLON, "Kudune ':' sakwise 'yowes'.");
      const statements = [];
      while (!this.check(TokenType.MBARI)) statements.push(this.declaration());
      defaultBranch = new AST.Block(statements);
    }
    this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise 'pilih'.");
    return new AST.Pilih(expr, cases, defaultBranch);
  }

  cobakStatement() {
    const tryBlock = new AST.Block(this.block());
    let catchVar = null;
    let catchBranch = null;
    if (this.match(TokenType.NYEKEL)) {
      this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise 'nyekel'.");
      catchVar = this.consume(TokenType.IDENTIFIER, "Kudune jeneng variabel error.");
      this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise jeneng variabel.");
      this.consume(TokenType.TERUS, "Kudune 'terus' sakwise 'nyekel'.");
      catchBranch = new AST.Block(this.block());
    }
    let finallyBranch = null;
    if (this.match(TokenType.PUNGKASAN)) {
      this.consume(TokenType.TERUS, "Kudune 'terus' sakwise 'pungkasan'.");
      finallyBranch = new AST.Block(this.block());
    }
    return new AST.Cobak(tryBlock, catchVar, catchBranch, finallyBranch);
  }

  uncalenStatement() {
    const keyword = this.previous();
    const value = this.expression();
    return new AST.Uncalen(keyword, value);
  }

  block() {
    const statements = [];
    while (!this.check(TokenType.MBARI) && !this.isAtEnd()) {
      const decl = this.declaration();
      if (decl !== null) statements.push(decl);
    }
    this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise block.");
    return statements;
  }

  expressionStatement() {
    const expr = this.expression();
    return new AST.Expression(expr);
  }

  expression() {
    return this.assignment();
  }

  assignment() {
    const expr = this.ternary();
    if (this.match(TokenType.YOIKU, TokenType.TAMBAH_KARO, TokenType.KURANG_KARO, TokenType.PING_KARO, TokenType.BAGI_KARO, TokenType.SISO_KARO)) {
      const operator = this.previous();
      const value = this.assignment();
      if (expr instanceof AST.Variable) return new AST.Assign(expr.name, operator, value);
      else if (expr instanceof AST.Get) return new AST.Set(expr.object, expr.name, value);
      throw this.error(operator, "Target assignment ora valid.");
    }
    return expr;
  }

  ternary() {
    let expr = this.or();
    if (this.match(TokenType.TA)) {
      const thenExpr = this.expression();
      this.consume(TokenType.LEK_GAK, "Kudune 'lek gak' sakwise ekspresi true.");
      const elseExpr = this.ternary();
      expr = new AST.Ternary(expr, thenExpr, elseExpr);
    }
    return expr;
  }

  or() {
    let expr = this.and();
    while (this.match(TokenType.UTAWA)) {
      const operator = this.previous();
      const right = this.and();
      expr = new AST.Logical(expr, operator, right);
    }
    return expr;
  }

  and() {
    let expr = this.equality();
    while (this.match(TokenType.LAN)) {
      const operator = this.previous();
      const right = this.equality();
      expr = new AST.Logical(expr, operator, right);
    }
    return expr;
  }

  equality() {
    let expr = this.comparison();
    while (this.match(TokenType.GAK_PLEK, TokenType.GAK_PODO, TokenType.PLEK, TokenType.PODO)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new AST.Binary(expr, operator, right);
    }
    return expr;
  }

  comparison() {
    let expr = this.term();
    while (this.match(TokenType.LUWIH_GEDHE, TokenType.LUWIH_GEDHE_PODO, TokenType.LUWIH_CILIK, TokenType.LUWIH_CILIK_PODO)) {
      const operator = this.previous();
      const right = this.term();
      expr = new AST.Binary(expr, operator, right);
    }
    return expr;
  }

  term() {
    let expr = this.factor();
    while (this.match(TokenType.KURANG, TokenType.TAMBAH)) {
      const operator = this.previous();
      const right = this.factor();
      expr = new AST.Binary(expr, operator, right);
    }
    return expr;
  }

  factor() {
    let expr = this.unary();
    while (this.match(TokenType.BAGI, TokenType.PING, TokenType.SISO, TokenType.PANGKAT)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new AST.Binary(expr, operator, right);
    }
    return expr;
  }

  unary() {
    if (this.match(TokenType.ORA, TokenType.TAMBAH, TokenType.KURANG)) {
      const operator = this.previous();
      const right = this.unary();
      return new AST.Unary(operator, right);
    }
    return this.call();
  }

  call() {
    let expr = this.primary();
    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.DOT)) {
        const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng properti sakwise '.'.");
        expr = new AST.Get(expr, name);
      } else if (this.match(TokenType.ANYAR)) {
        this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise 'anyar'.");
        const args = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
          do { args.push(this.expression()); } while (this.match(TokenType.COMMA));
        }
        const paren = this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise argumen.");
        expr = new AST.Call(expr, paren, args);
      } else {
        break;
      }
    }
    return expr;
  }

  finishCall(callee) {
    const args = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    const paren = this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise argumen.");
    return new AST.Call(callee, paren, args);
  }

  primary() {
    if (this.match(TokenType.GAK)) return new AST.Literal(false);
    if (this.match(TokenType.TENAN)) return new AST.Literal(true);
    if (this.match(TokenType.KOSONG)) return new AST.Literal(null);
    if (this.match(TokenType.ORADIDEFINISIKAN)) return new AST.Literal(undefined);
    if (this.match(TokenType.NUMBER, TokenType.STRING)) return new AST.Literal(this.previous().literal);
    if (this.match(TokenType.IKI)) return new AST.This(this.previous());
    if (this.match(TokenType.ANYAR)) {
      const type = this.consume(TokenType.IDENTIFIER, "Kudune jeneng kelas sakwise 'anyar'.");
      this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise jeneng kelas.");
      const args = [];
      if (!this.check(TokenType.RIGHT_PAREN)) {
        do { args.push(this.expression()); } while (this.match(TokenType.COMMA));
      }
      const paren = this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise argumen.");
      return new AST.Call(new AST.Variable(type), paren, args);
    }
    
    // Identifier check
    if (this.check(TokenType.IDENTIFIER) || 
        this.check(TokenType.TAMBAH) || this.check(TokenType.KURANG) || 
        this.check(TokenType.PING) || this.check(TokenType.BAGI) || this.check(TokenType.SISO)) {
      this.advance();
      return new AST.Variable(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise ekspresi.");
      return new AST.Grouping(expr);
    }
    throw this.error(this.peek(), "Kudune ekspresi.");
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }
  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }
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
      switch (this.peek().type) {
        case TokenType.KELAS: case TokenType.GAWE: case TokenType.JARNO: case TokenType.IKI_IKU:
        case TokenType.LEK: case TokenType.SELAGI: case TokenType.KANGGO: case TokenType.CETAKNO:
        case TokenType.BALEKNO: return;
      }
      this.advance();
    }
  }
}
