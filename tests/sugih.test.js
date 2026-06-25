import { jest } from '@jest/globals';
import { Lexer } from '../src/lexer.js';
import { Parser } from '../src/parser.js';
import { Interpreter } from '../src/interpreter.js';

let Sugih;

function jalanakeKode(kode) {
  const outputs = [];
  const mockPrint = (val) => outputs.push(val);

  const lexer = new Lexer(kode);
  const tokens = lexer.scanTokens();
  const parser = new Parser(tokens, { recover: true });
  const statements = parser.parse();
  const interpreter = new Interpreter({ print: mockPrint });
  return interpreter.interpret(statements).then(() => outputs);
}

beforeAll(async () => {
  const mod = await import('../src/lib/sugih.js');
  Sugih = mod.Sugih;
});

describe('Sugih Library - Unit Tests (Direct JS)', () => {

  test('abang wraps text in red ANSI code', () => {
    expect(Sugih.abang('test')).toBe('\x1b[31mtest\x1b[0m');
  });

  test('ijo wraps text in green ANSI code', () => {
    expect(Sugih.ijo('test')).toBe('\x1b[32mtest\x1b[0m');
  });

  test('biru wraps text in blue ANSI code', () => {
    expect(Sugih.biru('test')).toBe('\x1b[34mtest\x1b[0m');
  });

  test('kuning wraps text in yellow ANSI code', () => {
    expect(Sugih.kuning('test')).toBe('\x1b[33mtest\x1b[0m');
  });

  test('ungu wraps text in magenta ANSI code', () => {
    expect(Sugih.ungu('test')).toBe('\x1b[35mtest\x1b[0m');
  });

  test('cyan wraps text in cyan ANSI code', () => {
    expect(Sugih.cyan('test')).toBe('\x1b[36mtest\x1b[0m');
  });

  test('putih wraps text in white ANSI code', () => {
    expect(Sugih.putih('test')).toBe('\x1b[37mtest\x1b[0m');
  });

  test('ireng wraps text in black ANSI code', () => {
    expect(Sugih.ireng('test')).toBe('\x1b[30mtest\x1b[0m');
  });

  test('abu wraps text in gray ANSI code', () => {
    expect(Sugih.abu('test')).toBe('\x1b[90mtest\x1b[0m');
  });

  test('kandel wraps text in bold ANSI code', () => {
    expect(Sugih.kandel('test')).toBe('\x1b[1mtest\x1b[0m');
  });

  test('miring wraps text in italic ANSI code', () => {
    expect(Sugih.miring('test')).toBe('\x1b[3mtest\x1b[0m');
  });

  test('garisNgisor wraps text in underline ANSI code', () => {
    expect(Sugih.garisNgisor('test')).toBe('\x1b[4mtest\x1b[0m');
  });

  test('nyabrang wraps text in strikethrough ANSI code', () => {
    expect(Sugih.nyabrang('test')).toBe('\x1b[9mtest\x1b[0m');
  });

  test('remang wraps text in dim ANSI code', () => {
    expect(Sugih.remang('test')).toBe('\x1b[2mtest\x1b[0m');
  });

  test('latarAbang wraps text in red background ANSI code', () => {
    expect(Sugih.latarAbang('test')).toBe('\x1b[41mtest\x1b[0m');
  });

  test('latarIjo wraps text in green background ANSI code', () => {
    expect(Sugih.latarIjo('test')).toBe('\x1b[42mtest\x1b[0m');
  });

  test('latarBiru wraps text in blue background ANSI code', () => {
    expect(Sugih.latarBiru('test')).toBe('\x1b[44mtest\x1b[0m');
  });

  test('latarKuning wraps text in yellow background ANSI code', () => {
    expect(Sugih.latarKuning('test')).toBe('\x1b[43mtest\x1b[0m');
  });

  test('latarUngu wraps text in magenta background ANSI code', () => {
    expect(Sugih.latarUngu('test')).toBe('\x1b[45mtest\x1b[0m');
  });

  test('latarCyan wraps text in cyan background ANSI code', () => {
    expect(Sugih.latarCyan('test')).toBe('\x1b[46mtest\x1b[0m');
  });

  test('latarPutih wraps text in white background ANSI code', () => {
    expect(Sugih.latarPutih('test')).toBe('\x1b[47mtest\x1b[0m');
  });

  test('pandu with "biru" style uses blue+bold', () => {
    expect(Sugih.pandu('teks', 'biru')).toBe('\x1b[34m\x1b[1mteks\x1b[0m');
  });

  test('pandu with "ijo" style uses green+bold', () => {
    expect(Sugih.pandu('teks', 'ijo')).toBe('\x1b[32m\x1b[1mteks\x1b[0m');
  });

  test('pandu with "abang" style uses red+bold', () => {
    expect(Sugih.pandu('teks', 'abang')).toBe('\x1b[31m\x1b[1mteks\x1b[0m');
  });

  test('pandu defaults to blue when no style given', () => {
    expect(Sugih.pandu('teks')).toBe('\x1b[34m\x1b[1mteks\x1b[0m');
  });

  test('tulis calls console.log with formatted arguments', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.tulis('Halo', 'Dunia');
    expect(logs[0]).toBe('Halo Dunia');

    console.log = origLog;
  });

  test('tulis handles numbers and objects', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.tulis(42, { a: 1 });
    expect(logs[0]).toContain('42');
    expect(logs[0]).toContain('"a"');

    console.log = origLog;
  });

  test('info calls console.log with blue info prefix', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.info('pesan info');
    expect(logs[0]).toContain('\x1b[34mℹ\x1b[0m');
    expect(logs[0]).toContain('pesan info');

    console.log = origLog;
  });

  test('sukses calls console.log with green checkmark prefix', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.sukses('berhasil');
    expect(logs[0]).toContain('\x1b[32m✓\x1b[0m');
    expect(logs[0]).toContain('berhasil');

    console.log = origLog;
  });

  test('wigati calls console.log with yellow warning prefix', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.wigati('hati-hati');
    expect(logs[0]).toContain('\x1b[33m⚠\x1b[0m');
    expect(logs[0]).toContain('hati-hati');

    console.log = origLog;
  });

  test('galat calls console.log with red error prefix', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.galat('error bro');
    expect(logs[0]).toContain('\x1b[31m✗\x1b[0m');
    expect(logs[0]).toContain('error bro');

    console.log = origLog;
  });

  test('judul outputs markdown-style heading with ANSI', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.judul('Judul', 1);
    expect(logs[0]).toContain('# Judul');

    console.log = origLog;
  });

  test('judul level 2 uses ## prefix', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.judul('Sub Judul', 2);
    expect(logs[0]).toContain('## Sub Judul');

    console.log = origLog;
  });

  test('gaweTabel returns a builder with tambahbaris and cetak methods', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    const tabel = Sugih.gaweTabel(['Jeneng', 'Umur']);
    tabel.tambahbaris('Fatih', 25).cetak();

    expect(logs[0]).toContain('┌');
    expect(logs.some(l => l.includes('Jeneng'))).toBe(true);
    expect(logs.some(l => l.includes('Umur'))).toBe(true);
    expect(logs.some(l => l.includes('Fatih'))).toBe(true);
    expect(logs.some(l => l.includes('25'))).toBe(true);
    expect(logs[logs.length - 1]).toContain('┘');

    console.log = origLog;
  });

  test('gawePanel draws a panel with title and content', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.gawePanel('Isi panel', 'Judul Panel');
    expect(logs[0]).toContain('┌');
    expect(logs[0]).toContain('Judul Panel');
    expect(logs.some(l => l.includes('Isi panel'))).toBe(true);
    expect(logs[logs.length - 1]).toContain('┘');

    console.log = origLog;
  });

  test('coba inspects an object with colored output', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.coba({ jeneng: 'Fatih', umur: 25 });
    const output = logs.join('\n');
    expect(output).toContain('jeneng');
    expect(output).toContain('Fatih');
    expect(output).toContain('umur');
    expect(output).toContain('25');

    console.log = origLog;
  });

  test('JSONcantik pretty-prints JSON with colored keys', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.JSONcantik({ jeneng: 'Fatih', umur: 25 });
    expect(logs[0]).toContain('"jeneng"');
    expect(logs[0]).toContain('"umur"');

    console.log = origLog;
  });

  test('kolom prints items in columns', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.kolom(['A', 'B', 'C', 'D'], 2);
    expect(logs.length).toBeGreaterThanOrEqual(2);

    console.log = origLog;
  });

  test('pedhot prints a colored separator line', () => {
    const logs = [];
    const origLog = console.log;
    console.log = (v) => logs.push(v);

    Sugih.pedhot('', 'ijo');
    expect(logs[0]).toContain('\x1b[32m');
    expect(logs[0]).toContain('─');

    console.log = origLog;
  });

  test('gaweBar returns a progress bar builder', () => {
    const bar = Sugih.gaweBar(100, 'Ngunduh...');
    expect(bar).toHaveProperty('maju');
    expect(bar).toHaveProperty('setel');
    expect(bar).toHaveProperty('tulisan');
    expect(bar).toHaveProperty('rampung');
    expect(bar).toHaveProperty('nilai');
    expect(bar).toHaveProperty('total');
    expect(bar.nilai()).toBe(0);
    expect(bar.total()).toBe(100);
  });

  test('gaweBar.maju increases the value', () => {
    const bar = Sugih.gaweBar(10);
    bar.maju(3);
    expect(bar.nilai()).toBe(3);
    bar.maju(5);
    expect(bar.nilai()).toBe(8);
  });

  test('gaweBar.rampung sets value to total', () => {
    const bar = Sugih.gaweBar(10);
    bar.maju(3);
    bar.rampung();
    expect(bar.nilai()).toBe(10);
  });

  test('gaweBar.setel sets exact value', () => {
    const bar = Sugih.gaweBar(100);
    bar.setel(42);
    expect(bar.nilai()).toBe(42);
  });

  test('_stringify handles null/undefined', () => {
    expect(Sugih._stringify(null)).toBe('kosong');
    expect(Sugih._stringify(undefined)).toBe('oraDidefinisikan');
  });

  test('_stringify handles objects', () => {
    const result = Sugih._stringify({ a: 1 });
    expect(result).toContain('"a"');
    expect(result).toContain('1');
  });

  test('_stringify handles primitives', () => {
    expect(Sugih._stringify(42)).toBe('42');
    expect(Sugih._stringify('teks')).toBe('teks');
    expect(Sugih._stringify(true)).toBe('true');
  });

  test('style helper wraps text with codes', async () => {
    const { style, ANSI } = await import('../src/lib/sugih.js');
    const result = style('test', ANSI.fg.red, ANSI.bold);
    expect(result).toBe('\x1b[31m\x1b[1mtest\x1b[0m');
  });

  test('bertabel property is true', () => {
    expect(Sugih.bertabel).toBe(true);
  });

  test('toString returns <native Sugih>', () => {
    expect(String(Sugih)).toBe('<native Sugih>');
  });
});

describe('Sugih Library - Integration Tests (Via Interpreter)', () => {
  let logs;
  let origLog;

  beforeAll(() => {
    origLog = console.log;
  });

  beforeEach(() => {
    logs = [];
    console.log = (v) => logs.push(v);
  });

  afterAll(() => {
    console.log = origLog;
  });

  test('Sugih.ijo is accessible from JPL via built-in global', async () => {
    const kode = `
      Sugih.tulis(Sugih.ijo("ijo teks"))
    `;
    await jalanakeKode(kode);
    expect(logs[0]).toContain('\x1b[32m');
    expect(logs[0]).toContain('ijo teks');
    expect(logs[0]).toContain('\x1b[0m');
  });

  test('Sugih.abang colors text red', async () => {
    const kode = `Sugih.tulis(Sugih.abang("abang"))`;
    await jalanakeKode(kode);
    expect(logs[0]).toBe('\x1b[31mabang\x1b[0m');
  });

  test('Sugih.kandel bolds text', async () => {
    const kode = `Sugih.tulis(Sugih.kandel("kandel"))`;
    await jalanakeKode(kode);
    expect(logs[0]).toBe('\x1b[1mkandel\x1b[0m');
  });

  test('Sugih.info logs with info prefix', async () => {
    const kode = `Sugih.info("informasi")`;
    await jalanakeKode(kode);
    expect(logs[0]).toContain('informasi');
    expect(logs[0]).toContain('\x1b[34m');
  });

  test('Sugih.sukses logs with success prefix', async () => {
    const kode = `Sugih.sukses("berhasil")`;
    await jalanakeKode(kode);
    expect(logs[0]).toContain('berhasil');
    expect(logs[0]).toContain('\x1b[32m');
  });

  test('Sugih.wigati logs with warning prefix', async () => {
    const kode = `Sugih.wigati("awas")`;
    await jalanakeKode(kode);
    expect(logs[0]).toContain('awas');
    expect(logs[0]).toContain('\x1b[33m');
  });

  test('Sugih.galat logs with error prefix', async () => {
    const kode = `Sugih.galat("error")`;
    await jalanakeKode(kode);
    expect(logs[0]).toContain('error');
    expect(logs[0]).toContain('\x1b[31m');
  });

  test('Sugih.judul prints heading', async () => {
    const kode = `Sugih.judul("Judul", 1)`;
    await jalanakeKode(kode);
    expect(logs[0]).toContain('# Judul');
  });

  test('Sugih.gaweTabel creates and prints a table', async () => {
    const kode = `
      jarno tabel yoiku Sugih.gaweTabel(['Jeneng', 'Umur'])
      tabel.tambahbaris('Fatih', 25)
      tabel.cetak()
    `;
    await jalanakeKode(kode);
    expect(logs.some(l => l.includes('Jeneng'))).toBe(true);
    expect(logs.some(l => l.includes('Fatih'))).toBe(true);
    expect(logs.some(l => l.includes('25'))).toBe(true);
  });

  test('Sugih.gawePanel prints a panel', async () => {
    const kode = `Sugih.gawePanel("Isi panel", "Judul")`;
    await jalanakeKode(kode);
    expect(logs[0]).toContain('┌');
    expect(logs.some(l => l.includes('Isi panel'))).toBe(true);
  });

  test('Sugih.JSONcantik pretty-prints JSON', async () => {
    const kode = `Sugih.JSONcantik(terus jeneng: 'Fatih', umur: 25 mbari)`;
    await jalanakeKode(kode);
    expect(logs[0]).toContain('jeneng');
    expect(logs[0]).toContain('Fatih');
  });

  test('Sugih.coba inspects an object', async () => {
    const kode = `Sugih.coba(terus jeneng: 'Fatih' mbari)`;
    await jalanakeKode(kode);
    expect(logs[0]).toContain('jeneng');
  });

  test('Sugih.kolom prints items in columns', async () => {
    const kode = `Sugih.kolom(['A', 'B', 'C'], 2)`;
    await jalanakeKode(kode);
    expect(logs.length).toBeGreaterThanOrEqual(1);
  });

  test('Sugih.pedhot prints a separator', async () => {
    const kode = `Sugih.pedhot('', 'ijo')`;
    await jalanakeKode(kode);
    expect(logs[0]).toContain('─');
  });

  test('Sugih.gaweBar creates and uses progress bar', async () => {
    const kode = `
      jarno bar yoiku Sugih.gaweBar(10, 'Tes')
      bar.maju(5)
      cetakno('Nilai: ' tambah bar.nilai())
      bar.rampung()
    `;
    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('Nilai: 5');
  });

  test('Sugih.pandu with color name works', async () => {
    const kode = `Sugih.tulis(Sugih.pandu("teks biru", "biru"))`;
    await jalanakeKode(kode);
    expect(logs[0]).toContain('\x1b[34m\x1b[1mteks biru\x1b[0m');
  });

  test('Sugih.miring italicizes text', async () => {
    const kode = `Sugih.tulis(Sugih.miring("miring"))`;
    await jalanakeKode(kode);
    expect(logs[0]).toBe('\x1b[3mmiring\x1b[0m');
  });

  test('Sugih.garisNgisor underlines text', async () => {
    const kode = `Sugih.tulis(Sugih.garisNgisor("garis"))`;
    await jalanakeKode(kode);
    expect(logs[0]).toBe('\x1b[4mgaris\x1b[0m');
  });

  test('Sugih.latarAbang sets red background', async () => {
    const kode = `Sugih.tulis(Sugih.latarAbang("latar"))`;
    await jalanakeKode(kode);
    expect(logs[0]).toBe('\x1b[41mlatar\x1b[0m');
  });

  test('Sugih.tulis handles multiple arguments', async () => {
    const kode = `Sugih.tulis(Sugih.ijo("ijo"), Sugih.abang("abang"))`;
    await jalanakeKode(kode);
    expect(logs[0]).toContain('\x1b[32mijo\x1b[0m');
    expect(logs[0]).toContain('\x1b[31mabang\x1b[0m');
  });
});

describe('Sugih Library - PRD Compliance', () => {
  test('1. Javanese-First - all method names use Javanese', () => {
    const jvMethods = [
      'tulis', 'abang', 'ijo', 'biru', 'kuning', 'ungu', 'cyan', 'putih', 'ireng', 'abu',
      'kandel', 'miring', 'garisNgisor', 'nyabrang', 'remang',
      'latarAbang', 'latarIjo', 'latarBiru', 'latarKuning', 'latarUngu', 'latarCyan', 'latarPutih',
      'pandu', 'info', 'sukses', 'wigati', 'galat',
      'judul', 'gaweTabel', 'gaweBar', 'gawePanel', 'coba', 'JSONcantik', 'kolom', 'pedhot',
    ];
    for (const m of jvMethods) {
      expect(typeof Sugih[m]).toBe('function');
    }
  });

  test('2. bertabel is exposed as a non-function property', () => {
    expect(Sugih.bertabel).toBe(true);
  });

  test('3. All color methods return ANSI-wrapped strings', () => {
    const colors = ['abang', 'ijo', 'biru', 'kuning', 'ungu', 'cyan', 'putih', 'ireng', 'abu'];
    for (const c of colors) {
      const result = Sugih[c]('test');
      expect(result).toMatch(/\x1b\[\d+mtest\x1b\[0m/);
    }
  });

  test('4. All style methods return ANSI-wrapped strings', () => {
    const styles = ['kandel', 'miring', 'garisNgisor', 'nyabrang', 'remang'];
    for (const s of styles) {
      const result = Sugih[s]('test');
      expect(result).toMatch(/\x1b\[\d+mtest\x1b\[0m/);
    }
  });

  test('5. All background methods return ANSI-wrapped strings', () => {
    const bgs = ['latarAbang', 'latarIjo', 'latarBiru', 'latarKuning', 'latarUngu', 'latarCyan', 'latarPutih'];
    for (const b of bgs) {
      const result = Sugih[b]('test');
      expect(result).toMatch(/\x1b\[\d+mtest\x1b\[0m/);
    }
  });
});
