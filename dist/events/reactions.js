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
Object.defineProperty(exports, "__esModule", { value: true });
var google_translate_api_browser_1 = require("google-translate-api-browser");
/* eslint-enable no-unused-vars */
function loadReactions(bot, db) {
    var _this = this;
    bot.on('messageReactionAdd', function (msg, emoji, uid) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (emoji.name) {
                case '🤠':
                    db.zincrby("highlights:" + msg.channel, 1, msg.id);
                    break;
                case '🔣':
                    translateMessage(msg, uid);
                    break;
                default:
                    break;
            }
            return [2 /*return*/];
        });
    }); });
    bot.on('messageReactionRemove', function (msg, emoji, uid) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (emoji.name !== '🤠')
                return [2 /*return*/];
            db.zincrby("highlights:" + msg.channel, -1, msg.id);
            return [2 /*return*/];
        });
    }); });
    bot.on('messageReactionRemoveEmoji', function (msg, emoji) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (emoji.name !== '🤠')
                return [2 /*return*/];
            db.zrem("highlights:" + msg.channel, msg.id);
            return [2 /*return*/];
        });
    }); });
    function translateMessage(msg, uid) {
        var _this = this;
        db.exists("translate:" + msg.id, function (err, res) { return __awaiter(_this, void 0, void 0, function () {
            var m, tr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err != null)
                            console.error(err);
                        if (res === 1) {
                            db.expire("translate:" + msg.id, 20 * 60);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, msg.channel.getMessage(msg.id)];
                    case 1:
                        m = _a.sent();
                        if (m.author.id === uid)
                            return [2 /*return*/];
                        return [4 /*yield*/, google_translate_api_browser_1.translate(m.content, { from: 'auto', to: 'en' })];
                    case 2:
                        tr = _a.sent();
                        msg.channel.createMessage({
                            embed: {
                                author: {
                                    name: m.author.username,
                                    icon_url: m.author.staticAvatarURL
                                },
                                title: m.content,
                                description: tr.text
                            }
                        });
                        db.setex("translate:" + msg.id, 60 * 30, 'd');
                        return [2 /*return*/];
                }
            });
        }); });
    }
}
exports.loadReactions = loadReactions;
