"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exports.deregister = exports.register = void 0;
const logging_1 = __importDefault(require("../logging"));
const emptyOpts = {
    alias: [],
    denyUsers: null,
    allowUsers: null,
    denyGuilds: null,
    allowGuilds: null
};
const aliasMap = new Map();
const commandMap = new Map();
function register(names, cmd) {
    if (names.length === 0)
        return;
    const id = names.shift();
    names.forEach(alias => {
        aliasMap.set(alias, id);
    });
    commandMap.set(id, cmd);
}
exports.register = register;
function deregister(name) {
}
exports.deregister = deregister;
function exec(data, publicReply, privateReply) {
    var _a;
    logging_1.default('executing ' + data.name);
    const id = (_a = findAlias(data.name)) !== null && _a !== void 0 ? _a : data.name;
    const comm = findCommand(id);
    if (comm != null) {
        comm(data, publicReply, privateReply);
    }
}
exports.exec = exec;
function loadCommand(id, db) {
    const op = Object.assign({}, emptyOpts);
    op.alias = db[`${id}:alias`];
    op.denyUsers = db[`${id}:denyusers`];
    op.allowUsers = db[`${id}:allowusers`];
    op.denyGuilds = db[`${id}:denyguilds`];
    op.allowGuilds = db[`${id}:allowguilds`];
    return op;
}
function findAlias(alias) {
    if (alias == null)
        return undefined;
    for (const [key, value] of aliasMap) {
        if (key === alias)
            return value;
    }
    return undefined;
}
function findCommand(id) {
    if (id == null)
        return undefined;
    return commandMap.get(id);
}
//# sourceMappingURL=manager.js.map