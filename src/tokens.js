export const TokenType = {
  // Keywords
  IKI_IKU: 'IKI_IKU',       // const
  JARNO: 'JARNO',           // let
  GAWE: 'GAWE',             // function
  BALEKNO: 'BALEKNO',       // return
  CETAKNO: 'CETAKNO',       // console.log / print
  LEK: 'LEK',               // if
  LEK_MISALE: 'LEK_MISALE', // else if
  LIYANE: 'LIYANE',         // else
  SELAGI: 'SELAGI',         // while
  KANGGO: 'KANGGO',         // for
  TERUS: 'TERUS',           // { (block start)
  MBARI: 'MBARI',           // } (block end)
  TENAN: 'TENAN',           // true
  GAK: 'GAK',               // false
  KOSONG: 'KOSONG',         // null
  ORADIDEFINISIKAN: 'ORADIDEFINISIKAN', // undefined
  TAKON: 'TAKON',           // prompt
  ANYAR: 'ANYAR',           // new
  MANDEK: 'MANDEK',         // break
  LANJUTNO: 'LANJUTNO',     // continue
  PILIH: 'PILIH',           // switch
  KALO: 'KALO',             // case
  YOWES: 'YOWES',           // default
  COBAK: 'COBAK',           // try
  NYEKEL: 'NYEKEL',         // catch
  PUNGKASAN: 'PUNGKASAN',   // finally
  UNCALEN: 'UNCALEN',       // throw
  TENANGAN: 'TENANGAN',     // async / generator
  ENTENI: 'ENTENI',         // await
  ASILNO: 'ASILNO',         // yield
  LAKONI: 'LAKONI',         // =>
  KELAS: 'KELAS',           // class
  TURUNAN_SOKO: 'TURUNAN_SOKO', // extends
  WUJUDNO: 'WUJUDNO',       // constructor
  INDUK: 'INDUK',           // super
  IKI: 'IKI',               // this
  TETEP: 'TETEP',           // static
  ENTUK: 'ENTUK',           // get
  PASANG: 'PASANG',         // set
  IKU_ONO: 'IKU_ONO',       // is not null/undefined
  IKU_ILANG: 'IKU_ILANG',   // is null/undefined
  TUPLE: 'TUPLE',           // tuple()
  JUPUKNO: 'JUPUKNO',       // import
  METOKNO: 'METOKNO',       // export
  SOKO: 'SOKO',             // of (for...of)
  ING: 'ING',               // in (for...in / property check)
  DADI: 'DADI',             // as (import renaming)
  BIASANE: 'BIASANE',       // default (import/export)
  KABEH: 'KABEH',           // * (export wildcard)
  TA: 'TA',                 // ternary ?
  LEK_GAK: 'LEK_GAK',       // ternary :

  // Literals
  IDENTIFIER: 'IDENTIFIER',
  NUMBER: 'NUMBER',
  STRING: 'STRING',

  // Operators
  YOIKU: 'YOIKU',           // =
  TAMBAH: 'TAMBAH',         // +
  KURANG: 'KURANG',         // -
  PING: 'PING',             // *
  BAGI: 'BAGI',             // /
  SISO: 'SISO',             // %
  PANGKAT: 'PANGKAT',       // **
  TAMBAH_KARO: 'TAMBAH_KARO', // +=
  KURANG_KARO: 'KURANG_KARO', // -=
  PING_KARO: 'PING_KARO',   // *=
  BAGI_KARO: 'BAGI_KARO',   // /=
  SISO_KARO: 'SISO_KARO',   // %=

  // Comparisons
  PLEK: 'PLEK',             // ===
  PODO: 'PODO',             // ==
  GAK_PLEK: 'GAK_PLEK',     // !==
  GAK_PODO: 'GAK_PODO',     // !=
  LUWIH_GEDHE: 'LUWIH_GEDHE', // >
  LUWIH_CILIK: 'LUWIH_CILIK', // <
  LUWIH_GEDHE_PODO: 'LUWIH_GEDHE_PODO', // >=
  LUWIH_CILIK_PODO: 'LUWIH_CILIK_PODO', // <=

  // Logical
  LAN: 'LAN',               // &&
  UTAWA: 'UTAWA',           // ||
  ORA: 'ORA',               // !
  UTOWO_YEN_KOSONG: 'UTOWO_YEN_KOSONG', // ??

  // Bitwise
  LANBIT: 'LANBIT',         // &
  UTAWABIT: 'UTAWABIT',     // |
  XOR: 'XOR',               // ^
  WALIK: 'WALIK',           // ~
  GESER_KIWO: 'GESER_KIWO', // <<
  GESER_TENGEN: 'GESER_TENGEN', // >>
  GESER_TENGEN_NOL: 'GESER_TENGEN_NOL', // >>>

  // Punctuation
  LEFT_PAREN: 'LEFT_PAREN',   // (
  RIGHT_PAREN: 'RIGHT_PAREN', // )
  LEFT_BRACKET: 'LEFT_BRACKET', // [
  RIGHT_BRACKET: 'RIGHT_BRACKET', // ]
  COMMA: 'COMMA',             // ,
  DOT: 'DOT',                 // .
  COLON: 'COLON',             // :
  SEMICOLON: 'SEMICOLON',     // ;
  MUNGKIN: 'MUNGKIN',         // .mungkin.
  
  EOF: 'EOF'
};

export const Keywords = {
  'iki iku': TokenType.IKI_IKU,
  'jarno': TokenType.JARNO,
  'gawe': TokenType.GAWE,
  'balekno': TokenType.BALEKNO,
  'cetakno': TokenType.CETAKNO,
  'lek': TokenType.LEK,
  'liyane': TokenType.LIYANE,
  'selagi': TokenType.SELAGI,
  'kanggo': TokenType.KANGGO,
  'terus': TokenType.TERUS,
  'mbari': TokenType.MBARI,
  'tenan': TokenType.TENAN,
  'gak': TokenType.GAK,
  'kosong': TokenType.KOSONG,
  'oraDidefinisikan': TokenType.ORADIDEFINISIKAN,
  'takon': TokenType.TAKON,
  'anyar': TokenType.ANYAR,
  'mandek': TokenType.MANDEK,
  'lanjutno': TokenType.LANJUTNO,
  'pilih': TokenType.PILIH,
  'kalo': TokenType.KALO,
  'yowes': TokenType.YOWES,
  'cobak': TokenType.COBAK,
  'nyekel': TokenType.NYEKEL,
  'pungkasan': TokenType.PUNGKASAN,
  'uncalen': TokenType.UNCALEN,
  'tenangan': TokenType.TENANGAN,
  'enteni': TokenType.ENTENI,
  'asilno': TokenType.ASILNO,
  'lakoni': TokenType.LAKONI,
  'kelas': TokenType.KELAS,
  'wujudno': TokenType.WUJUDNO,
  'induk': TokenType.INDUK,
  'iki': TokenType.IKI,
  'tetep': TokenType.TETEP,
  'entuk': TokenType.ENTUK,
  'pasang': TokenType.PASANG,
  'tuple': TokenType.TUPLE,
  'jupukno': TokenType.JUPUKNO,
  'metokno': TokenType.METOKNO,
  'soko': TokenType.SOKO,
  'ing': TokenType.ING,
  'dadi': TokenType.DADI,
  'biasane': TokenType.BIASANE,
  'kabeh': TokenType.KABEH,
  'ta': TokenType.TA,

  // Javanese Operators as Keywords to prevent them being IDENTIFIERs
  'tambah': TokenType.TAMBAH,
  'kurang': TokenType.KURANG,
  'ping': TokenType.PING,
  'bagi': TokenType.BAGI,
  'siso': TokenType.SISO,
  'pangkat': TokenType.PANGKAT,
  'yoiku': TokenType.YOIKU,
  'tambahKaro': TokenType.TAMBAH_KARO,
  'kurangKaro': TokenType.KURANG_KARO,
  'pingKaro': TokenType.PING_KARO,
  'bagiKaro': TokenType.BAGI_KARO,
  'sisoKaro': TokenType.SISO_KARO,
  'plek': TokenType.PLEK,
  'podo': TokenType.PODO,
  'gakPlek': TokenType.GAK_PLEK,
  'gakPodo': TokenType.GAK_PODO,
  'luwihGedhe': TokenType.LUWIH_GEDHE,
  'luwihCilik': TokenType.LUWIH_CILIK,
  'luwihGedhePodo': TokenType.LUWIH_GEDHE_PODO,
  'luwihCilikPodo': TokenType.LUWIH_CILIK_PODO,
  'lan': TokenType.LAN,
  'utawa': TokenType.UTAWA,
  'ora': TokenType.ORA,
  'lanbit': TokenType.LANBIT,
  'utawabit': TokenType.UTAWABIT,
  'xor': TokenType.XOR,
  'walik': TokenType.WALIK,
  'geserKiwo': TokenType.GESER_KIWO,
  'geserTengen': TokenType.GESER_TENGEN,
  'geserTengenNol': TokenType.GESER_TENGEN_NOL,
  'utowoYenKosong': TokenType.UTOWO_YEN_KOSONG,
  'lek misale': TokenType.LEK_MISALE,
  'lek gak': TokenType.LEK_GAK,
  
  // Additional keywords
  'carane': TokenType.GAWE,
  'susuk': TokenType.BALEKNO,
  'ngomong': TokenType.CETAKNO,
  'yo': TokenType.TERUS,
  'mari': TokenType.MBARI,
  'saestu': TokenType.TENAN,
  'iyo': TokenType.TENAN,
  'mbelgedhes': TokenType.GAK,
  'muspro': TokenType.KOSONG,
  'luput': TokenType.UNCALEN,
  'yen': TokenType.LEK,
  'menawi': TokenType.LEK,
  'utowo': TokenType.LIYANE,
  'saksuwene': TokenType.SELAGI,
  'mbaleni': TokenType.KANGGO,
};
