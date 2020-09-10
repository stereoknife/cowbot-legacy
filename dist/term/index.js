"use strict";
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
    srv.on('messageCreate', async (message) => {
        const { channel, content, author } = message;
        const commandData = { ...parse(content), message };
        logging_1.default(commandData, 0);
        // if valid command
        if (commandData?.prefix != null && commandData?.prefix !== '') {
            logging_1.default('valid command found', 1);
            const reply = channel.createMessage.bind(channel);
            const dmch = await author.getDMChannel();
            const dm = dmch.createMessage.bind(dmch);
            manager_1.exec(commandData, reply, dm);
        }
    });
}
//# sourceMappingURL=index.js.map