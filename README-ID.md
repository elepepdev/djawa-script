[English](./README.md) | [Bahasa Indonesia](./README-ID.md)

---

# DjawaScript

**DjawaScript** adalah bahasa pemrograman berbasis transpiler yang terinspirasi dari bahasa Jawa, dengan JavaScript sebagai bahasa induknya. Tulis kode menggunakan kata-kata bahasa Jawa — DjawaScript akan mengompilasinya menjadi JavaScript yang valid.

> File sumber menggunakan ekstensi `.jawa`. Alat CLI-nya bernama `djawa`.

---

## Daftar Isi

- [Mulai Cepat](#mulai-cepat)
- [Konsep Dasar](#konsep-dasar)
  - [Blok Kode: `terus` & `mbari`](#blok-kode-terus--mbari)
  - [Komentar](#komentar)
  - [Variabel](#variabel)
  - [Tipe Data](#tipe-data)
  - [Konsol & Input Pengguna](#konsol--input-pengguna)
- [Sistem Tipe (Opsional)](#sistem-tipe-opsional)
- [Alur Kontrol](#alur-kontrol)
  - [Kondisional: `lek`, `lek misale`, `liyane`](#kondisional-lek-lek-misale-liyane)
  - [Operator Ternary: `ta` & `lek gak`](#operator-ternary-ta--lek-gak)
  - [Perulangan](#perulangan)
  - [Pernyataan Switch: `pilih`](#pernyataan-switch-pilih)
- [Fungsi](#fungsi)
  - [Fungsi Biasa: `gawe`](#fungsi-biasa-gawe)
  - [Arrow Function: `lakoni`](#arrow-function-lakoni)
  - [Fungsi Generator](#fungsi-generator)
  - [Fungsi Asinkron: `tenangan` & `enteni`](#fungsi-asinkron-tenangan--enteni)
- [Penanganan Error](#penanganan-error)
- [Operator & Pembanding](#operator--pembanding)
  - [Operator Aritmatika & Penugasan](#operator-aritmatika--penugasan)
  - [Operator Perbandingan & Logika](#operator-perbandingan--logika)
  - [Operator Khusus](#operator-khusus)
  - [Optional Chaining: `.mungkin.`](#optional-chaining-mungkin)
  - [Nullish Coalescing: `utowoYenKosong`](#nullish-coalescing-utowoyenkosong)
  - [Operator Bitwise](#operator-bitwise)
- [Fitur Unik](#fitur-unik)
  - [Pengecekan Null/Undefined: `iku ono` & `iku ilang`](#pengecekan-nullundefined-iku-ono--iku-ilang)
  - [Tuple (Data Immutable)](#tuple-data-immutable)
- [Kata Kunci Khusus](#kata-kunci-khusus)
- [Pemrograman Berorientasi Objek (OOP)](#pemrograman-berorientasi-objek-oop)
- [Sistem Modul](#sistem-modul)
- [Metaprogramming: `Perantara` & `Pantulan`](#metaprogramming-perantara--pantulan)
- [Pustaka Bawaan](#pustaka-bawaan)
  - [Nilai & Konstruktor Global](#nilai--konstruktor-global)
  - [`Mtk` — Objek Math](#mtk--objek-math)
  - [`Tanggalan` — Objek Date](#tanggalan--objek-date)
  - [`DataJSON` — Objek JSON](#datajson--objek-json)
  - [Fungsi Global](#fungsi-global)
  - [Method Promise: `.banjur` & `.nyekel`](#method-promise-banjur--nyekel)
  - [Method Array](#method-array)
  - [Method String](#method-string)
  - [Method Bersama Array & String](#method-bersama-array--string)
- [Referensi CLI](#referensi-cli)

---

## Mulai Cepat

**1. Install via npm:**
```bash
npm install -g @jawirhytam/jawirscript
```

Atau install versi terbaru langsung dari GitHub:
```bash
npm install -g https://github.com/gegesteorngoding/djawa-script
```

**2. Buat file baru:**
```bash
djawa make halo
```

**3. Tulis program pertamamu (`halo.jawa`):**
```jawascript
iki iku jeneng yoiku "Dunia"
cetakno("Halo, " tambah jeneng tambah "!")
```

**4. Jalankan:**
```bash
djawa run halo.jawa
```

---

## Konsep Dasar

### Blok Kode: `terus` & `mbari`

DjawaScript adalah bahasa **berbasis blok**. Setiap blok kode — baik untuk fungsi, perulangan, maupun kondisional — harus dibuka dengan `terus` dan ditutup dengan `mbari`. Anggap saja mereka seperti `{` dan `}` di JavaScript.

```jawascript
lek (tenan) terus
  // kode di dalam blok
mbari
```

### Komentar

```jawascript
// Ini adalah komentar satu baris

/*
  Ini adalah
  komentar multi-baris
*/
```

### Variabel

| Kata Kunci | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `iki iku` | `const` | Konstan — tidak bisa diubah nilainya |
| `jarno` | `let` | Mutable — nilainya bisa diubah |

```jawascript
// Variabel konstan
iki iku jeneng yoiku "Budi"

// Variabel yang bisa diubah
jarno umur yoiku 25
umur yoiku umur tambah 1  // umur sekarang 26
```

### Tipe Data

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `tenan` | `true` | Boolean benar |
| `gak` | `false` | Boolean salah |
| `kosong` | `null` | Nilai null |
| `oraDidefinisikan` | `undefined` | Nilai undefined |

```jawascript
jarno lagi_sinau yoiku tenan
jarno nilai yoiku 100
jarno pesan yoiku "Sugeng sinau!"
jarno ora_ono yoiku kosong
```

### Konsol & Input Pengguna

Objek `cetakno` adalah padanan dari `console` di JavaScript. Gunakan `takon` untuk meminta input dari pengguna.

| Method | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `cetakno(...)` | `console.log(...)` | Cetak output ke konsol |
| `cetakno.peringatan(...)` | `console.warn(...)` | Catat pesan peringatan |
| `cetakno.kesalahan(...)` | `console.error(...)` | Catat pesan error |
| `cetakno.info(...)` | `console.info(...)` | Catat pesan informasi |
| `cetakno.debug(...)` | `console.debug(...)` | Catat pesan debug |
| `cetakno.tabel(data)` | `console.table(data)` | Tampilkan data sebagai tabel |
| `cetakno.hitung(label)` | `console.count(label)` | Catat berapa kali baris ini dipanggil |
| `cetakno.waktu(label)` | `console.time(label)` | Mulai timer |
| `cetakno.akhirWaktu(label)` | `console.timeEnd(label)` | Hentikan timer dan tampilkan waktu yang berlalu |
| `cetakno.grup(label)` | `console.group(label)` | Mulai grup yang dapat dilipat di konsol |
| `cetakno.akhirGrup()` | `console.groupEnd()` | Akhiri grup konsol saat ini |
| `takon(pesan)` | `prompt(pesan)` | Minta input dari pengguna |

```jawascript
cetakno("Halo Dunyo!")

jarno jenengmu yoiku takon("Sopo jenengmu? ")
cetakno("Sugeng rawuh, " tambah jenengmu)

cetakno.peringatan("Iki peringatan!")
cetakno.kesalahan("Iki kesalahan!")

cetakno.waktu("timerku")
// ... beberapa operasi ...
cetakno.akhirWaktu("timerku")
```

---

## Sistem Tipe (Opsional)

DjawaScript mendukung **sistem tipe statis opsional** yang mirip dengan TypeScript. Menambahkan anotasi tipe tidak diwajibkan, tetapi sangat membantu untuk menangkap bug lebih awal dan membuat kode lebih mudah dipahami.

**Tipe yang Didukung:**

| Tipe DjawaScript | Tipe JavaScript |
| :--- | :--- |
| `Angka` | `number` |
| `Teks` | `string` |
| `Logika` | `boolean` |
| `Kosong` | `null` |
| `OraDidefinisikan` | `undefined` |
| `Daftar` | `Array` |
| `Obyek` | `Object` |
| `Sembarang` | `any` |
| `OraOno` | `void` |

**Sintaks:**

```jawascript
// Deklarasi variabel dengan tipe
jarno umur: Angka = 30
iki iku jeneng: Teks = "Budi"
jarno isAktif: Logika = tenan

// Parameter dan tipe kembalian fungsi
gawe sapa(jeneng: Teks): Teks terus
  balekno "Halo " tambah jeneng
mbari

gawe tambahkan(a: Angka, b: Angka): Angka terus
  balekno a tambah b
mbari

// Arrow function dengan tipe
jarno getUmur yoiku (tahunLahir: Angka): Angka lakoni 2025 kurang tahunLahir

jarno cetakInfo yoiku (pesan: Teks, jumlah: Angka): OraOno lakoni terus
  cetakno(pesan tambah ": " tambah jumlah)
mbari
```

> **Cara kerjanya:** Ketika tipe digunakan, DjawaScript mentranspilasi kode Anda menjadi TypeScript yang valid. Anda kemudian bisa menjalankan `tsc` untuk melakukan pengecekan tipe statis dan menghasilkan output JavaScript akhir.

---

## Alur Kontrol

### Kondisional: `lek`, `lek misale`, `liyane`

| Kata Kunci | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `lek (kondisi)` | `if (kondisi)` | Jalankan blok jika kondisi benar |
| `lek misale (kondisi)` | `else if (kondisi)` | Pengecekan kondisi tambahan |
| `liyane` | `else` | Jalankan jika semua kondisi sebelumnya salah |

```jawascript
jarno nilai yoiku 85

lek (nilai luwihGedhe 90) terus
  cetakno("Istimewa")
mbari lek misale (nilai luwihGedhe 75) terus
  cetakno("Baik")
mbari liyane terus
  cetakno("Tetap semangat!")
mbari
```

### Operator Ternary: `ta` & `lek gak`

Kondisional satu baris yang ringkas, setara dengan operator ternary `? :` di JavaScript.

**Sintaks:** `kondisi ta nilai_jika_benar lek gak nilai_jika_salah`

```jawascript
// JS: const status = umur >= 18 ? 'Dewasa' : 'Anak-anak';

iki iku umur yoiku 20
iki iku status yoiku umur luwihGedhePodo 18 ta 'Dewasa' lek gak 'Anak-anak'
cetakno(status)  // Output: Dewasa
```

### Perulangan

**Perulangan `for` — `kanggo`**

```jawascript
kanggo (jarno i yoiku 0; i luwihCilik 5; i++) terus
  cetakno(i)
mbari
// Output: 0 1 2 3 4
```

**Perulangan `while` — `selagi`**

```jawascript
jarno hitung yoiku 0
selagi (hitung luwihCilik 3) terus
  cetakno(hitung)
  hitung++
mbari
```

**Perulangan `do...while` — `lakoni...selagi`**

Blok dijalankan minimal satu kali, meskipun kondisi langsung salah dari awal.

```jawascript
jarno hitung yoiku 0
lakoni terus
  cetakno("Hitungan: " tambah hitung)
  hitung++
mbari selagi (hitung luwihCilik 3)
```

**Perulangan `for...in` — `kanggo...ing`**

Melakukan iterasi atas **kunci** (nama properti) dari sebuah objek.

```jawascript
iki iku pengguna yoiku { jeneng: 'Sastro', umur: 30, kota: 'Jogja' }

kanggo (iki iku kunci ing pengguna) terus
  cetakno(kunci tambah ": " tambah pengguna[kunci])
mbari
// Output:
// jeneng: Sastro
// umur: 30
// kota: Jogja
```

**Perulangan `for...of` — `kanggo...soko`**

Melakukan iterasi atas **nilai** dari sebuah iterable (Array, String, Map, Set, dll.).

```jawascript
iki iku woh_wohan yoiku ['apel', 'jeruk', 'mangga']

kanggo (iki iku woh soko woh_wohan) terus
  cetakno(woh)
mbari
// Output:
// apel
// jeruk
// mangga
```

**Kontrol perulangan:**

| Kata Kunci | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `mandek` | `break` | Keluar dari perulangan seketika |
| `lanjutno` | `continue` | Lompat ke iterasi berikutnya |

### Pernyataan Switch: `pilih`

| Kata Kunci | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `pilih (variabel)` | `switch (variabel)` | Mulai pernyataan switch |
| `kalo (nilai):` | `case (nilai):` | Blok case |
| `yowes:` | `default:` | Blok default jika tidak ada case yang cocok |
| `mandek` | `break` | Keluar dari switch |

```jawascript
jarno hari yoiku "Senin"

pilih (hari) terus
  kalo "Senin":
    cetakno("Semangat awal pekan!")
    mandek
  kalo "Jumat":
    cetakno("Hampir akhir pekan!")
    mandek
  yowes:
    cetakno("Hari biasa.")
mbari
```

---

## Fungsi

### Fungsi Biasa: `gawe`

| Kata Kunci | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `gawe nama(params)` | `function nama(params)` | Deklarasikan sebuah fungsi |
| `balekno nilai` | `return nilai` | Kembalikan sebuah nilai |

```jawascript
gawe hitungLuas(panjang, lebar) terus
  balekno panjang ping lebar
mbari

iki iku luas yoiku hitungLuas(10, 5)
cetakno(luas)  // Output: 50
```

### Arrow Function: `lakoni`

Sintaks fungsi yang lebih pendek, setara dengan arrow function `=>` di JavaScript.

- **Satu baris:** Nilai kembalian bersifat implisit — tidak perlu `balekno`.
- **Multi-baris:** Bungkus isi dengan `terus` dan `mbari`, dan gunakan `balekno` secara eksplisit.

```jawascript
// Satu baris (return implisit)
// JS: const kalikan = (a, b) => a * b;
iki iku kalikan yoiku (a, b) lakoni a ping b
cetakno(kalikan(7, 8))  // Output: 56

// Digunakan sebagai callback
iki iku angka yoiku [1, 2, 3]
iki iku angkaGanda yoiku angka.petakake(n lakoni n ping 2)
cetakno(angkaGanda)  // Output: [2, 4, 6]

// Multi-baris (return eksplisit)
iki iku sapa yoiku (jeneng) lakoni terus
  iki iku sapaan yoiku "Sugeng rawuh, " tambah jeneng
  balekno sapaan
mbari
cetakno(sapa("Sastro"))  // Output: Sugeng rawuh, Sastro
```

### Fungsi Generator

Gunakan `tenangan` untuk mendeklarasikan generator dan `asilno` (`yield`) untuk menjeda eksekusi dan mengembalikan nilai.

```jawascript
gawe tenangan idGenerator() terus
  jarno id yoiku 0
  selagi (tenan) terus
    asilno id++
  mbari
mbari

jarno gen yoiku idGenerator anyar()
cetakno(gen.next().value)  // Output: 0
cetakno(gen.next().value)  // Output: 1
```

### Fungsi Asinkron: `tenangan` & `enteni`

| Kata Kunci | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `tenangan` | `async` | Deklarasikan fungsi asinkron |
| `enteni` | `await` | Tunggu sebuah Promise selesai |

```jawascript
tenangan gawe prosesData() terus
  cetakno("Mengambil data...")
  iki iku data yoiku enteni ambilData()
  cetakno("Data diterima:", data)
mbari
```

---

## Penanganan Error

| Kata Kunci | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `cobak` | `try` | Mulai blok yang mungkin melempar error |
| `nyekel (error)` | `catch (error)` | Tangani error jika terjadi |
| `pungkasan` | `finally` | Selalu dijalankan, terlepas dari berhasil atau gagal |
| `uncalen nilai` | `throw nilai` | Lempar error secara manual |

```jawascript
cobak terus
  uncalen "Ada yang salah!"
mbari nyekel (e) terus
  cetakno("Error tertangkap: " tambah e)
mbari pungkasan terus
  cetakno("Ini selalu dijalankan.")
mbari
```

---

## Operator & Pembanding

> **Penting:** Selalu beri spasi sebelum dan sesudah operator.
> ✅ `5 tambah 3` &nbsp;&nbsp; ❌ `5'tambah'3`

### Operator Aritmatika & Penugasan

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `tambah` | `+` | Penjumlahan |
| `kurang` | `-` | Pengurangan |
| `ping` | `*` | Perkalian |
| `bagi` | `/` | Pembagian |
| `siso` | `%` | Modulo (sisa bagi) |
| `pangkat` | `**` | Pangkat |
| `yoiku` | `=` | Penugasan |
| `tambahKaro` | `+=` | Tambah lalu tugaskan |
| `kurangKaro` | `-=` | Kurang lalu tugaskan |
| `pingKaro` | `*=` | Kali lalu tugaskan |
| `bagiKaro` | `/=` | Bagi lalu tugaskan |
| `sisoKaro` | `%=` | Modulo lalu tugaskan |

### Operator Perbandingan & Logika

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `plek` | `===` | Persamaan ketat (nilai DAN tipe harus sama) |
| `podo` | `==` | Persamaan longgar (nilai saja) |
| `gakPlek` | `!==` | Ketidaksamaan ketat |
| `gakPodo` | `!=` | Ketidaksamaan longgar |
| `luwihGedhe` | `>` | Lebih besar dari |
| `luwihCilik` | `<` | Lebih kecil dari |
| `luwihGedhePodo` | `>=` | Lebih besar dari atau sama dengan |
| `luwihCilikPodo` | `<=` | Lebih kecil dari atau sama dengan |
| `lan` | `&&` | Logika AND |
| `utawa` | `\|\|` | Logika OR |
| `ora` | `!` | Logika NOT |

```jawascript
iki iku a yoiku 10
iki iku b yoiku 4

jarno hasil yoiku a tambah b  // -> 14
cetakno(2 pangkat 3)           // -> 8

lek (hasil luwihGedhe 10 lan ora (a podo 0)) terus
  cetakno("Hasilnya lebih besar dari 10 dan a bukan 0")
mbari

jarno skorku yoiku 100
skorku kurangKaro 10
cetakno(skorku)  // -> 90
```

### Operator Khusus

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `ikuJinise` | `instanceof` | Cek apakah objek adalah instance dari sebuah kelas |
| `tipene` | `typeof` | Dapatkan tipe data sebuah nilai |
| `hapusen` | `delete` | Hapus properti dari sebuah objek |
| `kosongno` | `void` | Evaluasi ekspresi dan kembalikan `undefined` |
| `ing` | `in` | Cek apakah properti ada di dalam objek |

```jawascript
// ikuJinise (instanceof)
kelas Mobil terus
  wujudno(merk) terus
    iki.merk yoiku merk
  mbari
mbari
jarno mobilku yoiku Mobil anyar("Toyota")
cetakno(mobilku ikuJinise Mobil)  // Output: tenan

// tipene (typeof)
cetakno(tipene "halo")  // Output: string

// hapusen (delete)
jarno obj yoiku { a: 1, b: 2 }
hapusen obj.a
cetakno(obj.a)  // Output: oraDidefinisikan

// ing (in)
jarno orang yoiku { jeneng: "Budi", umur: 30 }
cetakno("jeneng" ing orang)   // Output: tenan
cetakno("alamat" ing orang)   // Output: gak
```

### Optional Chaining: `.mungkin.`

Akses properti yang bersarang dalam dengan aman tanpa menyebabkan error, meskipun salah satu bagian dari rantai adalah `null` atau `undefined`. Setara dengan operator `?.` di JavaScript.

```jawascript
iki iku pengguna yoiku { jeneng: 'Sastro', alamat: { jalan: 'Jl. Kenangan' } }
iki iku penggunaKosong yoiku kosong

// Akses aman — berhasil
iki iku namaJalan yoiku pengguna.alamat.mungkin.jalan
cetakno(namaJalan)  // Output: Jl. Kenangan

// Akses aman — properti tidak ada, mengembalikan undefined bukan error
iki iku kodePos yoiku pengguna.alamat.mungkin.kodePos
cetakno(kodePos)  // Output: undefined

// Akses aman pada objek null
iki iku hasil yoiku penggunaKosong.mungkin.alamat.mungkin.jalan
cetakno(hasil)  // Output: undefined
```

### Nullish Coalescing: `utowoYenKosong`

Mengembalikan nilai di sebelah kanan hanya jika nilai di sebelah kiri adalah **benar-benar** `null` atau `undefined`. Berbeda dengan `utawa` (`||`) yang juga terpicu oleh nilai falsy seperti `0` atau `''`.

```jawascript
iki iku nilaiNol yoiku 0
iki iku nilaiKosong yoiku kosong

cetakno(nilaiNol utowoYenKosong 10)    // Output: 0  (0 bukan null/undefined)
cetakno(nilaiKosong utowoYenKosong 10) // Output: 10 (null memicu nilai cadangan)

// Bandingkan dengan OR logika (utawa)
cetakno(nilaiNol utawa 10)  // Output: 10 (karena 0 adalah falsy — perilaku berbeda!)
```

### Operator Bitwise

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `lanbit` | `&` | Bitwise AND |
| `utawabit` | `\|` | Bitwise OR |
| `xor` | `^` | Bitwise XOR |
| `walik` | `~` | Bitwise NOT |
| `geserKiwo` | `<<` | Geser kiri |
| `geserTengen` | `>>` | Geser kanan |
| `geserTengenNol` | `>>>` | Geser kanan dengan isi nol |

```jawascript
iki iku a yoiku 5  // Biner: 0101
iki iku b yoiku 3  // Biner: 0011

cetakno(a lanbit b)       // Output: 1  (0001)
cetakno(a utawabit b)     // Output: 7  (0111)
cetakno(a xor b)          // Output: 6  (0110)
cetakno(a geserKiwo 1)    // Output: 10 (1010)
cetakno(a geserTengen 1)  // Output: 2  (0010)
```

---

## Fitur Unik

### Pengecekan Null/Undefined: `iku ono` & `iku ilang`

DjawaScript menyediakan kata kunci yang mudah dibaca untuk mengecek apakah sebuah variabel ada atau tidak — tanpa perlu menulis `=== null || === undefined`.

| Ekspresi | Artinya |
| :--- | :--- |
| `variabel iku ono` | Variabel **bukan** `null` atau `undefined` |
| `variabel iku ilang` | Variabel **adalah** `null` atau `undefined` |

```jawascript
jarno varKosong yoiku kosong
jarno varIsi yoiku 42

// Cek ketiadaan
lek (varKosong iku ilang) terus
  cetakno("varKosong tidak ada.")  // Ini berjalan
mbari

// Cek keberadaan
lek (varIsi iku ono) terus
  cetakno("varIsi ada, nilainya:", varIsi)  // Ini berjalan
mbari
```

### Tuple (Data Immutable)

`Tuple` mirip seperti array, tetapi isinya **tidak bisa diubah** setelah dibuat. Gunakan untuk data yang harus tetap konstan, seperti koordinat atau pasangan nilai tetap.

```jawascript
// Buat Tuple koordinat
iki iku koordinat yoiku tuple(10, 20)
cetakno(koordinat[0])  // Output: 10
cetakno(koordinat[1])  // Output: 20

// Mencoba mengubah Tuple akan gagal (atau melempar error di strict mode)
cobak terus
  koordinat[0] yoiku 5
mbari nyekel (e) terus
  cetakno("Tidak bisa mengubah Tuple:", e.message)
mbari
cetakno(koordinat[0])  // Output: Tetap 10

// Tuple bisa menampung tipe data yang berbeda
iki iku infoPengguna yoiku tuple("Budi", 28, tenan)
cetakno(infoPengguna[0])  // Output: Budi
cetakno(infoPengguna[1])  // Output: 28
```

---

## Kata Kunci Khusus

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `iki` | `this` | Merujuk pada instance objek saat ini |
| `soko` | `of` | Digunakan dalam perulangan `kanggo...soko` (for...of) |
| `debug` | `debugger` | Jeda eksekusi dan aktifkan debugger |
| `tetep` | `static` | Definisikan method atau properti statis pada kelas |
| `entuk` | `get` | Definisikan getter pada kelas |
| `pasang` | `set` | Definisikan setter pada kelas |

```jawascript
// tetep (static)
kelas Utilitas terus
  tetep gawe sapa() terus
    cetakno("Halo dari Utilitas!")
  mbari
mbari
Utilitas.sapa()  // Output: Halo dari Utilitas!

// entuk (get) dan pasang (set)
kelas Kotak terus
  wujudno(lebar, dhuwur) terus
    iki._lebar yoiku lebar
    iki._dhuwur yoiku dhuwur
  mbari

  entuk area terus
    balekno iki._lebar ping iki._dhuwur
  mbari

  pasang ukuran(nilai) terus
    iki._lebar yoiku nilai
    iki._dhuwur yoiku nilai
  mbari
mbari

jarno kotakku yoiku Kotak anyar(5, 10)
cetakno(kotakku.area)    // Output: 50
kotakku.ukuran yoiku 7
cetakno(kotakku.area)    // Output: 49
```

---

## Pemrograman Berorientasi Objek (OOP)

DjawaScript mendukung OOP berbasis kelas dengan pewarisan.

| Kata Kunci | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `kelas Nama` | `class Nama` | Deklarasikan sebuah kelas |
| `wujudno(...)` | `constructor(...)` | Konstruktor kelas |
| `turunan soko KelasInduk` | `extends KelasInduk` | Warisi dari kelas induk |
| `induk(...)` | `super(...)` | Panggil konstruktor induk |
| `iki` | `this` | Merujuk pada instance saat ini |

```jawascript
// Kelas Induk
kelas Kewan terus
  wujudno(jeneng) terus
    iki.jeneng yoiku jeneng
  mbari

  mangan() terus
    cetakno(iki.jeneng tambah " lagi mangan.")
  mbari
mbari

// Kelas Anak
kelas Kucing turunan soko Kewan terus
  wujudno(jeneng) terus
    induk(jeneng)
  mbari

  meong() terus
    cetakno(iki.jeneng tambah " muni Meong!")
  mbari
mbari

jarno kucingku yoiku Kucing anyar("Tom")
kucingku.mangan()  // Output: Tom lagi mangan.
kucingku.meong()   // Output: Tom muni Meong!
```

---

## Sistem Modul

DjawaScript mendukung sistem modul gaya ES untuk mengorganisasi kode ke beberapa file.

| Kata Kunci | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `metokno { nama }` | `export { nama }` | Ekspor nilai bernama |
| `metokno biasane nilai` | `export default nilai` | Ekspor nilai default |
| `jupukno ... soko '...'` | `import ... from '...'` | Impor dari sebuah file |
| `biasane` | `default` | Digunakan untuk impor/ekspor default |
| `dadi` | `as` | Ganti nama saat mengimpor |

**`util.jawa`**
```jawascript
gawe salam(jeneng) terus
  balekno "Sugeng rawuh, " tambah jeneng
mbari

iki iku VERSI yoiku "1.0"

metokno { salam }         // Ekspor bernama
metokno biasane VERSI     // Ekspor default
```

**`app.jawa`**
```jawascript
jupukno biasane versiAplikasi, { salam dadi ngucapnoSalam } soko './util.js'

cetakno("Versi:", versiAplikasi)   // Output: Versi: 1.0
cetakno(ngucapnoSalam("Doni"))     // Output: Sugeng rawuh, Doni
```

### Ekspor Ulang sebagai Namespace

Ekspor ulang semua ekspor dari modul lain di bawah satu objek namespace.

```jawascript
// JS: export * as utils from './utils.js';
metokno kabeh dadi util soko './util_export.js'
```

### Impor Dinamis

Muat modul secara on-demand saat runtime.

```jawascript
// JS: import('./module.js').then(module => ...)
jupukno('./modul_dinamis.js')
  .banjur(modul lakoni cetakno('Berhasil dimuat:', modul.pesan))
  .nyekel(error lakoni cetakno('Error:', error))
```

> **Catatan:** Path impor harus menunjuk ke **file `.js` yang sudah dikompilasi**, bukan file sumber `.jawa`.

---

## Metaprogramming: `Perantara` & `Pantulan`

Metaprogramming tingkat lanjut didukung melalui `Perantara` (Proxy) dan `Pantulan` (Reflect).

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `Perantara` | `Proxy` | Membungkus objek untuk mencegat operasi |
| `Pantulan` | `Reflect` | Menyediakan method untuk operasi yang dicegat |
| `Pantulan.jupuk` | `Reflect.get` | Ambil properti dari sebuah objek |
| `Pantulan.pasang` | `Reflect.set` | Atur properti pada sebuah objek |
| `Pantulan.bangun` | `Reflect.construct` | Bangun objek baru |

```jawascript
iki iku target yoiku { pesan: 'Hello World', nilai: 100 }

iki iku handler yoiku {
  // Cegat pembacaan properti
  jupuk: gawe(obj, prop) terus
    cetakno(`Mengambil: "${prop}"`)
    balekno Pantulan.jupuk(obj, prop)
  mbari,

  // Cegat penulisan properti
  pasang: gawe(obj, prop, value) terus
    cetakno(`Mengatur "${prop}" menjadi "${value}"`)
    lek (prop plek 'nilai' lan tipene value ora plek 'number') terus
      uncalen anyar Kesalahan('Nilai harus berupa angka!')
    mbari
    balekno Pantulan.pasang(obj, prop, value)
  mbari
}

iki iku p yoiku anyar Perantara(target, handler)

cetakno(p.pesan)  // -> Mengambil: "pesan" -> Hello World
p.nilai yoiku 200  // -> Mengatur "nilai" menjadi "200"

cobak terus
  p.nilai yoiku 'bukan angka'
mbari nyekel (e) terus
  cetakno('Error: ' tambah e.message)  // -> Error: Nilai harus berupa angka!
mbari
```

---

## Pustaka Bawaan

### Nilai & Konstruktor Global

**Nilai global:**

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `kosong` | `null` | Nilai null |
| `oraDidefinisikan` | `undefined` | Nilai undefined |
| `gudukAngka` | `NaN` | Not-a-Number |
| `tanpaBates` | `Infinity` | Tak terhingga |
| `globalIki` | `globalThis` | Objek lingkup global |

**Konstruktor global:**

Instance baru bisa dibuat dengan sintaks `NamaKelas anyar()` atau `anyar NamaKelas()`.

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `Daftar` | `Array` | Array |
| `Obyek` | `Object` | Object |
| `Teks` | `String` | String |
| `Angka` | `Number` | Number |
| `Logika` | `Boolean` | Boolean |
| `Simbol` | `Symbol` | Symbol (identifikator unik) |
| `Peta` | `Map` | Map |
| `Kumpulan` | `Set` | Set |
| `Janji` | `Promise` | Promise |
| `Kesalahan` | `Error` | Error |
| `PolaTeks` | `RegExp` | Regular Expression |

**Method statis untuk Obyek & Daftar:**

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `Obyek.iku(v1, v2)` | `Object.is(v1, v2)` | Perbandingan ketat |
| `Obyek.wenehno(target, ...src)` | `Object.assign(target, ...src)` | Salin properti ke target |
| `Obyek.kunci(obj)` | `Object.keys(obj)` | Array nama properti |
| `Obyek.nilai(obj)` | `Object.values(obj)` | Array nilai properti |
| `Obyek.entri(obj)` | `Object.entries(obj)` | Array pasangan `[kunci, nilai]` |
| `Daftar.ikiDaftar(nilai)` | `Array.isArray(nilai)` | Cek apakah nilai adalah Array |

```jawascript
jarno daftar yoiku Daftar anyar()
cetakno(daftar)  // Output: []

iki iku obj1 yoiku { a: 1 }
iki iku obj2 yoiku { b: 2 }
iki iku gabungan yoiku Obyek.wenehno({}, obj1, obj2)
cetakno(DataJSON.stringkan(gabungan))  // Output: {"a":1,"b":2}
cetakno(Obyek.kunci(gabungan))         // Output: ['a', 'b']

// Simbol — membuat kunci unik yang tidak bertabrakan dengan properti lain
iki iku uid yoiku Simbol('id')
iki iku pengguna yoiku { jeneng: 'Slamet' }
pengguna[uid] yoiku '987-xyz'
cetakno(Obyek.kunci(pengguna))  // Output: ['jeneng'] (kunci Simbol tersembunyi)
cetakno(pengguna[uid])          // Output: 987-xyz
```

### `Mtk` — Objek Math

**Konstanta:**

| Konstanta | Nilai | Keterangan |
| :--- | :--- | :--- |
| `Mtk.PI` | ≈ 3.14159 | Pi |
| `Mtk.E` | ≈ 2.718 | Bilangan Euler |
| `Mtk.LN2` | ≈ 0.693 | Logaritma natural dari 2 |
| `Mtk.LN10` | ≈ 2.303 | Logaritma natural dari 10 |
| `Mtk.SQRT2` | ≈ 1.414 | Akar kuadrat dari 2 |

**Fungsi:**

| Fungsi | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `Mtk.acak()` | `Math.random()` | Angka acak antara 0 dan 1 |
| `Mtk.bunder(x)` | `Math.round(x)` | Bulatkan ke integer terdekat |
| `Mtk.ngisor(x)` | `Math.floor(x)` | Bulatkan ke bawah |
| `Mtk.nduwur(x)` | `Math.ceil(x)` | Bulatkan ke atas |
| `Mtk.mutlak(x)` | `Math.abs(x)` | Nilai absolut |
| `Mtk.pangkat(basis, eksponen)` | `Math.pow(basis, eksponen)` | Pemangkatan |
| `Mtk.oyot(x)` | `Math.sqrt(x)` | Akar kuadrat |
| `Mtk.palingDhuwur(...args)` | `Math.max(...args)` | Nilai terbesar |
| `Mtk.palingNgisor(...args)` | `Math.min(...args)` | Nilai terkecil |
| `Mtk.sin(x)` | `Math.sin(x)` | Sinus |
| `Mtk.cos(x)` | `Math.cos(x)` | Kosinus |
| `Mtk.tan(x)` | `Math.tan(x)` | Tangen |
| `Mtk.log(x)` | `Math.log(x)` | Logaritma natural |
| `Mtk.log2(x)` | `Math.log2(x)` | Logaritma basis 2 |
| `Mtk.log10(x)` | `Math.log10(x)` | Logaritma basis 10 |
| `Mtk.exp(x)` | `Math.exp(x)` | Eˣ |
| `Mtk.cbrt(x)` | `Math.cbrt(x)` | Akar kubik |
| `Mtk.trunc(x)` | `Math.trunc(x)` | Hapus bagian desimal |
| `Mtk.sign(x)` | `Math.sign(x)` | Tanda angka (-1, 0, atau 1) |
| `Mtk.hypot(...args)` | `Math.hypot(...args)` | Akar kuadrat dari jumlah kuadrat |

### `Tanggalan` — Objek Date

| Method | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `Tanggalan.saiki()` | `Date.now()` | Milidetik sejak 1 Januari 1970 UTC |
| `Tanggalan anyar()` | `new Date()` | Tanggal dan waktu saat ini |

### `DataJSON` — Objek JSON

| Method | Ekuivalen JavaScript | Keterangan |
| :--- | :--- | :--- |
| `DataJSON.urai(str)` | `JSON.parse(str)` | Urai string JSON menjadi objek |
| `DataJSON.stringkan(obj)` | `JSON.stringify(obj)` | Ubah objek menjadi string JSON |

### Fungsi Global

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `ikiGudukAngka(nilai)` | `isNaN(nilai)` | Cek apakah nilai adalah NaN |
| `jadiknoInt(str, radix)` | `parseInt(str, radix)` | Urai string ke integer |
| `jadiknoFloat(str)` | `parseFloat(str)` | Urai string ke float |
| `ikiTerbatas(nilai)` | `isFinite(nilai)` | Cek apakah nilai adalah angka terbatas |
| `uraiURI(uri)` | `decodeURI(uri)` | Dekode URI |
| `enkodeURI(uri)` | `encodeURI(uri)` | Enkode URI |
| `uraiBagianURI(str)` | `decodeURIComponent(str)` | Dekode komponen URI |
| `enkodeBagianURI(str)` | `encodeURIComponent(str)` | Enkode komponen URI |
| `setWaktuTunda(fn, ms)` | `setTimeout(fn, ms)` | Jalankan fungsi setelah penundaan |
| `hapusWaktuTunda(id)` | `clearTimeout(id)` | Batalkan timeout |
| `setWaktuInterval(fn, ms)` | `setInterval(fn, ms)` | Jalankan fungsi berulang kali |
| `hapusWaktuInterval(id)` | `clearInterval(id)` | Batalkan interval |

```jawascript
cetakno(ikiGudukAngka("abc"))    // Output: tenan
cetakno(jadiknoInt("101", 2))    // Output: 5 (biner ke desimal)
cetakno(ikiTerbatas(10 bagi 0))  // Output: gak

setWaktuTunda(gawe () terus
  cetakno("Ini muncul setelah 1 detik")
mbari, 1000)

jarno hitungMundur yoiku 3
jarno intervalId yoiku setWaktuInterval(gawe () terus
  cetakno("Hitung mundur: " tambah hitungMundur)
  hitungMundur kurangKaro 1
  lek (hitungMundur plek 0) terus
    hapusWaktuInterval(intervalId)
    cetakno("Selesai!")
  mbari
mbari, 1000)
```

### Method Promise: `.banjur` & `.nyekel`

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `.banjur(onFulfilled, onRejected?)` | `.then(...)` | Tangani Promise yang berhasil |
| `.nyekel(onRejected)` | `.catch(...)` | Tangani Promise yang gagal |

```jawascript
iki iku janjiku yoiku Janji anyar((resolve, reject) dadi terus
  setWaktuTunda(() dadi resolve('Selesai!'), 100)
mbari)

janjiku
  .banjur(hasil lakoni cetakno('Berhasil:', hasil))
  .nyekel(error lakoni cetakno('Error:', error))
```

### Method Array

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `.dorong(item)` | `.push(item)` | Tambah item ke akhir |
| `.jupukPungkasan()` | `.pop()` | Hapus dan kembalikan item terakhir |
| `.geser()` | `.shift()` | Hapus dan kembalikan item pertama |
| `.tambahNgarep(item)` | `.unshift(item)` | Tambah item ke awal |
| `.sambung(idx, del, item?)` | `.splice(...)` | Sisipkan atau hapus item |
| `.sambungake(separator)` | `.join(separator)` | Gabungkan elemen menjadi string |
| `.walik()` | `.reverse()` | Balikkan urutan array |
| `.urutake(fn?)` | `.sort(fn?)` | Urutkan array |
| `.golek(fn)` | `.find(fn)` | Temukan elemen pertama yang cocok |
| `.golekIndeks(fn)` | `.findIndex(fn)` | Temukan indeks kecocokan pertama |
| `.golekIndeksPungkasan(item)` | `.lastIndexOf(item)` | Temukan indeks terakhir dari item |
| `.saring(fn)` | `.filter(fn)` | Saring elemen berdasarkan kondisi |
| `.petakake(fn)` | `.map(fn)` | Transformasi setiap elemen |
| `.kanggoSaben(fn)` | `.forEach(fn)` | Jalankan fungsi untuk setiap elemen |
| `.suda(fn, initial?)` | `.reduce(fn, initial?)` | Reduksi menjadi satu nilai |
| `.sudaTengen(fn, initial?)` | `.reduceRight(fn, initial?)` | Reduksi dari kanan ke kiri |
| `.ana(fn)` | `.some(fn)` | Cek apakah ada elemen yang cocok |
| `.kabeh(fn)` | `.every(fn)` | Cek apakah semua elemen cocok |

### Method String

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `.gedekno()` | `.toUpperCase()` | Ubah ke huruf kapital |
| `.cilikno()` | `.toLowerCase()` | Ubah ke huruf kecil |
| `.rapikno()` | `.trim()` | Hapus spasi di awal dan akhir |
| `.gantien(a, b)` | `.replace(a, b)` | Ganti kecocokan pertama |
| `.gantienKabeh(a, b)` | `.replaceAll(a, b)` | Ganti semua kecocokan |
| `.pecahen(separator)` | `.split(separator)` | Pecah menjadi array |
| `.dimulaiKaro(s)` | `.startsWith(s)` | Cek apakah dimulai dengan string |
| `.diakhiriKaro(s)` | `.endsWith(s)` | Cek apakah diakhiri dengan string |
| `.tambahiNgarep(len, txt)` | `.padStart(len, txt)` | Tambah karakter di awal |
| `.tambahiMburi(len, txt)` | `.padEnd(len, txt)` | Tambah karakter di akhir |
| `.potonganTeks(start, end?)` | `.substring(start, end?)` | Ambil sebagian string |
| `.karakterKe(index)` | `.charAt(index)` | Ambil karakter pada indeks |
| `.cocokno(regex)` | `.match(regex)` | Cocokkan dengan regex |
| `.goleki(kata)` | `.search(kata)` | Cari kecocokan |

### Method Bersama Array & String

Method-method ini berfungsi pada keduanya, `Daftar` (Array) dan `Teks` (String).

| DjawaScript | JavaScript | Keterangan |
| :--- | :--- | :--- |
| `.dawane` | `.length` | Panjang array atau string |
| `.ngemot(item)` | `.includes(item)` | Cek apakah item terkandung di dalamnya |
| `.iris(start, end?)` | `.slice(start, end?)` | Ambil sebagian |
| `.gabung(item)` | `.concat(item)` | Gabungkan array atau string |
| `.indeksSaka(item)` | `.indexOf(item)` | Temukan indeks pertama dari item |

---

## Referensi CLI

### Instalasi

Pastikan [Node.js](https://nodejs.org/) sudah terinstal, lalu jalankan:

```bash
npm install -g @jawirhytam/jawirscript
```

Atau install langsung dari GitHub:
```bash
npm install -g https://github.com/gegesteorngoding/djawa-script
```

### Perintah

| Perintah | Keterangan |
| :--- | :--- |
| `djawa run <file.jawa>` | Transpilasi dan jalankan file `.jawa` |
| `djawa build <file.jawa>` | Transpilasi file `.jawa` menjadi `.js` |
| `djawa make <namafile>` | Buat file `.jawa` baru dari template |
| `djawa version` / `djawa -v` | Tampilkan versi DjawaScript saat ini |
| `djawa help` / `djawa -h` | Tampilkan informasi bantuan |
