import { TokenType } from './tokens.js';

export class Expr {
  accept(visitor) {}
}

export class Binary extends Expr {
  constructor(left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor) { return visitor.visitBinaryExpr(this); }
}

export class Grouping extends Expr {
  constructor(expression) {
    super();
    this.expression = expression;
  }
  accept(visitor) { return visitor.visitGroupingExpr(this); }
}

export class Literal extends Expr {
  constructor(value) {
    super();
    this.value = value;
  }
  accept(visitor) { return visitor.visitLiteralExpr(this); }
}

export class Unary extends Expr {
  constructor(operator, right) {
    super();
    this.operator = operator;
    this.right = right;
  }
  accept(visitor) { return visitor.visitUnaryExpr(this); }
}

export class Variable extends Expr {
  constructor(name) {
    super();
    this.name = name;
  }
  accept(visitor) { return visitor.visitVariableExpr(this); }
}

export class Assign extends Expr {
  constructor(name, operator, value) {
    super();
    this.name = name;
    this.operator = operator;
    this.value = value;
  }
  accept(visitor) { return visitor.visitAssignExpr(this); }
}

export class Call extends Expr {
  constructor(callee, paren, args) {
    super();
    this.callee = callee;
    this.paren = paren;
    this.args = args;
  }
  accept(visitor) { return visitor.visitCallExpr(this); }
}

export class Get extends Expr {
  constructor(object, name) {
    super();
    this.object = object;
    this.name = name;
  }
  accept(visitor) { return visitor.visitGetExpr(this); }
}

export class Set extends Expr {
  constructor(object, name, value) {
    super();
    this.object = object;
    this.name = name;
    this.value = value;
  }
  accept(visitor) { return visitor.visitSetExpr(this); }
}

export class This extends Expr {
  constructor(keyword) {
    super();
    this.keyword = keyword;
  }
  accept(visitor) { return visitor.visitThisExpr(this); }
}

export class Super extends Expr {
  constructor(keyword, method) {
    super();
    this.keyword = keyword;
    this.method = method;
  }
  accept(visitor) { return visitor.visitSuperExpr(this); }
}

export class Ternary extends Expr {
  constructor(condition, thenExpr, elseExpr) {
    super();
    this.condition = condition;
    this.thenExpr = thenExpr;
    this.elseExpr = elseExpr;
  }
  accept(visitor) { return visitor.visitTernaryExpr(this); }
}

export class Logical extends Expr {
  constructor(left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor) { return visitor.visitLogicalExpr(this); }
}

export class Tuple extends Expr {
  constructor(keyword, elements) {
    super();
    this.keyword = keyword;
    this.elements = elements;
  }
  accept(visitor) { return visitor.visitTupleExpr(this); }
}

export class Stmt {
  accept(visitor) {}
}

export class Expression extends Stmt {
  constructor(expression) {
    super();
    this.expression = expression;
  }
  accept(visitor) { return visitor.visitExpressionStmt(this); }
}

export class Cetakno extends Stmt {
  constructor(expression) {
    super();
    this.expression = expression;
  }
  accept(visitor) { return visitor.visitCetaknoStmt(this); }
}

export class Var extends Stmt {
  constructor(name, initializer, isConst = false) {
    super();
    this.name = name;
    this.initializer = initializer;
    this.isConst = isConst;
  }
  accept(visitor) { return visitor.visitVarStmt(this); }
}

export class Block extends Stmt {
  constructor(statements) {
    super();
    this.statements = statements;
  }
  accept(visitor) { return visitor.visitBlockStmt(this); }
}

export class Lek extends Stmt {
  constructor(condition, thenBranch, elseIfBranches, elseBranch) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseIfBranches = elseIfBranches; // Array of {condition, branch}
    this.elseBranch = elseBranch;
  }
  accept(visitor) { return visitor.visitLekStmt(this); }
}

export class Selagi extends Stmt {
  constructor(condition, body) {
    super();
    this.condition = condition;
    this.body = body;
  }
  accept(visitor) { return visitor.visitSelagiStmt(this); }
}

export class Kanggo extends Stmt {
  constructor(initializer, condition, increment, body) {
    super();
    this.initializer = initializer;
    this.condition = condition;
    this.increment = increment;
    this.body = body;
  }
  accept(visitor) { return visitor.visitKanggoStmt(this); }
}

export class Gawe extends Stmt {
  constructor(name, params, body, isAsync = false, isGenerator = false) {
    super();
    this.name = name;
    this.params = params;
    this.body = body;
    this.isAsync = isAsync;
    this.isGenerator = isGenerator;
  }
  accept(visitor) { return visitor.visitGaweStmt(this); }
}

export class Balekno extends Stmt {
  constructor(keyword, value) {
    super();
    this.keyword = keyword;
    this.value = value;
  }
  accept(visitor) { return visitor.visitBaleknoStmt(this); }
}

export class Kelas extends Stmt {
  constructor(name, superclass, methods) {
    super();
    this.name = name;
    this.superclass = superclass;
    this.methods = methods;
  }
  accept(visitor) { return visitor.visitKelasStmt(this); }
}

export class Cobak extends Stmt {
  constructor(tryBlock, catchVar, catchBranch, finallyBranch) {
    super();
    this.tryBlock = tryBlock;
    this.catchVar = catchVar;
    this.catchBranch = catchBranch;
    this.finallyBranch = finallyBranch;
  }
  accept(visitor) { return visitor.visitCobakStmt(this); }
}

export class Uncalen extends Stmt {
  constructor(keyword, value) {
    super();
    this.keyword = keyword;
    this.value = value;
  }
  accept(visitor) { return visitor.visitUncalenStmt(this); }
}

export class Mandek extends Stmt {
  constructor(keyword) {
    super();
    this.keyword = keyword;
  }
  accept(visitor) { return visitor.visitMandekStmt(this); }
}

export class Lanjutno extends Stmt {
  constructor(keyword) {
    super();
    this.keyword = keyword;
  }
  accept(visitor) { return visitor.visitLanjutnoStmt(this); }
}

export class Pilih extends Stmt {
  constructor(expression, cases, defaultBranch) {
    super();
    this.expression = expression;
    this.cases = cases; // Array of {value, branch}
    this.defaultBranch = defaultBranch;
  }
  accept(visitor) { return visitor.visitPilihStmt(this); }
}
