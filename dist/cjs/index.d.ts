declare type Entry = {
    key: (string | number | symbol)[];
    value: any;
};
declare type Options = {
    collectSymbol: boolean;
};
export declare function entryList(value: unknown, options?: Options): Entry[];
export {};
