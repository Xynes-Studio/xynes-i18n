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
  const pseudoMessage = tokenizeMessage(message)
    .map((part) => (part.protected ? part.value : pseudoLocalizeText(part.value)))
    .join("");

  return `[${pseudoMessage}]`;
}

interface MessageToken {
  readonly value: string;
  readonly protected: boolean;
}

function tokenizeMessage(message: string): MessageToken[] {
  const tokens: MessageToken[] = [];
  let index = 0;

  while (index < message.length) {
    const protectedToken =
      readRichTextTagToken(message, index) ?? readBalancedBraceToken(message, index);

    if (protectedToken) {
      tokens.push({ value: protectedToken.value, protected: true });
      index = protectedToken.endIndex;
      continue;
    }

    const nextProtectedStart = findNextProtectedTokenStart(message, index + 1);
    tokens.push({
      value: message.slice(index, nextProtectedStart),
      protected: false,
    });
    index = nextProtectedStart;
  }

  return tokens;
}

interface ProtectedToken {
  readonly value: string;
  readonly endIndex: number;
}

function readRichTextTagToken(message: string, startIndex: number): ProtectedToken | null {
  if (message[startIndex] !== "<") {
    return null;
  }

  const tagNameStart = message[startIndex + 1] === "/" ? startIndex + 2 : startIndex + 1;
  if (!isAsciiLetter(message[tagNameStart])) {
    return null;
  }

  const endIndex = message.indexOf(">", tagNameStart + 1);
  if (endIndex === -1) {
    return null;
  }

  return {
    value: message.slice(startIndex, endIndex + 1),
    endIndex: endIndex + 1,
  };
}

function readBalancedBraceToken(message: string, startIndex: number): ProtectedToken | null {
  if (message[startIndex] !== "{") {
    return null;
  }

  let depth = 0;

  for (let index = startIndex; index < message.length; index += 1) {
    if (message[index] === "{") {
      depth += 1;
    }

    if (message[index] === "}") {
      depth -= 1;

      if (depth === 0) {
        return {
          value: message.slice(startIndex, index + 1),
          endIndex: index + 1,
        };
      }
    }
  }

  return null;
}

function findNextProtectedTokenStart(message: string, startIndex: number): number {
  for (let index = startIndex; index < message.length; index += 1) {
    if (message[index] === "<" || message[index] === "{") {
      return index;
    }
  }

  return message.length;
}

function isAsciiLetter(character: string | undefined): boolean {
  if (!character) {
    return false;
  }

  const charCode = character.charCodeAt(0);
  return (
    (charCode >= "A".charCodeAt(0) && charCode <= "Z".charCodeAt(0)) ||
    (charCode >= "a".charCodeAt(0) && charCode <= "z".charCodeAt(0))
  );
}

function pseudoLocalizeText(text: string): string {
  return Array.from(text)
    .map((character) => ACCENT_MAP.get(character) ?? character)
    .join("");
}
