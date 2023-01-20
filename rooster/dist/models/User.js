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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
const _1 = require(".");
const child_process_1 = require("child_process");
class User {
    constructor({ name }) {
        this.name = name;
        this.id = "";
        this.avatar = false;
        const config = (0, utils_1.readUserFile)(path_1.default.join(__dirname, `../../data/users/${name}/config.json`), "json");
        const token = (0, utils_1.readUserFile)(path_1.default.join(__dirname, `../../data/users/${name}/token.txt`));
        this.avatar = (0, utils_1.readUserFile)(path_1.default.join(__dirname, `../../data/users/${name}/avatar.png`));
        if (config) {
            this.defaults = config.defaults || false;
            if (!this.defaults) {
                this.defaults = utils_1.USER_DEFAULTS;
            }
            const actionBuffer = config.actions || false;
            this.actions = [];
            if (actionBuffer) {
                for (const a of actionBuffer) {
                    this.actions.push(new _1.Action(a));
                }
            }
        }
        else {
            this.defaults = false;
            this.actions = false;
        }
        if (token) {
            this.token = token.trim();
            this.fetchMe(token);
        }
        else {
            this.token = false;
        }
    }
    fetchMe(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const me = yield (0, utils_1.matterGet)("users/me", token);
            if (me) {
                const data = JSON.parse(me);
                this.id = data.id;
                if (this.avatar) {
                    this.setAvatar();
                }
                if (this.defaults && this.defaults.nickname) {
                    const me = yield (0, utils_1.matterPut)(`users/${this.id}/patch`, token, {
                        nickname: this.defaults.nickname,
                    });
                }
            }
            if (this.actions && this.defaults) {
                for (const act of this.actions) {
                    switch (act.type) {
                        case "post": {
                            yield (0, utils_1.matterPost)("posts", token, {
                                channel_id: act.channel || this.defaults.channel,
                                message: act.text,
                            });
                            yield new Promise((resolve) => setTimeout(resolve, 10000));
                        }
                    }
                }
            }
        });
    }
    setAvatar() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, child_process_1.exec)(`curl -F 'image=@./data/users/${this.name}/avatar.png' -H 'Authorization: Bearer ${this.token}' ${utils_1.MM_URL}/api/v4/users/${this.id}/image`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        });
    }
}
exports.User = User;
