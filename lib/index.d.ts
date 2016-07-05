import { Duplex } from 'stream';
export declare class JspmAssetStream extends Duplex {
    private package;
    private glob;
    private started;
    private protocol;
    private _jspm;
    constructor(options: {
        package: string;
        glob: string;
    });
    private cleanFilePath(filePath);
    private resolveDirectory(packageName);
    private readFile(filePath);
    _read(): void;
    _write(data: any, enc: string, next: Function): void;
}
export declare function jspmAssets(packageName: string | IJspmAssetsConfig, glob?: string): JspmAssetStream;
export interface IJspmAssetsConfig {
    [index: string]: string;
}
