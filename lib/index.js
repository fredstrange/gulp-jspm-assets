'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path_1 = require('path');
var fs_1 = require('fs');
var stream_1 = require('stream');
var glob_stream_1 = require('glob-stream');
var File = require('vinyl');
var smash_streams_1 = require('smash-streams');
var jspm_1 = require('./jspm');
var JspmAssetStream = (function (_super) {
    __extends(JspmAssetStream, _super);
    function JspmAssetStream(options) {
        _super.call(this, { objectMode: true });
        this.package = '';
        this.glob = '';
        this.started = false;
        this.protocol = 'file:';
        if (!options || !options.package || !options.glob) {
            throw new Error('Provide a jspm package name and filepath or glob!');
        }
        this._jspm = new jspm_1.Jspm();
        this.package = options.package;
        this.glob = options.glob;
    }
    JspmAssetStream.prototype.cleanFilePath = function (filePath) {
        var platform = process.platform === 'win32' ? '///' : '//';
        return filePath.replace(this.protocol + platform, '');
    };
    JspmAssetStream.prototype.resolveDirectory = function (packageName) {
        var _this = this;
        return this._jspm.normalize(packageName).then(function (filePath) {
            filePath = _this.cleanFilePath(filePath);
            var parsed = path_1.parse(filePath);
            var resolvedPath = path_1.join(parsed.dir, parsed.name);
            return resolvedPath;
        });
    };
    JspmAssetStream.prototype.readFile = function (filePath) {
        var parsed = path_1.parse(filePath);
        return new Promise(function (resolve, reject) {
            fs_1.readFile(filePath, function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    var file = new File({
                        base: parsed.dir,
                        contents: data,
                        cwd: process.cwd(),
                        path: filePath
                    });
                    resolve(file);
                }
            });
        });
    };
    JspmAssetStream.prototype._read = function () {
        var _this = this;
        if (!this.started) {
            this.started = true;
            this.resolveDirectory(this.package)
                .then(function (filePath) {
                var globPath = path_1.join(filePath, _this.glob);
                var stream = glob_stream_1.create(globPath);
                var files = [];
                stream.on('data', function (file) {
                    var promise;
                    promise = _this.readFile(file.path)
                        .then(function (value) { return _this.push(value); })
                        .catch(function (err) { return _this.emit('error', err); });
                    files.push(promise);
                });
                stream.on('end', function () {
                    Promise.all(files).then(function (value) { return _this.push(null); });
                });
                stream.on('error', function (err) {
                    _this.emit('error', err);
                });
            })
                .catch(function (error) {
                _this.emit('error', error);
            });
        }
    };
    JspmAssetStream.prototype._write = function (data, enc, next) {
        this.push(data);
        next();
    };
    return JspmAssetStream;
})(stream_1.Duplex);
exports.JspmAssetStream = JspmAssetStream;
function jspmAssets(packageName, glob) {
    if (arguments.length === 2 && typeof packageName === 'string') {
        return new JspmAssetStream({
            glob: glob,
            package: packageName
        });
    }
    else if (arguments.length === 1 && typeof packageName === 'object' && packageName !== null) {
        var jspmAssets_1 = packageName;
        var streams = [];
        var keys = Object.keys(jspmAssets_1);
        if (keys.length === 0) {
            throw new Error('No packages or globs paths are provided in the config object!');
        }
        else {
            Object.keys(jspmAssets_1).forEach(function (asset) {
                streams.push(new JspmAssetStream({ glob: jspmAssets_1[asset], package: asset }));
            });
            return smash_streams_1.smashStreams(streams);
        }
    }
    else {
        throw new Error('Parameters not provided in the correct format!');
    }
}
exports.jspmAssets = jspmAssets;
//# sourceMappingURL=index.js.map