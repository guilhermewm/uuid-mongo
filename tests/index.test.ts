import { describe, expect, test } from '@jest/globals';
import { toBinData, toUUID } from '../src/index';

describe('UUID-BinData Conversion', () => {
  describe('Subtype 3', () => {
    const uuid = '00112233-4455-6677-8899-aabbccddeeff';
    const expectedBinData = 'BinData(3, "d2ZVRDMiEQD/7t3Mu6qZiA==")';

    test('toBinData converts UUID to MongoDB BinData(3, "...") format', () => {
      expect(toBinData('3', uuid)).toEqual(expectedBinData);
    });

    test('toUUID converts BinData(3, "...") back to UUID', () => {
      expect(toUUID('3', expectedBinData)).toEqual(uuid);
    });

    test('toUUID throws error for invalid BinData format', () => {
      const invalidBinData = 'InvalidFormat';
      expect(() => toUUID('3', invalidBinData)).toThrow('Invalid BinData format');
    });

    test('toUUID throws error for invalid binary data length', () => {
      const invalidBinData = 'BinData(3, "invalid")';
      expect(() => toUUID('3', invalidBinData)).toThrow('Invalid UUID binary length');
    });

    test('toBinData and toUUID are inverse operations', () => {
      const testUuid = '00112233-4455-6677-8899-aabbccddeeff';
      const binData = toBinData('3', testUuid);
      expect(toUUID('3', binData)).toEqual(testUuid);
    });
  });

  describe('Subtype 4', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const expectedBinData4 = 'BinData(4, "VQ6EAOKbQdSnFkRmVUQAAA==")';

    test('toBinData converts UUID to MongoDB BinData(4, "...") format', () => {
      expect(toBinData('4', uuid)).toEqual(expectedBinData4);
    });

    test('toUUID converts BinData(4, "...") back to UUID', () => {
      expect(toUUID('4', expectedBinData4)).toEqual(uuid);
    });

    test('toUUID throws error for invalid binary data length', () => {
      const invalidBinData = 'BinData(4, "invalid")';
      expect(() => toUUID('4', invalidBinData)).toThrow('Invalid UUID binary length');
    });

    test('toBinData and toUUID are inverse operations', () => {
      const testUuid = '550e8400-e29b-41d4-a716-446655440000';
      const binData = toBinData('4', testUuid);
      expect(toUUID('4', binData)).toEqual(testUuid);
    });
  });

  describe('Invalid Subtypes', () => {
    test('toBinData throws error for invalid subtype', () => {
      expect(() => toBinData('5', '00112233-4455-6677-8899-aabbccddeeff'))
        .toThrow('Invalid subtype, we only support subtype 3 and 4');
    });

    test('toUUID throws error for invalid subtype', () => {
      expect(() => toUUID('5', 'BinData(5, "d2ZVRDMiEQD/7t3Mu6qZiA==")'))
        .toThrow('Invalid subtype, we only support subtype 3 and 4');
    });
  });
});
