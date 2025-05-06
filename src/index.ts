// reference: https://github.com/luxmeter/mongojuuid

const BASE64_DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const HEX_DIGITS = "0123456789abcdef";

/**
 * Convert UUID string to Java-style BinData(3, "...") format
 * @param uuid - The UUID string to convert
 * @returns The BinData string representation
 */
export function toBindata(uuid: string): string {
  const hex = javaHex(uuid);
  const b64 = toBase64(hex);
  return `BinData(3, "${b64}")`;
}

/**
 * Convert BinData(3, "...") format back to UUIDs
 * @param bindata - The BinData string to convert
 * @returns The UUID string
 */
export function toUuid(bindata: string): string {
  let hex = toHex(bindata);
  hex = javaHex(hex);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Reorders UUID bytes to match Java UUID layout
 * @param uuid - The UUID string to reorder
 * @returns The reordered hex string
 */
export function javaHex(uuid: string): string {
  const clean = uuid.replace(/[{}-]/g, '');
  const bytes = Array.from({ length: 16 }, (_, i) => clean.slice(i * 2, i * 2 + 2));
  const msb = bytes.slice(0, 8).reverse().join('');
  const lsb = bytes.slice(8, 16).reverse().join('');
  return msb + lsb;
}

/**
 * Encode hex string into base64 using Java MongoDB rules
 * @param hex - The hex string to encode
 * @returns The base64 encoded string
 */
export function toBase64(hex: string): string {
  hex = hex.replace(/[{}-]/g, '');
  let base64 = '';
  for (let i = 0; i < 30; i += 6) {
    const group = hex.slice(i, i + 6);
    const n = parseInt(group, 16);
    base64 += BASE64_DIGITS[(n >> 18) & 0x3f];
    base64 += BASE64_DIGITS[(n >> 12) & 0x3f];
    base64 += BASE64_DIGITS[(n >> 6) & 0x3f];
    base64 += BASE64_DIGITS[n & 0x3f];
  }

  const lastByte = parseInt(hex.slice(30, 32), 16);
  base64 += BASE64_DIGITS[(lastByte >> 2) & 0x3f];
  const index = (lastByte << 4) & 0x3f;
  base64 += BASE64_DIGITS[index];
  base64 += '==';
  return base64;
}

/**
 * Decode BinData base64 string back into hex
 * @param bindata - The BinData string to decode
 * @returns The decoded hex string
 */
export function toHex(bindata: string): string {
  const match = bindata.match(/BinData\(3,\s*["']([^"']+)["']\)/);
  if (!match) {
    throw new Error('Invalid BinData format');
  }
  const base64 = match[1];
  let hex = '';
  for (let i = 0; i < 24; i += 4) {
    const e1 = BASE64_DIGITS.indexOf(base64[i]);
    const e2 = BASE64_DIGITS.indexOf(base64[i + 1]);
    const e3 = BASE64_DIGITS.indexOf(base64[i + 2]);
    const e4 = BASE64_DIGITS.indexOf(base64[i + 3]);

    const c1 = (e1 << 2) | (e2 >> 4);
    const c2 = ((e2 & 15) << 4) | (e3 >> 2);
    const c3 = ((e3 & 3) << 6) | e4;

    hex += HEX_DIGITS[(c1 >> 4)] + HEX_DIGITS[(c1 & 15)];
    if (e3 !== 64) {
      hex += HEX_DIGITS[(c2 >> 4)] + HEX_DIGITS[(c2 & 15)];
    }
    if (e4 !== 64) {
      hex += HEX_DIGITS[(c3 >> 4)] + HEX_DIGITS[(c3 & 15)];
    }
  }
  return hex;
} 