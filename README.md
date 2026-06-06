[English](./README.md) | [Bahasa Indonesia](./README-ID.md)

---

# JPL — Javanese Programming Language

**JPL (Javanese Programming Language)** is an independent, interpreted programming language inspired by the Javanese language. Write code using Javanese words — JPL runs it directly through its own interpreter engine.

> Source files use the `.jawa` extension. The CLI tool is named `djawa`.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
  - [Code Blocks: `terus` & `mbari`](#code-blocks-terus--mbari)
  - [Comments](#comments)
  - [Variables](#variables)
  - [Data Types](#data-types)
  - [Console & User Input](#console--user-input)
- [Type System (Optional)](#type-system-optional)
- [Control Flow](#control-flow)
  - [Conditionals: `lek`, `lek misale`, `liyane`](#conditionals-lek-lek-misale-liyane)
  - [Ternary Operator: `ta` & `lek gak`](#ternary-operator-ta--lek-gak)
  - [Loops](#loops)
  - [Switch Statement: `pilih`](#switch-statement-pilih)
- [Functions](#functions)
  - [Regular Functions: `gawe`](#regular-functions-gawe)
  - [Arrow Functions: `lakoni`](#arrow-functions-lakoni)
  - [Generator Functions: `tenangan` & `asilno`](#generator-functions)
  - [Async Functions: `tenangan` & `enteni`](#async-functions-tenangan--enteni)
- [Error Handling](#error-handling)
- [Operators & Comparators](#operators--comparators)
  - [Arithmetic & Assignment Operators](#arithmetic--assignment-operators)
  - [Comparison & Logical Operators](#comparison--logical-operators)
  - [Special Operators](#special-operators)
  - [Optional Chaining: `.mungkin.`](#optional-chaining-mungkin)
  - [Nullish Coalescing: `utowoYenKosong`](#nullish-coalescing-utowoyenkosong)
  - [Bitwise Operators](#bitwise-operators)
- [Unique Features](#unique-features)
  - [Null/Undefined Checks: `iku ono` & `iku ilang`](#nullundefined-checks-iku-ono--iku-ilang)
  - [Tuple (Immutable Data)](#tuple-immutable-data)
- [Special Keywords](#special-keywords)
- [Object-Oriented Programming (OOP)](#object-oriented-programming-oop)
- [Module System](#module-system)
- [Metaprogramming: `Perantara` & `Pantulan`](#metaprogramming-perantara--pantulan)
- [Built-in Library](#built-in-library)
  - [Global Values & Constructors](#global-values--constructors)
  - [`Mtk` — Math Object](#mtk--math-object)
  - [`Tanggalan` — Date Object](#tanggalan--date-object)
  - [`DataJSON` — JSON Object](#datajson--json-object)
  - [Global Functions](#global-functions)
  - [Promise Methods: `.banjur` & `.nyekel`](#promise-methods-banjur--nyekel)
  - [Array Methods](#array-methods)
  - [String Methods](#string-methods)
  - [Shared Array & String Methods](#shared-array--string-methods)
- [CLI Reference](#cli-reference)

---

## Quick Start

**1. Install via npm:**
```bash
npm install -g @jawirhytam/jawirscript
```

Or install the latest version from GitHub:
```bash
npm install -g https://github.com/elepepdev/djawa-script
```

**2. Create a new file:**
```bash
djawa make hello
```

**3. Write your first program (`hello.jawa`):**
```jawascript
iki iku jeneng yoiku "Dunia"
cetakno("Halo, " tambah jeneng tambah "!")
```

**4. Run it:**
```bash
djawa run hello.jawa
```

---

## Core Concepts

### Code Blocks: `terus` & `mbari`

JPL is a **block-based** language. Every code block — whether for a function, loop, or conditional — must open with `terus` and close with `mbari`. Think of them as the `{` and `}` of JPL.

```jawascript
lek (tenan) terus
  // code inside the block
mbari
```

### Comments

```jawascript
// This is a single-line comment

/*
  This is a
  multi-line comment
*/
```

### Variables

| Keyword | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `iki iku` | `const` | Constant — cannot be reassigned |
| `jarno` | `let` | Mutable — can be reassigned |

```jawascript
// Constant variable
iki iku name yoiku "Budi"

// Mutable variable
jarno age yoiku 25
age yoiku age tambah 1  // age is now 26
```

### Data Types

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `tenan` | `true` | Boolean true |
| `gak` | `false` | Boolean false |
| `kosong` | `null` | Null value |
| `oraDidefinisikan` | `undefined` | Undefined value |

```jawascript
jarno isLearning yoiku tenan
jarno score yoiku 100
jarno message yoiku "Sugeng sinau!"
jarno nothing yoiku kosong
```

### Console & User Input

The `cetakno` keyword is JPL's equivalent of JavaScript's `console`. Use `takon` to prompt for user input.

| Method | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `cetakno(...)` | `console.log(...)` | Print output to the console |
| `cetakno.peringatan(...)` | `console.warn(...)` | Log a warning message |
| `cetakno.kesalahan(...)` | `console.error(...)` | Log an error message |
| `cetakno.info(...)` | `console.info(...)` | Log an informational message |
| `cetakno.debug(...)` | `console.debug(...)` | Log a debug message |
| `cetakno.tabel(data)` | `console.table(data)` | Display data as a table |
| `cetakno.hitung(label)` | `console.count(label)` | Log how many times this line has been called |
| `cetakno.waktu(label)` | `console.time(label)` | Start a timer |
| `cetakno.akhirWaktu(label)` | `console.timeEnd(label)` | Stop a timer and print elapsed time |
| `cetakno.grup(label)` | `console.group(label)` | Start a collapsible group in the console |
| `cetakno.akhirGrup()` | `console.groupEnd()` | End the current console group |
| `takon(message)` | `prompt(message)` | Prompt the user for input |

```jawascript
cetakno("Hello World!")

jarno yourName yoiku takon("What is your name? ")
cetakno("Welcome, " tambah yourName)

cetakno.peringatan("This is a warning!")
cetakno.kesalahan("This is an error!")

cetakno.waktu("myTimer")
// ... some operations ...
cetakno.akhirWaktu("myTimer")
```

---

## Type System (Optional)

JPL supports an **optional static type system** similar to TypeScript. Adding type annotations is not required, but it helps catch bugs early and makes code easier to understand.

**Supported Types:**

| JPL Type | JavaScript Type |
| :--- | :--- |
| `Angka` | `number` |
| `Teks` | `string` |
| `Logika` | `boolean` |
| `Kosong` | `null` |
| `OraDidefinisikan` | `undefined` |
| `Daftar` | `Array` |
| `Obyek` | `Object` |
| `Sembarang` | `any` |
| `OraOno` | `void` |

**Syntax:**

```jawascript
// Variable declarations with types
jarno age: Angka = 30
iki iku name: Teks = "Budi"
jarno isActive: Logika = tenan

// Function parameters and return types
gawe greet(name: Teks): Teks terus
  balekno "Hello " tambah name
mbari

gawe add(a: Angka, b: Angka): Angka terus
  balekno a tambah b
mbari

// Arrow function with types
jarno getAge yoiku (birthYear: Angka): Angka lakoni 2025 kurang birthYear

jarno printInfo yoiku (message: Teks, count: Angka): OraOno lakoni terus
  cetakno(message tambah ": " tambah count)
mbari
```

> **Note:** Type annotations are parsed and stored by the interpreter. Full static type enforcement is planned for a future release.

---

## Control Flow

### Conditionals: `lek`, `lek misale`, `liyane`

| Keyword | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `lek (condition)` | `if (condition)` | Executes block if condition is true |
| `lek misale (condition)` | `else if (condition)` | Additional condition check |
| `liyane` | `else` | Executes if all previous conditions are false |

```jawascript
jarno score yoiku 85

lek (score luwihGedhe 90) terus
  cetakno("Excellent")
mbari lek misale (score luwihGedhe 75) terus
  cetakno("Good")
mbari liyane terus
  cetakno("Keep practicing!")
mbari
```

### Ternary Operator: `ta` & `lek gak`

A concise inline conditional, equivalent to JavaScript's `? :` ternary.

**Syntax:** `condition ta value_if_true lek gak value_if_false`

```jawascript
// JS: const status = age >= 18 ? 'Adult' : 'Minor';

iki iku age yoiku 20
iki iku status yoiku age luwihGedhePodo 18 ta 'Adult' lek gak 'Minor'
cetakno(status)  // Output: Adult
```

### Loops

**`for` loop — `kanggo`**

```jawascript
kanggo (jarno i yoiku 0; i luwihCilik 5; i++) terus
  cetakno(i)
mbari
// Output: 0 1 2 3 4
```

**`while` loop — `selagi`**

```jawascript
jarno count yoiku 0
selagi (count luwihCilik 3) terus
  cetakno(count)
  count++
mbari
```

**`do...while` loop — `lakoni...selagi`**

The block runs at least once, even if the condition is false from the start.

```jawascript
jarno count yoiku 0
lakoni terus
  cetakno("Count: " tambah count)
  count++
mbari selagi (count luwihCilik 3)
```

**`for...in` loop — `kanggo...ing`**

Iterates over the **keys** (property names) of an object.

```jawascript
iki iku user yoiku { name: 'Sastro', age: 30, city: 'Jogja' }

kanggo (iki iku key ing user) terus
  cetakno(key tambah ": " tambah user[key])
mbari
// Output:
// name: Sastro
// age: 30
// city: Jogja
```

**`for...of` loop — `kanggo...soko`**

Iterates over the **values** of an iterable (Array, String, Map, Set, etc.).

```jawascript
iki iku fruits yoiku ['apple', 'orange', 'mango']

kanggo (iki iku fruit soko fruits) terus
  cetakno(fruit)
mbari
// Output:
// apple
// orange
// mango
```

**Loop control:**

| Keyword | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `mandek` | `break` | Exit the loop immediately |
| `lanjutno` | `continue` | Skip to the next iteration |

### Switch Statement: `pilih`

| Keyword | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `pilih (variable)` | `switch (variable)` | Start a switch statement |
| `kalo (value):` | `case (value):` | A case block |
| `yowes:` | `default:` | Default block if no case matches |
| `mandek` | `break` | Exit the switch |

```jawascript
jarno day yoiku "Monday"

pilih (day) terus
  kalo "Monday":
    cetakno("Start of the work week!")
    mandek
  kalo "Friday":
    cetakno("Almost weekend!")
    mandek
  yowes:
    cetakno("Regular day.")
mbari
```

---

## Functions

### Regular Functions: `gawe`

| Keyword | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `gawe name(params)` | `function name(params)` | Declare a function |
| `balekno value` | `return value` | Return a value |

```jawascript
gawe calculateArea(length, width) terus
  balekno length ping width
mbari

iki iku area yoiku calculateArea(10, 5)
cetakno(area)  // Output: 50
```

### Arrow Functions: `lakoni`

A shorter function syntax equivalent to JavaScript's `=>` arrow functions.

- **Single-line:** The return is implicit — no need for `balekno`.
- **Multi-line:** Wrap the body in `terus` and `mbari`, and use `balekno` explicitly.

```jawascript
// Single-line (implicit return)
// JS: const multiply = (a, b) => a * b;
iki iku multiply yoiku (a, b) lakoni a ping b
cetakno(multiply(7, 8))  // Output: 56

// Used as a callback
iki iku numbers yoiku [1, 2, 3]
iki iku doubled yoiku numbers.petakake(n lakoni n ping 2)
cetakno(doubled)  // Output: [2, 4, 6]

// Multi-line (explicit return)
iki iku greet yoiku (name) lakoni terus
  iki iku greeting yoiku "Welcome, " tambah name
  balekno greeting
mbari
cetakno(greet("Sastro"))  // Output: Welcome, Sastro
```

### Generator Functions

Use `tenangan` to declare a generator and `asilno` (`yield`) to pause and return a value.

```jawascript
gawe tenangan idGenerator() terus
  jarno id yoiku 0
  selagi (tenan) terus
    asilno id++
  mbari
mbari

jarno gen yoiku idGenerator anyar()
cetakno(gen.next().value)  // Output: 0
cetakno(gen.next().value)  // Output: 1
```

### Async Functions: `tenangan` & `enteni`

| Keyword | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `tenangan` | `async` | Declares an asynchronous function |
| `enteni` | `await` | Waits for a Promise to resolve |

```jawascript
tenangan gawe processData() terus
  cetakno("Fetching data...")
  iki iku data yoiku enteni fetchData()
  cetakno("Data received:", data)
mbari
```

---

## Error Handling

| Keyword | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `cobak` | `try` | Start a block that might throw an error |
| `nyekel (error)` | `catch (error)` | Handle the error if one is thrown |
| `pungkasan` | `finally` | Always runs, regardless of success or failure |
| `uncalen value` | `throw value` | Throw a custom error |

```jawascript
cobak terus
  uncalen "Something went wrong!"
mbari nyekel (e) terus
  cetakno("Caught error: " tambah e)
mbari pungkasan terus
  cetakno("This always runs.")
mbari
```

---

## Operators & Comparators

> **Important:** Always leave a space before and after operators.
> ✅ `5 tambah 3` &nbsp;&nbsp; ❌ `5'tambah'3`

### Arithmetic & Assignment Operators

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `tambah` | `+` | Addition |
| `kurang` | `-` | Subtraction |
| `ping` | `*` | Multiplication |
| `bagi` | `/` | Division |
| `siso` | `%` | Modulo (remainder) |
| `pangkat` | `**` | Exponentiation |
| `yoiku` | `=` | Assignment |
| `tambahKaro` | `+=` | Add and assign |
| `kurangKaro` | `-=` | Subtract and assign |
| `pingKaro` | `*=` | Multiply and assign |
| `bagiKaro` | `/=` | Divide and assign |
| `sisoKaro` | `%=` | Modulo and assign |

### Comparison & Logical Operators

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `plek` | `===` | Strict equality (value AND type match) |
| `podo` | `==` | Loose equality (value match only) |
| `gakPlek` | `!==` | Strict inequality |
| `gakPodo` | `!=` | Loose inequality |
| `luwihGedhe` | `>` | Greater than |
| `luwihCilik` | `<` | Less than |
| `luwihGedhePodo` | `>=` | Greater than or equal to |
| `luwihCilikPodo` | `<=` | Less than or equal to |
| `lan` | `&&` | Logical AND |
| `utawa` | `\|\|` | Logical OR |
| `ora` | `!` | Logical NOT |

```jawascript
iki iku a yoiku 10
iki iku b yoiku 4

jarno result yoiku a tambah b  // -> 14
cetakno(2 pangkat 3)           // -> 8

lek (result luwihGedhe 10 lan ora (a podo 0)) terus
  cetakno("Result is greater than 10 and a is not 0")
mbari

jarno myScore yoiku 100
myScore kurangKaro 10
cetakno(myScore)  // -> 90
```

### Special Operators

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `ikuJinise` | `instanceof` | Check if an object is an instance of a class |
| `tipene` | `typeof` | Get the data type of a value |
| `hapusen` | `delete` | Delete a property from an object |
| `kosongno` | `void` | Evaluate an expression and return `undefined` |
| `ing` | `in` | Check if a property exists in an object |

```jawascript
// ikuJinise (instanceof)
kelas Car terus
  wujudno(brand) terus
    iki.brand yoiku brand
  mbari
mbari
jarno myCar yoiku Car anyar("Toyota")
cetakno(myCar ikuJinise Car)  // Output: tenan

// tipene (typeof)
cetakno(tipene "hello")  // Output: string

// hapusen (delete)
jarno obj yoiku { a: 1, b: 2 }
hapusen obj.a
cetakno(obj.a)  // Output: oraDidefinisikan

// ing (in)
jarno person yoiku { name: "Budi", age: 30 }
cetakno("name" ing person)     // Output: tenan
cetakno("address" ing person)  // Output: gak
```

### Optional Chaining: `.mungkin.`

Safely access deeply nested properties without causing an error if any part of the chain is `null` or `undefined`. Equivalent to JavaScript's `?.` operator.

```jawascript
iki iku user yoiku { name: 'Sastro', address: { street: 'Jl. Kenangan' } }
iki iku emptyUser yoiku kosong

// Safe access — works fine
iki iku street yoiku user.address.mungkin.street
cetakno(street)  // Output: Jl. Kenangan

// Safe access — property doesn't exist, returns undefined instead of crashing
iki iku postal yoiku user.address.mungkin.postalCode
cetakno(postal)  // Output: undefined

// Safe access on a null object
iki iku result yoiku emptyUser.mungkin.address.mungkin.street
cetakno(result)  // Output: undefined
```

### Nullish Coalescing: `utowoYenKosong`

Returns the right-hand value only when the left-hand value is **strictly** `null` or `undefined` — unlike `utawa` (`||`), it does NOT trigger for other falsy values like `0` or `''`.

```jawascript
iki iku zeroValue yoiku 0
iki iku nullValue yoiku kosong

cetakno(zeroValue utowoYenKosong 10)  // Output: 0  (0 is not null/undefined)
cetakno(nullValue utowoYenKosong 10)  // Output: 10 (null triggers the fallback)

// Compare with logical OR (utawa)
cetakno(zeroValue utawa 10)  // Output: 10 (because 0 is falsy — different behavior!)
```

### Bitwise Operators

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `lanbit` | `&` | Bitwise AND |
| `utawabit` | `\|` | Bitwise OR |
| `xor` | `^` | Bitwise XOR |
| `walik` | `~` | Bitwise NOT |
| `geserKiwo` | `<<` | Left shift |
| `geserTengen` | `>>` | Right shift |
| `geserTengenNol` | `>>>` | Zero-fill right shift |

```jawascript
iki iku a yoiku 5  // Binary: 0101
iki iku b yoiku 3  // Binary: 0011

cetakno(a lanbit b)       // Output: 1  (0001)
cetakno(a utawabit b)     // Output: 7  (0111)
cetakno(a xor b)          // Output: 6  (0110)
cetakno(a geserKiwo 1)    // Output: 10 (1010)
cetakno(a geserTengen 1)  // Output: 2  (0010)
```

---

## Unique Features

### Null/Undefined Checks: `iku ono` & `iku ilang`

JPL provides readable keywords to check whether a variable exists or is missing — no need to write `=== null || === undefined`.

| Expression | Meaning |
| :--- | :--- |
| `variable iku ono` | Variable is **not** `null` or `undefined` |
| `variable iku ilang` | Variable **is** `null` or `undefined` |

```jawascript
jarno emptyVar yoiku kosong
jarno filledVar yoiku 42

// Check for absence
lek (emptyVar iku ilang) terus
  cetakno("emptyVar is missing.")  // This runs
mbari

// Check for presence
lek (filledVar iku ono) terus
  cetakno("filledVar exists:", filledVar)  // This runs
mbari
```

### Tuple (Immutable Data)

A `Tuple` is like an array, but its contents **cannot be changed** after creation. Use it for data that should stay constant, like coordinates or fixed pairs.

```jawascript
// Create a coordinate Tuple
iki iku coordinates yoiku tuple(10, 20)
cetakno(coordinates[0])  // Output: 10
cetakno(coordinates[1])  // Output: 20

// Attempting to change a Tuple will fail silently (or throw in strict mode)
cobak terus
  coordinates[0] yoiku 5
mbari nyekel (e) terus
  cetakno("Cannot modify a Tuple:", e.message)
mbari
cetakno(coordinates[0])  // Output: Still 10

// Tuples can hold mixed types
iki iku userInfo yoiku tuple("Budi", 28, tenan)
cetakno(userInfo[0])  // Output: Budi
cetakno(userInfo[1])  // Output: 28
```

---

## New Features (v2.1.0)

### Numeric Separator

Use underscores inside numeric literals to make large numbers readable. The underscores are ignored at runtime.

```jawascript
iki iku juta yoiku 1_000_000
iki iku hex yoiku 0xFF_FF
cetakno(juta)  // Output: 1000000
```

### Raw String

Prefix a string with `r` to disable escape sequences. Backslashes are kept as literal characters.

```jawascript
iki iku path yoiku r"C:\windows\system32\user"
cetakno(path)  // Output: C:\windows\system32\user (no escaping needed)
```

### Range Iterator

Create numeric ranges with the `..` operator. Ranges are iterable in `kanggo...soko` loops.

```jawascript
kanggo i soko 1..4 terus
  cetakno(i)  // Output: 1, 2, 3, 4
mbari

// Or use the `rentang` keyword
kanggo i soko rentang 3 terus
  cetakno(i)  // Output: 0, 1, 2
mbari
```

### Iterator Helpers

Javanese-flavored aliases for array iteration methods.

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `.kurangi(fn)` | `.reduce(...)` | Reduce to a single value |
| `.temokake(fn)` | `.find(...)` | Find first matching element |
| `.temokakeIndeks(fn)` | `.findIndex(...)` | Find first matching index |
| `.ratakan(depth?)` | `.flat(...)` | Flatten nested arrays |
| `.petakRata(fn)` | `.flatMap(...)` | Map then flatten |
| `.rangkep(n)` | `.fill(n)` | Fill with a value |

```jawascript
iki iku nums yoiku [1, 2, 3, 4, 5]
cetakno(nums.kurangi((a, b) dadi a + b, 0))  // Output: 15
cetakno(nums.temokake(x dadi x > 3))          // Output: 4
```

### RegExp Literal

Write regular expressions directly with `/.../flags` syntax.

```jawascript
iki iku pola yoiku /[0-9]+/g
iki iku emailPattern yoiku /^[^\s@]+@[^\s@]+$/
cetakno(emailPattern.tes("user@jawir.id"))  // Output: tenan (true)
cetakno(emailPattern.tes("ora-valid"))      // Output: salah (false)
```

### Enum (`cacah`)

Declare a fixed set of named constants. Each member has a numeric value (auto-incremented, or explicitly assigned).

```jawascript
cacah Werna yoiku
  abang,
  ijo,
  kuning,
  biru = 10,
  ungu
mbari

cetakno(Werna.kuning)        // Output: 2
cetakno(Werna.biru)          // Output: 10
cetakno(Werna.ikuEnum(ijo))  // Output: tenan (true)
cetakno(Werna.jenenge(10))   // Output: "biru"
cetakno(Werna.kabeh)         // Output: ["abang","ijo","kuning","biru","ungu"]
```

### Pattern Matching (`cocok`)

Branch on a value with structured patterns. Supports literal values, bindings, wildcards, array patterns, and object patterns.

```jawascript
cocok data terus
  kalo 0 dadi cetakno("nol")
  kalo 1, 2, 3 dadi cetakno("siji-siji")
  kalo x ngendi x < 0 dadi cetakno("negatif: " + x)
  kalo [1, ...sisa] dadi cetakno("kaping siji: 1, sisa: " + sisa)
  kalo { jeneng, umur } dadi cetakno("jeneng: " + jeneng + ", umur: " + umur)
  kalo _ dadi cetakno("liyane")
mbari
```

The `_` wildcard matches anything without binding.

### Inline Assertion (`pasten`)

Verify conditions and values inline. Failed assertions throw an error with a Javanese message.

```jawascript
pasten(1 + 1 plek 2)                                    // passes silently
pasten(1 + 1 plek 3, "matematika dasar")               // throws "pasten gagal: matematika dasar"
pastenPodo([1, 2, 3], [1, 2, 3])                        // deep-equality check
pastenPodo(aktual, dikarepake, "login kudu balikake token")  // custom message
```

Use these in test scripts or as runtime guards. `pastenPodo` is short for "pasten podo" (assert equals).

---

## Special Keywords

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `iki` | `this` | Refers to the current object instance |
| `soko` | `of` | Used in `kanggo...soko` (for...of) loops |
| `debug` | `debugger` | Pauses execution and invokes the debugger |
| `tetep` | `static` | Defines a static method or property on a class |
| `entuk` | `get` | Defines a getter on a class |
| `pasang` | `set` | Defines a setter on a class |

```jawascript
// tetep (static)
kelas Utility terus
  tetep gawe greet() terus
    cetakno("Hello from Utility!")
  mbari
mbari
Utility.greet()  // Output: Hello from Utility!

// entuk (get) and pasang (set)
kelas Box terus
  wujudno(width, height) terus
    iki._width yoiku width
    iki._height yoiku height
  mbari

  entuk area terus
    balekno iki._width ping iki._height
  mbari

  pasang size(value) terus
    iki._width yoiku value
    iki._height yoiku value
  mbari
mbari

jarno myBox yoiku Box anyar(5, 10)
cetakno(myBox.area)    // Output: 50
myBox.size yoiku 7
cetakno(myBox.area)    // Output: 49
```

---

## Object-Oriented Programming (OOP)

JPL supports class-based OOP with inheritance.

| Keyword | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `kelas Name` | `class Name` | Declare a class |
| `wujudno(...)` | `constructor(...)` | Class constructor |
| `turunan soko ParentClass` | `extends ParentClass` | Inherit from a parent class |
| `induk(...)` | `super(...)` | Call the parent constructor |
| `iki` | `this` | Refers to the current instance |

```jawascript
// Parent Class
kelas Animal terus
  wujudno(name) terus
    iki.name yoiku name
  mbari

  eat() terus
    cetakno(iki.name tambah " is eating.")
  mbari
mbari

// Child Class
kelas Cat turunan soko Animal terus
  wujudno(name) terus
    induk(name)
  mbari

  meow() terus
    cetakno(iki.name tambah " says Meow!")
  mbari
mbari

jarno myCat yoiku Cat anyar("Tom")
myCat.eat()   // Output: Tom is eating.
myCat.meow()  // Output: Tom says Meow!
```

---

## Module System

JPL supports ES-style modules for organizing code across multiple files.

| Keyword | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `metokno { name }` | `export { name }` | Export a named value |
| `metokno biasane value` | `export default value` | Export a default value |
| `jupukno ... soko '...'` | `import ... from '...'` | Import from a file |
| `biasane` | `default` | Used for default import/export |
| `dadi` | `as` | Rename an import |

**`util.jawa`**
```jawascript
gawe greet(name) terus
  balekno "Welcome, " tambah name
mbari

iki iku VERSION yoiku "1.0"

metokno { greet }          // Named export
metokno biasane VERSION    // Default export
```

**`app.jawa`**
```jawascript
jupukno biasane appVersion, { greet dadi sayHello } soko './util.js'

cetakno("Version:", appVersion)   // Output: Version: 1.0
cetakno(sayHello("Doni"))         // Output: Welcome, Doni
```

### Re-exporting as a Namespace

Re-export all exports from another module under a single namespace object.

```jawascript
// JS: export * as utils from './utils.js';
metokno kabeh dadi util soko './util_export.js'
```

### Dynamic Imports

Load modules on demand at runtime.

```jawascript
// JS: import('./module.js').then(module => ...)
jupukno('./dynamic_module.js')
  .banjur(module lakoni cetakno('Loaded:', module.message))
  .nyekel(error lakoni cetakno('Error:', error))
```

> **Note:** The import path must point to the **compiled `.js` file**, not the source `.jawa` file.

---

## Metaprogramming: `Perantara` & `Pantulan`

Advanced metaprogramming is supported through `Perantara` (Proxy) and `Pantulan` (Reflect).

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `Perantara` | `Proxy` | Wraps an object to intercept operations |
| `Pantulan` | `Reflect` | Provides methods for intercepted operations |
| `Pantulan.jupuk` | `Reflect.get` | Get a property from an object |
| `Pantulan.pasang` | `Reflect.set` | Set a property on an object |
| `Pantulan.bangun` | `Reflect.construct` | Construct a new object |

```jawascript
iki iku target yoiku { message: 'Hello World', value: 100 }

iki iku handler yoiku {
  // Intercept property reads
  jupuk: gawe(obj, prop) terus
    cetakno(`Getting: "${prop}"`)
    balekno Pantulan.jupuk(obj, prop)
  mbari,

  // Intercept property writes
  pasang: gawe(obj, prop, value) terus
    cetakno(`Setting "${prop}" to "${value}"`)
    lek (prop plek 'value' lan tipene value ora plek 'number') terus
      uncalen anyar Kesalahan('Value must be a number!')
    mbari
    balekno Pantulan.pasang(obj, prop, value)
  mbari
}

iki iku p yoiku anyar Perantara(target, handler)

cetakno(p.message)  // -> Getting: "message" -> Hello World
p.value yoiku 200   // -> Setting "value" to "200"

cobak terus
  p.value yoiku 'text'
mbari nyekel (e) terus
  cetakno('Error: ' tambah e.message)  // -> Error: Value must be a number!
mbari
```

---

## Built-in Library

### Global Values & Constructors

**Global values:**

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `kosong` | `null` | Null value |
| `oraDidefinisikan` | `undefined` | Undefined value |
| `gudukAngka` | `NaN` | Not-a-Number |
| `tanpaBates` | `Infinity` | Infinity |
| `globalIki` | `globalThis` | The global scope object |

**Global constructors:**

You can create new instances using either `ClassName anyar()` or `anyar ClassName()`.

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `Daftar` | `Array` | Array |
| `Obyek` | `Object` | Object |
| `Teks` | `String` | String |
| `Angka` | `Number` | Number |
| `Logika` | `Boolean` | Boolean |
| `Simbol` | `Symbol` | Symbol (unique identifier) |
| `Peta` | `Map` | Map |
| `Kumpulan` | `Set` | Set |
| `Janji` | `Promise` | Promise |
| `Kesalahan` | `Error` | Error |
| `PolaTeks` | `RegExp` | Regular Expression |

**Static Object & Array methods:**

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `Obyek.iku(v1, v2)` | `Object.is(v1, v2)` | Strict equality comparison |
| `Obyek.wenehno(target, ...src)` | `Object.assign(target, ...src)` | Copy properties from source to target |
| `Obyek.kunci(obj)` | `Object.keys(obj)` | Get array of property names |
| `Obyek.nilai(obj)` | `Object.values(obj)` | Get array of property values |
| `Obyek.entri(obj)` | `Object.entries(obj)` | Get array of `[key, value]` pairs |
| `Daftar.ikiDaftar(value)` | `Array.isArray(value)` | Check if value is an Array |

```jawascript
jarno list yoiku Daftar anyar()
cetakno(list)  // Output: []

iki iku obj1 yoiku { a: 1 }
iki iku obj2 yoiku { b: 2 }
iki iku merged yoiku Obyek.wenehno({}, obj1, obj2)
cetakno(DataJSON.stringkan(merged))  // Output: {"a":1,"b":2}
cetakno(Obyek.kunci(merged))         // Output: ['a', 'b']

// Symbol — creates a unique key that won't collide with other properties
iki iku uid yoiku Simbol('id')
iki iku user yoiku { name: 'Slamet' }
user[uid] yoiku '987-xyz'
cetakno(Obyek.kunci(user))  // Output: ['name'] (Symbol keys are hidden)
cetakno(user[uid])          // Output: 987-xyz
```

### `Mtk` — Math Object

**Constants:**

| Constant | Value | Description |
| :--- | :--- | :--- |
| `Mtk.PI` | ≈ 3.14159 | Pi |
| `Mtk.E` | ≈ 2.718 | Euler's number |
| `Mtk.LN2` | ≈ 0.693 | Natural log of 2 |
| `Mtk.LN10` | ≈ 2.303 | Natural log of 10 |
| `Mtk.SQRT2` | ≈ 1.414 | Square root of 2 |

**Functions:**

| Function | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `Mtk.acak()` | `Math.random()` | Random number between 0 and 1 |
| `Mtk.bunder(x)` | `Math.round(x)` | Round to nearest integer |
| `Mtk.ngisor(x)` | `Math.floor(x)` | Round down |
| `Mtk.nduwur(x)` | `Math.ceil(x)` | Round up |
| `Mtk.mutlak(x)` | `Math.abs(x)` | Absolute value |
| `Mtk.pangkat(base, exp)` | `Math.pow(base, exp)` | Exponentiation |
| `Mtk.oyot(x)` | `Math.sqrt(x)` | Square root |
| `Mtk.palingDhuwur(...args)` | `Math.max(...args)` | Largest value |
| `Mtk.palingNgisor(...args)` | `Math.min(...args)` | Smallest value |
| `Mtk.sin(x)` | `Math.sin(x)` | Sine |
| `Mtk.cos(x)` | `Math.cos(x)` | Cosine |
| `Mtk.tan(x)` | `Math.tan(x)` | Tangent |
| `Mtk.log(x)` | `Math.log(x)` | Natural logarithm |
| `Mtk.log2(x)` | `Math.log2(x)` | Base-2 logarithm |
| `Mtk.log10(x)` | `Math.log10(x)` | Base-10 logarithm |
| `Mtk.exp(x)` | `Math.exp(x)` | Eˣ |
| `Mtk.cbrt(x)` | `Math.cbrt(x)` | Cube root |
| `Mtk.trunc(x)` | `Math.trunc(x)` | Remove fractional part |
| `Mtk.sign(x)` | `Math.sign(x)` | Sign of a number (-1, 0, or 1) |
| `Mtk.hypot(...args)` | `Math.hypot(...args)` | Square root of sum of squares |

### `Tanggalan` — Date Object

| Method | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `Tanggalan.saiki()` | `Date.now()` | Milliseconds since Jan 1, 1970 UTC |
| `Tanggalan anyar()` | `new Date()` | Current date and time |

### `DataJSON` — JSON Object

| Method | JavaScript Equivalent | Description |
| :--- | :--- | :--- |
| `DataJSON.urai(str)` | `JSON.parse(str)` | Parse a JSON string into an object |
| `DataJSON.stringkan(obj)` | `JSON.stringify(obj)` | Convert an object to a JSON string |

### Global Functions

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `ikiGudukAngka(value)` | `isNaN(value)` | Check if a value is NaN |
| `jadiknoInt(str, radix)` | `parseInt(str, radix)` | Parse string to integer |
| `jadiknoFloat(str)` | `parseFloat(str)` | Parse string to float |
| `ikiTerbatas(value)` | `isFinite(value)` | Check if a value is a finite number |
| `uraiURI(uri)` | `decodeURI(uri)` | Decode a URI |
| `enkodeURI(uri)` | `encodeURI(uri)` | Encode a URI |
| `uraiBagianURI(str)` | `decodeURIComponent(str)` | Decode a URI component |
| `enkodeBagianURI(str)` | `encodeURIComponent(str)` | Encode a URI component |
| `setWaktuTunda(fn, ms)` | `setTimeout(fn, ms)` | Run function after a delay |
| `hapusWaktuTunda(id)` | `clearTimeout(id)` | Cancel a timeout |
| `setWaktuInterval(fn, ms)` | `setInterval(fn, ms)` | Run function repeatedly |
| `hapusWaktuInterval(id)` | `clearInterval(id)` | Cancel an interval |

```jawascript
cetakno(ikiGudukAngka("abc"))  // Output: tenan
cetakno(jadiknoInt("101", 2))  // Output: 5 (binary to decimal)
cetakno(ikiTerbatas(10 bagi 0)) // Output: gak

setWaktuTunda(gawe () terus
  cetakno("This appears after 1 second")
mbari, 1000)

jarno countdown yoiku 3
jarno intervalId yoiku setWaktuInterval(gawe () terus
  cetakno("Countdown: " tambah countdown)
  countdown kurangKaro 1
  lek (countdown plek 0) terus
    hapusWaktuInterval(intervalId)
    cetakno("Done!")
  mbari
mbari, 1000)
```

### Promise Methods: `.banjur` & `.nyekel`

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `.banjur(onFulfilled, onRejected?)` | `.then(...)` | Handle a fulfilled Promise |
| `.nyekel(onRejected)` | `.catch(...)` | Handle a rejected Promise |

```jawascript
iki iku myPromise yoiku Janji anyar((resolve, reject) dadi terus
  setWaktuTunda(() dadi resolve('Done!'), 100)
mbari)

myPromise
  .banjur(result lakoni cetakno('Success:', result))
  .nyekel(error lakoni cetakno('Error:', error))
```

### Array Methods

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `.dorong(item)` | `.push(item)` | Add item to end |
| `.jupukPungkasan()` | `.pop()` | Remove and return last item |
| `.geser()` | `.shift()` | Remove and return first item |
| `.tambahNgarep(item)` | `.unshift(item)` | Add item to front |
| `.sambung(idx, del, item?)` | `.splice(...)` | Insert or remove items |
| `.sambungake(separator)` | `.join(separator)` | Join elements into a string |
| `.walik()` | `.reverse()` | Reverse the array |
| `.urutake(fn?)` | `.sort(fn?)` | Sort the array |
| `.golek(fn)` | `.find(fn)` | Find first matching element |
| `.golekIndeks(fn)` | `.findIndex(fn)` | Find index of first match |
| `.golekIndeksPungkasan(item)` | `.lastIndexOf(item)` | Find last index of item |
| `.saring(fn)` | `.filter(fn)` | Filter elements by condition |
| `.petakake(fn)` | `.map(fn)` | Transform each element |
| `.kanggoSaben(fn)` | `.forEach(fn)` | Run function for each element |
| `.suda(fn, initial?)` | `.reduce(fn, initial?)` | Reduce to a single value |
| `.sudaTengen(fn, initial?)` | `.reduceRight(fn, initial?)` | Reduce from right to left |
| `.ana(fn)` | `.some(fn)` | Check if any element matches |
| `.kabeh(fn)` | `.every(fn)` | Check if all elements match |

### String Methods

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `.gedekno()` | `.toUpperCase()` | Convert to uppercase |
| `.cilikno()` | `.toLowerCase()` | Convert to lowercase |
| `.rapikno()` | `.trim()` | Remove leading/trailing whitespace |
| `.gantien(a, b)` | `.replace(a, b)` | Replace first match |
| `.gantienKabeh(a, b)` | `.replaceAll(a, b)` | Replace all matches |
| `.pecahen(separator)` | `.split(separator)` | Split into an array |
| `.dimulaiKaro(s)` | `.startsWith(s)` | Check if starts with string |
| `.diakhiriKaro(s)` | `.endsWith(s)` | Check if ends with string |
| `.tambahiNgarep(len, txt)` | `.padStart(len, txt)` | Pad the start |
| `.tambahiMburi(len, txt)` | `.padEnd(len, txt)` | Pad the end |
| `.potonganTeks(start, end?)` | `.substring(start, end?)` | Extract a substring |
| `.karakterKe(index)` | `.charAt(index)` | Get character at index |
| `.cocokno(regex)` | `.match(regex)` | Match against a regex |
| `.goleki(word)` | `.search(word)` | Search for a match |

### Shared Array & String Methods

These methods work on both `Daftar` (Array) and `Teks` (String).

| JPL | JavaScript | Description |
| :--- | :--- | :--- |
| `.dawane` | `.length` | Length of array or string |
| `.ngemot(item)` | `.includes(item)` | Check if item is contained |
| `.iris(start, end?)` | `.slice(start, end?)` | Extract a portion |
| `.gabung(item)` | `.concat(item)` | Concatenate arrays or strings |
| `.indeksSaka(item)` | `.indexOf(item)` | Find first index of item |

---

## CLI Reference

### Installation

Make sure [Node.js](https://nodejs.org/) is installed, then run:

```bash
npm install -g @jawirhytam/jawirscript
```

Or install directly from GitHub:
```bash
npm install -g https://github.com/elepepdev/djawa-script
```

### Commands

| Command | Description |
| :--- | :--- |
| `djawa run <file.jawa>` | Run a `.jawa` file directly |
| `djawa make <filename>` | Create a new `.jawa` file from template |
| `djawa version` / `djawa -v` | Show the current JPL version |
| `djawa help` / `djawa -h` | Show help information |