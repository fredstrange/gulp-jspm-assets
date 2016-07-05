var _jspm;
var Jspm = (function () {
    function Jspm() {
        if (!_jspm) {
            _jspm = loadJspm();
        }
    }
    Jspm.mock = function (jspm) {
        _jspm = jspm;
    };
    Jspm.prototype.normalize = function (packageName) {
        return _jspm.normalize(packageName);
    };
    return Jspm;
})();
exports.Jspm = Jspm;
function loadJspm() {
    var jspm;
    try {
        jspm = require('jspm');
    }
    catch (ex) {
        throw new Error("Can't load jspm try installing it via npm!");
    }
    return jspm;
}
exports.loadJspm = loadJspm;
//# sourceMappingURL=jspm.js.map