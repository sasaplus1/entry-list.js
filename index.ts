const toString = Object.prototype.toString;

function getKeys(value: unknown): (string | symbol)[] | null {
  if (Array.isArray(value)) {
    return Object.keys(value);
  }

  if (toString.call(value) === '[object Object]') {
    return [
      ...Object.keys(value as Record<string, unknown>),
      ...Object.getOwnPropertySymbols(value)
    ];
  }

  return null;
}

type Entry = {
  key: (string | symbol)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

export function entryList(
  value: unknown,
  prefix: (string | symbol)[] = [],
  result: Entry[] = [],
  references: WeakSet<any> = new WeakSet()
): Entry[] {
  const keys = getKeys(value);

  if (keys === null) {
    result.push({ value, key: prefix });
  } else {
    references.add(value);

    for (let i = 0, len = keys.length; i < len; ++i) {
      // NOTE: https://github.com/microsoft/TypeScript/issues/1863
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const v = (value as Record<string | symbol, any>)[keys[i] as any];

      if (references.has(v)) {
        result.push({
          value: v,
          key: [...prefix, keys[i]]
        });
      } else {
        entryList(v, [...prefix, keys[i]], result, references);
      }
    }
  }

  return result;
}
