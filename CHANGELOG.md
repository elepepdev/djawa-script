# Changelog

All notable changes to this project will be documented in this file.

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
