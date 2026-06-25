/* ===========================
   JPL Documentation — App JS
   =========================== */

(function () {
  'use strict';

  // ---- Language Detection ----
  const isEnglish = window.location.pathname.includes('/en/');

  // ---- Search Data (Javanese/Indonesian) ----
  const searchDataJv = [
    // Memulai
    { id: 'quickstart', section: 'Memulai', title: 'Mulai Cepat', keywords: 'install npm djawa halo jawa program pertama terminal' },
    // Konsep Dasar
    { id: 'blocks', section: 'Konsep Dasar', title: 'Blok Kode', keywords: 'terus mbari blok kurawal code block scope' },
    { id: 'comments', section: 'Konsep Dasar', title: 'Komentar', keywords: 'komentar comment slash bintang multi baris' },
    { id: 'variables', section: 'Konsep Dasar', title: 'Variabel', keywords: 'iki iku jarno const let variabel variable mutable immutable' },
    { id: 'destructuring', section: 'Konsep Dasar', title: 'Destructuring', keywords: 'destructuring array objek object unpacking pejah' },
    { id: 'datatypes', section: 'Konsep Dasar', title: 'Tipe Data', keywords: 'tipe data type number string boolean null undefined array object tenan gak kosong oraDidefinisikan' },
    { id: 'numeric-separator', section: 'Konsep Dasar', title: 'Numeric Separator', keywords: 'numeric separator underscore ribuan angka' },
    { id: 'raw-string', section: 'Konsep Dasar', title: 'Raw String', keywords: 'raw string backtick template literal mentah' },
    { id: 'regexp', section: 'Konsep Dasar', title: 'RegExp Literal', keywords: 'regexp regex regular expression pola' },
    { id: 'console', section: 'Konsep Dasar', title: 'Konsol & Input', keywords: 'cetakno console log input tampa takon peringatan kesalahan info debug tabel grup waktu' },
    { id: 'typesystem', section: 'Konsep Dasar', title: 'Sistem Tipe', keywords: 'sistem tipe type system static dynamic duck typing Angka Teks Logika Kosong OraDidefinisikan Daftar Obyek Sembarang OraOno' },
    // Kontrol Alur
    { id: 'conditionals', section: 'Kontrol Alur', title: 'Kondisional', keywords: 'lek if else kondisional conditional lek misale liyane yen menawi utowo' },
    { id: 'ternary', section: 'Kontrol Alur', title: 'Ternary', keywords: 'ternary operator kondisional singkat ta lek gak' },
    { id: 'loops', section: 'Kontrol Alur', title: 'Perulangan', keywords: 'for ulang perulangan loop while selagi kanggo mandek lanjutno saksuwene mbaleni' },
    { id: 'range', section: 'Kontrol Alur', title: 'Range Iterator', keywords: 'range iterator .. span perulangan rentang' },
    { id: 'labels', section: 'Kontrol Alur', title: 'Label Statements', keywords: 'label statement break continue' },
    { id: 'async-iterator', section: 'Kontrol Alur', title: 'Async Iterator', keywords: 'async iterator for await tenangan' },
    { id: 'switch', section: 'Kontrol Alur', title: 'Switch', keywords: 'switch pilih case break default kalo yowes' },
    { id: 'pattern', section: 'Kontrol Alur', title: 'Pattern Matching', keywords: 'pattern matching kalo cocok when dadi binding wildcard array object' },
    // Fungsi
    { id: 'functions', section: 'Fungsi', title: 'Fungsi Biasa', keywords: 'fungsi function gawe balekno return carane susuk' },
    { id: 'arrow', section: 'Fungsi', title: 'Arrow Function', keywords: 'arrow function panah panah fungsi lambda lakoni' },
    { id: 'rest-spread', section: 'Fungsi', title: 'Rest & Spread', keywords: 'rest spread parameter ... titik tiga' },
    { id: 'generator', section: 'Fungsi', title: 'Generator', keywords: 'generator yield function bintang asilno tenangan' },
    { id: 'async', section: 'Fungsi', title: 'Async/Await', keywords: 'async await promise asynchronous tenangan enteni' },
    { id: 'tagged-template', section: 'Fungsi', title: 'Tagged Template', keywords: 'tagged template literal tag function' },
    // Error Handling
    { id: 'error', section: 'Error Handling', title: 'Try/Catch', keywords: 'try catch error kesalahan lempar lemparan cobak nyekel pungkasan uncalen luput' },
    { id: 'assertion', section: 'Error Handling', title: 'Asersi (pasten)', keywords: 'assert asersi pasten pastenPodo assertion validate validasi' },
    // Operator
    { id: 'arithmetic', section: 'Operator', title: 'Aritmatika & Penugasan', keywords: 'aritmatika arithmetic tambah kurang kali bagi modulo penugasan assignment yoiku tambahKaro kurangKaro pingKaro bagiKaro sisoKaro pangkat' },
    { id: 'comparison', section: 'Operator', title: 'Perbandingan & Logika', keywords: 'perbandingan comparison logical logika == === != !== greater less and or not && || ! plek podo gakPlek gakPodo luwihGedhe luwihCilik luwihGedhePodo luwihCilikPodo lan utawa ora' },
    { id: 'special-ops', section: 'Operator', title: 'Khusus', keywords: 'operator khusus special typeof instanceof in ikuJinise tipene hapusen kosongno ing' },
    { id: 'optional-chaining', section: 'Operator', title: 'Optional Chaining', keywords: 'optional chaining ?. titik tanya mungkin' },
    { id: 'nullish', section: 'Operator', title: 'Nullish Coalescing', keywords: 'nullish coalescing ?? operator utowoYenKosong' },
    { id: 'bitwise', section: 'Operator', title: 'Bitwise', keywords: 'bitwise and or xor not shift lanbit utawabit xor walik geserKiwo geserTengen geserTengenNol' },
    // Fitur Unik
    { id: 'nullcheck', section: 'Fitur Unik', title: 'Pengecekan Null', keywords: 'null check kosong opsional iku ono iku ilang' },
    { id: 'tuple', section: 'Fitur Unik', title: 'Tuple', keywords: 'tuple pasangan tetap immutable' },
    { id: 'ngenteni', section: 'Fitur Unik', title: 'Ngenteni (Tunggu)', keywords: 'ngenteni sleep wait tunggu jeda delay detik menit jam dino millisecond promise async' },
    // Sintaks Lainnya
    { id: 'optional-parens', section: 'Sintaks Lainnya', title: 'Tanda Kurung Opsional', keywords: 'optional parentheses kurung opsional' },
    { id: 'special-keywords', section: 'Sintaks Lainnya', title: 'Kata Kunci Khusus', keywords: 'kata kunci khusus special keywords iki soko debug tetep entuk pasang' },
    { id: 'alt-keywords', section: 'Sintaks Lainnya', title: 'Kata Kunci Alternatif', keywords: 'kata kunci alternatif alternative keywords synonym carane susuk ngomong yo mari saestu iyo mbelgedhes muspro luput yen menawi utowo saksuwene mbaleni' },
    // OOP
    { id: 'classes', section: 'OOP', title: 'Kelas', keywords: 'kelas class objek object method properti constructor kelas turunan soko wujudno induk this' },
    { id: 'enum', section: 'OOP', title: 'Enum', keywords: 'enum enumerasi enumerasi tipe data cacah' },
    { id: 'sealed', section: 'OOP', title: 'Sealed Class', keywords: 'sealed class tertutup final katutup' },
    { id: 'abstract', section: 'OOP', title: 'Abstract Class', keywords: 'abstract class abstrak dasar' },
    { id: 'interface', section: 'OOP', title: 'Interface', keywords: 'interface antarmuka kontrak wangun nurut' },
    { id: 'struct', section: 'OOP', title: 'Struct', keywords: 'struct struktur data' },
    // Modul
    { id: 'modules', section: 'Modul', title: 'Sistem Modul', keywords: 'modul module import ekspor export jupukno metokno biasane dadi kabeh' },
    { id: 'reexport', section: 'Modul', title: 'Re-export & Dynamic Import', keywords: 'reexport dynamic import muat dinamis' },
    { id: 'metaprogramming', section: 'Modul', title: 'Metaprogramming', keywords: 'metaprogramming refleksi reflection Perantara Pantulan Proxy Reflect' },
    // Standard Library
    { id: 'globals', section: 'Standard Library', title: 'Global & Konstruktor', keywords: 'global konstruktor constructor number string boolean array object Daftar Obyek Teks Angka Logika Simbol Peta Kumpulan Janji Kesalahan PolaTeks' },
    { id: 'math', section: 'Standard Library', title: 'Mtk (Math)', keywords: 'mtk math matematika pi akar absolut Mtk.PI Mtk.E Mtk.SQRT2 Mtk.acak Mtk.bunder Mtk.ngisor Mtk.nduwur Mtk.mutlak Mtk.pangkat Mtk.oyot Mtk.palingDhuwur Mtk.palingNgisor Mtk.sin Mtk.cos Mtk.tan Mtk.log Mtk.exp Mtk.cbrt Mtk.trunc Mtk.sign Mtk.hypot' },
    { id: 'date', section: 'Standard Library', title: 'Tanggalan (Date)', keywords: 'tanggalan date tanggal waktu time Tanggalan.saiki Tanggalan.anyar' },
    { id: 'json', section: 'Standard Library', title: 'JSON', keywords: 'json parse stringify JSON.obyek JSON.tulisan' },
    { id: 'global-fns', section: 'Standard Library', title: 'Fungsi Global', keywords: 'fungsi global global function parse int float ikiGudukAngka jadiknoInt jadiknoFloat ikiTerbatas uraiURI enkodeURI uraiBagianURI enkodeBagianURI setWaktuTunda hapusWaktuTunda setWaktuInterval hapusWaktuInterval' },
    { id: 'wektu', section: 'Standard Library', title: 'Wektu (Time)', keywords: 'wektu time timer setTimeout setInterval Wektu.ngenteni Wektu.mbaleni Wektu.mandek' },
    { id: 'koneksi', section: 'Standard Library', title: 'Koneksi (Connection)', keywords: 'koneksi connection http fetch api jaluk kirim dandani busak get post put delete response status header json teks' },
    { id: 'sugih', section: 'Standard Library', title: 'Sugih (Rich Terminal)', keywords: 'sugih rich terminal warna color abang ijo biru kuning ungu cyan putih ireng abu kandel bold miring italic garisNgisor underline nyabrang strikethrough remang dim latar background panel tabel table progress bar logging info sukses wigati galat error judul heading coba inspect JSON cantik pedhot separator kolom columns pandu tulis gaweTabel gawePanel gaweBar' },
    { id: 'berkas', section: 'Standard Library', title: 'Berkas (File I/O)', keywords: 'berkas file io i/o maca baca tulis kopi copy pindah move busak delete gantiJeneng rename ono exists info stats folder directory gaweFolder gaweFolderBertingkat dhaptarFolder dhaptarFolderJero list sambung join rampung resolve jeneng basename direktori dirname ekstensi extension pisah parse path' },
    { id: 'builtin-objects', section: 'Standard Library', title: 'Objek Tambahan', keywords: 'objek built-in map set weakmap weakset Himpunan PetaLemah HimpunanLemah URL URLParamCari' },
    { id: 'promise-methods', section: 'Standard Library', title: 'Promise Methods', keywords: 'promise method all race resolve reject .banjur .nyekel' },
    { id: 'array-methods', section: 'Standard Library', title: 'Method Array', keywords: 'array method map filter reduce find sort dorong jupukPungkasan geser tambahNgarep sambung sambungake walik urutake golek golekIndeks saring petakake kanggoSaben suda ratakan petakRata isi isien gabungno ana kabeh kurangi temokake temokakeIndeks' },
    { id: 'string-methods', section: 'Standard Library', title: 'Method String', keywords: 'string method upper lower trim split replace gedekno cilikno rapikno gantien gantienKabeh pecahan dimulaiKaro diakhiriKaro tambahiNgarep tambahiMburi potonganTeks karakterKe cocokno goleki' },
    { id: 'shared-methods', section: 'Standard Library', title: 'Method Bersama', keywords: 'shared method array string length includes slice dawane ngemot iris gabung indeksSaka' },
    { id: 'cli', section: 'CLI', title: 'Referensi CLI', keywords: 'cli command perintah djawa run fmt repl make version help' },
    // Individual keyword searches
    { id: 'variables', section: 'Kata Kunci', title: 'iki iku (const)', keywords: 'iki iku const konstan tetap' },
    { id: 'variables', section: 'Kata Kunci', title: 'jarno (let)', keywords: 'jarno let variabel mutable' },
    { id: 'functions', section: 'Kata Kunci', title: 'gawe (function)', keywords: 'gawe function fungsi deklarasi' },
    { id: 'functions', section: 'Kata Kunci', title: 'balekno (return)', keywords: 'balekno return kembalikan nilai' },
    { id: 'console', section: 'Kata Kunci', title: 'cetakno (print)', keywords: 'cetakno print output console log ngomong' },
    { id: 'conditionals', section: 'Kata Kunci', title: 'lek (if)', keywords: 'lek if kondisi if' },
    { id: 'loops', section: 'Kata Kunci', title: 'selagi (while)', keywords: 'selagi while ulang' },
    { id: 'loops', section: 'Kata Kunci', title: 'kanggo (for)', keywords: 'kanggo for ulang iterasi' },
    { id: 'error', section: 'Kata Kunci', title: 'cobak (try)', keywords: 'cobak try coba' },
    { id: 'error', section: 'Kata Kunci', title: 'nyekel (catch)', keywords: 'nyekel catch tangkap error' },
    { id: 'error', section: 'Kata Kunci', title: 'uncalen (throw)', keywords: 'uncalen throw lempar luput' },
    { id: 'async', section: 'Kata Kunci', title: 'tenangan (async)', keywords: 'tenangan async asynchronous' },
    { id: 'async', section: 'Kata Kunci', title: 'enteni (await)', keywords: 'enteni await tunggu promise' },
    { id: 'ngenteni', section: 'Kata Kunci', title: 'ngenteni (sleep)', keywords: 'ngenteni sleep wait tunggu jeda delay' },
    { id: 'classes', section: 'Kata Kunci', title: 'kelas (class)', keywords: 'kelas class objek' },
    { id: 'classes', section: 'Kata Kunci', title: 'wujudno (constructor)', keywords: 'wujudno constructor pembuat' },
    { id: 'classes', section: 'Kata Kunci', title: 'iki (this)', keywords: 'iki this diri' },
  ];

  // ---- Search Data (English) ----
  const searchDataEn = [
    // Getting Started
    { id: 'quickstart', section: 'Getting Started', title: 'Quick Start', keywords: 'install npm djawa hello world first program terminal' },
    // Core Concepts
    { id: 'blocks', section: 'Core Concepts', title: 'Code Blocks', keywords: 'block curly braces scope terus mbari' },
    { id: 'comments', section: 'Core Concepts', title: 'Comments', keywords: 'comment slash asterisk multi line komentar' },
    { id: 'variables', section: 'Core Concepts', title: 'Variables', keywords: 'const let variable immutable mutable iki iku jarno' },
    { id: 'destructuring', section: 'Core Concepts', title: 'Destructuring', keywords: 'destructuring array object unpacking pejah' },
    { id: 'datatypes', section: 'Core Concepts', title: 'Data Types', keywords: 'data type number string boolean null undefined array object tenan gak Empty Undefined List Object Any Nothing' },
    { id: 'numeric-separator', section: 'Core Concepts', title: 'Numeric Separator', keywords: 'numeric separator underscore thousands number' },
    { id: 'raw-string', section: 'Core Concepts', title: 'Raw String', keywords: 'raw string backtick template literal mentah' },
    { id: 'regexp', section: 'Core Concepts', title: 'RegExp Literal', keywords: 'regexp regex regular expression pattern' },
    { id: 'console', section: 'Core Concepts', title: 'Console & Input', keywords: 'print console log input read warn error info debug table group time' },
    { id: 'typesystem', section: 'Core Concepts', title: 'Type System', keywords: 'type system static dynamic duck typing Number Text Boolean Empty Undefined List Object Any Nothing' },
    // Control Flow
    { id: 'conditionals', section: 'Control Flow', title: 'Conditionals', keywords: 'if else conditional lek misale liyane yen menawi utowo' },
    { id: 'ternary', section: 'Control Flow', title: 'Ternary', keywords: 'ternary operator conditional short ta lek gak' },
    { id: 'loops', section: 'Control Flow', title: 'Loops', keywords: 'for loop while repeat iterate break continue saksuwene mbaleni' },
    { id: 'range', section: 'Control Flow', title: 'Range Iterator', keywords: 'range iterator .. span loop rentang' },
    { id: 'labels', section: 'Control Flow', title: 'Label Statements', keywords: 'label statement break continue' },
    { id: 'async-iterator', section: 'Control Flow', title: 'Async Iterator', keywords: 'async iterator for await tenangan' },
    { id: 'switch', section: 'Control Flow', title: 'Switch', keywords: 'switch select case break default kalo yowes' },
    { id: 'pattern', section: 'Control Flow', title: 'Pattern Matching', keywords: 'pattern matching kalo cocok when dadi binding wildcard array object' },
    // Functions
    { id: 'functions', section: 'Functions', title: 'Regular Functions', keywords: 'function define return carane susuk gawe balekno' },
    { id: 'arrow', section: 'Functions', title: 'Arrow Function', keywords: 'arrow function panah panah lambda lakoni' },
    { id: 'rest-spread', section: 'Functions', title: 'Rest & Spread', keywords: 'rest spread parameter ... ellipsis' },
    { id: 'generator', section: 'Functions', title: 'Generator', keywords: 'generator yield function asterisk tenangan' },
    { id: 'async', section: 'Functions', title: 'Async/Await', keywords: 'async await promise asynchronous tenangan enteni' },
    { id: 'tagged-template', section: 'Functions', title: 'Tagged Template', keywords: 'tagged template literal tag function' },
    // Error Handling
    { id: 'error', section: 'Error Handling', title: 'Try/Catch', keywords: 'try catch error throw cobak nyekel pungkasan uncalen luput' },
    { id: 'assertion', section: 'Error Handling', title: 'Assertions (pasten)', keywords: 'assert assertion validate pasten pastenPodo' },
    // Operators
    { id: 'arithmetic', section: 'Operators', title: 'Arithmetic & Assignment', keywords: 'arithmetic add subtract multiply modulo assignment plus times divided minus plusEquals' },
    { id: 'comparison', section: 'Operators', title: 'Comparison & Logical', keywords: 'comparison logical == === != !== greater less and or not && || ! plek podo lan utawa ora' },
    { id: 'special-ops', section: 'Operators', title: 'Special', keywords: 'operator special typeof instanceof in ikuJinise tipene hapusen kosongno ing' },
    { id: 'optional-chaining', section: 'Operators', title: 'Optional Chaining', keywords: 'optional chaining ?. dot question maybe' },
    { id: 'nullish', section: 'Operators', title: 'Nullish Coalescing', keywords: 'nullish coalescing ?? operator nullish' },
    { id: 'bitwise', section: 'Operators', title: 'Bitwise', keywords: 'bitwise and or xor not shift' },
    // Unique Features
    { id: 'nullcheck', section: 'Unique Features', title: 'Null Checking', keywords: 'null check empty optional isDefined isPresent' },
    { id: 'tuple', section: 'Unique Features', title: 'Tuple', keywords: 'tuple pair immutable' },
    { id: 'ngenteni', section: 'Unique Features', title: 'Ngenteni (Sleep)', keywords: 'ngenteni sleep wait delay timer detik menit jam dino millisecond promise async' },
    // Other Syntax
    { id: 'optional-parens', section: 'Other Syntax', title: 'Optional Parentheses', keywords: 'optional parentheses kurung opsional' },
    { id: 'special-keywords', section: 'Other Syntax', title: 'Special Keywords', keywords: 'special keywords iki iku yoiku debug assert this it that' },
    { id: 'alt-keywords', section: 'Other Syntax', title: 'Alternative Keywords', keywords: 'alternative keywords synonym carane susuk ngomong yo mari saestu iyo' },
    // OOP
    { id: 'classes', section: 'OOP', title: 'Classes', keywords: 'class object method property constructor inheritance instance this kelas turunan soko wujudno induk' },
    { id: 'enum', section: 'OOP', title: 'Enum', keywords: 'enum enumeration data type cacah' },
    { id: 'sealed', section: 'OOP', title: 'Sealed Class', keywords: 'sealed class closed final katutup' },
    { id: 'abstract', section: 'OOP', title: 'Abstract Class', keywords: 'abstract class base dasar' },
    { id: 'interface', section: 'OOP', title: 'Interface', keywords: 'interface contract wangun nurut' },
    { id: 'struct', section: 'OOP', title: 'Struct', keywords: 'struct structure data' },
    // Modules
    { id: 'modules', section: 'Modules', title: 'Module System', keywords: 'module import export all any jupukno metokno biasane dadi' },
    { id: 'reexport', section: 'Modules', title: 'Re-export & Dynamic Import', keywords: 'reexport dynamic import load' },
    { id: 'metaprogramming', section: 'Modules', title: 'Metaprogramming', keywords: 'metaprogramming reflection proxy reflect Perantara Pantulan' },
    // Standard Library
    { id: 'globals', section: 'Standard Library', title: 'Globals & Constructors', keywords: 'global constructor number string boolean array object Number Boolean List Text Object Symbol Map Set Promise Error RegExp' },
    { id: 'math', section: 'Standard Library', title: 'Mtk (Math)', keywords: 'mtk math pi sqrt abs Mtk.PI Mtk.E Mtk.SQRT2 Mtk.random Mtk.round Mtk.floor Mtk.ceil Mtk.min Mtk.max Mtk.abs Mtk.pow Mtk.sqrt Mtk.highest Mtk.lowest Mtk.sin Mtk.cos Mtk.tan Mtk.log Mtk.exp Mtk.cbrt Mtk.trunc Mtk.sign Mtk.hypot' },
    { id: 'date', section: 'Standard Library', title: 'Tanggalan (Date)', keywords: 'date time Date.now Date.anyar' },
    { id: 'json', section: 'Standard Library', title: 'JSON', keywords: 'json parse stringify JSON.obyek JSON.tulisan' },
    { id: 'global-fns', section: 'Standard Library', title: 'Global Functions', keywords: 'global function parseInt parseFloat isNumber toInt toFloat isFinite encodeURI decodeURI encodeURIComponent decodeURIComponent setTimeout clearTimeout setInterval clearInterval' },
    { id: 'wektu', section: 'Standard Library', title: 'Wektu (Time)', keywords: 'time timer Time.sleep Time.repeat Time.stop' },
    { id: 'koneksi', section: 'Standard Library', title: 'Koneksi (Connection)', keywords: 'koneksi connection http fetch api jaluk kirim dandani busak get post put delete response status header json teks' },
    { id: 'sugih', section: 'Standard Library', title: 'Sugih (Rich Terminal)', keywords: 'sugih rich terminal color abang red ijo green biru blue kuning yellow ungu magenta cyan putih white ireng black abu gray kandel bold miring italic garisNgisor underline nyabrang strikethrough remang dim latar background panel table progress bar logging info sukses wigati galat error judul heading coba inspect json pretty print pedhot separator kolom columns pandu tulis gaweTabel gawePanel gaweBar' },
    { id: 'berkas', section: 'Standard Library', title: 'Berkas (File I/O)', keywords: 'berkas file io i/o maca read tulis write tambah append kopi copy pindah move gantiJeneng rename busak delete ono exists info stats gaweFolder mkdir gaweFolderBertingkat recursive busakFolder rmdir busakFolderKabeh rmrf dhaptarFolder listdir dhaptarFolderJero walk sambung join rampung resolve jeneng basename direktori dirname ekstensi extension pisah parse path' },
    { id: 'builtin-objects', section: 'Standard Library', title: 'Built-in Objects', keywords: 'built-in map set weakmap weakset WeakMap WeakSet URL URLSearchParams' },
    { id: 'promise-methods', section: 'Standard Library', title: 'Promise Methods', keywords: 'promise method all race resolve reject .then .catch' },
    { id: 'array-methods', section: 'Standard Library', title: 'Array Methods', keywords: 'array method map filter reduce find sort push pop shift unshift indexOf includes slice concat flat flatten forEach some every findIndex' },
    { id: 'string-methods', section: 'Standard Library', title: 'String Methods', keywords: 'string method upper lower trim split replace replaceAll substring startsWith endsWith padStart padEnd slice indexOf charAt' },
    { id: 'shared-methods', section: 'Standard Library', title: 'Shared Methods', keywords: 'shared method array string length includes slice size contains indexOf' },
    { id: 'cli', section: 'CLI', title: 'CLI Reference', keywords: 'cli command djawa run fmt repl make version help' },
    // Individual keyword searches
    { id: 'variables', section: 'Keywords', title: 'iki / iku (const)', keywords: 'iki iku const constant immutable' },
    { id: 'variables', section: 'Keywords', title: 'jarno (let)', keywords: 'jarno let variable mutable' },
    { id: 'functions', section: 'Keywords', title: 'gawe (function)', keywords: 'gawe function define' },
    { id: 'functions', section: 'Keywords', title: 'balekno (return)', keywords: 'balekno return value' },
    { id: 'console', section: 'Keywords', title: 'cetakno (print)', keywords: 'cetakno print output console log' },
    { id: 'conditionals', section: 'Keywords', title: 'lek (if)', keywords: 'lek if condition' },
    { id: 'loops', section: 'Keywords', title: 'selagi (while)', keywords: 'selagi while loop' },
    { id: 'loops', section: 'Keywords', title: 'kanggo (for)', keywords: 'kanggo for loop iterate' },
    { id: 'error', section: 'Keywords', title: 'cobak (try)', keywords: 'cobak try catch' },
    { id: 'error', section: 'Keywords', title: 'nyekel (catch)', keywords: 'nyekel catch error' },
    { id: 'error', section: 'Keywords', title: 'uncalen (throw)', keywords: 'uncalen throw error' },
    { id: 'async', section: 'Keywords', title: 'tenangan (async)', keywords: 'tenangan async asynchronous' },
    { id: 'async', section: 'Keywords', title: 'enteni (await)', keywords: 'enteni await promise' },
    { id: 'ngenteni', section: 'Keywords', title: 'ngenteni (sleep)', keywords: 'ngenteni sleep wait delay timer' },
    { id: 'classes', section: 'Keywords', title: 'kelas (class)', keywords: 'kelas class object' },
    { id: 'classes', section: 'Keywords', title: 'wujudno (constructor)', keywords: 'wujudno constructor' },
    { id: 'classes', section: 'Keywords', title: 'iki (this)', keywords: 'iki this self' },
  ];

  const searchData = isEnglish ? searchDataEn : searchDataJv;
  const noResultText = isEnglish ? 'No results found' : 'Ora ditemukake';

  // ---- DOM Elements ----
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sections = document.querySelectorAll('section[id]');

  // ---- Search ----
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      if (!q) {
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
        return;
      }

      const matches = searchData.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = `<div class="search-result-item"><span class="result-title">${noResultText}</span></div>`;
        searchResults.classList.add('active');
        return;
      }

      searchResults.innerHTML = matches.map(m =>
        `<a href="#${m.id}" class="search-result-item">
          <span class="result-section">${m.section}</span>
          <span class="result-title">${m.title}</span>
        </a>`
      ).join('');
      searchResults.classList.add('active');
    });

    searchResults.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (link) {
        searchResults.classList.remove('active');
        searchInput.value = '';
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-box')) {
        searchResults.classList.remove('active');
      }
    });
  }

  // ---- Scroll Spy ----
  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // ---- Mobile Menu Toggle ----
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      this.classList.toggle('open');
    });
  }

  // ---- Sidebar Mobile Toggle ----
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (sidebar.classList.contains('open') &&
          !e.target.closest('.sidebar') &&
          !e.target.closest('.sidebar-toggle')) {
        sidebar.classList.remove('open');
      }
    });
  }

  // ---- Close sidebar on link click (mobile) ----
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove('open');
      }
    });
  });

})();
