function transcript(txt) {
  txt = txt.replace(/್‍/g, "ä").replace(/‍/g, "");

  let E = txt.indexOf("ೆ*");
  let N = txt.indexOf("ೆ*");
  let M = 1;
  while (E > -1) {
    while (txt[N - 2] == "್" || txt[N - 2] == "ä") {
      M = M + 2;
      N = N - 2;
    }
    txt = txt.slice(0, E - M) + "o" + txt.slice(E - M, E) + txt.slice(E + 2);
    E = txt.indexOf("ೆ*");
    N = txt.indexOf("ೆ*");
    M = 1;
  }

  E = txt.indexOf("ೇ*");
  N = txt.indexOf("ೇ*");
  M = 1;
  while (E > -1) {
    while (txt[N - 2] == "್" || txt[N - 2] == "ä") {
      M = M + 2;
      N = N - 2;
    }
    txt = txt.slice(0, E - M) + "O" + txt.slice(E - M, E) + txt.slice(E + 2);
    E = txt.indexOf("ೇ*");
    N = txt.indexOf("ೇ*");
    M = 1;
  }

  txt = txt
    .replace(/ಎ\*/g, "oA")
    .replace(/ಏ\*/g, "OA")
    .replace(/ು\*/g, "uAX")
    .replace(/ಉ\*/g, "XAuAX");

  txt = txt.replace(/ೈ/g, "ೈ").replace(/ೊೖ/g, "ೖa");

  let e = txt.indexOf("ೖ");
  let n = txt.indexOf("ೖ");
  let m = 1;
  while (e > -1) {
    if (/ಾ|ಿ|ೀ|ು|ೂ|ೃ|ೆ|ೇ|ೊ|ೋ|ೌ/.test(txt[e - 1])) {
      n = n - 1;
      m = 2;
    }
    while (txt[n - 2] == "್" || txt[n - 2] == "ä") {
      m = m + 2;
      n = n - 2;
    }
    txt = txt.slice(0, e - m) + "ee" + txt.slice(e - m, e) + txt.slice(e + 1);

    e = txt.indexOf("ೖ");
    n = txt.indexOf("ೖ");
    m = 1;
  }

  e = txt.indexOf("ೆ");
  n = txt.indexOf("ೆ");
  m = 1;
  while (e > -1) {
    while (txt[n - 2] == "್" || txt[n - 2] == "ä") {
      m = m + 2;
      n = n - 2;
    }
    txt = txt.slice(0, e - m) + "e" + txt.slice(e - m, e) + txt.slice(e + 1);
    e = txt.indexOf("ೆ");
    n = txt.indexOf("ೆ");
    m = 1;
  }

  e = txt.indexOf("ೇ");
  n = txt.indexOf("ೇ");
  m = 1;
  while (e > -1) {
    while (txt[n - 2] == "್" || txt[n - 2] == "ä") {
      m = m + 2;
      n = n - 2;
    }
    //replace ೇ with E
    txt = txt.slice(0, e - m) + "E" + txt.slice(e - m, e) + txt.slice(e + 1);
    e = txt.indexOf("ೇ");
    n = txt.indexOf("ೇ");
    m = 1;
  }

  e = txt.indexOf("ೈ");
  n = txt.indexOf("ೈ");
  m = 1;
  while (e > -1) {
    while (txt[n - 2] == "್" || txt[n - 2] == "ä") {
      m = m + 2;
      n = n - 2;
    }
    txt = txt.slice(0, e - m) + "ee" + txt.slice(e - m, e) + txt.slice(e + 1);
    e = txt.indexOf("ೈ");
    n = txt.indexOf("ೈ");
    m = 1;
  }

  e = txt.indexOf("ೊ");
  n = txt.indexOf("ೊ");
  m = 1;
  while (e > -1) {
    while (txt[n - 2] == "್" || txt[n - 2] == "ä") {
      m = m + 2;
      n = n - 2;
    }
    txt =
      txt.slice(0, e - m) + "e" + txt.slice(e - m, e) + "a" + txt.slice(e + 1);
    e = txt.indexOf("ೊ");
    n = txt.indexOf("ೊ");
    m = 1;
  }

  e = txt.indexOf("ೋ");
  n = txt.indexOf("ೋ");
  m = 1;
  while (e > -1) {
    while (txt[n - 2] == "್" || txt[n - 2] == "ä") {
      m = m + 2;
      n = n - 2;
    }
    txt =
      txt.slice(0, e - m) + "F" + txt.slice(e - m, e) + "a" + txt.slice(e + 1);
    e = txt.indexOf("ೋ");
    n = txt.indexOf("ೋ");
    m = 1;
  }

  let H = txt.indexOf("ರ್");
  let ra2 = txt[H + 2];

  while (H > -1) {
    if (
      /ಕ|ಖ|ಗ|ಘ|ಙ|ಚ|ಛ|ಜ|ಝ|ಞ|ಟ|ಠ|ಡ|ಢ|ಣ|ತ|ಥ|ದ|ಧ|ನ|ಪ|ಫ|ಬ|ಭ|ಮ|ಯ|ಲ|ವ|ಶ|ಷ|ಸ|ಹ|ಳ/.test(
        ra2
      ) &&
      txt[H - 1] !== "್"
    ) {
      txt = txt.slice(0, H) + txt[H + 2] + "f" + txt.slice(H + 3);
      H = txt.indexOf("ರ್");
      ra2 = txt[H + 2];
    } else {
      txt = txt.replace("ರ್", "rA");
      H = txt.indexOf("ರ್");
      ra2 = txt[H + 2];
    }
  }

  txt = txt
    .replace(/ಅ/g, "XAA")
    .replace(/ಆ/g, "XAa")
    .replace(/ಇ/g, "XAi")
    .replace(/ಈ/g, "XAI")
    .replace(/ಉ/g, "XAu")
    .replace(/ಊ/g, "XAU")
    .replace(/ಋ/g, "XAR")
    .replace(/ೠ/g, "XARR")
    .replace(/ಎ/g, "eA")
    .replace(/ಏ/g, "EA")
    .replace(/ಐ/g, "eeA")
    .replace(/ಒ/g, "eAa")
    .replace(/ಓ/g, "FAa")
    .replace(/ಔ/g, "XAY")
    .replace(/ಂ/g, "M")
    .replace(/ಃ/g, "H")
    .replace(/ಕ/g, "k")
    .replace(/ಖ/g, "K")
    .replace(/ಗ/g, "g")
    .replace(/ಘ/g, "G")
    .replace(/ಙ/g, "Z")
    .replace(/ಚ/g, "c")
    .replace(/ಛ/g, "C")
    .replace(/ಜ/g, "j")
    .replace(/ಝ/g, "J")
    .replace(/ಞ/g, "z")
    .replace(/ಟ/g, "q")
    .replace(/ಠ/g, "Q")
    .replace(/ಡ/g, "w")
    .replace(/ಢ/g, "W")
    .replace(/ಣ/g, "N")
    .replace(/ತ/g, "t")
    .replace(/ಥ/g, "T")
    .replace(/ದ/g, "d")
    .replace(/ಧ/g, "D")
    .replace(/ನ/g, "n")
    .replace(/ಪ/g, "p")
    .replace(/ಫ/g, "P")
    .replace(/ಬ/g, "b")
    .replace(/ಭ/g, "B")
    .replace(/ಮ/g, "m")
    .replace(/ಯ/g, "y")
    .replace(/ರ/g, "r")
    .replace(/ಲ/g, "l")
    .replace(/ವ/g, "v")
    .replace(/ಶ/g, "S")
    .replace(/ಷ/g, "x")
    .replace(/ಸ/g, "s")
    .replace(/ಹ/g, "h")
    .replace(/ಳ/g, "L")
    .replace(/ೞ/g, "L")
    .replace(/ಱ/g, "xxrhaxx")
    .replace(/್/g, "A")
    .replace(/ಾ/g, "a")
    .replace(/ು/g, "u")
    .replace(/ೂ/g, "U")
    .replace(/ೌ/g, "Y")
    .replace(/ಿ/g, "i")
    .replace(/ೀ/g, "I")
    .replace(/ೃ/g, "R")
    .replace(/ೄ/g, "RR")
    .replace(/‌/g, "X")
    .replace(/‍/g, "")
    .replace(/ä/g, "A");

  //malayalam

  txt = txt.replace(/്‍/g, "ä");

  E = txt.indexOf("െ*");
  N = txt.indexOf("െ*");
  M = 1;
  while (E > -1) {
    while (txt[N - 2] == "്" || txt[N - 2] == "ä") {
      M = M + 2;
      N = N - 2;
    }
    txt = txt.slice(0, E - M) + "o" + txt.slice(E - M, E) + txt.slice(E + 2);
    E = txt.indexOf("െ*");
    N = txt.indexOf("െ*");
    M = 1;
  }

  E = txt.indexOf("േ*");
  N = txt.indexOf("േ*");
  M = 1;
  while (E > -1) {
    while (txt[N - 2] == "്" || txt[N - 2] == "ä") {
      M = M + 2;
      N = N - 2;
    }
    txt = txt.slice(0, E - M) + "O" + txt.slice(E - M, E) + txt.slice(E + 2);
    E = txt.indexOf("േ*");
    N = txt.indexOf("േ*");
    M = 1;
  }

  txt = txt
    .replace(/എ\*/g, "oA")
    .replace(/ഏ\*/g, "OA")
    .replace(/ു\*/g, "uAX")
    .replace(/ഉ\*/g, "XAuAX");

  txt = txt.replace(/െൈ/g, "ൈ").replace(/ൊൈ/g, "ൈa");

  //replace െ with e
  e = txt.indexOf("െ");
  n = txt.indexOf("െ");
  m = 1;
  while (e > -1) {
    while (txt[n - 2] == "്" || txt[n - 2] == "ä") {
      m = m + 2;
      n = n - 2;
    }
    txt = txt.slice(0, e - m) + "e" + txt.slice(e - m, e) + txt.slice(e + 1);
    e = txt.indexOf("െ");
    n = txt.indexOf("െ");
    m = 1;
  }

  //replace േ with E
  e = txt.indexOf("േ");
  n = txt.indexOf("േ");
  m = 1;
  while (e > -1) {
    while (txt[n - 2] == "്" || txt[n - 2] == "ä") {
      m = m + 2;
      n = n - 2;
    }
    txt = txt.slice(0, e - m) + "E" + txt.slice(e - m, e) + txt.slice(e + 1);
    e = txt.indexOf("േ");
    n = txt.indexOf("േ");
    m = 1;
  }

  //replace ൈ with ee
  e = txt.indexOf("ൈ");
  n = txt.indexOf("ൈ");
  m = 1;
  while (e > -1) {
    while (txt[n - 2] == "്" || txt[n - 2] == "ä") {
      m = m + 2;
      n = n - 2;
    }
    txt = txt.slice(0, e - m) + "ee" + txt.slice(e - m, e) + txt.slice(e + 1);
    e = txt.indexOf("ൈ");
    n = txt.indexOf("ൈ");
    m = 1;
  }

  e = txt.indexOf("ൊ");
  n = txt.indexOf("ൊ");
  m = 1;
  while (e > -1) {
    while (txt[n - 2] == "്" || txt[n - 2] == "ä") {
      m = m + 2;
      n = n - 2;
    }
    txt =
      txt.slice(0, e - m) + "e" + txt.slice(e - m, e) + "a" + txt.slice(e + 1);
    e = txt.indexOf("ൊ");
    n = txt.indexOf("ൊ");
    m = 1;
  }

  e = txt.indexOf("ോ");
  n = txt.indexOf("ോ");
  m = 1;
  while (e > -1) {
    while (txt[n - 2] == "്" || txt[n - 2] == "ä") {
      m = m + 2;
      n = n - 2;
    }
    txt =
      txt.slice(0, e - m) + "F" + txt.slice(e - m, e) + "a" + txt.slice(e + 1);
    e = txt.indexOf("ോ");
    n = txt.indexOf("ോ");
    m = 1;
  }

  H = txt.indexOf("ര്");
  ra2 = txt[H + 2];
  while (H > -1) {
    if (
      /ക|ഖ|ഗ|ഘ|ങ|ച|ഛ|ജ|ഝ|ഞ|ട|ഠ|ഡ|ഢ|ണ|ത|ഥ|ദ|ധ|ന|പ|ഫ|ബ|ഭ|മ|യ|ല|വ|ശ|ഷ|സ|ഹ|ള/.test(
        ra2
      ) &&
      txt[H - 1] !== "്"
    ) {
      txt = txt.slice(0, H) + txt[H + 2] + "f" + txt.slice(H + 3);
      H = txt.indexOf("ര്");
      ra2 = txt[H + 2];
    } else {
      txt = txt.replace("ര്", "rA");
      H = txt.indexOf("ര്");
      ra2 = txt[H + 2];
    }
  }

  H = txt.indexOf("ർ");
  ra2 = txt[H + 1];
  while (H > -1) {
    if (
      /ക|ഖ|ഗ|ഘ|ങ|ച|ഛ|ജ|ഝ|ഞ|ട|ഠ|ഡ|ഢ|ണ|ത|ഥ|ദ|ധ|ന|പ|ഫ|ബ|ഭ|മ|യ|ല|വ|ശ|ഷ|സ|ഹ|ള/.test(
        ra2
      ) &&
      txt[H - 1] !== "്"
    ) {
      txt = txt.slice(0, H) + txt[H + 1] + "f" + txt.slice(H + 2);
      H = txt.indexOf("ർ");
      ra2 = txt[H + 1];
    } else {
      txt = txt.replace("ർ", "rA");
      H = txt.indexOf("ർ");
      ra2 = txt[H + 1];
    }
  }

  txt = txt
    .replace(/അ/g, "XAA")
    .replace(/ആ/g, "XAa")
    .replace(/ഇ/g, "XAi")
    .replace(/ഈ/g, "XAI")
    .replace(/ഉ/g, "XAu")
    .replace(/ഊ/g, "XAU")
    .replace(/ഋ/g, "XAR")
    .replace(/ൠ/g, "XARR")
    .replace(/ൄ/g, "RR")
    .replace(/എ/g, "eA")
    .replace(/ഏ/g, "EA")
    .replace(/ഐ/g, "eeA")
    .replace(/ഒ/g, "eAa")
    .replace(/ഓ/g, "FAa")
    .replace(/ഔ/g, "AY")
    .replace(/ൗ/g, "Y")
    .replace(/ം/g, "M")
    .replace(/ഃ/g, "H")
    .replace(/ക/g, "k")
    .replace(/ഖ/g, "K")
    .replace(/ഗ/g, "g")
    .replace(/ഘ/g, "G")
    .replace(/ങ/g, "Z")
    .replace(/ച/g, "c")
    .replace(/ഛ/g, "C")
    .replace(/ജ/g, "j")
    .replace(/ഝ/g, "J")
    .replace(/ഞ/g, "z")
    .replace(/ട/g, "q")
    .replace(/ഠ/g, "Q")
    .replace(/ഡ/g, "w")
    .replace(/ഢ/g, "W")
    .replace(/ണ/g, "N")
    .replace(/ത/g, "t")
    .replace(/ഥ/g, "T")
    .replace(/ദ/g, "d")
    .replace(/ധ/g, "D")
    .replace(/ന/g, "n")
    .replace(/പ/g, "p")
    .replace(/ഫ/g, "P")
    .replace(/ബ/g, "b")
    .replace(/ഭ/g, "B")
    .replace(/മ/g, "m")
    .replace(/യ/g, "y")
    .replace(/ര/g, "r")
    .replace(/ല/g, "l")
    .replace(/വ/g, "v")
    .replace(/ശ/g, "S")
    .replace(/ഷ/g, "x")
    .replace(/സ/g, "s")
    .replace(/ഹ/g, "h")
    .replace(/ള/g, "L")
    .replace(/്/g, "A")
    .replace(/ാ/g, "a")
    .replace(/ു/g, "u")
    .replace(/ൂ/g, "U")
    .replace(/ൈ/g, "Y")
    .replace(/ി/g, "i")
    .replace(/ീ/g, "I")
    .replace(/ൃ/g, "R")
    .replace(/‍/g, "X")
    .replace(/‌/g, "X")
    .replace(/ä/g, "A");
  txt = txt
    .replace(/A /g, "A  ")
    .replace(/റ/g, "r")
    .replace(/ഴ/g, "L")
    .replace(/ർ/g, "rA")
    .replace(/ൻ/g, "nA")
    .replace(/ൺ/g, "NA")
    .replace(/ൽ/g, "lA")
    .replace(/ൾ/g, "LA");

  let fa = txt.indexOf("fA");
  while (fa > -1) {
    var tt = [
      "k",
      "K",
      "g",
      "G",
      "Z",
      "c",
      "C",
      "j",
      "J",
      "z",
      "q",
      "Q",
      "w",
      "W",
      "N",
      "t",
      "T",
      "d",
      "D",
      "n",
      "p",
      "P",
      "b",
      "B",
      "m",
      "y",
      "r",
      "l",
      "v",
      "S",
      "x",
      "s",
      "h",
      "L",
    ];

    if (tt.includes(txt[fa + 2])) {
      txt = txt.slice(0, fa) + "fXA" + txt.slice(fa + 2);
    }

    fa = txt.indexOf("fA", fa + 2);
  }

  return txt;
}

exports.transcript = transcript;
