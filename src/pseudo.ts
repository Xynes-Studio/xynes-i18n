const TOKEN_PATTERN = /(<\/?[A-Za-z][^>]*>|{[^{}]*(?:{[^{}]*}[^{}]*)*})/g;

const ACCENT_MAP = new Map<string, string>([
  ["a", "aa"],
  ["b", "bb"],
  ["c", "cc"],
  ["d", "dd"],
  ["e", "ee"],
  ["f", "ff"],
  ["g", "gg"],
  ["h", "hh"],
  ["i", "ii"],
  ["j", "jj"],
  ["k", "kk"],
  ["l", "ll"],
  ["m", "mm"],
  ["n", "nn"],
  ["o", "oo"],
  ["p", "pp"],
  ["q", "qq"],
  ["r", "rr"],
  ["s", "ss"],
  ["t", "tt"],
  ["u", "uu"],
  ["v", "vv"],
  ["w", "ww"],
  ["x", "xx"],
  ["y", "yy"],
  ["z", "zz"],
  ["A", "AA"],
  ["B", "BB"],
  ["C", "CC"],
  ["D", "DD"],
  ["E", "EE"],
  ["F", "FF"],
  ["G", "GG"],
  ["H", "HH"],
  ["I", "II"],
  ["J", "JJ"],
  ["K", "KK"],
  ["L", "LL"],
  ["M", "MM"],
  ["N", "NN"],
  ["O", "OO"],
  ["P", "PP"],
  ["Q", "QQ"],
  ["R", "RR"],
  ["S", "SS"],
  ["T", "TT"],
  ["U", "UU"],
  ["V", "VV"],
  ["W", "WW"],
  ["X", "XX"],
  ["Y", "YY"],
  ["Z", "ZZ"],
]);

export function pseudoLocalizeMessage(message: string): string {
  const parts = message.split(TOKEN_PATTERN).filter((part) => part !== "");
  const pseudoMessage = parts
    .map((part) => (isProtectedToken(part) ? part : pseudoLocalizeText(part)))
    .join("");

  return `[${pseudoMessage}]`;
}

function isProtectedToken(part: string): boolean {
  return (
    /^<\/?[A-Za-z][^>]*>$/.test(part) ||
    (part.startsWith("{") && part.endsWith("}"))
  );
}

function pseudoLocalizeText(text: string): string {
  return Array.from(text)
    .map((character) => ACCENT_MAP.get(character) ?? character)
    .join("");
}
