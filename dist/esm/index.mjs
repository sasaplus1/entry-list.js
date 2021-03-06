function entryList(value, options = { collectSymbol: false }) {
    const { collectSymbol } = options;
    const getKeys = collectSymbol
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function (value) {
                return Array.isArray(value)
                    ? Object.keys(value)
                    : Reflect.ownKeys(value);
            }
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function (value) {
                return Object.keys(value);
            };
    const result = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const references = new WeakSet();
    const getEntries = function getEntries(value, prefix = []) {
        if (value !== null && typeof value === 'object') {
            references.add(value);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore 2345
            const keys = getKeys(value);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const key of keys) {
                // NOTE: https://github.com/microsoft/TypeScript/issues/1863
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const v = value[key];
                if (references.has(v)) {
                    result.push({
                        value: v,
                        key: [...prefix, key]
                    });
                }
                else {
                    getEntries(v, [...prefix, key]);
                }
            }
        }
        else {
            result.push({ value, key: prefix });
        }
        return result;
    };
    return getEntries(value);
}

export { entryList };
//# sourceMappingURL=index.mjs.map
