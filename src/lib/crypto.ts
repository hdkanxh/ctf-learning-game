/**
 * 浏览器端 SHA-256 哈希（用于 flag 验证）
 * 使用 Web Crypto API，无需后端
 */

export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 凯撒密码加密（仅用于生成题目素材）
 */
export function caesarEncrypt(text: string, shift: number): string {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      }
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join('');
}

/**
 * 凯撒密码解密
 */
export function caesarDecrypt(text: string, shift: number): string {
  return caesarEncrypt(text, (26 - shift) % 26);
}

/**
 * Base64 编码
 */
export function base64Encode(text: string): string {
  if (typeof window !== 'undefined') {
    return btoa(unescape(encodeURIComponent(text)));
  }
  return Buffer.from(text).toString('base64');
}

/**
 * Base64 解码
 */
export function base64Decode(text: string): string {
  // 清理空白字符，补齐缺失的 = 填充符
  let cleaned = text.trim().replace(/\s/g, '');
  while (cleaned.length % 4 !== 0) cleaned += '=';

  try {
    const decoded = atob(cleaned);
    try {
      return decodeURIComponent(escape(decoded));
    } catch {
      return decoded;
    }
  } catch {
    throw new Error('Base64 解码失败，请检查输入');
  }
}

/**
 * 字符串逆序
 */
export function reverseString(text: string): string {
  return text.split('').reverse().join('');
}

/**
 * ROT13（凯撒偏移 13）
 */
export function rot13(text: string): string {
  return caesarEncrypt(text, 13);
}

/**
 * 栅栏密码加密
 */
export function railFenceEncrypt(text: string, rails: number): string {
  const fence: string[][] = Array.from({ length: rails }, () => []);
  let rail = 0;
  let direction = 1;
  for (const char of text) {
    fence[rail].push(char);
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }
  return fence.flat().join('');
}

/**
 * 栅栏密码解密
 */
export function railFenceDecrypt(text: string, rails: number): string {
  const fence: (string | null)[][] = Array.from({ length: rails }, () =>
    Array(text.length).fill(null)
  );
  let rail = 0;
  let direction = 1;
  for (let i = 0; i < text.length; i++) {
    fence[rail][i] = '*';
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }
  let idx = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < text.length; c++) {
      if (fence[r][c] === '*') {
        fence[r][c] = text[idx++];
      }
    }
  }
  rail = 0;
  direction = 1;
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += fence[rail][i];
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }
  return result;
}

/**
 * 摩尔斯电码表
 */
export const MORSE_CODE: Record<string, string> = {
  'a': '.-',   'b': '-...', 'c': '-.-.', 'd': '-..',  'e': '.',
  'f': '..-.', 'g': '--.',  'h': '....', 'i': '..',   'j': '.---',
  'k': '-.-',  'l': '.-..', 'm': '--',   'n': '-.',   'o': '---',
  'p': '.--.', 'q': '--.-', 'r': '.-.',  's': '...',  't': '-',
  'u': '..-',  'v': '...-', 'w': '.--',  'x': '-..-', 'y': '-.--',
  'z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '_': '..--.-', '{': '---...', '}': '...---', '-': '-....-',
};

export const MORSE_REVERSE: Record<string, string> = {};
for (const [key, value] of Object.entries(MORSE_CODE)) {
  MORSE_REVERSE[value] = key;
}

/**
 * 摩尔斯电码解码
 */
export function morseDecode(morse: string): string {
  return morse
    .trim()
    .split(/\s+/)
    .map((code) => MORSE_REVERSE[code] || code)
    .join('');
}