// reference: https://github.com/luxmeter/mongojuuid

const BASE64_DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const HEX_DIGITS = "0123456789abcdef";

// Convert UUID string to Java-style BinData(3, "...") format
function toBindata(uuid) {
  const hex = javaHex(uuid);
  const b64 = toBase64(hex);
  return `BinData(3, "${b64}")`;
}

// Convert BinData(3, "...") format back to UUIDs
function toUuid(bindata) {
  let hex = toHex(bindata);
  hex = javaHex(hex);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Reorders UUID bytes to match Java UUID layout
function javaHex(uuid) {
  const clean = uuid.replace(/[{}-]/g, '');
  const bytes = Array.from({ length: 16 }, (_, i) => clean.slice(i * 2, i * 2 + 2));
  const msb = bytes.slice(0, 8).reverse().join('');
  const lsb = bytes.slice(8, 16).reverse().join('');
  return msb + lsb;
}

// Encode hex string into base64 using Java MongoDB rules
function toBase64(hex) {
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

// Decode BinData base64 string back into hex
function toHex(bindata) {
  const base64 = bindata.match(/BinData\(3,\s*["']([^"']+)["']\)/)[1];
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

module.exports = {
    toBindata,
    toUuid,
    javaHex,
    toBase64,
    toHex
};