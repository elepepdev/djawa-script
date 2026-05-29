#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Lexer } from './src/lexer.js';
import { Parser } from './src/parser.js';
import { Interpreter } from './src/interpreter.js';
import { fileURLToPath } from 'url';

function showHelp() {
  console.log(`
=== JPL (Javanese Programming Language) ===

Usage: djawa <command> [file]

Commands:
  run <file>         Run a .jawa file using the Javanese Independent Engine.
  repl               Start the interactive Javanese shell.
  version, -v        Show the version of DjawaScript.
  help, -h           Show this help message.

Example:
  djawa run test.jawa

// I'm a new soul, I came to this strange world ~
  `);
}

function showVersion() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const packageJsonPath = path.join(__dirname, 'package.json');
  const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`JPL (Javanese Programming Language) v${version}`);
}

async function runRepl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'djawa> '
  });

  const interpreter = new Interpreter();
  console.log("DjawaScript REPL (Independent Engine)");
  console.log("Ketik 'metu' utowo pencet Ctrl+C kanggo metu.");

  rl.prompt();

  rl.on('line', (line) => {
    const trimmed = line.trim();
    if (trimmed === 'metu') {
      rl.close();
      return;
    }

    if (trimmed === '') {
      rl.prompt();
      return;
    }

    try {
      const lexer = new Lexer(line);
      const tokens = lexer.scanTokens();
      const parser = new Parser(tokens);
      const statements = parser.parse();
      
      interpreter.interpret(statements);
    } catch (error) {
      console.error('Error:', error.message);
    }

    rl.prompt();
  }).on('close', () => {
    console.log('\nMatur nuwun!');
    process.exit(0);
  });
}

async function runFile(fileName) {
  const absolutePath = path.resolve(fileName);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File ora ono ing '${absolutePath}'`);
    process.exit(1);
  }

  const code = fs.readFileSync(absolutePath, 'utf8');
  try {
    const lexer = new Lexer(code);
    const tokens = lexer.scanTokens();
    const parser = new Parser(tokens);
    const statements = parser.parse();
    
    const interpreter = new Interpreter();
    interpreter.interpret(statements);
  } catch (error) {
    console.error('Error nalika nglakokake kode:');
    console.error(error.message);
  }
}

const args = process.argv.slice(2);
const command = args[0];
const fileName = args[1];

switch (command) {
  case 'run':
    if (!fileName) {
      console.error('Error: Monggo lebokake jeneng file .jawa');
    } else {
      runFile(fileName);
    }
    break;

  case 'repl':
    runRepl();
    break;

  case 'version':
  case '-v':
    showVersion();
    break;

  case 'help':
  case '-h':
  case undefined:
    showHelp();
    break;

  default:
    console.error(`Error: Command '${command}' ora dingerteni.`);
    showHelp();
    break;
}
