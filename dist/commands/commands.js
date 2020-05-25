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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = __importDefault(require("https"));
var google_translate_api_browser_1 = require("google-translate-api-browser");
/* eslint-enable no-unused-vars */
var emojiScrapeRegex = /<ol class="search-results">[^]*?<h2>[^]*?<span class="emoji">(.)*<\/span>[^]*?<\/ol>/u;
function loadCommands(bot, db) {
    var _this = this;
    // Simple commands
    bot.registerCommand('echo', function (_, args) { return args.join(' '); });
    bot.registerCommand('clapback', function (_, args) { return args.join('👏') + '👏'; });
    bot.registerCommand('linegoesdown', 'https://twitter.com/moarajuliana/status/1252318965864464387');
    bot.registerCommand('dollarmachinegoesbrr', 'https://twitter.com/NorthernForger/status/1252412693274755074');
    bot.registerCommand('unemployme', 'https://www.youtube.com/watch?v=M5FGuBatbTg');
    // Complex commands
    bot.registerCommand('yee', function (msg) {
        db.zrevrange("highlights:" + msg.channel, 0, 1, function (err, res) { return __awaiter(_this, void 0, void 0, function () {
            var found;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err)
                            console.error(err);
                        if (res == null)
                            return [2 /*return*/, 'no messages saved in this channel'];
                        return [4 /*yield*/, msg.channel.getMessage(res[0])];
                    case 1:
                        found = _a.sent();
                        msg.channel.createMessage(found.content);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    bot.registerCommand('t', function (msg, args) { return __awaiter(_this, void 0, void 0, function () {
        var from, to, tr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    from = 'auto';
                    to = 'en';
                    return [4 /*yield*/, google_translate_api_browser_1.translate(args.join(' '), { from: from, to: to })];
                case 1:
                    tr = _a.sent();
                    msg.channel.createMessage(tr.text);
                    return [2 /*return*/];
            }
        });
    }); });
    var yturl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=AIzaSyAMTINdBOQCIE0ArDVVED2Ia5f0zwpIi1w&q=';
    bot.registerCommand('yt', function (msg, args) {
        https_1.default.get(yturl + encodeURIComponent(args.join(' ')), function (res) {
            var statusCode = res.statusCode;
            if (!statusCode || statusCode < 200 || statusCode >= 300)
                return;
            res.setEncoding('utf8');
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                try {
                    var id = JSON.parse(data).items[0].id.videoId;
                    console.log(id);
                    if (id)
                        msg.channel.createMessage("https://youtube.com/watch?v=" + id);
                }
                catch (err) {
                    console.log(err);
                }
            });
        });
    });
}
exports.loadCommands = loadCommands;
// TODO colours
function emojify(word) {
    return new Promise(function (resolve, reject) {
        https_1.default.get('https://emojipedia.org/search/?q=' + word, function (res) {
            var statusCode = res.statusCode;
            if (!statusCode || statusCode < 200 || statusCode >= 300)
                resolve(' ' + word + ' ');
            res.setEncoding('utf8');
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                var match = data.match(emojiScrapeRegex);
                resolve(match ? match[1] : ' ' + word + ' ');
            });
        });
    });
}
