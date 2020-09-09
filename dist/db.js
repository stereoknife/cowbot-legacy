"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const redis_1 = __importDefault(require("redis"));
let db;
function init() {
    redis_1.default.createClient(process.env.redisPath || '/var/redis/run/redis.sock', {
        retry_strategy: opt => { if (opt.attempt > 10)
            process.exit(); },
        socket_initial_delay: 5000
    });
    db.on('error', err => console.error(err));
}
exports.init = init;
//# sourceMappingURL=db.js.map