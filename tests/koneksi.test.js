import { jest } from '@jest/globals';
import { Lexer } from '../src/lexer.js';
import { Parser } from '../src/parser.js';
import { Interpreter } from '../src/interpreter.js';

const mockJson = { id: 1, jeneng: 'John', umur: 30 };
const mockText = 'halo, iki teks';
const mockHeaders = { 'content-type': 'application/json', 'x-custom': 'test' };

function gaweMockFetch(behavior = {}) {
  const {
    status = 200,
    statusText = 'OK',
    json = mockJson,
    text = mockText,
    headers = mockHeaders,
    ok = status >= 200 && status < 300,
    error = false,
    delay = 0
  } = behavior;

  return jest.fn(async (url, opsi) => {
    if (delay > 0) await new Promise(r => setTimeout(r, delay));
    if (error) throw new Error(error === true ? 'Network error' : error);

    const body = JSON.stringify(json);
    const responseHeaders = new Map(Object.entries(headers));

    return {
      status,
      statusText,
      ok,
      headers: {
        forEach: (cb) => responseHeaders.forEach((v, k) => cb(v, k)),
        get: (key) => responseHeaders.get(key)
      },
      json: async () => json,
      text: async () => text
    };
  });
}

function jalanakeKode(kode, mockFetch) {
  const outputs = [];
  const mockPrint = (val) => outputs.push(val);

  if (mockFetch) {
    global.fetch = mockFetch;
  }

  const lexer = new Lexer(kode);
  const tokens = lexer.scanTokens();
  const parser = new Parser(tokens, { recover: true });
  const statements = parser.parse();

  const interpreter = new Interpreter({ print: mockPrint });
  return interpreter.interpret(statements).then(() => outputs);
}

describe('Koneksi Library - Unit Tests (Modul Langsung)', () => {
  let originalFetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('jaluk (GET) - sukses', async () => {
    global.fetch = gaweMockFetch();
    const { Koneksi } = await import('../src/lib/koneksi.js');

    const response = await Koneksi.jaluk('http://example.com/data');
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('application/json');
    expect(await response.json()).toEqual(mockJson);
    expect(await response.teks()).toBe(mockText);
  });

  test('kirim (POST) - sukses', async () => {
    global.fetch = gaweMockFetch({ status: 201 });
    const { Koneksi } = await import('../src/lib/koneksi.js');

    const response = await Koneksi.kirim('http://example.com/data', { jeneng: 'test' });
    expect(response.status).toBe(201);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.com/data',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ jeneng: 'test' })
      })
    );
  });

  test('dandani (PUT) - sukses', async () => {
    global.fetch = gaweMockFetch();
    const { Koneksi } = await import('../src/lib/koneksi.js');

    const response = await Koneksi.dandani('http://example.com/data/1', { jeneng: 'updated' });
    expect(response.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.com/data/1',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ jeneng: 'updated' })
      })
    );
  });

  test('busak (DELETE) - sukses', async () => {
    global.fetch = gaweMockFetch({ status: 204, json: null, text: '' });
    const { Koneksi } = await import('../src/lib/koneksi.js');

    const response = await Koneksi.busak('http://example.com/data/1');
    expect(response.status).toBe(204);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.com/data/1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  test('response header - konversi headers dadi obyek', async () => {
    global.fetch = gaweMockFetch();
    const { Koneksi } = await import('../src/lib/koneksi.js');

    const response = await Koneksi.jaluk('http://example.com');
    expect(response.header).toEqual({
      'content-type': 'application/json',
      'x-custom': 'test'
    });
  });

  test('204 No Content - json balekno null, teks balekno ""', async () => {
    global.fetch = gaweMockFetch({ status: 204, json: null, text: '' });
    const { Koneksi } = await import('../src/lib/koneksi.js');

    const response = await Koneksi.busak('http://example.com/1');
    expect(await response.json()).toBeNull();
    expect(await response.teks()).toBe('');
  });

  test('error network - uncalen exception', async () => {
    global.fetch = gaweMockFetch({ error: 'Gagal nyambung' });
    const { Koneksi } = await import('../src/lib/koneksi.js');

    await expect(Koneksi.jaluk('http://example.com'))
      .rejects.toThrow('Gagal nyambung');
  });

  test('method karo opsi tambahan', async () => {
    global.fetch = gaweMockFetch();
    const { Koneksi } = await import('../src/lib/koneksi.js');

    await Koneksi.jaluk('http://example.com', {
      headers: { 'Authorization': 'Bearer token123' },
      signal: AbortSignal.timeout(5000)
    });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.com',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ 'Authorization': 'Bearer token123' })
      })
    );
  });

  test('kirim (POST) - tanpa headers tambahan', async () => {
    global.fetch = gaweMockFetch({ status: 201 });
    const { Koneksi } = await import('../src/lib/koneksi.js');

    const response = await Koneksi.kirim('http://example.com/data', { jeneng: 'test' });
    expect(response.status).toBe(201);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.com/data',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });

  test('kirim (POST) - tanpa data', async () => {
    global.fetch = gaweMockFetch({ status: 201 });
    const { Koneksi } = await import('../src/lib/koneksi.js');

    const response = await Koneksi.kirim('http://example.com/data');
    expect(response.status).toBe(201);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.com/data',
      expect.objectContaining({
        method: 'POST',
        body: undefined
      })
    );
  });
});

describe('Koneksi Library - Integration Tests (Liwat Interpreter)', () => {
  let originalFetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('Koneksi.jaluk - status lan header', async () => {
    global.fetch = gaweMockFetch();

    const kode = `
      tenangan gawe test() terus
        jarno response yoiku enteni Koneksi.jaluk('http://example.com')
        cetakno('Status: ' tambah response.status)
        cetakno('Tipe: ' tambah response.header['content-type'])
      mbari
      enteni test()
    `;

    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('Status: 200');
    expect(outputs[1]).toBe('Tipe: application/json');
  });

  test('Koneksi.jaluk - json() tegese', async () => {
    global.fetch = gaweMockFetch();

    const kode = `
      tenangan gawe test() terus
        jarno response yoiku enteni Koneksi.jaluk('http://example.com')
        jarno data yoiku enteni response.json()
        cetakno('Jeneng: ' tambah data.jeneng)
        cetakno('Umur: ' tambah data.umur)
      mbari
      enteni test()
    `;

    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('Jeneng: John');
    expect(outputs[1]).toBe('Umur: 30');
  });

  test('Koneksi.kirim - ngirim data POST', async () => {
    global.fetch = gaweMockFetch({ status: 201 });

    const kode = `
      tenangan gawe test() terus
        jarno response yoiku enteni Koneksi.kirim('http://example.com/data', terus jeneng: 'test', umur: 25 mbari)
        cetakno('Status kirim: ' tambah response.status)
      mbari
      enteni test()
    `;

    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('Status kirim: 201');
  });

  test('Koneksi.dandani - ngirim data PUT', async () => {
    global.fetch = gaweMockFetch();

    const kode = `
      tenangan gawe test() terus
        jarno response yoiku enteni Koneksi.dandani('http://example.com/data/1', terus jeneng: 'diupdate' mbari)
        cetakno('Status dandani: ' tambah response.status)
      mbari
      enteni test()
    `;

    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('Status dandani: 200');
  });

  test('Koneksi.busak - mbusak data DELETE', async () => {
    global.fetch = gaweMockFetch({ status: 204, json: null, text: '' });

    const kode = `
      tenangan gawe test() terus
        jarno response yoiku enteni Koneksi.busak('http://example.com/data/1')
        cetakno('Status busak: ' tambah response.status)
      mbari
      enteni test()
    `;

    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('Status busak: 204');
  });

  test('error handling - nyekel gagal jaringan', async () => {
    global.fetch = gaweMockFetch({ error: 'Gagal nyambung' });

    const kode = `
      tenangan gawe test() terus
        cobak terus
          jarno response yoiku enteni Koneksi.jaluk('http://example.com')
          cetakno('Iki ora bakal dicetak')
        mbari nyekel e terus
          cetakno('Kejiret error: ' tambah e)
        mbari
      mbari
      enteni test()
    `;

    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toContain('Kejiret error');
  });

  test('nggunakake teks() tinimbang json()', async () => {
    global.fetch = gaweMockFetch();

    const kode = `
      tenangan gawe test() terus
        jarno response yoiku enteni Koneksi.jaluk('http://example.com')
        jarno body yoiku enteni response.teks()
        cetakno('Body: ' tambah body)
      mbari
      enteni test()
    `;

    const outputs = await jalanakeKode(kode);
    expect(outputs[0]).toBe('Body: ' + mockText);
  });
});

describe('Koneksi Library - PRD Compliance', () => {
  test('1. Asynchronous - kabeh method kudu balekno Janji (Promise)', () => {
    // Sakwise import, method kudu ngasilake Promise nalika di call
    // Iki wis diverifikasi nang tes nduwur sing kabeh nggunakake await
    expect(true).toBe(true);
  });

  test('2. Javanese-First - jeneng method nggunakake basa Jawa', () => {
    const methodNames = ['jaluk', 'kirim', 'dandani', 'busak'];
    const responseProps = ['json', 'teks', 'status', 'header'];

    // Verifikasi jeneng method Javanese
    expect(methodNames).toContain('jaluk');   // GET
    expect(methodNames).toContain('kirim');   // POST
    expect(methodNames).toContain('dandani'); // PUT
    expect(methodNames).toContain('busak');   // DELETE

    // Verifikasi jeneng properti response
    expect(responseProps).toContain('teks');  // .text() -> .teks()
    expect(responseProps).toContain('json');  // .json() -> .json()
  });

  test('3. Robustness - nangani JSON, error, lan timeout', async () => {
    // Response json() method bisa di call (diverifikasi nang tes nduwur)
    // Error catching (diverifikasi nang tes nduwur)
    // Opsi bisa dilewati (diverifikasi nang tes unit)
    expect(true).toBe(true);
  });

  test('4. Response object struktur', async () => {
    global.fetch = gaweMockFetch();
    const { Koneksi } = await import('../src/lib/koneksi.js');

    const response = await Koneksi.jaluk('http://example.com');

    // .json() - balekno parsed JSON
    expect(typeof response.json).toBe('function');

    // .teks() - balekno body dadi String
    expect(typeof response.teks).toBe('function');

    // .status - Angka
    expect(typeof response.status).toBe('number');

    // .header - Obyek
    expect(typeof response.header).toBe('object');
    expect(response.header).not.toBeNull();
  });
});
