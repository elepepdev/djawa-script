/* ===========================
   JPL Documentation — App JS
   =========================== */

(function () {
  'use strict';

  // ---- Language Detection ----
  const isEnglish = window.location.pathname.includes('/en/');

  // ---- Search Data (Javanese/Indonesian) ----
  const searchDataJv = [
    { id: 'quickstart', section: 'Memulai', title: 'Mulai Cepat', keywords: 'install npm djawa halo jawa program pertama terminal' },
    { id: 'blocks', section: 'Konsep Dasar', title: 'Blok Kode', keywords: 'terus mbari blok kurawal code block scope' },
    { id: 'comments', section: 'Konsep Dasar', title: 'Komentar', keywords: 'komentar comment slash bintang multi baris' },
    { id: 'variables', section: 'Konsep Dasar', title: 'Variabel', keywords: 'iki iku jarno const let variabel variable mutable immutable' },
    { id: 'destructuring', section: 'Konsep Dasar', title: 'Destructuring', keywords: 'destructuring array objek object unpacking pejah' },
    { id: 'datatypes', section: 'Konsep Dasar', title: 'Tipe Data', keywords: 'tipe data type number string boolean null undefined array object' },
    { id: 'numeric-separator', section: 'Konsep Dasar', title: 'Numeric Separator', keywords: 'numeric separator underscore ribuan angka' },
    { id: 'raw-string', section: 'Konsep Dasar', title: 'Raw String', keywords: 'raw string backtick template literal mentah' },
    { id: 'regexp', section: 'Konsep Dasar', title: 'RegExp Literal', keywords: 'regexp regex regular expression pola' },
    { id: 'console', section: 'Konsep Dasar', title: 'Konsol & Input', keywords: 'cetakno console log input tampa' },
    { id: 'typesystem', section: 'Konsep Dasar', title: 'Sistem Tipe', keywords: 'sistem tipe type system static dynamic duck typing' },
    { id: 'conditionals', section: 'Kontrol Alur', title: 'Kondisional', keywords: 'lek if else kondisional conditional' },
    { id: 'ternary', section: 'Kontrol Alur', title: 'Ternary', keywords: 'ternary operator kondisional singkat' },
    { id: 'loops', section: 'Kontrol Alur', title: 'Perulangan', keywords: 'for ulang perulangan loop while' },
    { id: 'range', section: 'Kontrol Alur', title: 'Range Iterator', keywords: 'range iterator .. span perulangan' },
    { id: 'labels', section: 'Kontrol Alur', title: 'Label Statements', keywords: 'label statement break continue' },
    { id: 'async-iterator', section: 'Kontrol Alur', title: 'Async Iterator', keywords: 'async iterator for await' },
    { id: 'switch', section: 'Kontrol Alur', title: 'Switch', keywords: 'switch pilih case break default' },
    { id: 'pattern', section: 'Kontrol Alur', title: 'Pattern Matching', keywords: 'pattern matching kalo cocok when dadi' },
    { id: 'functions', section: 'Fungsi', title: 'Fungsi Biasa', keywords: 'fungsi function function fungsi biasa fungsi' },
    { id: 'arrow', section: 'Fungsi', title: 'Arrow Function', keywords: 'arrow function panah panah fungsi lambda' },
    { id: 'rest-spread', section: 'Fungsi', title: 'Rest & Spread', keywords: 'rest spread parameter ... titik tiga' },
    { id: 'generator', section: 'Fungsi', title: 'Generator', keywords: 'generator yield function bintang' },
    { id: 'async', section: 'Fungsi', title: 'Async/Await', keywords: 'async await promise asynchronous' },
    { id: 'tagged-template', section: 'Fungsi', title: 'Tagged Template', keywords: 'tagged template literal tag function' },
    { id: 'error', section: 'Error Handling', title: 'Try/Catch', keywords: 'try catch error kesalahan lempar lemparan' },
    { id: 'assertion', section: 'Error Handling', title: 'Asersi (pasten)', keywords: 'assert asersi pasten assertion validate validasi' },
    { id: 'arithmetic', section: 'Operator', title: 'Aritmatika & Penugasan', keywords: 'aritmatika arithmetic tambah kurang kali bagi modulo penugasan assignment' },
    { id: 'comparison', section: 'Operator', title: 'Perbandingan & Logika', keywords: 'perbandingan comparison logical logika == === != !== greater less and or not && || ! plek podo lan utawa ora' },
    { id: 'special-ops', section: 'Operator', title: 'Khusus', keywords: 'operator khusus special typeof instanceof in' },
    { id: 'optional-chaining', section: 'Operator', title: 'Optional Chaining', keywords: 'optional chaining ?. titik tanya' },
    { id: 'nullish', section: 'Operator', title: 'Nullish Coalescing', keywords: 'nullish coalescing ?? operator' },
    { id: 'bitwise', section: 'Operator', title: 'Bitwise', keywords: 'bitwise and or xor not shift' },
    { id: 'nullcheck', section: 'Fitur Unik', title: 'Pengecekan Null', keywords: 'null check kosong opsional' },
    { id: 'tuple', section: 'Fitur Unik', title: 'Tuple', keywords: 'tuple pasangan tetap immutable' },
    { id: 'optional-parens', section: 'Sintaks Lainnya', title: 'Tanda Kurung Opsional', keywords: 'optional parentheses kurung opsional' },
    { id: 'special-keywords', section: 'Sintaks Lainnya', title: 'Kata Kunci Khusus', keywords: 'kata kunci khusus special keywords iki iku yoiku' },
    { id: 'alt-keywords', section: 'Sintaks Lainnya', title: 'Kata Kunci Alternatif', keywords: 'kata kunci alternatif alternative keywords synonym' },
    { id: 'classes', section: 'OOP', title: 'Kelas', keywords: 'kelas class objek object method properti constructor' },
    { id: 'enum', section: 'OOP', title: 'Enum', keywords: 'enum enumerasi enumerasi tipe data' },
    { id: 'sealed', section: 'OOP', title: 'Sealed Class', keywords: 'sealed class tertutup final' },
    { id: 'abstract', section: 'OOP', title: 'Abstract Class', keywords: 'abstract class abstrak dasar' },
    { id: 'interface', section: 'OOP', title: 'Interface', keywords: 'interface antarmuka kontrak' },
    { id: 'struct', section: 'OOP', title: 'Struct', keywords: 'struct struktur data' },
    { id: 'modules', section: 'Modul', title: 'Sistem Modul', keywords: 'modul module import ekspor export' },
    { id: 'reexport', section: 'Modul', title: 'Re-export & Dynamic Import', keywords: 'reexport dynamic import muat dinamis' },
    { id: 'metaprogramming', section: 'Modul', title: 'Metaprogramming', keywords: 'metaprogramming refleksi reflection' },
    { id: 'globals', section: 'Standard Library', title: 'Global & Konstruktor', keywords: 'global konstruktor constructor number string boolean array object' },
    { id: 'math', section: 'Standard Library', title: 'Mtk (Math)', keywords: 'mtk math matematika pi akar absolut' },
    { id: 'date', section: 'Standard Library', title: 'Tanggalan (Date)', keywords: 'tanggalan date tanggal waktu time' },
    { id: 'json', section: 'Standard Library', title: 'JSON', keywords: 'json parse stringify' },
    { id: 'global-fns', section: 'Standard Library', title: 'Fungsi Global', keywords: 'fungsi global global function parse int float' },
    { id: 'wektu', section: 'Standard Library', title: 'Wektu (Time)', keywords: 'wektu time timer setTimeout setInterval' },
    { id: 'builtin-objects', section: 'Standard Library', title: 'Objek Tambahan', keywords: 'objek built-in map set weakmap weakset' },
    { id: 'promise-methods', section: 'Standard Library', title: 'Promise Methods', keywords: 'promise method all race resolve reject' },
    { id: 'array-methods', section: 'Standard Library', title: 'Method Array', keywords: 'array method map filter reduce find sort' },
    { id: 'string-methods', section: 'Standard Library', title: 'Method String', keywords: 'string method upper lower trim split replace' },
    { id: 'shared-methods', section: 'Standard Library', title: 'Method Bersama', keywords: 'shared method array string length includes slice' },
    { id: 'cli', section: 'CLI', title: 'Referensi CLI', keywords: 'cli command perintah djawa run fmt repl make version help' },
  ];

  // ---- Search Data (English) ----
  const searchDataEn = [
    { id: 'quickstart', section: 'Getting Started', title: 'Quick Start', keywords: 'install npm djawa hello jawa program first terminal' },
    { id: 'blocks', section: 'Core Concepts', title: 'Code Blocks', keywords: 'terus mbari block curly braces scope' },
    { id: 'comments', section: 'Core Concepts', title: 'Comments', keywords: 'comment slash star multi line' },
    { id: 'variables', section: 'Core Concepts', title: 'Variables', keywords: 'iki iku jarno const let variable mutable immutable' },
    { id: 'destructuring', section: 'Core Concepts', title: 'Destructuring', keywords: 'destructuring array object unpacking' },
    { id: 'datatypes', section: 'Core Concepts', title: 'Data Types', keywords: 'data type number string boolean null undefined array object' },
    { id: 'numeric-separator', section: 'Core Concepts', title: 'Numeric Separator', keywords: 'numeric separator underscore thousands digits' },
    { id: 'raw-string', section: 'Core Concepts', title: 'Raw String', keywords: 'raw string backtick template literal' },
    { id: 'regexp', section: 'Core Concepts', title: 'RegExp Literal', keywords: 'regexp regex regular expression pattern' },
    { id: 'console', section: 'Core Concepts', title: 'Console & Input', keywords: 'cetakno console log input prompt' },
    { id: 'typesystem', section: 'Core Concepts', title: 'Type System', keywords: 'type system static dynamic duck typing' },
    { id: 'conditionals', section: 'Control Flow', title: 'Conditionals', keywords: 'lek if else conditional' },
    { id: 'ternary', section: 'Control Flow', title: 'Ternary', keywords: 'ternary operator conditional shorthand' },
    { id: 'loops', section: 'Control Flow', title: 'Loops', keywords: 'for repeat perulangan loop while' },
    { id: 'range', section: 'Control Flow', title: 'Range Iterator', keywords: 'range iterator .. span loop' },
    { id: 'labels', section: 'Control Flow', title: 'Label Statements', keywords: 'label statement break continue' },
    { id: 'async-iterator', section: 'Control Flow', title: 'Async Iterator', keywords: 'async iterator for await' },
    { id: 'switch', section: 'Control Flow', title: 'Switch', keywords: 'switch select case break default' },
    { id: 'pattern', section: 'Control Flow', title: 'Pattern Matching', keywords: 'pattern matching if matches when becomes' },
    { id: 'functions', section: 'Functions', title: 'Regular Functions', keywords: 'function function regular function' },
    { id: 'arrow', section: 'Functions', title: 'Arrow Function', keywords: 'arrow function arrow lambda' },
    { id: 'rest-spread', section: 'Functions', title: 'Rest & Spread', keywords: 'rest spread parameter ... triple dots' },
    { id: 'generator', section: 'Functions', title: 'Generator', keywords: 'generator yield function star' },
    { id: 'async', section: 'Functions', title: 'Async/Await', keywords: 'async await promise asynchronous' },
    { id: 'tagged-template', section: 'Functions', title: 'Tagged Template', keywords: 'tagged template literal tag function' },
    { id: 'error', section: 'Error Handling', title: 'Try/Catch', keywords: 'try catch error exception throw' },
    { id: 'assertion', section: 'Error Handling', title: 'Assertion (pasten)', keywords: 'assert asersi pasten assertion validate validation' },
    { id: 'arithmetic', section: 'Operators', title: 'Arithmetic & Assignment', keywords: 'arithmetic add subtract multiply divide modulo assignment' },
    { id: 'comparison', section: 'Operators', title: 'Comparison & Logic', keywords: 'comparison logical logic == === != !== greater less and or not && || !' },
    { id: 'special-ops', section: 'Operators', title: 'Special', keywords: 'special operator typeof instanceof in' },
    { id: 'optional-chaining', section: 'Operators', title: 'Optional Chaining', keywords: 'optional chaining ?. question mark' },
    { id: 'nullish', section: 'Operators', title: 'Nullish Coalescing', keywords: 'nullish coalescing ?? operator' },
    { id: 'bitwise', section: 'Operators', title: 'Bitwise', keywords: 'bitwise and or xor not shift' },
    { id: 'nullcheck', section: 'Unique Features', title: 'Null Checking', keywords: 'null check empty optional' },
    { id: 'tuple', section: 'Unique Features', title: 'Tuple', keywords: 'tuple fixed pair immutable' },
    { id: 'optional-parens', section: 'Other Syntax', title: 'Optional Parentheses', keywords: 'optional parentheses' },
    { id: 'special-keywords', section: 'Other Syntax', title: 'Special Keywords', keywords: 'special keywords iki iku yoiku' },
    { id: 'alt-keywords', section: 'Other Syntax', title: 'Alternative Keywords', keywords: 'alternative keywords synonym' },
    { id: 'classes', section: 'OOP', title: 'Classes', keywords: 'class object method property constructor' },
    { id: 'enum', section: 'OOP', title: 'Enum', keywords: 'enum enumeration type data' },
    { id: 'sealed', section: 'OOP', title: 'Sealed Class', keywords: 'sealed class closed final' },
    { id: 'abstract', section: 'OOP', title: 'Abstract Class', keywords: 'abstract class base' },
    { id: 'interface', section: 'OOP', title: 'Interface', keywords: 'interface contract' },
    { id: 'struct', section: 'OOP', title: 'Struct', keywords: 'struct data structure' },
    { id: 'modules', section: 'Modules', title: 'Module System', keywords: 'module import export' },
    { id: 'reexport', section: 'Modules', title: 'Re-export & Dynamic Import', keywords: 'reexport dynamic import dynamic load' },
    { id: 'metaprogramming', section: 'Modules', title: 'Metaprogramming', keywords: 'metaprogramming reflection' },
    { id: 'globals', section: 'Standard Library', title: 'Globals & Constructors', keywords: 'global constructor number string boolean array object' },
    { id: 'math', section: 'Standard Library', title: 'Math (Mtk)', keywords: 'math math mathematics pi root absolute' },
    { id: 'date', section: 'Standard Library', title: 'Date (Tanggalan)', keywords: 'date date time' },
    { id: 'json', section: 'Standard Library', title: 'JSON', keywords: 'json parse stringify' },
    { id: 'global-fns', section: 'Standard Library', title: 'Global Functions', keywords: 'global function parse int float' },
    { id: 'wektu', section: 'Standard Library', title: 'Time (Wektu)', keywords: 'time time timer setTimeout setInterval' },
    { id: 'builtin-objects', section: 'Standard Library', title: 'Additional Objects', keywords: 'built-in object map set weakmap weakset' },
    { id: 'promise-methods', section: 'Standard Library', title: 'Promise Methods', keywords: 'promise method all race resolve reject' },
    { id: 'array-methods', section: 'Standard Library', title: 'Array Methods', keywords: 'array method map filter reduce find sort' },
    { id: 'string-methods', section: 'Standard Library', title: 'String Methods', keywords: 'string method upper lower trim split replace' },
    { id: 'shared-methods', section: 'Standard Library', title: 'Shared Methods', keywords: 'shared method array string length includes slice' },
    { id: 'cli', section: 'CLI', title: 'CLI Reference', keywords: 'cli command perintah djawa run fmt repl make version help' },
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
