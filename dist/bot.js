"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eris_1 = __importDefault(require("eris"));
var redis_1 = __importDefault(require("redis"));
var reactions_1 = require("./events/reactions");
var commands_1 = require("./commands/commands");
var utils_1 = require("./commands/utils");
var commandOpts = {
    prefix: ['🤠', 'go-go-gadget-', '☭']
};
var db = redis_1.default.createClient(process.env.redisPath || '/var/redis/run/redis.sock', {
    retry_strategy: function (opt) { if (opt.attempt > 10)
        process.exit(); },
    socket_initial_delay: 5000
});
db.on('error', function (err) { return console.error(err); });
var bot = new eris_1.default.CommandClient('NDgxNTQxNTEzMTAxMzEyMDUx.XkkIww.n7VU-pjvkd-UsPMmAmj0IQWjIJo', {}, commandOpts);
process.on('uncaughtException', function (err) {
    console.log(err);
    console.log('RIP me :(');
    bot.disconnect({ reconnect: false });
    process.exit();
});
process.on('SIGINT', function () {
    console.log('Buh bai');
    bot.disconnect({ reconnect: false });
    process.exit();
});
bot.on('ready', function () {
    console.log('Ready!');
});
// Reactions
reactions_1.loadReactions(bot, db);
// loadEvents(bot)
// Commands
commands_1.loadCommands(bot, db);
utils_1.loadUtilities(bot);
bot.connect();
