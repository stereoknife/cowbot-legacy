"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const reactions = new Map();
exports.default = {
    register,
    deregister,
    setup
};
function setup(bot) {
    bot.on('messageReactionAdd', async (uncachedMsg, emoji, user) => {
        if (!reactions.has(emoji.name))
            return;
        const message = (uncachedMsg.content == null)
            ? await bot.getMessage(uncachedMsg.channel.id, uncachedMsg.id)
            : uncachedMsg;
        const reply = message.channel.createMessage.bind(message.channel);
        const dmch = await bot.getDMChannel(user);
        const dm = dmch.createMessage.bind(dmch);
        const exec = reactions.get(emoji.name);
        if (exec != null)
            exec(emoji, message, reply, dm);
    });
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