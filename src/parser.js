import { TokenType, Keywords } from './tokens.js';
import * as AST from './ast.js';
import { Lexer } from './lexer.js';

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
      let result = null;
      if (this.match(TokenType.KELAS)) result = this.classDeclaration();
      else if (this.match(TokenType.GAWE)) {
        let isAsync = false;
        if (this.match(TokenType.TENANGAN)) isAsync = true;
        result = this.functionDeclaration("gawe", isAsync);
      }
      else if (this.match(TokenType.TENANGAN)) {
        if (this.match(TokenType.GAWE)) {
          result = this.functionDeclaration("gawe", true);
        } else {
          result = this.statement();
        }
      }
      else if (this.match(TokenType.IKI_IKU)) result = this.varDeclaration(true);
      else if (this.match(TokenType.JARNO)) result = this.varDeclaration(false);
      else result = this.statement();

      this.match(TokenType.SEMICOLON); // Optional semicolon
      return result;
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
    if (kind !== "wujudno" && kind !== "arrow") {
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
        if (this.match(TokenType.TERUS)) { // Object destructuring in param
            const properties = [];
            if (!this.check(TokenType.MBARI)) {
                do {
                    const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng properti.");
                    let alias = name;
                    if (this.match(TokenType.DADI)) {
                        alias = this.consume(TokenType.IDENTIFIER, "Kudune jeneng alias.");
                    }
                    properties.push({ name, alias });
                } while (this.match(TokenType.COMMA));
            }
            this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise destructuring.");
            parameters.push({ lexeme: "{destructuring}", properties, line: this.previous().line });
        } else if (this.match(TokenType.LEFT_BRACKET)) { // Array destructuring in param
            const elements = [];
            if (!this.check(TokenType.RIGHT_BRACKET)) {
                do {
                    elements.push(this.consume(TokenType.IDENTIFIER, "Kudune jeneng elemen."));
                } while (this.match(TokenType.COMMA));
            }
            this.consume(TokenType.RIGHT_BRACKET, "Kudune ']' sakwise destructuring.");
            parameters.push({ lexeme: "[destructuring]", elements, line: this.previous().line });
        } else {
            parameters.push(this.consume(TokenType.IDENTIFIER, "Kudune jeneng parameter."));
            if (this.match(TokenType.COLON)) {
                this.consume(TokenType.IDENTIFIER, "Kudune tipe data.");
            }
        }
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise parameter.");
    
    if (this.match(TokenType.COLON)) {
        this.consume(TokenType.IDENTIFIER, "Kudune tipe data balikan.");
    }

    this.consume(TokenType.TERUS, `Kudune 'terus' sakdurunge body ${kind}.`);
    const body = this.block();
    const finalName = name || { lexeme: kind === "wujudno" ? "wujudno" : "arrow", line: this.previous().line };
    return new AST.Gawe(finalName, parameters, new AST.Block(body), isAsync);
  }

  varDeclaration(isConst) {
    if (this.match(TokenType.TERUS)) { // Object destructuring
        const properties = [];
        if (!this.check(TokenType.MBARI)) {
            do {
                const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng properti.");
                let alias = name;
                if (this.match(TokenType.DADI)) {
                    alias = this.consume(TokenType.IDENTIFIER, "Kudune jeneng alias.");
                }
                let defaultValue = null;
                if (this.match(TokenType.YOIKU)) {
                    defaultValue = this.expression();
                }
                properties.push({ name, alias, defaultValue });
            } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise destructuring.");
        this.consume(TokenType.YOIKU, "Kudune 'yoiku' sakwise destructuring.");
        const initializer = this.expression();
        return new AST.Var({ lexeme: "{destructuring}", properties, line: this.previous().line }, initializer, isConst);
    }
    
    if (this.match(TokenType.LEFT_BRACKET)) { // Array destructuring
        const elements = [];
        if (!this.check(TokenType.RIGHT_BRACKET)) {
            do {
                elements.push(this.consume(TokenType.IDENTIFIER, "Kudune jeneng elemen."));
            } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RIGHT_BRACKET, "Kudune ']' sakwise destructuring.");
        this.consume(TokenType.YOIKU, "Kudune 'yoiku' sakwise destructuring.");
        const initializer = this.expression();
        return new AST.Var({ lexeme: "[destructuring]", elements, line: this.previous().line }, initializer, isConst);
    }

    const name = this.consume(TokenType.IDENTIFIER, "Kudune jeneng variabel.");
    
    if (this.match(TokenType.COLON)) {
        this.consume(TokenType.IDENTIFIER, "Kudune tipe data.");
    }

    let initializer = null;
    if (this.match(TokenType.YOIKU)) {
      initializer = this.expression();
    }
    return new AST.Var(name, initializer, isConst);
  }

  statement() {
    if (this.match(TokenType.CLEAR)) return new AST.Command('clear');
    if (this.match(TokenType.CREDITS)) return new AST.Command('credits');
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
    const expressions = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        expressions.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise nilai.");
    return new AST.Cetakno(expressions);
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
    this.consume(TokenType.TERUS, "Kudune 'terus' sakwise 'cobak'.");
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
    let expr = this.nullish();
    if (this.match(TokenType.TA)) {
      const thenExpr = this.expression();
      this.consume(TokenType.LEK_GAK, "Kudune 'lek gak' sakwise ekspresi true.");
      const elseExpr = this.ternary();
      expr = new AST.Ternary(expr, thenExpr, elseExpr);
    }
    return expr;
  }

  nullish() {
      let expr = this.or();
      while (this.match(TokenType.UTOWO_YEN_KOSONG)) {
          const operator = this.previous();
          const right = this.or();
          expr = new AST.Logical(expr, operator, right);
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
    while (this.match(TokenType.GAK_PLEK, TokenType.GAK_PODO, TokenType.PLEK, TokenType.PODO, TokenType.GUDUK)) {
      const operator = this.previous();
      if (operator.type === TokenType.GUDUK) {
          const right = this.comparison();
          expr = new AST.Binary(expr, { type: TokenType.GAK_PODO, lexeme: "!=", line: operator.line }, right);
      } else {
        const right = this.comparison();
        expr = new AST.Binary(expr, operator, right);
      }
    }
    return expr;
  }

  comparison() {
    let expr = this.term();
    while (this.match(TokenType.LUWIH_GEDHE, TokenType.LUWIH_GEDHE_PODO, TokenType.LUWIH_CILIK, TokenType.LUWIH_CILIK_PODO,
                     TokenType.IKU_ONO, TokenType.IKU_ILANG, TokenType.IKU)) {
      const operator = this.previous();
      if (operator.type === TokenType.IKU_ONO || operator.type === TokenType.IKU_ILANG) {
        expr = new AST.Postfix(expr, operator);
      } else if (operator.type === TokenType.IKU) {
          if (this.match(TokenType.ONO)) {
              expr = new AST.Postfix(expr, { type: TokenType.IKU_ONO, lexeme: "iku ono", line: operator.line });
          } else if (this.match(TokenType.ILANG)) {
              expr = new AST.Postfix(expr, { type: TokenType.IKU_ILANG, lexeme: "iku ilang", line: operator.line });
          } else {
              throw this.error(this.peek(), "Kudune 'ono' utowo 'ilang' sakwise 'iku'.");
          }
      } else {
        const right = this.term();
        expr = new AST.Binary(expr, operator, right);
      }
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
    if (this.match(TokenType.ORA, TokenType.TAMBAH, TokenType.KURANG, TokenType.ENTENI, TokenType.ASILNO)) {
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
        if (this.check(TokenType.IDENTIFIER) || this.isKeyword(this.peek())) {
          const name = this.advance();
          expr = new AST.Get(expr, name);
        } else {
          throw this.error(this.peek(), "Kudune jeneng properti sakwise '.'.");
        }
      } else if (this.match(TokenType.LEFT_BRACKET)) {
        const index = this.expression();
        this.consume(TokenType.RIGHT_BRACKET, "Kudune ']' sakwise index.");
        // We can reuse Get AST or create a new Index AST. 
        // For simplicity, let's use a dummy identifier for bracket access or just use Get.
        // Actually, let's use a special Get node or handle it in Interpreter.
        // I'll create an Index node in AST.
        expr = new AST.Get(expr, { lexeme: "[]", line: this.previous().line, index });
      } else if (this.match(TokenType.ANYAR)) {
        // ... handled in primary
        break;
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
    
    if (this.match(TokenType.TEMPLATE)) {
      const { strings, expressions } = this.previous().literal;
      const parsedExpressions = expressions.map(code => {
        const lexer = new Lexer(code);
        const tokens = lexer.scanTokens();
        const parser = new Parser(tokens);
        return parser.expression();
      });
      return new AST.TemplateLiteral(strings, parsedExpressions);
    }

    if (this.match(TokenType.TAKON)) {
      this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise 'takon'.");
      const prompt = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise prompt.");
      return new AST.Call(new AST.Variable({ lexeme: "takon", line: this.previous().line }), this.previous(), [prompt]);
    }

    if (this.match(TokenType.TUPLE)) {
      this.consume(TokenType.LEFT_PAREN, "Kudune '(' sakwise 'tuple'.");
      const elements = [];
      if (!this.check(TokenType.RIGHT_PAREN)) {
        do { elements.push(this.expression()); } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise elemen tuple.");
      return new AST.Tuple(this.previous(), elements);
    }

    if (this.match(TokenType.LEFT_BRACKET)) {
      const elements = [];
      if (!this.check(TokenType.RIGHT_BRACKET)) {
        do { elements.push(this.expression()); } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RIGHT_BRACKET, "Kudune ']' sakwise elemen array.");
      return new AST.ArrayLiteral(elements);
    }

    if (this.match(TokenType.TERUS)) { // Using 'terus' as '{' for objects
      const properties = new Map();
      if (!this.check(TokenType.MBARI)) {
        do {
          let key;
          if (this.match(TokenType.IDENTIFIER, TokenType.STRING)) {
              key = this.previous().literal || this.previous().lexeme;
          } else {
              key = this.consume(TokenType.IDENTIFIER, "Kudune jeneng properti.").lexeme;
          }
          this.consume(TokenType.COLON, "Kudune ':' sakwise jeneng properti.");
          const value = this.expression();
          properties.set(key, value);
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.MBARI, "Kudune 'mbari' sakwise properti obyek.");
      return new AST.ObjectLiteral(properties);
    }

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

    // Arrow function check (single param)
    if (this.check(TokenType.IDENTIFIER)) {
        const next = this.tokens[this.current + 1];
        if (next && next.type === TokenType.LAKONI) {
            const param = this.advance();
            this.advance(); // consume LAKONI
            if (this.match(TokenType.TERUS)) {
                return new AST.Gawe({ lexeme: "arrow", line: param.line }, [param], new AST.Block(this.block()));
            } else {
                return new AST.Gawe({ lexeme: "arrow", line: param.line }, [param], new AST.Expression(this.expression()));
            }
        }
    }

    // Arrow function check (multiple params)
    if (this.check(TokenType.LEFT_PAREN)) {
        let i = this.current + 1;
        let isArrow = false;
        let parenCount = 1;
        while (i < this.tokens.length && parenCount > 0) {
            if (this.tokens[i].type === TokenType.LEFT_PAREN) parenCount++;
            if (this.tokens[i].type === TokenType.RIGHT_PAREN) parenCount--;
            i++;
        }
        if (i < this.tokens.length && this.tokens[i].type === TokenType.LAKONI) isArrow = true;
        
        if (isArrow) {
            this.advance(); // consume (
            const parameters = [];
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    parameters.push(this.consume(TokenType.IDENTIFIER, "Kudune jeneng parameter."));
                } while (this.match(TokenType.COMMA));
            }
            this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise parameter.");
            this.consume(TokenType.LAKONI, "Kudune 'lakoni' sakwise parameter.");
            if (this.match(TokenType.TERUS)) {
                return new AST.Gawe({ lexeme: "arrow", line: this.previous().line }, parameters, new AST.Block(this.block()));
            } else {
                return new AST.Gawe({ lexeme: "arrow", line: this.previous().line }, parameters, new AST.Expression(this.expression()));
            }
        }
    }

    if (this.match(TokenType.IDENTIFIER) || 
        this.match(TokenType.TAMBAH, TokenType.KURANG, TokenType.PING, TokenType.BAGI, TokenType.SISO)) {
      return new AST.Variable(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Kudune ')' sakwise ekspresi.");
      return new AST.Grouping(expr);
    }
    throw this.error(this.peek(), "Kudune ekspresi.");
  }

  isKeyword(token) {
    if (token.type === TokenType.EOF) return false;
    return !!Keywords[token.lexeme.toLowerCase()] || !!Keywords[token.lexeme];
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
