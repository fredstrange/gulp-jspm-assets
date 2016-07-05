export declare class Jspm {
    static mock(jspm?: Jspm): void;
    constructor();
    normalize(packageName: string): Promise<string>;
}
export declare function loadJspm(): Jspm;
