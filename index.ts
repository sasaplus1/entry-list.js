type Entry = {
  key: (string | number | symbol)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

type Options = {
  collectSymbol: boolean;
};

export function entryList(
  value: unknown,
  options: Options = { collectSymbol: false }
): Entry[] {
  const { collectSymbol } = options;

  const getKeys = collectSymbol
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function (value: Record<string, any>): (string | number | symbol)[] {
        return Array.isArray(value)
          ? Object.keys(value)
          : Reflect.ownKeys(value);
      }
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function (value: Record<string, any>): string[] {
        return Object.keys(value);
      };

  const result: Entry[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const references: WeakSet<any> = new WeakSet();

  const getEntries = function getEntries(
    value: unknown,
    prefix: (string | number | symbol)[] = []
  ): Entry[] {
    if (value !== null && typeof value === 'object') {
      references.add(value);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore 2345
      const keys = getKeys(value);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const key of keys) {
        // NOTE: https://github.com/microsoft/TypeScript/issues/1863
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const v = (value as Record<string | symbol, any>)[key as any];

        if (references.has(v)) {
          result.push({
            value: v,
            key: [...prefix, key]
          });
        } else {
          getEntries(v, [...prefix, key]);
        }
      }
    } else {
      result.push({ value, key: prefix });
    }

    return result;
  };

  return getEntries(value);
}
