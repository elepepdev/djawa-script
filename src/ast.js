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

export class Postfix extends Expr {
  constructor(left, operator) {
    super();
    this.left = left;
    this.operator = operator;
  }
  accept(visitor) { return visitor.visitPostfixExpr(this); }
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

export class ArrayLiteral extends Expr {
  constructor(elements) {
    super();
    this.elements = elements;
  }
  accept(visitor) { return visitor.visitArrayLiteralExpr(this); }
}

export class ObjectLiteral extends Expr {
  constructor(properties) {
    super();
    this.properties = properties; // Map of key (string) to value (Expr)
  }
  accept(visitor) { return visitor.visitObjectLiteralExpr(this); }
}

export class RangeExpr extends Expr {
  constructor(start, end, inclusive) {
    super();
    this.start = start;
    this.end = end;
    this.inclusive = inclusive; // true for 1..10, false for 1...10
  }
  accept(visitor) { return visitor.visitRangeExpr(this); }
}

export class TemplateLiteral extends Expr {
  constructor(strings, expressions) {
    super();
    this.strings = strings;
    this.expressions = expressions;
  }
  accept(visitor) { return visitor.visitTemplateLiteralExpr(this); }
}

export class TaggedTemplate extends Expr {
  constructor(tag, template) {
    super();
    this.tag = tag;
    this.template = template;
  }
  accept(visitor) { return visitor.visitTaggedTemplateExpr(this); }
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
  constructor(expressions) {
    super();
    this.expressions = expressions;
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

export class ForOf extends Stmt {
  constructor(name, iterable, body, isConst = false, isAsync = false) {
    super();
    this.name = name;
    this.iterable = iterable;
    this.body = body;
    this.isConst = isConst;
    this.isAsync = isAsync;
  }
  accept(visitor) { return visitor.visitForOfStmt(this); }
}

export class RentangStmt extends Stmt {
  constructor(start, end, body) {
    super();
    this.start = start;
    this.end = end; // null = just iterate from start (use as iterable)
    this.body = body;
  }
  accept(visitor) { return visitor.visitRentangStmt(this); }
}

export class Gawe extends Stmt {
  constructor(name, params, body, isAsync = false, isGenerator = false, isAbstract = false) {
    super();
    this.name = name;
    this.params = params;
    this.body = body;
    this.isAsync = isAsync;
    this.isGenerator = isGenerator;
    this.isAbstract = isAbstract;
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
  constructor(name, superclass, methods, interfaces = [], isSealed = false, isAbstract = false) {
    super();
    this.name = name;
    this.superclass = superclass;
    this.methods = methods;
    this.interfaces = interfaces; // Array of AST.Variable references
    this.isSealed = isSealed;
    this.isAbstract = isAbstract;
  }
  accept(visitor) { return visitor.visitKelasStmt(this); }
}

export class Struktur extends Stmt {
  constructor(name, fields) {
    super();
    this.name = name;
    this.fields = fields; // Array of Token (identifiers)
  }
  accept(visitor) { return visitor.visitStrukturStmt(this); }
}

export class WangunStmt extends Stmt {
  constructor(name, methods, properties) {
    super();
    this.name = name;
    this.methods = methods; // Array of {name, params, returnType}
    this.properties = properties; // Array of {name, type, isReadOnly}
  }
  accept(visitor) { return visitor.visitWangunStmt(this); }
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
  constructor(keyword, label = null) {
    super();
    this.keyword = keyword;
    this.label = label;
  }
  accept(visitor) { return visitor.visitMandekStmt(this); }
}

export class Ngenteni extends Stmt {
  constructor(keyword, amount, unit = null) {
    super();
    this.keyword = keyword;
    this.amount = amount; // Expr - the amount of time
    this.unit = unit; // Token - DETIK, MENIT, JAM, DINO, or null for milliseconds
  }
  accept(visitor) { return visitor.visitNgenteniStmt(this); }
}

export class Lanjutno extends Stmt {
  constructor(keyword, label = null) {
    super();
    this.keyword = keyword;
    this.label = label;
  }
  accept(visitor) { return visitor.visitLanjutnoStmt(this); }
}

export class LabeledStmt extends Stmt {
  constructor(name, stmt) {
    super();
    this.name = name;
    this.stmt = stmt;
  }
  accept(visitor) { return visitor.visitLabeledStmt(this); }
}

export class Command extends Stmt {
  constructor(name) {
    super();
    this.name = name; // string, e.g., 'clear' or 'credits'
  }
  accept(visitor) { return visitor.visitCommandStmt(this); }
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

export class EnumStmt extends Stmt {
  constructor(name, variants) {
    super();
    this.name = name;
    this.variants = variants; // Array of {name, value, explicit}
  }
  accept(visitor) { return visitor.visitEnumStmt(this); }
}

export class MatchStmt extends Stmt {
  constructor(expression, arms, defaultBranch) {
    super();
    this.expression = expression;
    this.arms = arms; // Array of {patterns, guard, body}
    this.defaultBranch = defaultBranch;
  }
  accept(visitor) { return visitor.visitMatchStmt(this); }
}

export class LiteralPattern { constructor(value) { this.value = value; } }
export class BindingPattern { constructor(name) { this.name = name; } }
export class WildcardPattern {}
export class ArrayPattern { constructor(elements, rest) { this.elements = elements; this.rest = rest; } }
export class ObjectPattern { constructor(properties, rest) { this.properties = properties; this.rest = rest; } }

export class MetoknoStmt extends Stmt {
  constructor(kind, items) {
    super();
    this.kind = kind; // 'named' | 'default' | 'all'
    this.items = items; // For 'named': [{name}]; for 'default': [expr]; for 'all': []
  }
  accept(visitor) { return visitor.visitMetoknoStmt(this); }
}

export class JupuknoStmt extends Stmt {
  constructor(kind, items, source) {
    super();
    this.kind = kind; // 'named' | 'default' | 'all' | 'simple'
    this.items = items; // For 'named': [{name, alias}]; for 'default': [name]; for 'all': [alias]
    this.source = source; // string path
  }
  accept(visitor) { return visitor.visitJupuknoStmt(this); }
}
