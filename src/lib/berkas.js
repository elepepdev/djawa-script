import fs from 'fs';
import path from 'path';

function resolvePath(p, currentDir) {
  if (!p || typeof p !== 'string') return p;
  if (path.isAbsolute(p)) return p;
  return path.resolve(currentDir || process.cwd(), p);
}

function pesenError(e, pathStr) {
  if (e.code === 'ENOENT') return `'${pathStr}' ora ditemokake.`;
  if (e.code === 'EACCES') return `Izin ditolak kanggo '${pathStr}'.`;
  if (e.code === 'EEXIST') return `'${pathStr}' wis ana.`;
  if (e.code === 'ENOTDIR') return `'${pathStr}' dudu folder.`;
  if (e.code === 'EISDIR') return `'${pathStr}' iku folder, dudu file.`;
  if (e.code === 'ENOTEMPTY') return `Folder '${pathStr}' durung kosong.`;
  return e.message;
}

function uncalen(e, pathStr) {
  throw new Error('Berkas: ' + pesenError(e, pathStr));
}

const Berkas = {
  maca(pathStr, encoding, currentDir) {
    try {
      return fs.readFileSync(resolvePath(pathStr, currentDir), encoding || 'utf8');
    } catch (e) { uncalen(e, pathStr); }
  },

  macaBuffer(pathStr, currentDir) {
    try {
      return fs.readFileSync(resolvePath(pathStr, currentDir));
    } catch (e) { uncalen(e, pathStr); }
  },

  tulis(pathStr, data, currentDir) {
    try {
      fs.writeFileSync(resolvePath(pathStr, currentDir), data);
    } catch (e) { uncalen(e, pathStr); }
  },

  tambah(pathStr, data, currentDir) {
    try {
      fs.appendFileSync(resolvePath(pathStr, currentDir), data);
    } catch (e) { uncalen(e, pathStr); }
  },

  kopi(sumber, tujuan, currentDir) {
    try {
      fs.cpSync(resolvePath(sumber, currentDir), resolvePath(tujuan, currentDir), { recursive: true });
    } catch (e) { uncalen(e, sumber); }
  },

  pindah(sumber, tujuan, currentDir) {
    try {
      fs.renameSync(resolvePath(sumber, currentDir), resolvePath(tujuan, currentDir));
    } catch (e) { uncalen(e, sumber); }
  },

  gantiJeneng(asal, anyar, currentDir) {
    try {
      fs.renameSync(resolvePath(asal, currentDir), resolvePath(anyar, currentDir));
    } catch (e) { uncalen(e, asal); }
  },

  busak(pathStr, currentDir) {
    try {
      fs.unlinkSync(resolvePath(pathStr, currentDir));
    } catch (e) { uncalen(e, pathStr); }
  },

  ono(pathStr, currentDir) {
    try {
      return fs.existsSync(resolvePath(pathStr, currentDir));
    } catch { return false; }
  },

  info(pathStr, currentDir) {
    try {
      const s = fs.statSync(resolvePath(pathStr, currentDir));
      return {
        gede: s.size,
        ikuFile: s.isFile(),
        ikuFolder: s.isDirectory(),
        ikuLink: s.isSymbolicLink(),
        wektuGawe: s.birthtime,
        wektuGanti: s.mtime,
        wektuAkses: s.atime,
        mode: s.mode,
        toString: () => '<Info Berkas: ' + pathStr + '>'
      };
    } catch (e) { uncalen(e, pathStr); }
  },

  gaweFolder(pathStr, currentDir) {
    try {
      fs.mkdirSync(resolvePath(pathStr, currentDir));
    } catch (e) { uncalen(e, pathStr); }
  },

  gaweFolderBertingkat(pathStr, currentDir) {
    try {
      fs.mkdirSync(resolvePath(pathStr, currentDir), { recursive: true });
    } catch (e) { uncalen(e, pathStr); }
  },

  busakFolder(pathStr, currentDir) {
    try {
      fs.rmdirSync(resolvePath(pathStr, currentDir));
    } catch (e) { uncalen(e, pathStr); }
  },

  busakFolderKabeh(pathStr, currentDir) {
    try {
      fs.rmSync(resolvePath(pathStr, currentDir), { recursive: true, force: true });
    } catch (e) { uncalen(e, pathStr); }
  },

  dhaptarFolder(pathStr, currentDir) {
    try {
      return fs.readdirSync(resolvePath(pathStr, currentDir));
    } catch (e) { uncalen(e, pathStr); }
  },

  dhaptarFolderJero(pathStr, currentDir) {
    try {
      const resolved = resolvePath(pathStr, currentDir);
      const entries = fs.readdirSync(resolved, { recursive: true });
      return entries.map(e => e.split(path.sep).join('/'));
    } catch (e) { uncalen(e, pathStr); }
  },

  sambung(...segments) {
    return path.join(...segments);
  },

  rampung(...segments) {
    return path.resolve(...segments);
  },

  jeneng(pathStr) {
    return path.basename(pathStr);
  },

  direktori(pathStr) {
    return path.dirname(pathStr);
  },

  ekstensi(pathStr) {
    return path.extname(pathStr);
  },

  pisah(pathStr) {
    const parsed = path.parse(pathStr);
    return {
      oyot: parsed.root,
      folder: parsed.dir,
      jeneng: parsed.base,
      ekstensi: parsed.ext,
      jenengIso: parsed.name,
      toString: () => '<Berkas Path: ' + pathStr + '>'
    };
  },

  toString: () => '<native Berkas>'
};

export { Berkas };
