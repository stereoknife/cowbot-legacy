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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const reactions = new Map();
exports.default = {
    register,
    deregister,
    setup
};
function setup(bot) {
    bot.on('messageReactionAdd', (uncachedMsg, emoji, user) => __awaiter(this, void 0, void 0, function* () {
        if (!reactions.has(emoji.name))
            return;
        const message = (uncachedMsg.content == null)
            ? yield bot.getMessage(uncachedMsg.channel.id, uncachedMsg.id)
            : uncachedMsg;
        const reply = message.channel.createMessage.bind(message.channel);
        const dmch = yield bot.getDMChannel(user);
        const dm = dmch.createMessage.bind(dmch);
        const exec = reactions.get(emoji.name);
        if (exec != null)
            exec(emoji, message, reply, dm);
    }));
}
exports.setup = setup;
function register(e, fn) {
    if (reactions.has(e))
        return;
    reactions.set(e, fn);
}
function deregister() {
}
//# sourceMappingURL=index.js.map