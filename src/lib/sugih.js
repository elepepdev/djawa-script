const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  blink: '\x1b[5m',
  strikethrough: '\x1b[9m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m',
  },

  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    gray: '\x1b[100m',
    brightRed: '\x1b[101m',
    brightGreen: '\x1b[102m',
    brightYellow: '\x1b[103m',
    brightBlue: '\x1b[104m',
    brightMagenta: '\x1b[105m',
    brightCyan: '\x1b[106m',
    brightWhite: '\x1b[107m',
  },
};

function style(text, ...codes) {
  return codes.join('') + text + ANSI.reset;
}

const Sugih = {
  _stringify(v) {
    if (v === null) return 'kosong';
    if (v === undefined) return 'oraDidefinisikan';
    if (typeof v === 'object') {
      try { return JSON.stringify(v, null, 2); } catch { return String(v); }
    }
    return String(v);
  },

  _formatArgs(args) {
    return args.map(a => this._stringify(a)).join(' ');
  },

  tulis(...args) {
    console.log(args.map(a => this._stringify(a)).join(' '));
  },

  abang: (teks) => style(teks, ANSI.fg.red),
  ijo: (teks) => style(teks, ANSI.fg.green),
  biru: (teks) => style(teks, ANSI.fg.blue),
  kuning: (teks) => style(teks, ANSI.fg.yellow),
  ungu: (teks) => style(teks, ANSI.fg.magenta),
  cyan: (teks) => style(teks, ANSI.fg.cyan),
  putih: (teks) => style(teks, ANSI.fg.white),
  ireng: (teks) => style(teks, ANSI.fg.black),
  abu: (teks) => style(teks, ANSI.fg.gray),

  kandel: (teks) => style(teks, ANSI.bold),
  miring: (teks) => style(teks, ANSI.italic),
  garisNgisor: (teks) => style(teks, ANSI.underline),
  nyabrang: (teks) => style(teks, ANSI.strikethrough),
  remang: (teks) => style(teks, ANSI.dim),

  latarAbang: (teks) => style(teks, ANSI.bg.red),
  latarIjo: (teks) => style(teks, ANSI.bg.green),
  latarBiru: (teks) => style(teks, ANSI.bg.blue),
  latarKuning: (teks) => style(teks, ANSI.bg.yellow),
  latarUngu: (teks) => style(teks, ANSI.bg.magenta),
  latarCyan: (teks) => style(teks, ANSI.bg.cyan),
  latarPutih: (teks) => style(teks, ANSI.bg.white),

  pandu: (teks, gaya) => {
    const warna = gaya || 'biru';
    const fgMap = { abang: ANSI.fg.red, ijo: ANSI.fg.green, biru: ANSI.fg.blue, kuning: ANSI.fg.yellow, ungu: ANSI.fg.magenta, cyan: ANSI.fg.cyan };
    const c = fgMap[warna] || ANSI.fg.blue;
    return style(teks, c, ANSI.bold);
  },

  info: (...args) => {
    const msg = args.map(a => Sugih._stringify(a)).join(' ');
    console.log(`${ANSI.fg.blue}ℹ${ANSI.reset} ${msg}`);
  },

  sukses: (...args) => {
    const msg = args.map(a => Sugih._stringify(a)).join(' ');
    console.log(`${ANSI.fg.green}✓${ANSI.reset} ${msg}`);
  },

  wigati: (...args) => {
    const msg = args.map(a => Sugih._stringify(a)).join(' ');
    console.log(`${ANSI.fg.yellow}⚠${ANSI.reset} ${msg}`);
  },

  galat: (...args) => {
    const msg = args.map(a => Sugih._stringify(a)).join(' ');
    console.log(`${ANSI.fg.red}✗${ANSI.reset} ${msg}`);
  },

  judul: (teks, tingkat) => {
    const level = tingkat || 1;
    const colors = [ANSI.bold + ANSI.fg.brightWhite, ANSI.bold + ANSI.fg.white, ANSI.fg.white, ANSI.fg.gray];
    const c = colors[Math.min(level - 1, colors.length - 1)];
    const prefix = '#'.repeat(level);
    console.log(`\n${c}${prefix} ${teks}${ANSI.reset}`);
  },

  gaweTabel: (headers) => {
    const rows = [];
    const h = headers || [];

    const builder = {
      tambahbaris: (...cells) => {
        rows.push(cells);
        return builder;
      },
      cetak: () => {
        if (h.length === 0 && rows.length === 0) return;

        const colCount = h.length > 0 ? h.length : rows[0]?.length || 0;
        const colWidths = new Array(colCount).fill(0);

        if (h.length > 0) {
          h.forEach((header, i) => { colWidths[i] = Math.max(colWidths[i], String(header).length); });
        }
        rows.forEach(row => {
          row.forEach((cell, i) => {
            if (i < colWidths.length) {
              colWidths[i] = Math.max(colWidths[i], String(cell).length);
            }
          });
        });

        colWidths.forEach((w, i) => { colWidths[i] = Math.min(w + 2, 80); });

        const totalWidth = colWidths.reduce((s, w) => s + w + 3, 0) + 1;

        const separator = ANSI.fg.gray + '─'.repeat(totalWidth - 1) + ANSI.reset;

        const renderRow = (cells, isHeader) => {
          let line = ANSI.fg.gray + '│' + ANSI.reset;
          for (let i = 0; i < colCount; i++) {
            const cell = i < cells.length ? String(cells[i]) : '';
            const w = colWidths[i];
            const content = isHeader ? ANSI.bold + cell.padEnd(w) + ANSI.reset : cell.padEnd(w);
            line += ' ' + content + ' ' + ANSI.fg.gray + '│' + ANSI.reset;
          }
          return line;
        };

        const headerSep = ANSI.fg.gray + '┌' + colWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐' + ANSI.reset;
        const rowSep = ANSI.fg.gray + '├' + colWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤' + ANSI.reset;
        const footerSep = ANSI.fg.gray + '└' + colWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘' + ANSI.reset;

        console.log(headerSep);
        if (h.length > 0) {
          console.log(renderRow(h, true));
          console.log(rowSep);
        }
        rows.forEach((row, idx) => {
          console.log(renderRow(row, false));
          if (idx < rows.length - 1) console.log(rowSep);
        });
        console.log(footerSep);
        return builder;
      },
      toString: () => '<Sugih Tabel>'
    };
    return builder;
  },

  gaweBar: (total, label) => {
    let _value = 0;
    let _total = total || 100;
    let _label = label || '';
    let _interval = null;
    const barWidth = 30;

    const _render = () => {
      const pct = Math.min(1, Math.max(0, _value / _total));
      const filled = Math.round(pct * barWidth);
      const empty = barWidth - filled;
      const bar = ANSI.fg.green + '█'.repeat(filled) + ANSI.reset + ANSI.fg.gray + '░'.repeat(empty) + ANSI.reset;
      const pctStr = (pct * 100).toFixed(1).padStart(6);
      process.stdout.write('\r' + bar + ' ' + ANSI.bold + pctStr + '%' + ANSI.reset + (_label ? ' ' + _label : ''));
    };

    const builder = {
      maju: (amount) => {
        _value = Math.min(_total, _value + (amount || 1));
        _render();
        return builder;
      },
      setel: (value) => {
        _value = Math.min(_total, Math.max(0, value));
        _render();
        return builder;
      },
      tulisan: (teks) => {
        _label = teks;
        _render();
        return builder;
      },
      rampung: () => {
        _value = _total;
        _render();
        console.log('');
        return builder;
      },
      nilai: () => _value,
      total: () => _total,
      toString: () => '<Sugih Bar>'
    };
    return builder;
  },

  gawePanel: (teks, judulPanel) => {
    const lines = String(teks).split('\n');
    const maxLen = Math.max(...lines.map(l => l.length), judulPanel ? judulPanel.length + 4 : 0);
    const width = Math.min(maxLen + 4, process.stdout.columns - 2 || 78);

    const top = ANSI.fg.gray + '┌' + (judulPanel ? ' ' + ANSI.bold + judulPanel + ANSI.reset + ANSI.fg.gray + ' ' : '') + '─'.repeat(Math.max(0, width - (judulPanel ? judulPanel.length + 4 : 0) - 1)) + '┐' + ANSI.reset;
    const bottom = ANSI.fg.gray + '└' + '─'.repeat(width - 1) + '┘' + ANSI.reset;

    console.log(top);
    for (const line of lines) {
      const padded = line + ' '.repeat(Math.max(0, width - 1 - line.length));
      console.log(ANSI.fg.gray + '│' + ANSI.reset + ' ' + padded + ' ' + ANSI.fg.gray + '│' + ANSI.reset);
    }
    console.log(bottom);
  },

  coba: (obj) => {
    const seen = new WeakSet();
    const inspect = (o, depth) => {
      if (depth > 3) return ANSI.fg.gray + '...' + ANSI.reset;
      if (o === null) return ANSI.fg.gray + 'kosong' + ANSI.reset;
      if (o === undefined) return ANSI.fg.gray + 'oraDidefinisikan' + ANSI.reset;
      if (typeof o === 'string') return ANSI.fg.green + "'" + o + "'" + ANSI.reset;
      if (typeof o === 'number') return ANSI.fg.yellow + String(o) + ANSI.reset;
      if (typeof o === 'boolean') return ANSI.fg.cyan + (o ? 'tenan' : 'gak') + ANSI.reset;
      if (typeof o === 'function') return ANSI.fg.magenta + '[Fungsi]' + ANSI.reset;
      if (typeof o !== 'object') return String(o);
      if (seen.has(o)) return ANSI.fg.gray + '[Circular]' + ANSI.reset;
      seen.add(o);

      if (Array.isArray(o)) {
        if (o.length === 0) return '[]';
        const items = o.map(item => inspect(item, depth + 1));
        return '[\n' + items.map(item => '  ' + item).join('\n') + '\n]';
      }

      const keys = Object.keys(o);
      if (keys.length === 0) return '{}';
      const entries = keys.map(k => {
        const val = inspect(o[k], depth + 1);
        return ANSI.bold + String(k) + ANSI.reset + ': ' + val;
      });
      return '{\n' + entries.map(e => '  ' + e).join('\n') + '\n}';
    };
    console.log(inspect(obj, 0));
  },

  JSONcantik: (obj) => {
    try {
      const json = JSON.stringify(obj, null, 2);
      const colored = json.replace(/"([^"]+)":/g, (_, key) => ANSI.bold + '"' + key + '"' + ANSI.reset + ':');
      console.log(colored);
    } catch {
      console.log(String(obj));
    }
  },

  kolom: (items, jumlahKolom) => {
    const cols = jumlahKolom || 3;
    const colWidth = Math.floor((process.stdout.columns || 80) / cols);
    let line = '';
    items.forEach((item, idx) => {
      const s = String(item).padEnd(colWidth);
      line += s;
      if ((idx + 1) % cols === 0) {
        console.log(line);
        line = '';
      }
    });
    if (line) console.log(line);
  },

  pedhot: (teks, werna) => {
    const colorMap = {
      abang: ANSI.fg.red,
      ijo: ANSI.fg.green,
      biru: ANSI.fg.blue,
      kuning: ANSI.fg.yellow,
      ungu: ANSI.fg.magenta,
      cyan: ANSI.fg.cyan,
      putih: ANSI.fg.white,
    };
    const c = colorMap[werna] || ANSI.fg.white;
    console.log(c + '─'.repeat(Math.min(process.stdout.columns || 80, 50)) + ANSI.reset);
  },

  bertabel: true,
  toString: () => '<native Sugih>'
};

export { Sugih, style, ANSI };
