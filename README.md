# uuid-mongo

Convert UUIDs to and from MongoDB `BinData` format with support for both Java-style (subtype 3) and standard (subtype 4) UUID formats.

This utility helps you handle the UUID byte-order difference between Java MongoDB drivers and other platforms like Node.js or Python.

Based on: [luxmeter/mongojuuid](https://github.com/luxmeter/mongojuuid)

---

## Features

- ✅ Convert UUID to MongoDB `BinData` format
  - Subtype 3: Java-style UUID format (legacy)
  - Subtype 4: Standard UUID format
- ✅ Convert `BinData` back to UUID
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
const { toBinData, toUUID } = require('uuid-mongo');

// Convert UUID to MongoDB BinData (subtype 3 - Java-style)
const bindata3 = toBinData('3', "00112233-4455-6677-8899-aabbccddeeff");
console.log(bindata3);
// Output: BinData(3, "d2ZVRDMiEQD/7t3Mu6qZiA==")

// Convert UUID to MongoDB BinData (subtype 4 - standard)
const bindata4 = toBinData('4', "550e8400-e29b-41d4-a716-446655440000");
console.log(bindata4);
// Output: BinData(4, "VQ6EAOKbQdSnFkRmVUQAAA==")

// Convert BinData back to UUID (subtype 3)
const uuid3 = toUUID('3', 'BinData(3, "d2ZVRDMiEQD/7t3Mu6qZiA==")');
console.log(uuid3);
// Output: 00112233-4455-6677-8899-aabbccddeeff

// Convert BinData back to UUID (subtype 4)
const uuid4 = toUUID('4', 'BinData(4, "VQ6EAOKbQdSnFkRmVUQAAA==")');
console.log(uuid4);
// Output: 550e8400-e29b-41d4-a716-446655440000
```

---

## API Reference

### `toBinData(subtype: string, uuid: string) => string`

Converts UUID strings into MongoDB `BinData` format with the specified subtype.

#### Parameters:
- `subtype`: The BinData subtype ('3' for Java-style or '4' for standard)
- `uuid`: The UUID string to convert (e.g., '550e8400-e29b-41d4-a716-446655440000')

#### Returns:
The BinData string representation (e.g., 'BinData(3, "d2ZVRDMiEQD/7t3Mu6qZiA==")' or 'BinData(4, "VQ6EAOKbQdSnFkRmVUQAAA==")')

#### Throws:
- Error if the subtype is not '3' or '4'

#### Example:
```js
toBinData('3', "00112233-4455-6677-8899-aabbccddeeff");
// Returns: 'BinData(3, "d2ZVRDMiEQD/7t3Mu6qZiA==")'

toBinData('4', "550e8400-e29b-41d4-a716-446655440000");
// Returns: 'BinData(4, "VQ6EAOKbQdSnFkRmVUQAAA==")'
```

---

### `toUUID(subtype: string, bindata: string) => string`

Converts MongoDB `BinData` strings back into UUID format.

#### Parameters:
- `subtype`: The BinData subtype ('3' for Java-style or '4' for standard)
- `bindata`: The BinData string to convert (e.g., 'BinData(3, "d2ZVRDMiEQD/7t3Mu6qZiA==")')

#### Returns:
The UUID string (e.g., '550e8400-e29b-41d4-a716-446655440000')

#### Throws:
- Error if the subtype is not '3' or '4'
- Error if the BinData format is invalid
- Error if the binary data length is not 16 bytes

#### Example:
```js
toUUID('3', 'BinData(3, "d2ZVRDMiEQD/7t3Mu6qZiA==")');
// Returns: '00112233-4455-6677-8899-aabbccddeeff'

toUUID('4', 'BinData(4, "VQ6EAOKbQdSnFkRmVUQAAA==")');
// Returns: '550e8400-e29b-41d4-a716-446655440000'
```

---

## License

MIT