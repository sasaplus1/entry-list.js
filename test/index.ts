import assert = require('assert');

import { entryList } from '../index';

describe('entry-list', function () {
  describe('return empty key and argument value', function () {
    it('null', function () {
      assert.deepStrictEqual(entryList(null), [{ key: [], value: null }]);
    });
    it('undefined', function () {
      assert.deepStrictEqual(entryList(undefined), [
        { key: [], value: undefined }
      ]);
    });
    it('boolean', function () {
      assert.deepStrictEqual(entryList(true), [{ key: [], value: true }]);
      assert.deepStrictEqual(entryList(false), [{ key: [], value: false }]);
    });
    it('number', function () {
      assert.deepStrictEqual(entryList(0), [{ key: [], value: 0 }]);
      assert.deepStrictEqual(entryList(-0), [{ key: [], value: -0 }]);
      assert.deepStrictEqual(entryList(9007199254740991), [
        { key: [], value: 9007199254740991 }
      ]);
      assert.deepStrictEqual(entryList(-9007199254740991), [
        { key: [], value: -9007199254740991 }
      ]);
      assert.deepStrictEqual(entryList(NaN), [{ key: [], value: NaN }]);
      assert.deepStrictEqual(entryList(Infinity), [
        { key: [], value: Infinity }
      ]);
      assert.deepStrictEqual(entryList(-Infinity), [
        { key: [], value: -Infinity }
      ]);
    });
    it('string', function () {
      assert.deepStrictEqual(entryList(''), [{ key: [], value: '' }]);
      assert.deepStrictEqual(entryList('𩸽定食'), [
        { key: [], value: '𩸽定食' }
      ]);
    });
    it('bigint', function () {
      if (typeof BigInt === 'undefined') {
        return this.skip();
      }

      assert.deepStrictEqual(entryList(BigInt('9007199254740991')), [
        { key: [], value: BigInt('9007199254740991') }
      ]);
      assert.deepStrictEqual(entryList(BigInt('-9007199254740991')), [
        { key: [], value: BigInt('-9007199254740991') }
      ]);
    });
    it('symbol', function () {
      if (typeof Symbol === 'undefined') {
        return this.skip();
      }

      const s = Symbol();

      assert.deepStrictEqual(entryList(s), [{ key: [], value: s }]);
    });
  });

  describe('return key path and object values', function () {
    it('deeply nested array', function () {
      const data = [[1, 2, 3], [['4', '5', '6', ['7'], { n: 8 }]]];

      assert.deepStrictEqual(entryList(data), [
        { key: ['0', '0'], value: 1 },
        { key: ['0', '1'], value: 2 },
        { key: ['0', '2'], value: 3 },
        { key: ['1', '0', '0'], value: '4' },
        { key: ['1', '0', '1'], value: '5' },
        { key: ['1', '0', '2'], value: '6' },
        { key: ['1', '0', '3', '0'], value: '7' },
        { key: ['1', '0', '4', 'n'], value: 8 }
      ]);
    });
    it('deeply nested object', function () {
      const data = {
        a: {
          b: {
            c: 1,
            d: 2
          },
          e: [3, 4, 5]
        },
        f: {
          g: null
        }
      };

      assert.deepStrictEqual(entryList(data), [
        { key: ['a', 'b', 'c'], value: 1 },
        { key: ['a', 'b', 'd'], value: 2 },
        { key: ['a', 'e', '0'], value: 3 },
        { key: ['a', 'e', '1'], value: 4 },
        { key: ['a', 'e', '2'], value: 5 },
        { key: ['f', 'g'], value: null }
      ]);
    });
    it('deeply nested object with circular reference', function () {
      const data = {
        a: {
          b: {
            c: 1,
            d: 2,
            circular: null
          },
          e: [3, 4, 5]
        },
        f: {
          g: null
        }
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data.a.b.circular = data.a;

      assert.deepStrictEqual(entryList(data), [
        { key: ['a', 'b', 'c'], value: 1 },
        { key: ['a', 'b', 'd'], value: 2 },
        { key: ['a', 'b', 'circular'], value: data.a },
        { key: ['a', 'e', '0'], value: 3 },
        { key: ['a', 'e', '1'], value: 4 },
        { key: ['a', 'e', '2'], value: 5 },
        { key: ['f', 'g'], value: null }
      ]);
    });
    it('deeply nested object with symbol', function () {
      const s = Symbol();

      const data = {
        a: {
          b: {
            c: 1,
            d: 2
          },
          e: [3, 4, 5]
        },
        f: {
          g: {
            [s]: {
              h: null
            }
          }
        }
      };

      assert.deepStrictEqual(entryList(data, { collectSymbol: true }), [
        { key: ['a', 'b', 'c'], value: 1 },
        { key: ['a', 'b', 'd'], value: 2 },
        { key: ['a', 'e', '0'], value: 3 },
        { key: ['a', 'e', '1'], value: 4 },
        { key: ['a', 'e', '2'], value: 5 },
        { key: ['f', 'g', s, 'h'], value: null }
      ]);
    });
  });
});
