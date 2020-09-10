"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
const fp_1 = require("lodash/fp");
const logging_1 = __importDefault(require("../logging"));
function parser(opt) {
    return (input) => makeChain({}, input)
        .chain(extractPrefix(opt.prefix))
        .chain(extractCommand)
        .chain(extractFlags)
        .chain(extractArgs)
        .parse();
}
exports.parser = parser;
function makeChain(data, input) {
    return {
        parse: () => {
            if (data == null)
                data = {};
            if (data.prefix == null)
                data.prefix = '';
            if (data.name == null)
                data.prefix = '';
            if (data.flags == null)
                data.flags = {};
            if (data.args == null)
                data.args = [];
            return data;
        },
        chain: (p) => {
            var _a;
            const [out, rest] = (_a = p(input)) !== null && _a !== void 0 ? _a : [null, ''];
            return makeChain(Object.assign(Object.assign({}, data), out), rest);
        }
    };
}
function extractPrefix(pref) {
    return (input) => {
        var _a, _b;
        const prefix = (_a = input.match(new RegExp(`^(${pref.join('|')})`))) === null || _a === void 0 ? void 0 : _a[1];
        logging_1.default(prefix, 0);
        return [{ prefix }, input.slice((_b = prefix === null || prefix === void 0 ? void 0 : prefix.length) !== null && _b !== void 0 ? _b : 0)];
    };
}
function extractCommand(input) {
    const w = fp_1.words(input);
    const name = w.shift();
    logging_1.default(name, 0);
    return [{ name }, w.join(' ')];
}
function extractFlags(input) {
    const ws = fp_1.words(input);
    const out = [];
    const flags = {};
    for (let i = 0; i < ws.length; i++) {
        const w = ws[i];
        if (w.match(/^--/)) {
            flags[w] = ws[++i];
        }
        else {
            out.push(w);
        }
    }
    logging_1.default(flags, 0);
    return [{ flags }, out.join(' ')];
}
function extractArgs(input) {
    var _a;
    logging_1.default(input, 0);
    return [{ args: (_a = fp_1.words(input)) !== null && _a !== void 0 ? _a : '' }, ''];
}
//# sourceMappingURL=parser.js.map