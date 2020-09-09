"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enable = exports.deregister = exports.register = exports.init = void 0;
const events_1 = require("events");
const logging_1 = __importDefault(require("./logging"));
const servicesMap = new Map();
const emitter = new events_1.EventEmitter();
function init(bot) {
    bot.on('messageCreate', (msg) => emitter.emit('messageCreate', msg));
    bot.on('messageReactionAdd', (msg) => emitter.emit('messageReactionAdd', msg));
}
exports.init = init;
function register(srv) {
    if (!servicesMap.has(srv.id)) {
        logging_1.default('Registering service ' + srv.id);
        servicesMap.set(srv.id, srv);
    }
}
exports.register = register;
function deregister(id) {
    if (servicesMap.has(id)) {
        logging_1.default('Deregistering service ' + id);
        servicesMap.delete(id);
    }
}
exports.deregister = deregister;
function enable(id) {
    if (servicesMap.has(id)) {
        logging_1.default('Enabling service ' + id);
        const srv = servicesMap.get(id);
        srv.enabled = true;
    }
}
exports.enable = enable;
//# sourceMappingURL=services.js.map