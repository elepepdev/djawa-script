#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Lexer } from './src/lexer.js';
import { Parser } from './src/parser.js';
import { Interpreter } from './src/interpreter.js';
import { Formatter } from './src/formatter.js';
import { fileURLToPath } from 'url';

function showHelp() {
  console.log(`
=== JPL (Javanese Programming Language) ===

Usage: djawa [options] [file]

Commands:
  <file.jawa>        Run a .jawa file directly.
  fmt <file>         Format a .jawa file (in-place).
  fmt --check <file> Check formatting without modifying.
  fmt --stdout <file> Print formatted output to stdout.
  repl               Start the interactive Javanese shell.
  version, -v        Show the version of DjawaScript.
  help, -h           Show this help message.

Aliases:
  run <file>         Alias for running a .jawa file (backward compatible).

Example:
  djawa hello.jawa
  djawa fmt test.jawa

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
  let buffer = "";
  let blockDepth = 0;

  console.log("DjawaScript REPL v2.3.0");
  console.log("Ketik 'metu' utowo pencet Ctrl+C kanggo metu.");

  rl.setPrompt('djawa> ');
  rl.prompt();

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (trimmed === 'metu') {
      rl.close();
      return;
    }

    if (trimmed === '') {
      rl.prompt();
      return;
    }

    // Hitung blok
    const terusCount = (line.match(/terus/g) || []).length;
    const mbariCount = (line.match(/mbari/g) || []).length;
    blockDepth += (terusCount - mbariCount);

    buffer += line + '\n';

    if (blockDepth > 0) {
      rl.setPrompt('....> ');
      rl.prompt();
      return;
    }

    // Jika blok selesai, eksekusi
    try {
      const lexer = new Lexer(buffer);
      const tokens = lexer.scanTokens();
      const parser = new Parser(tokens);
      const statements = parser.parse();

      await interpreter.interpret(statements);
    } catch (error) {
      console.error('Error:', error.message);
      buffer = "";
      blockDepth = 0;
    }

    buffer = ""; // Reset
    blockDepth = 0; // Reset
    rl.setPrompt('djawa> ');
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
    interpreter.currentDir = path.dirname(absolutePath);
    await interpreter.interpret(statements);
  } catch (error) {
    console.error('Error nalika nglakokake kode:');
    console.error(error.message);
    process.exit(1);
  }
}

function formatFile(fileName, opts = {}) {
  const absolutePath = path.resolve(fileName);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File ora ono ing '${absolutePath}'`);
    process.exit(1);
  }

  const code = fs.readFileSync(absolutePath, 'utf8');
  try {
    const lexer = new Lexer(code);
    const tokens = lexer.scanTokens();
    const parser = new Parser(tokens, { recover: true });
    const statements = parser.parse();

    const formatter = new Formatter();
    const formatted = formatter.format(statements);

    if (opts.check) {
      if (code !== formatted) {
        console.error(`${fileName}: Format ora cocok.`);
        process.exit(1);
      }
      console.log(`${fileName}: Format wis rapi.`);
    } else if (opts.stdout) {
      console.log(formatted);
    } else {
      fs.writeFileSync(absolutePath, formatted, 'utf8');
      console.log(`Formatted: ${fileName}`);
    }
  } catch (error) {
    console.error('Error nalika format:');
    console.error(error.message);
  }
}

const args = process.argv.slice(2); 

if (args.includes('--niggaplsmakemycodeworks')) {
  console.log('You stupid nigga.');
  process.exit(0);
}

if (args.includes('--plsmakemycodeworks')) {
  console.log('No.');
  process.exit(0);
}

const command = args[0];

function extractOpts(validFlags) {
  const opts = {};
  const rest = [];
  for (const arg of args.slice(1)) {
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (validFlags.includes(key)) opts[key] = true;
    } else {
      rest.push(arg);
    }
  }
  opts._ = rest;
  return opts;
}

switch (command) {
  case 'run':
    {
      const opts = extractOpts([]);
      const fileName = opts._[0];
      if (!fileName) {
        console.error('Error: Monggo lebokake jeneng file .jawa');
      } else {
        runFile(fileName);
      }
    }
    break;

  case 'fmt':
    {
      const opts = extractOpts(['check', 'stdout']);
      const fileName = opts._[0];
      if (!fileName) {
        console.error('Error: Monggo lebokake jeneng file .jawa');
      } else {
        formatFile(fileName, { check: opts.check, stdout: opts.stdout });
      }
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
    if (command && command.endsWith('.jawa')) {
      runFile(command);
    } else {
      console.error(`Error: Command '${command}' ora dingerteni.`);
      showHelp();
    }
    break;
}
