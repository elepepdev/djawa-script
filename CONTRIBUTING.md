# Contributing to DjawaScript (JPL)

Thank you for your interest! Every contribution helps make JPL a more complete language.

## Code of Conduct

Be respectful, inclusive, and constructive. No harassment, discrimination, or personal attacks.

## How to Contribute

### Report Bugs
- Open an issue with a minimal `.jawa` file that reproduces the bug
- Include the error message and expected behavior

### Suggest Features
- Open an issue describing the feature, its syntax, and use case
- Check ROADMAP.md first

### Submit Code
1. Fork the repo
2. Create a branch: `git checkout -b feat/my-feature`
3. Make your changes
4. Run tests: `npm test`
5. Add tests for new features
6. Commit with [conventional commits](https://www.conventionalcommits.org/)
7. Push and open a Pull Request

## Development Setup

```bash
git clone https://github.com/gegesteorngoding/djawa-script.git
cd djawa-script
npm install
npm test
```

## Code Conventions

- Follow existing style (indentation, naming)
- Error messages in **Javanese** (ngoko register)
- Test every new feature with a `.jawa` file in `tests/features/`
- Keep snapshot tests deterministic (no Date.now(), Math.random())
- All tests must pass before merging

## Project Structure

```
src/
  tokens.js      — Token definitions and keyword map
  lexer.js       — Tokenizer (source → tokens)
  parser.js      — Recursive descent parser (tokens → AST)
  ast.js         — AST node classes (visitor pattern)
  interpreter.js — Tree-walking interpreter
  environment.js — Scope chain (lexical scoping)
  runtime.js     — (reserved for future use)
cli.js           — CLI runner + REPL
tests/
  features/      — .jawa integration tests
  interpreter.test.js — Jest test runner
```

## Testing

```bash
npm test                    # full suite
node --test tests/lexer.test.js    # lexer unit tests
```

## Questions?

Open a discussion or issue. We're building this together.
