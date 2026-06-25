import fs from 'fs';
import path from 'path';
import os from 'os';
import { jest } from '@jest/globals';
import { Lexer } from '../src/lexer.js';
import { Parser } from '../src/parser.js';
import { Interpreter } from '../src/interpreter.js';

let Berkas;
let tmpDir;

beforeAll(async () => {
  const mod = await import('../src/lib/berkas.js');
  Berkas = mod.Berkas;
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'berkas-test-'));
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function tmpPath(name) {
  return path.join(tmpDir, name);
}

function jalanakeKode(kode) {
  const outputs = [];
  const mockPrint = (val) => outputs.push(val);
  const lexer = new Lexer(kode);
  const tokens = lexer.scanTokens();
  const parser = new Parser(tokens, { recover: true });
  const statements = parser.parse();
  const interpreter = new Interpreter({ print: mockPrint });
  interpreter.currentDir = tmpDir;
  return interpreter.interpret(statements).then(() => outputs);
}

describe('Berkas Library - Unit Tests (Direct JS)', () => {
  describe('File Reading', () => {
    test('maca reads a text file', () => {
      const f = tmpPath('maca-test.txt');
      fs.writeFileSync(f, 'Halo Dunia');
      expect(Berkas.maca(f)).toBe('Halo Dunia');
    });

    test('maca with custom encoding', () => {
      const f = tmpPath('maca-enc.txt');
      fs.writeFileSync(f, 'test');
      expect(Berkas.maca(f, 'utf8')).toBe('test');
    });

    test('macaBuffer reads raw buffer', () => {
      const f = tmpPath('maca-buf.bin');
      fs.writeFileSync(f, Buffer.from([0x48, 0x65, 0x6c]));
      const buf = Berkas.macaBuffer(f);
      expect(buf).toBeInstanceOf(Buffer);
      expect(buf.length).toBe(3);
      expect(buf[0]).toBe(0x48);
    });

    test('maca throws on non-existent file', () => {
      expect(() => Berkas.maca(tmpPath('gak-ana.txt'))).toThrow('ora ditemokake');
    });
  });

  describe('File Writing', () => {
    test('tulis writes text to file', () => {
      const f = tmpPath('tulis-test.txt');
      Berkas.tulis(f, 'tulisan anyar');
      expect(fs.readFileSync(f, 'utf8')).toBe('tulisan anyar');
    });

    test('tulis overwrites existing file', () => {
      const f = tmpPath('tulis-overwrite.txt');
      fs.writeFileSync(f, 'lama');
      Berkas.tulis(f, 'anyar');
      expect(fs.readFileSync(f, 'utf8')).toBe('anyar');
    });

    test('tambah appends to file', () => {
      const f = tmpPath('tambah-test.txt');
      fs.writeFileSync(f, 'awal ');
      Berkas.tambah(f, 'tambahan');
      expect(fs.readFileSync(f, 'utf8')).toBe('awal tambahan');
    });

    test('tambah creates file if not exists', () => {
      const f = tmpPath('tambah-anyar.txt');
      Berkas.tambah(f, 'baru');
      expect(fs.readFileSync(f, 'utf8')).toBe('baru');
    });
  });

  describe('File Operations', () => {
    test('kopi copies a file', () => {
      const src = tmpPath('kopi-src.txt');
      const dst = tmpPath('kopi-dst.txt');
      fs.writeFileSync(src, 'isi file');
      Berkas.kopi(src, dst);
      expect(fs.readFileSync(dst, 'utf8')).toBe('isi file');
    });

    test('pindah moves/renames a file', () => {
      const src = tmpPath('pindah-src.txt');
      const dst = tmpPath('pindah-dst.txt');
      fs.writeFileSync(src, 'dipindah');
      Berkas.pindah(src, dst);
      expect(fs.existsSync(src)).toBe(false);
      expect(fs.readFileSync(dst, 'utf8')).toBe('dipindah');
    });

    test('gantiJeneng renames a file', () => {
      const src = tmpPath('ganti-src.txt');
      const dst = tmpPath('ganti-dst.txt');
      fs.writeFileSync(src, 'diganti');
      Berkas.gantiJeneng(src, dst);
      expect(fs.existsSync(src)).toBe(false);
      expect(fs.readFileSync(dst, 'utf8')).toBe('diganti');
    });

    test('busak deletes a file', () => {
      const f = tmpPath('busak-test.txt');
      fs.writeFileSync(f, 'dibusak');
      Berkas.busak(f);
      expect(fs.existsSync(f)).toBe(false);
    });

    test('busak throws on non-existent file', () => {
      expect(() => Berkas.busak(tmpPath('gak-ana.txt'))).toThrow('ora ditemokake');
    });

    test('ono returns true for existing path', () => {
      const f = tmpPath('ono-ana.txt');
      fs.writeFileSync(f, 'ana');
      expect(Berkas.ono(f)).toBe(true);
    });

    test('ono returns false for non-existent path', () => {
      expect(Berkas.ono(tmpPath('ono-gak-ana.txt'))).toBe(false);
    });

    test('info returns file stats', () => {
      const f = tmpPath('info-test.txt');
      fs.writeFileSync(f, 'stat info');
      const info = Berkas.info(f);
      expect(info.gede).toBe(9);
      expect(info.ikuFile).toBe(true);
      expect(info.ikuFolder).toBe(false);
      expect(info).toHaveProperty('wektuGawe');
      expect(info).toHaveProperty('wektuGanti');
      expect(info.mode).toBeTruthy();
    });

    test('info on a directory', () => {
      const d = tmpPath('info-folder');
      fs.mkdirSync(d);
      const info = Berkas.info(d);
      expect(info.ikuFile).toBe(false);
      expect(info.ikuFolder).toBe(true);
    });

    test('info throws on non-existent path', () => {
      expect(() => Berkas.info(tmpPath('gak-ana.txt'))).toThrow('ora ditemokake');
    });
  });

  describe('Directory Operations', () => {
    test('gaweFolder creates a directory', () => {
      const d = tmpPath('gaweFolder-test');
      Berkas.gaweFolder(d);
      expect(fs.statSync(d).isDirectory()).toBe(true);
    });

    test('gaweFolder throws if parent missing', () => {
      expect(() => Berkas.gaweFolder(tmpPath('gak-ana/baru'))).toThrow();
    });

    test('gaweFolderBertingkat creates nested directories', () => {
      const d = tmpPath('a/b/c/d');
      Berkas.gaweFolderBertingkat(d);
      expect(fs.statSync(d).isDirectory()).toBe(true);
    });

    test('busakFolder removes empty directory', () => {
      const d = tmpPath('busakFolder-test');
      fs.mkdirSync(d);
      Berkas.busakFolder(d);
      expect(fs.existsSync(d)).toBe(false);
    });

    test('busakFolder throws on non-empty directory', () => {
      const d = tmpPath('busakFolder-nonempty');
      fs.mkdirSync(d);
      fs.writeFileSync(path.join(d, 'file.txt'), 'isi');
      expect(() => Berkas.busakFolder(d)).toThrow();
      fs.rmSync(d, { recursive: true, force: true });
    });

    test('busakFolderKabeh removes directory recursively', () => {
      const d = tmpPath('busakKabeh-test');
      fs.mkdirSync(d);
      fs.writeFileSync(path.join(d, 'a.txt'), 'a');
      fs.mkdirSync(path.join(d, 'sub'));
      fs.writeFileSync(path.join(d, 'sub', 'b.txt'), 'b');
      Berkas.busakFolderKabeh(d);
      expect(fs.existsSync(d)).toBe(false);
    });

    test('dhaptarFolder lists directory contents', () => {
      const d = tmpPath('dhaptar-test');
      fs.mkdirSync(d);
      fs.writeFileSync(path.join(d, 'a.txt'), 'a');
      fs.writeFileSync(path.join(d, 'b.txt'), 'b');
      const entries = Berkas.dhaptarFolder(d);
      expect(entries).toContain('a.txt');
      expect(entries).toContain('b.txt');
      expect(entries.length).toBe(2);
    });

    test('dhaptarFolderJero lists recursively', () => {
      const d = tmpPath('dhaptarJero-test');
      fs.mkdirSync(d);
      fs.writeFileSync(path.join(d, 'a.txt'), 'a');
      fs.mkdirSync(path.join(d, 'sub'));
      fs.writeFileSync(path.join(d, 'sub', 'b.txt'), 'b');
      const entries = Berkas.dhaptarFolderJero(d);
      expect(entries).toContain('a.txt');
      expect(entries).toContain('sub/b.txt');
    });
  });

  describe('Path Utilities', () => {
    test('sambung joins path segments', () => {
      expect(Berkas.sambung('a', 'b', 'c')).toBe('a/b/c');
      expect(Berkas.sambung('/a', 'b')).toBe('/a/b');
    });

    test('rampung resolves to absolute path', () => {
      const resolved = Berkas.rampung('/a', 'b');
      expect(resolved).toBe('/a/b');
    });

    test('jeneng returns basename', () => {
      expect(Berkas.jeneng('/path/to/file.txt')).toBe('file.txt');
      expect(Berkas.jeneng('file.txt')).toBe('file.txt');
    });

    test('direktori returns dirname', () => {
      expect(Berkas.direktori('/path/to/file.txt')).toBe('/path/to');
      expect(Berkas.direktori('file.txt')).toBe('.');
    });

    test('ekstensi returns extension', () => {
      expect(Berkas.ekstensi('file.txt')).toBe('.txt');
      expect(Berkas.ekstensi('file')).toBe('');
      expect(Berkas.ekstensi('file.tar.gz')).toBe('.gz');
    });

    test('pisah parses path into components', () => {
      const p = Berkas.pisah('/path/to/file.txt');
      expect(p.oyot).toBe('/');
      expect(p.folder).toBe('/path/to');
      expect(p.jeneng).toBe('file.txt');
      expect(p.ekstensi).toBe('.txt');
      expect(p.jenengIso).toBe('file');
    });
  });

  describe('Error Messages', () => {
    test('maca non-existent gives Javanese error', () => {
      expect(() => Berkas.maca(tmpPath('gak-ana.jawa'))).toThrow(/ora ditemokake/);
    });

    test('busak non-existent gives Javanese error', () => {
      expect(() => Berkas.busak(tmpPath('gak-ana'))).toThrow(/ora ditemokake/);
    });

    test('info non-existent gives Javanese error', () => {
      expect(() => Berkas.info(tmpPath('gak-ana'))).toThrow(/ora ditemokake/);
    });
  });
});

describe('Berkas Library - Integration Tests (Via Interpreter)', () => {
  test('Berkas.maca reads file from JPL', async () => {
    const f = path.join(tmpDir, 'integrasi-maca.txt');
    fs.writeFileSync(f, 'Halo saka JPL');
    const kode = `cetakno(Berkas.maca('integrasi-maca.txt'))`;
    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('Halo saka JPL');
  });

  test('Berkas.tulis writes file from JPL', async () => {
    const f = 'integrasi-tulis.txt';
    const fp = path.join(tmpDir, f);
    const kode = `Berkas.tulis('${f}', 'tulisan saka JPL')`;
    await jalanakeKode(kode);
    expect(fs.readFileSync(fp, 'utf8')).toBe('tulisan saka JPL');
  });

  test('Berkas.ono checks file existence from JPL', async () => {
    const f = 'integrasi-ono.txt';
    const fp = path.join(tmpDir, f);
    fs.writeFileSync(fp, 'ana');
    const kode = `
      cetakno(Berkas.ono('${f}'))
      cetakno(Berkas.ono('gak-ana.txt'))
    `;
    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('true');
    expect(outputs[1]).toBe('false');
  });

  test('Berkas.tambah appends from JPL', async () => {
    const f = 'integrasi-tambah.txt';
    const fp = path.join(tmpDir, f);
    fs.writeFileSync(fp, 'awal ');
    const kode = `Berkas.tambah('${f}', 'tambahan')`;
    await jalanakeKode(kode);
    expect(fs.readFileSync(fp, 'utf8')).toBe('awal tambahan');
  });

  test('Berkas.kopi copies file from JPL', async () => {
    const src = 'integrasi-kopi-src.txt';
    const dst = 'integrasi-kopi-dst.txt';
    fs.writeFileSync(path.join(tmpDir, src), 'isi kopi');
    const kode = `Berkas.kopi('${src}', '${dst}')`;
    await jalanakeKode(kode);
    expect(fs.readFileSync(path.join(tmpDir, dst), 'utf8')).toBe('isi kopi');
  });

  test('Berkas.busak deletes file from JPL', async () => {
    const f = 'integrasi-busak.txt';
    fs.writeFileSync(path.join(tmpDir, f), 'dibusak');
    const kode = `Berkas.busak('${f}')`;
    await jalanakeKode(kode);
    expect(fs.existsSync(path.join(tmpDir, f))).toBe(false);
  });

  test('Berkas.info gets file stats from JPL', async () => {
    const f = 'integrasi-info.txt';
    fs.writeFileSync(path.join(tmpDir, f), 'info');
    const kode = `
      jarno info yoiku Berkas.info('${f}')
      cetakno(info.gede)
      cetakno(info.ikuFile)
    `;
    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('4');
    expect(outputs[1]).toBe('true');
  });

  test('Berkas path utilities work in JPL', async () => {
    const kode = `
      cetakno(Berkas.sambung('a', 'b', 'c'))
      cetakno(Berkas.jeneng('/path/to/file.txt'))
      cetakno(Berkas.ekstensi('file.txt'))
      cetakno(Berkas.direktori('/a/b/c.txt'))
    `;
    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('a/b/c');
    expect(outputs[1]).toBe('file.txt');
    expect(outputs[2]).toBe('.txt');
    expect(outputs[3]).toBe('/a/b');
  });

  test('Berkas directory operations from JPL', async () => {
    const d = 'integrasi-folder-jpl';
    const dp = path.join(tmpDir, d);
    const kode = `
      Berkas.gaweFolder('${d}')
      cetakno(Berkas.ono('${d}'))
      Berkas.busakFolder('${d}')
      cetakno(Berkas.ono('${d}'))
    `;
    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('true');
    expect(outputs[1]).toBe('false');
  });

  test('Berkas error message from JPL is Javanese', async () => {
    const kode = `
      cobak terus
        Berkas.maca('gak-ana-tenan.txt')
      mbari nyekel e terus
        cetakno(e)
      mbari
    `;
    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toContain('ora ditemokake');
  });

  test('Berkas.pisah parses path in JPL', async () => {
    const kode = `
      jarno p yoiku Berkas.pisah('/home/user/file.txt')
      cetakno(p.jeneng)
      cetakno(p.ekstensi)
      cetakno(p.folder)
    `;
    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('file.txt');
    expect(outputs[1]).toBe('.txt');
    expect(outputs[2]).toBe('/home/user');
  });
});
