// Search data - all documentation content
const searchData = [
  // Mulai Cepat
  { title: 'Mulai Cepat', section: 'quickstart', keywords: 'install npm djawa mulai cepat hello world', id: 'quickstart' },
  { title: 'Instalasi', section: 'quickstart', keywords: 'npm install package manager', id: 'quickstart' },
  
  // Konsep Dasar
  { title: 'Blok Kode: terus & mbari', section: 'Konsep Dasar', keywords: 'blok kode block terus mbari kurung kurawal', id: 'blocks' },
  { title: 'Komentar', section: 'Konsep Dasar', keywords: 'komentar comment single line multi line', id: 'comments' },
  { title: 'Variabel', section: 'Konsep Dasar', keywords: 'variabel variable const let iki iku jarno', id: 'variables' },
  { title: 'Destructuring', section: 'Konsep Dasar', keywords: 'destructuring object array unpack', id: 'destructuring' },
  { title: 'Tipe Data', section: 'Konsep Dasar', keywords: 'tipe data type boolean true false null undefined tenan gak kosong', id: 'datatypes' },
  { title: 'Konsol & Input', section: 'Konsep Dasar', keywords: 'konsol console print output input cetakno takon prompt', id: 'console' },
  
  // Kontrol Alur
  { title: 'Kondisional: lek', section: 'Kontrol Alur', keywords: 'kondisional if else lek misale liyane', id: 'conditionals' },
  { title: 'Operator Ternary', section: 'Kontrol Alur', keywords: 'ternary ta lek gak inline conditional', id: 'ternary' },
  { title: 'Perulangan: kanggo, selagi', section: 'Kontrol Alur', keywords: 'perulangan loop for while do while kanggo selagi lakoni', id: 'loops' },
  { title: 'Switch Statement: pilih', section: 'Kontrol Alur', keywords: 'switch case pilih kalo yowes', id: 'switch' },
  { title: 'Pattern Matching: cocok', section: 'Kontrol Alur', keywords: 'pattern matching cocok kalo wildcard binding', id: 'pattern' },
  
  // Fungsi
  { title: 'Fungsi: gawe', section: 'Fungsi', keywords: 'fungsi function gawe balekno return parameter', id: 'functions' },
  { title: 'Arrow Function: lakoni', section: 'Fungsi', keywords: 'arrow function lambda lakoni callback implicit return', id: 'arrow' },
  { title: 'Async/Await', section: 'Fungsi', keywords: 'async await tenangan enteni promise asynchronous', id: 'async' },
  { title: 'Generator', section: 'Fungsi', keywords: 'generator yield asilno asilno kabeh iterator', id: 'generator' },
  
  // Error Handling
  { title: 'Try/Catch: cobak', section: 'Error Handling', keywords: 'try catch finally throw error cobak nyekel pungkasan uncalen', id: 'error' },
  { title: 'Asersi: pasten', section: 'Error Handling', keywords: 'assertion assert pasten pastenPodo check', id: 'assertion' },
  
  // Operator
  { title: 'Operator Aritmatika', section: 'Operator', keywords: 'aritmatika arithmetic tambah kurang ping bagi siso pangkat', id: 'arithmetic' },
  { title: 'Operator Perbandingan', section: 'Operator', keywords: 'perbandingan comparison equal greater less than plek podo luwihGedhe luwihCilik', id: 'comparison' },
  { title: 'Operator Logika', section: 'Operator', keywords: 'logika logical and or not lan utawa ora', id: 'logical' },
  { title: 'Operator Bitwise', section: 'Operator', keywords: 'bitwise and or xor not shift', id: 'bitwise' },
  
  // OOP
  { title: 'Kelas', section: 'OOP', keywords: 'kelas class object oriented oop wujudno constructor extends turunan inheritance', id: 'classes' },
  { title: 'Enum: cacah', section: 'OOP', keywords: 'enum cacah named constants', id: 'enum' },
  { title: 'Abstract Class', section: 'OOP', keywords: 'abstract class abstrak kelas', id: 'abstract' },
  { title: 'Interface: wangun', section: 'OOP', keywords: 'interface wangun implements nurut contract', id: 'interface' },
  { title: 'Struct', section: 'OOP', keywords: 'struct struktur value type immutable', id: 'struct' },
  
  // Fitur Lanjutan
  { title: 'Sistem Modul', section: 'Fitur Lanjutan', keywords: 'module import export metokno jupukno', id: 'modules' },
  { title: 'Metaprogramming', section: 'Fitur Lanjutan', keywords: 'metaprogramming proxy reflect perantara pantulan', id: 'metaprogramming' },
  { title: 'Tuple', section: 'Fitur Lanjutan', keywords: 'tuple immutable data array tetap', id: 'tuple' },
  
  // Standard Library
  { title: 'Mtk (Math)', section: 'Standard Library', keywords: 'math mtk pi acak bunder ngisor nduwur mutlak oyot', id: 'math' },
  { title: 'Tanggalan (Date)', section: 'Standard Library', keywords: 'date tanggalan time waktu', id: 'date' },
  { title: 'JSON', section: 'Standard Library', keywords: 'json obyek tulisan parse stringify', id: 'json' },
  { title: 'Method Array', section: 'Standard Library', keywords: 'array method dorong saring petakake golek suda filter map reduce', id: 'array-methods' },
  { title: 'Method String', section: 'Standard Library', keywords: 'string method gedekno cilikno rapikno gantien replace split', id: 'string-methods' },
  
  // CLI
  { title: 'Referensi CLI', section: 'CLI', keywords: 'cli command djawa run fmt repl make version help terminal', id: 'cli' },
];

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

// Search functionality
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      searchResults.classList.remove('active');
      return;
    }
    
    const matches = searchData.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.keywords.toLowerCase().includes(query) ||
      item.section.toLowerCase().includes(query)
    );
    
    if (matches.length > 0) {
      searchResults.innerHTML = matches.map(item => `
        <div class="search-result-item" data-id="${item.id}">
          <span class="result-title">${item.title}</span>
          <span class="result-section">${item.section}</span>
        </div>
      `).join('');
      searchResults.classList.add('active');
    } else {
      searchResults.innerHTML = '<div class="search-result-item"><span class="result-title">Tidak ditemukan</span></div>';
      searchResults.classList.add('active');
    }
  });

  // Handle search result click
  searchResults.addEventListener('click', (e) => {
    const item = e.target.closest('.search-result-item');
    if (item) {
      const id = item.dataset.id;
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        searchResults.classList.remove('active');
        searchInput.value = '';
        
        // Update active state
        sidebarLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    }
  });

  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
      searchResults.classList.remove('active');
    }
  });
}

// Mobile sidebar toggle
if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
}

// Mobile nav toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Active link on scroll
if (sidebarLinks.length > 0) {
  const sections = document.querySelectorAll('section[id]');
  
  const observerOptions = {
    rootMargin: '-80px 0px -80% 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        sidebarLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => observer.observe(section));
}

// Smooth scroll for sidebar links
sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Close mobile sidebar
      if (sidebar) sidebar.classList.remove('active');
    }
  });
});

// Close sidebar when clicking a link on mobile
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', () => {
    if (sidebar) sidebar.classList.remove('active');
  });
});