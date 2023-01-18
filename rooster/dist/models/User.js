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
/*
for user
  grab their config
  create a user in memory
  store their token
  if they have an avatar file, set as profile picture

User
  name
  token
  defaults
    team
    channel
  Action[]
    use user's default unless overridden
    for action's text, parse newlines and escape backticks, convert to string literal
*/
class User {
    constructor({ name }) {
        this.name = name;
        this.id = "";
        this.avatar = false;
        const config = (0, utils_1.readUserFile)(path_1.default.join(__dirname, `../../data/users/${name}/config.json`), "json");
        const token = (0, utils_1.readUserFile)(path_1.default.join(__dirname, `../../data/users/${name}/token.txt`));
        const avatar = (0, utils_1.readUserFile)(path_1.default.join(__dirname, `../../data/users/${name}/avatar.png`), "blob");
        console.log(avatar);
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
        if (avatar) {
            this.avatar = avatar;
        }
        else {
            this.avatar = false;
        }
        if (token) {
            this.token = token;
            // set prof pic
            this.fetchMe(token);
        }
        else {
            this.token = false;
        }
    }
    fetchMe(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const me = yield (0, utils_1.matterFetch)("users/me", token);
            if (me) {
                const data = JSON.parse(me);
                this.id = data.id;
                console.log(this);
                if (this.avatar) {
                    this.setAvatar(this.avatar);
                }
            }
        });
    }
    setAvatar(png) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token || !this.avatar)
                return false;
            const body = new FormData();
            body.append("image", png);
            console.log(body.has("image"));
            const av = yield (0, utils_1.matterFetch)(`users/${this.id}/image`, this.token, {
                method: "POST",
                body,
            });
            console.log("results", av);
        });
    }
}
exports.User = User;
