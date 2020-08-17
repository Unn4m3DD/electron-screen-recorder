"use strict";
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
exports.__esModule = true;
var electron_1 = require("electron");
var fs_1 = require("fs");
var dialog = electron_1.remote.dialog;
var media_recorder;
var recordedChunks = [];
var video_canvas = document.getElementById("video_canvas");
var start_button = document.getElementById("start_button");
var stop_button = document.getElementById("stop_button");
var select_button = document.getElementById("select_button");
var select_popup_container = document.getElementById("select_popup_container");
var select_popup_menu = document.getElementById("select_popup_menu");
var select_popup_loading = document.getElementById("select_popup_loading");
var select_source = function (source) { return __awaiter(void 0, void 0, void 0, function () {
    var stream;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                select_button.innerText = source.name.slice(0, 13);
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
                close_modal();
                media_recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
                media_recorder.ondataavailable = handleDataAvailable;
                media_recorder.onstop = handleStop;
                return [2 /*return*/];
        }
    });
}); };
var get_video_sources = function () { return __awaiter(void 0, void 0, void 0, function () {
    var interval, sources;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                select_popup_container.style.display = "flex";
                select_popup_loading.innerText = "loading";
                interval = setInterval(function () { select_popup_loading.innerText += "."; }, 400);
                return [4 /*yield*/, electron_1.desktopCapturer.getSources({
                        types: ["window", "screen"]
                    })];
            case 1:
                sources = _a.sent();
                clearInterval(interval);
                sources = group(sources, 3);
                select_popup_menu.innerHTML =
                    sources.map(function (source) {
                        var innerHTML = source.map(function (item) { return ("\n      <div class=\"thumbnail_container\" id=\"" + item.name + "\">\n        <div class=\"thumbnail_text\">" + item.name + "</div>\n        <img class=\"thumbnail_image\"src=\"" + item.thumbnail.toDataURL() + "\" />\n      </div>"); }).join("");
                        return "<div>" + innerHTML + "</div>";
                    }).join("");
                sources.forEach(function (element) {
                    element.forEach(function (source) {
                        if (document.getElementById(source.name))
                            document.getElementById(source.name).onclick = function () { return select_source(source); };
                    });
                });
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
    for (var i = 0; i < array.length; i++) {
        if (i % count == 0)
            result.push([]);
        result[result.length - 1].push(array[i]);
    }
    return result;
}
start_button.onclick = function (event) {
    media_recorder.start();
    start_button.innerText = 'Recording';
};
stop_button.onclick = function (e) {
    media_recorder.stop();
    start_button.classList.remove('is-danger');
    start_button.innerText = 'Start';
};
function handleDataAvailable(e) {
    recordedChunks.push(e.data);
}
function handleStop(e) {
    return __awaiter(this, void 0, void 0, function () {
        var blob, buffer, _a, _b, filePath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    blob = new Blob(recordedChunks, {
                        type: 'video/webm; codecs=vp9'
                    });
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, blob.arrayBuffer()];
                case 1:
                    buffer = _b.apply(_a, [_c.sent()]);
                    return [4 /*yield*/, dialog.showSaveDialog({
                            buttonLabel: 'Save video',
                            defaultPath: "vid-" + Date.now() + ".webm"
                        })];
                case 2:
                    filePath = (_c.sent()).filePath;
                    if (filePath) {
                        fs_1.writeFile(filePath, buffer, function () { });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=render.js.map