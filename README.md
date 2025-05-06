# uuid-mongo

Convert UUIDs to and from Java-style MongoDB `BinData(3, "...")` format.

This utility helps you handle the UUID byte-order difference between Java MongoDB drivers and other platforms like Node.js or Python.

Based on: [luxmeter/mongojuuid](https://github.com/luxmeter/mongojuuid)

---

## Features

- ✅ Convert UUID to Java-compatible `BinData(3, "...")`
- ✅ Convert `BinData(3, "...")` back to UUID
- ✅ Java-style byte reordering
- ✅ Hex ↔ Base64 conversions per Java MongoDB rules

---

## Installation

Clone the repo or copy the file into your project:

```bash
git clone https://github.com/guilhermewm/uuid-mongo.git
```

Or install via `npm` if you package it:

```bash
npm install uuid-mongo
```

---

## Usage

```js
const {
  toBindata,
  toUuid,
  javaHex,
  toBase64,
  toHex
} = require('./mongojuuid');

// Convert UUID to Java-style BinData
const bindata = toBindata("00112233-4455-6677-8899-aabbccddeeff");
console.log(bindata[0]);
// Output: BinData(3, "MzRkUUIiMwAAB1aYiqq7zN3v==")

// Convert BinData back to UUID
const uuid = toUuid("BinData(3, \\"MzRkUUIiMwAAB1aYiqq7zN3v==\\")");
console.log(uuid[0]);
// Output: 00112233-4455-6677-8899-aabbccddeeff

// Convert UUID to Java-ordered hex
const hex = javaHex("00112233-4455-6677-8899-aabbccddeeff");
console.log(hex);
// Output: 33221100554477668899aabbccddeeff

// Encode to Java MongoDB Base64
const base64 = toBase64("33221100554477668899aabbccddeeff");
console.log(base64);
// Output: MzRkUUIiMwAAB1aYiqq7zN3v==

// Decode BinData base64 to hex
const recoveredHex = toHex('BinData(3, "MzRkUUIiMwAAB1aYiqq7zN3v==")');
console.log(recoveredHex);
// Output: 33221100554477668899aabbccddeeff
```

---

## API Reference

### `toBindata(...uuids: string[]) => string[]`

Converts standard UUID strings into Java-style MongoDB `BinData(3, "...")`.

#### Example:

```js
toBindata("00112233-4455-6677-8899-aabbccddeeff");
// Returns: ['BinData(3, "MzRkUUIiMwAAB1aYiqq7zN3v==")']
```

---

### `toUuid(...bindatas: string[]) => string[]`

Converts Java-style `BinData(3, "...")` strings back into standard UUID format.

#### Example:

```js
toUuid('BinData(3, "MzRkUUIiMwAAB1aYiqq7zN3v==")');
// Returns: ['00112233-4455-6677-8899-aabbccddeeff']
```

---

### `javaHex(uuid: string) => string`

Reorders UUID hex bytes to match Java's internal layout.

#### Example:

```js
javaHex("00112233-4455-6677-8899-aabbccddeeff");
// Returns: '33221100554477668899aabbccddeeff'
```

---

### `toBase64(hex: string) => string`

Encodes a Java-ordered hex string into base64 using Java MongoDB UUID rules.

#### Example:

```js
toBase64("33221100554477668899aabbccddeeff");
// Returns: 'MzRkUUIiMwAAB1aYiqq7zN3v=='
```

---

### `toHex(bindata: string) => string`

Decodes the base64 portion of a `BinData(3, "...")` string back into a hex string.

#### Example:

```js
toHex('BinData(3, "MzRkUUIiMwAAB1aYiqq7zN3v==")');
// Returns: '33221100554477668899aabbccddeeff'
```

---

## License

MIT