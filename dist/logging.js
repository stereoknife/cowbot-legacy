"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging = true;
const level = 1;
function log(message, priority = 1) {
    if (logging && priority >= level) {
        console.log(message);
        return;
    }
}
exports.default = log;
//# sourceMappingURL=logging.js.map