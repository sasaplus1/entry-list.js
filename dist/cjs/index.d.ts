declare type Entry = {
    key: (string | symbol)[];
    value: any;
};
export declare function entryList(value: unknown, prefix?: (string | symbol)[], result?: Entry[], references?: unknown[]): Entry[];
export {};
