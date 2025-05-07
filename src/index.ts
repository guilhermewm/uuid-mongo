// reference: https://github.com/luxmeter/mongojuuid

const BASE64_DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const HEX_DIGITS = "0123456789abcdef";

/**
 * Convert UUID string to Java-style BinData(3, "...") format
 * @param uuid - The UUID string to convert
 * @returns The BinData string representation
 */
function toBindataSubtype3(uuid: string): string {
  const hex = javaHex(uuid);
  const b64 = toBase64(hex);
  return `BinData(3, "${b64}")`;
}

/**
 * Convert BinData(3, "...") format back to UUIDs
 * @param bindata - The BinData string to convert
 * @returns The UUID string
 */
function toUuidSubtype3(bindata: string): string {
  let hex = toHex(bindata);
  if (hex.length !== 32) {
    throw new Error("Invalid BinData(3, \"...\") format");
  }
  hex = javaHex(hex);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Reorders UUID bytes to match Java UUID layout
 * @param uuid - The UUID string to reorder
 * @returns The reordered hex string
 */
function javaHex(uuid: string): string {
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
function toBase64(hex: string): string {
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
function toHex(bindata: string): string {
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

/**
 * Converts a UUID string to MongoDB BinData(4, ...) format.
 * This format is used for storing UUIDs in MongoDB with subtype 4 (standard UUID).
 * The bytes are stored in Java-compatible byte order.
 * 
 * @param uuidString - The UUID string to convert (e.g., '550e8400-e29b-41d4-a716-446655440000')
 * @returns The BinData string representation (e.g., 'BinData(4, "VQ6EAOKbQdSnFkRmVUQAAA==")')
 */
function toBindataSubtype4(uuidString: string): string {
  const bytes = uuidStringToJavaBinary(uuidString);
  const base64 = Buffer.from(bytes).toString('base64');
  return `BinData(4, "${base64}")`;
}

/**
 * Converts a MongoDB BinData(4, ...) string back to a UUID string.
 * This function handles the conversion from MongoDB's binary format back to standard UUID format.
 * 
 * @param binDataString - The BinData string to convert (e.g., 'BinData(4, "VQ6EAOKbQdSnFkRmVUQAAA==")')
 * @returns The UUID string (e.g., '550e8400-e29b-41d4-a716-446655440000')
 * @throws {Error} If the input format is invalid or the binary data length is not 16 bytes
 */
function toUuidSubtype4(binDataString: string): string {
  const match = binDataString.match(/BinData\(4,\s*"(.+)"\)/);
  if (!match) {
      throw new Error("Invalid BinData(4, \"...\") format");
  }

  const encoded = match[1];
  const bytes = Buffer.from(encoded, 'base64');

  if (bytes.length !== 16) {
      throw new Error("Invalid UUID binary length");
  }

  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0'));

  return [
      hex.slice(0, 4).join(''),
      hex.slice(4, 6).join(''),
      hex.slice(6, 8).join(''),
      hex.slice(8, 10).join(''),
      hex.slice(10).join('')
  ].join('-');
}

/**
 * Converts a UUID string to a byte array with Java UUID byte order.
 * This function handles the conversion of UUID string to its binary representation
 * following Java's UUID byte ordering convention.
 * 
 * @param uuid - The UUID string to convert (e.g., '550e8400-e29b-41d4-a716-446655440000')
 * @returns A Uint8Array containing the 16 bytes of the UUID in Java byte order
 */
function uuidStringToJavaBinary(uuid: string): Uint8Array {
  const hex = uuid.replace(/-/g, '');

  // Parse the fields
  const timeLow = hex.substring(0, 8);
  const timeMid = hex.substring(8, 12);
  const timeHi = hex.substring(12, 16);
  const clockSeq = hex.substring(16, 20);
  const node = hex.substring(20);

  // Helper to convert hex string to byte array
  function hexToBytes(h: string): number[] {
      const out = [];
      for (let i = 0; i < h.length; i += 2) {
          out.push(parseInt(h.slice(i, i + 2), 16));
      }
      return out;
  }

  // Java writes each field in big-endian
  const bytes = [
      ...hexToBytes(timeLow),
      ...hexToBytes(timeMid),
      ...hexToBytes(timeHi),
      ...hexToBytes(clockSeq),
      ...hexToBytes(node)
  ];

  return Uint8Array.from(bytes);
}

/**
 * Converts a UUID string to MongoDB BinData format with the specified subtype.
 * This function supports two subtypes:
 * - Subtype 3: Java-style UUID format (legacy)
 * - Subtype 4: Standard UUID format
 * 
 * @param subtype - The BinData subtype ('3' or '4')
 * @param uuid - The UUID string to convert (e.g., '550e8400-e29b-41d4-a716-446655440000')
 * @returns The BinData string representation (e.g., 'BinData(3, "d2ZVRDMiEQD/7t3Mu6qZiA==")' or 'BinData(4, "VQ6EAOKbQdSnFkRmVUQAAA==")')
 * @throws {Error} If the subtype is not '3' or '4'
 */
export function toBinData(subtyte: string, uuid: string): string {
  if (subtyte === '3') {
    return toBindataSubtype3(uuid);
  } else if (subtyte === '4') {
    return toBindataSubtype4(uuid);
  } else {
    throw new Error("Invalid subtype, we only support subtype 3 and 4");
  }
}

/**
 * Converts a MongoDB BinData string back to a UUID string.
 * This function supports two subtypes:
 * - Subtype 3: Java-style UUID format (legacy)
 * - Subtype 4: Standard UUID format
 * 
 * @param subtype - The BinData subtype ('3' or '4')
 * @param bindata - The BinData string to convert (e.g., 'BinData(3, "d2ZVRDMiEQD/7t3Mu6qZiA==")' or 'BinData(4, "VQ6EAOKbQdSnFkRmVUQAAA==")')
 * @returns The UUID string (e.g., '550e8400-e29b-41d4-a716-446655440000')
 * @throws {Error} If the subtype is not '3' or '4'
 * @throws {Error} If the BinData format is invalid
 * @throws {Error} If the binary data length is not 16 bytes
 */
export function toUUID(subtype: string, bindata: string): string {
  if (subtype === '3') {
    return toUuidSubtype3(bindata);
  } else if (subtype === '4') {
    return toUuidSubtype4(bindata);
  } else {
    throw new Error("Invalid subtype, we only support subtype 3 and 4");
  }
}

