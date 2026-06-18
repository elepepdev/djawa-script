function wenehiTanggapan(tanggapan) {
  let _teks = null;

  return {
    get status() {
      return tanggapan.status;
    },
    get header() {
      const header = {};
      tanggapan.headers.forEach((nilai, kunci) => {
        header[kunci] = nilai;
      });
      return header;
    },
    json: async () => {
      if (tanggapan.status === 204) return null;
      return await tanggapan.json();
    },
    teks: async () => {
      if (tanggapan.status === 204) return "";
      if (_teks === null) _teks = await tanggapan.text();
      return _teks;
    },
    toString: () => `<Tanggapan Koneksi ${tanggapan.status}>`
  };
}

export const Koneksi = {
  jaluk: async (url, opsi) => {
    const tanggapan = await fetch(url, { method: 'GET', ...opsi });
    return wenehiTanggapan(tanggapan);
  },
  kirim: async (url, data, opsi) => {
    const body = data !== undefined ? JSON.stringify(data) : undefined;
    const tanggapan = await fetch(url, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json', ...(opsi?.headers || {}) },
      ...opsi
    });
    return wenehiTanggapan(tanggapan);
  },
  dandani: async (url, data, opsi) => {
    const body = data !== undefined ? JSON.stringify(data) : undefined;
    const tanggapan = await fetch(url, {
      method: 'PUT',
      body,
      headers: { 'Content-Type': 'application/json', ...(opsi?.headers || {}) },
      ...opsi
    });
    return wenehiTanggapan(tanggapan);
  },
  busak: async (url, opsi) => {
    const tanggapan = await fetch(url, { method: 'DELETE', ...opsi });
    return wenehiTanggapan(tanggapan);
  },
  toString: () => "<native Koneksi>"
};
