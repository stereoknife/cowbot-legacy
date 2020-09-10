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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
/* eslint-enable no-unused-vars */
const term_1 = __importDefault(require("../term"));
const reactions_1 = __importDefault(require("../reactions"));
const google_translate_api_browser_1 = __importDefault(require("google-translate-api-browser"));
const languages_1 = __importDefault(require("google-translate-api-browser/dist/languages"));
const logging_1 = __importDefault(require("../logging"));
exports.default = {
    install() {
        term_1.default.register(['t', 'translate'], translateFromCommand);
        reactions_1.default.register('🔣', translateFromReaction);
        reactions_1.default.register('🗺️', translateFromReaction);
    },
    uninstall() {
        // deregister(['t', 'translate'])
    }
};
function translateFromCommand({ args, flags }, reply) {
    const msg = args.join(' ');
    translate(msg, flags.from, flags.to)
        .then(([text, from, to]) => {
        reply({
            embed: {
                description: msg,
                title: text,
                footer: {
                    text: `Translated from ${from} to ${to}.`
                }
            }
        });
    })
        .catch(logging_1.default);
}
function translateFromReaction({ name }, message, reply, dm) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const [text, from, to] = yield translate(message.content, 'auto', name === '🗺️' ? 'random' : 'en');
        if (text === message.content) {
            reply('Nothing to translate..');
        }
        else {
            reply({
                embed: {
                    author: {
                        name: (_b = (_a = message.member) === null || _a === void 0 ? void 0 : _a.nick) !== null && _b !== void 0 ? _b : message.author.username,
                        icon_url: message.author.staticAvatarURL
                    },
                    description: `_${message.content}_\n${text}`,
                    footer: {
                        text: `Translated from ${from} to ${to}`
                    }
                }
            });
        }
    });
}
function translate(msg, from = 'auto', to = 'en') {
    if (to === 'random') {
        const langKeys = Object.keys(languages_1.default);
        const i = Math.floor(Math.random() * langKeys.length);
        to = langKeys[i];
    }
    return google_translate_api_browser_1.default(msg, { from, to })
        .then((tr) => [tr.text, languages_1.default[tr.from.language.iso], languages_1.default[to]]);
}
exports.translate = translate;
//# sourceMappingURL=translate.pkg.js.map