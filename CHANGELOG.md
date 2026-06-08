# Changelog

All notable changes to this project will be documented in this file.

## [v2.3.0] — Tahap 2 Lengkap (Fase B)

### Added
- **Sealed class** (`katutup kelas`): Prefix `katutup` to prevent subclassing. Runtime error on extend attempt.
- **Abstract class** (`abstrak kelas` / `abstrak gawe`): Cannot be instantiated directly; subclasses must implement abstract methods.
- **Interface** (`wangun` / `nurut`): Define method contracts with `wangun`; classes implement with `nurut`.
- **Struct** (`struktur`): Immutable value types with frozen instances. Fields as comma-separated list.
- **Labeled statements**: `label: stmt` syntax for `mandek <label>` / `lanjutno <label>` in nested loops.
- **Async iterator**: `kanggo tenangan i soko expr terus ... mbari` (for-await-of).
- **Tagged template literals**: `` fn`...${}...` `` syntax with `TaggedTemplate` AST node.

### Removed
- **36 English keyword aliases**: All English keywords (`class`, `interface`, `extends`, `sealed`, `abstract`, `struct`, `implements`, `new`, `if`, `else`, `while`, `for`, `return`, `function`, `const`, `let`, `var`, `async`, `await`, `yield`, `try`, `catch`, `finally`, `throw`, `constructor`, `super`, `this`, `static`, `switch`, `case`, `default`, `true`, `false`, `null`, `undefined`) removed from `tokens.js` — JPL is now purely Javanese.

### Fixed
- `turunan soko` (extends) was missing from Keywords map — now works.
- 10 test cases removed (English keyword tests).

### Documentation
- Full README overhaul: Fixed Indonesian-language sections in English README (Tanda Kurung Opsional → Optional Parentheses).
- Added documentation for all Fase B features in both English and Indonesian READMEs.
- Added Destructuring, Rest & Spread documentation.
- Added `asilno kabeh` (yield*) generator enhancement documentation.
- Documented 15 alternative Javanese keyword synonyms (`carane`, `susuk`, `ngomong`, `yo`, `mari`, `saestu`, `iyo`, `mbelgedhes`, `muspro`, `luput`, `yen`, `menawi`, `utowo`, `saksuwene`, `mbaleni`).
- `DataJSON` → `JSON` with corrected method names (`tulisan`/`obyek`).
- Added `Wektu` (time utilities) and Additional Built-in Objects (`Himpunan`, `PetaLemah`, `HimpunanLemah`, `URL`, `URLParamCari`) sections.
- Updated TOC in both READMEs.

## [v2.2.0] — Tanda Kurung Opsional

### Added
- **Paren-optional syntax** (statement level): `lek`, `lek misale`, `selagi`, `pilih`, `cetakno`, `nyekel` dapat ditulis tanpa tanda kurung di sekitar argumennya, demi filosofi "berbicara kepada komputer secara langsung".
  - `lek (x > 0) terus` → `lek x > 0 terus`
  - `cetakno a, b, c` (multi-argumen tanpa kurung)
  - `nyekel e terus` (langsung identifier)
- Hybrid parser: kurung lama tetap 100% didukung — tidak ada breaking change.

### Out of Scope (tetap wajib kurung)
- Deklarasi fungsi `gawe name (params) terus` (multi-param, destructuring)
- Arrow function `(x, y) lakoni ...`
- C-style `kanggo (init; cond; incr)`
- Function call ekspresi `f (a, b)`, `tuple (a, b)`, `takon (msg)`, `new Foo (a, b)`, grouping `(expr)`

## [v2.1.0] — Tahap 1 Complete

### Added
- **Numeric separator**: `1_000_000`, `0xFF_FF`, `1_000.5` — underscores ignored in numeric literals.
- **Raw string**: `r"C:\windows\system32"` — backslashes treated literally (no escape sequences).
- **Range iterator**: `1..10`, `a..b` step ranges, and `rentang n` shorthand.
- **Iterator helpers**: `.kurangi()`, `.temokake()`, `.temokakeIndeks()`, `.ratakan()`, `.petakRata()`, `.rangkep()` — Javanese aliases for array iteration methods.
- **RegExp literal**: `/.../flags` — direct regex syntax with flags.
- **Stdlib additions**: `HimpunanLemah` (WeakSet), `PetaLemah` (WeakMap), `URL`, `URLParamCari` (URLSearchParams), `Himpunan` (callable Set).
- **JS constructor aliases**: `Daftar`, `Peta`, `Himpunan`, `Tanggalan`, `EkspresiReguler` callable as constructors.
- **Enum (cacah)**: `cacah Werna yoiku abang, ijo, kuning mbari` — declarative enums with `ikuEnum`, `jenenge`, `nilai`, `kabeh` helpers.
- **Pattern matching (cocok)**: `cocok expr terus kalo X dadi ... liyane dadi ... mbari` — literal, binding, wildcard, array, and object patterns; comma as or-pattern separator.
- **Pasten assertion**: `pasten(kondisi, pesan?)` and `pastenPodo(actual, expected, pesan?)` for inline tests.
- **Module system MVP**: `jupukno`/`metokno` keywords parse correctly with named/default/wildcard imports & exports; `loadModule()` supports relative paths.

### Fixed
- `kanggo x soko arr` for-of loop (was silently failing for some cases).
- Reserved keyword `cocok` alias to `cocokke` for `.match()` to avoid parser conflict.

## [v2.0.0]

### Change
- Migrating to Interpreter instead of using traditional Transpiler.
- Added REPL
