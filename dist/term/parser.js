"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
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
            const [out, rest] = p(input) ?? [null, ''];
            return makeChain({ ...data, ...out }, rest);
        }
    };
}
function extractPrefix(pref) {
    return (input) => {
        const prefix = input.match(new RegExp(`^(${pref.join('|')})`))?.[1];
        logging_1.default(prefix, 0);
        return [{ prefix }, input.slice(prefix?.length ?? 0)];
    };
}
function extractCommand(input) {
    const w = words(input);
    const name = w.shift();
    logging_1.default(name, 0);
    return [{ name }, w.join(' ')];
}
function extractFlags(input) {
    const ws = words(input);
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
    logging_1.default(input, 0);
    return [{ args: words(input) ?? '' }, ''];
}
function words(input) {
    return [...input.matchAll(/([^\s]+)|"([^"]+)"/g)]
        .map(match => match[1] ?? match[2]);
}
//# sourceMappingURL=parser.js.map