"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const utils_1 = require("../utils");
class Action {
    constructor(props) {
        this.type = props.type;
        this.channel = props.channel || utils_1.USER_DEFAULTS.channel;
        this.text = props.text || "";
        if (this.text) {
        }
    }
}
exports.Action = Action;
