import fs from 'fs';
import path from 'path';
import { Lexer } from './src/lexer.js';
import { Parser } from './src/parser.js';
import { Interpreter } from './src/interpreter.js';

const file = process.argv[2];
if (!file) {
    console.error("Usage: node run-test.js <file.jawa>");
    process.exit(1);
}

const code = fs.readFileSync(file, 'utf8');
try {
    const lexer = new Lexer(code);
    const tokens = lexer.scanTokens();
    const parser = new Parser(tokens);
    const statements = parser.parse();
    
    const interpreter = new Interpreter();
    await interpreter.interpret(statements);
} catch (e) {
    console.error(e);
}
