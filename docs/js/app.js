/* ===========================
   JPL Documentation — App JS
   =========================== */

(function () {
  'use strict';

  // ---- Search Data ----
  const searchData = [
    // Memulai
    { id: 'quickstart', section: 'Memulai', title: 'Mulai Cepat', keywords: 'install npm djawa halo jawa program pertama terminal' },

    // Konsep Dasar
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

    // Kontrol Alur
    { id: 'conditionals', section: 'Kontrol Alur', title: 'Kondisional', keywords: 'lek如果不条件 if else kondisional conditional' },
    { id: 'ternary', section: 'Kontrol Alur', title: 'Ternary', keywords: 'ternary operator kondisional singkat' },
    { id: 'loops', section: 'Kontrol Alur', title: 'Perulangan', keywords: '循环 for ulang perulangan loop while' },
    { id: 'range', section: 'Kontrol Alur', title: 'Range Iterator', keywords: 'range iterator .. span perulangan' },
    { id: 'labels', section: 'Kontrol Alur', title: 'Label Statements', keywords: 'label statement break continue' },
    { id: 'async-iterator', section: 'Kontrol Alur', title: 'Async Iterator', keywords: 'async iterator for await' },
    { id: 'switch', section: 'Kontrol Alur', title: 'Switch', keywords: 'switch pilih case break default' },
    { id: 'pattern', section: 'Kontrol Alur', title: 'Pattern Matching', keywords: 'pattern matching kalo cocok when dadi' },

    // Fungsi
    { id: 'functions', section: 'Fungsi', title: 'Fungsi Biasa', keywords: 'fungsi function function fungsi biasa fungsi' },
    { id: 'arrow', section: 'Fungsi', title: 'Arrow Function', keywords: 'arrow function panah panah fungsi lambda' },
    { id: 'rest-spread', section: 'Fungsi', title: 'Rest & Spread', keywords: 'rest spread parameter ... titik tiga' },
    { id: 'generator', section: 'Fungsi', title: 'Generator', keywords: 'generator yield function bintang' },
    { id: 'async', section: 'Fungsi', title: 'Async/Await', keywords: 'async await promise asynchronous' },
    { id: 'tagged-template', section: 'Fungsi', title: 'Tagged Template', keywords: 'tagged template literal tag function' },

    // Error Handling
    { id: 'error', section: 'Error Handling', title: 'Try/Catch', keywords: 'try catch error kesalahan lempar lemparan' },
    { id: 'assertion', section: 'Error Handling', title: 'Asersi (pasten)', keywords: 'assert asersi pasten assertion validate validasi' },

    // Operator
    { id: 'arithmetic', section: 'Operator', title: 'Aritmatika & Penugasan', keywords: 'aritmatika arithmetic tambah kurang kali bagi modulo penugasan assignment' },
    { id: 'comparison', section: 'Operator', title: 'Perbandingan & Logika', keywords: 'perbandingan comparison logical logika == === != !== greater less and or not && || ! plek podo lan utawa ora' },
    { id: 'special-ops', section: 'Operator', title: 'Khusus', keywords: 'operator khusus special typeof instanceof in' },
    { id: 'optional-chaining', section: 'Operator', title: 'Optional Chaining', keywords: 'optional chaining ?. titik tanya' },
    { id: 'nullish', section: 'Operator', title: 'Nullish Coalescing', keywords: 'nullish coalescing ?? operator' },
    { id: 'bitwise', section: 'Operator', title: 'Bitwise', keywords: 'bitwise and or xor not shift' },

    // Fitur Unik
    { id: 'nullcheck', section: 'Fitur Unik', title: 'Pengecekan Null', keywords: 'null check kosong opsional' },
    { id: 'tuple', section: 'Fitur Unik', title: 'Tuple', keywords: 'tuple pasangan tetap immutable' },

    // Sintaks Lainnya
    { id: 'optional-parens', section: 'Sintaks Lainnya', title: 'Tanda Kurung Opsional', keywords: 'optional parentheses kurung opsional' },
    { id: 'special-keywords', section: 'Sintaks Lainnya', title: 'Kata Kunci Khusus', keywords: 'kata kunci khusus special keywords iki iku yoiku' },
    { id: 'alt-keywords', section: 'Sintaks Lainnya', title: 'Kata Kunci Alternatif', keywords: 'kata kunci alternatif alternative keywords synonym' },

    // OOP
    { id: 'classes', section: 'OOP', title: 'Kelas', keywords: 'kelas class objek object method properti constructor' },
    { id: 'enum', section: 'OOP', title: 'Enum', keywords: 'enum enumerasi enumerasi tipe data' },
    { id: 'sealed', section: 'OOP', title: 'Sealed Class', keywords: 'sealed class tertutup final' },
    { id: 'abstract', section: 'OOP', title: 'Abstract Class', keywords: 'abstract class abstrak dasar' },
    { id: 'interface', section: 'OOP', title: 'Interface', keywords: 'interface antarmuka kontrak' },
    { id: 'struct', section: 'OOP', title: 'Struct', keywords: 'struct struktur data' },

    // Modul & Metaprogramming
    { id: 'modules', section: 'Modul', title: 'Sistem Modul', keywords: 'modul module import ekspor export' },
    { id: 'reexport', section: 'Modul', title: 'Re-export & Dynamic Import', keywords: 'reexport dynamic import muat dinamis' },
    { id: 'metaprogramming', section: 'Modul', title: 'Metaprogramming', keywords: 'metaprogramming refleksi reflection' },

    // Standard Library
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

    // CLI
    { id: 'cli', section: 'CLI', title: 'Referensi CLI', keywords: 'cli command perintah djawa run fmt repl make version help' },
  ];

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
        searchResults.innerHTML = '<div class="search-result-item"><span class="result-title">Ora ditemukake</span></div>';
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
