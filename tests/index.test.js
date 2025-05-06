const { toBindata, toUuid, javaHex, toBase64, toHex } = require('../src/index');

describe('UUID-BinData Conversion Utilities', () => {
	const uuid = '00112233-4455-6677-8899-aabbccddeeff';
	const expectedBinData = 'BinData(3, "d2ZVRDMiEQD/7t3Mu6qZiA==")';

	test('toBindata converts UUID to MongoDB BinData(3, "...") format', () => {
			expect(toBindata(uuid)).toEqual(expectedBinData);
	});

	test('toUuid converts BinData(3, "...") back to UUID', () => {
			expect(toUuid(expectedBinData)).toEqual(uuid);
	});

  test('javaHex converts UUID to Java byte order hex', () => {
    expect(javaHex(uuid)).toBe('7766554433221100ffeeddccbbaa9988');
  });

  test('toBase64 encodes hex to base64 with Java MongoDB rules', () => {
    const hex = javaHex(uuid);
    expect(toBase64(hex)).toBe('d2ZVRDMiEQD/7t3Mu6qZiA==');
  });

  test('toHex decodes base64 BinData back to hex', () => {
    const hex = toHex(expectedBinData);
    expect(hex).toBe('7766554433221100ffeeddccbbaa9988');
  });
});
