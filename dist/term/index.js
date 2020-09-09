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
/* eslint-enable no-unused-vars */
const manager_1 = require("./manager");
const parser_1 = require("./parser");
const logging_1 = __importDefault(require("../logging"));
exports.default = {
    register: manager_1.register,
    deregister: manager_1.deregister,
    setup
};
function setup(srv) {
    const parse = parser_1.parser({
        prefix: ['🤠', 'go-go-gadget', '☭', 'please cowbot would you']
    });
    srv.on('messageCreate', ({ channel, content, author }) => __awaiter(this, void 0, void 0, function* () {
        const commandData = parse(content);
        logging_1.default(commandData, 0);
        // if valid command
        if ((commandData === null || commandData === void 0 ? void 0 : commandData.prefix) != null && (commandData === null || commandData === void 0 ? void 0 : commandData.prefix) !== '') {
            logging_1.default('valid command found', 1);
            const reply = channel.createMessage.bind(channel);
            const dmch = yield author.getDMChannel();
            const dm = dmch.createMessage.bind(dmch);
            manager_1.exec(commandData, reply, dm);
        }
    }));
}
//# sourceMappingURL=index.js.map