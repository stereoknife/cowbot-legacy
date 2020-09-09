"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
const db = __importStar(require("./db"));
const term_1 = __importDefault(require("./term"));
const reactions_1 = __importDefault(require("./reactions"));
const translate_pkg_1 = __importDefault(require("./usr/translate.pkg"));
const general_pkg_1 = __importDefault(require("./usr/general.pkg"));
// Check env variables
if (process.env.token == null) {
    console.error('Bot token missing, add it to token environment variable');
    process.exit();
}
if (process.env.owner == null) {
    console.warn("No owner defined, you won't be able to access to restricted commands.");
}
db.init();
const bot = new eris_1.Client(process.env.token);
process.on('uncaughtException', function (err) {
    console.log(err);
    console.log('Katastrooffi occured');
    bot.disconnect({ reconnect: true });
});
process.on('SIGINT', function () {
    console.log('Shutting down...');
    bot.disconnect({ reconnect: false });
    process.exit();
});
term_1.default.setup(bot);
reactions_1.default.setup(bot);
// load base features
translate_pkg_1.default.install();
general_pkg_1.default.install();
bot.on('ready', () => {
    console.log('Ready!');
});
bot.connect();
//# sourceMappingURL=bot.js.map