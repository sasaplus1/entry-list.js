/*!
 * @license entry-list.js Copyright(c) 2021 sasa+1
 * https://github.com/sasaplus1/entry-list.js
 * Released under the MIT license.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.entryList = {}));
}(this, (function (exports) { 'use strict';

  const toString = Object.prototype.toString;
  function getKeys(value) {
      if (Array.isArray(value)) {
          return Object.keys(value);
      }
      if (toString.call(value) === '[object Object]') {
          return [
              ...Object.keys(value),
              ...Object.getOwnPropertySymbols(value)
          ];
      }
      return null;
  }
  function entryList(value, prefix = [], result = [], references = []) {
      const keys = getKeys(value);
      if (keys === null) {
          result.push({ value, key: prefix });
      }
      else {
          references.push(value);
          for (let i = 0, len = keys.length; i < len; ++i) {
              // NOTE: https://github.com/microsoft/TypeScript/issues/1863
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const v = value[keys[i]];
              if (references.includes(v)) {
                  result.push({
                      value: v,
                      key: [...prefix, keys[i]]
                  });
              }
              else {
                  entryList(v, [...prefix, keys[i]], result, references);
              }
          }
      }
      return result;
  }

  exports.entryList = entryList;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=entry-list.js.map
