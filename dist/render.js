var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var video_canvas = document.getElementById("video_canvas");
var start_button = document.getElementById("start_button");
var stop_button = document.getElementById("stop_button");
var select_button = document.getElementById("select_button");
var select_popup_container = document.getElementById("select_popup_container");
var select_popup_menu = document.getElementById("select_popup_menu");
var select_popup_loading = document.getElementById("select_popup_loading");
var desktop_capturer = require("electron").desktopCapturer;
var menu = require("electron").remote.Menu;
var select_source = function (source) { return __awaiter(_this, void 0, void 0, function () {
    var stream;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                select_button.innerText = source.name;
                return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: source.id
                            }
                        }
                    })];
            case 1:
                stream = _a.sent();
                video_canvas.srcObject = stream;
                video_canvas.play();
                return [2 /*return*/];
        }
    });
}); };
var get_video_sources = function () { return __awaiter(_this, void 0, void 0, function () {
    var interval, sources;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                select_popup_container.style.display = "flex";
                select_popup_loading.innerText = "loading";
                interval = setInterval(function () { select_popup_loading.innerText += "."; }, 400);
                return [4 /*yield*/, desktop_capturer.getSources({
                        types: ["window", "screen"]
                    })];
            case 1:
                sources = _a.sent();
                clearInterval(interval);
                source = group(source, 3);
                select_popup_menu.innerHTML =
                    sources.map(function (source) {
                        var innerHTML = source.map(function (item) { return ("\n      <div class=\"thumbnail_container\">\n        <div class=\"thumbnail_text\">" + item.name + "</div>\n        <img class=\"thumbnail_image\"src=\"" + item.thumbnail.toDataURL() + "\" />\n      </div>"); });
                        return "<div>" + innerHTML + "</div>";
                    }).join("");
                select_popup_menu.style.display = "flex";
                return [2 /*return*/];
        }
    });
}); };
var close_modal = function () {
    select_popup_container.style.display = "none";
    select_popup_menu.style.display = "none";
};
function group(array, count) {
    var result = [];
    for (var i = 0; i < array.count; i++) {
        if (i % count == 0)
            result.push([]);
        result[result.length - 1].push(array[i]);
    }
    return result;
}
//# sourceMappingURL=render.js.map