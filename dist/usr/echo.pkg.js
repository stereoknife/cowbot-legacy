"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-enable no-unused-vars */
const term_1 = __importDefault(require("../term"));
// import log from '../logging'
// import db from '../db'
exports.default = {
    install() {
        term_1.default.register(['remember'], remember);
        term_1.default.register(['forget'], forget);
        term_1.default.register(['linegoesdown'], (_, rp) => rp('https://twitter.com/moarajuliana/status/1252318965864464387'));
        term_1.default.register(['brrr'], (_, rp) => rp('https://www.youtube.com/watch?v=RUw6WKIrqmw'));
        term_1.default.register(['linegoesup'], (_, rp) => rp('https://www.youtube.com/watch?v=M5FGuBatbTg'));
    }
};
function remember({ args, message }, reply) {
    const name = args.shift();
    if (name == null)
        return;
    term_1.default.register([name], (_, rp) => rp(args.join(' ')));
    reply('ok');
}
function forget({ args, message }, reply) {
    const name = args.shift();
    if (name == null)
        return;
    term_1.default.deregister(name);
    reply('i forgot');
}
//# sourceMappingURL=echo.pkg.js.map