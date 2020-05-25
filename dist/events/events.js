"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadEvents(bot) {
    bot.on('messageCreate', function (message) {
        var match = message.content.match(/^CBT stands for [\w ]*/);
        if (match) {
            // tweet match
        }
    });
}
exports.loadEvents = loadEvents;
