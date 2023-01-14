"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const USER_DEFAULTS = {
    team: "main",
    channel: "example",
};
const MM_URL = "http://localhost:8065";
console.log("Rooster server online!");
function read(filepath, json = true) {
    let contents;
    try {
        contents = fs.readFileSync(filepath, {
            encoding: "utf8",
        });
    }
    catch (_a) {
        contents = false;
    }
    if (typeof contents == "string" && json) {
        return JSON.parse(contents);
    }
    else {
        return contents;
    }
}
class Action {
    constructor(props) {
        this.type = props.type;
        this.channel = props.channel || USER_DEFAULTS.channel;
        this.text = props.text || "";
        if (this.text) {
        }
    }
}
class User {
    constructor({ name }) {
        this.name = name;
        const config = read(path.join(__dirname, `../data/users/${name}/config.json`));
        const token = read(path.join(__dirname, `../data/users/${name}/token.txt`), false);
        if (config) {
            this.defaults = config.defaults || false;
            if (!this.defaults) {
                this.defaults = USER_DEFAULTS;
            }
            const actionBuffer = config.actions || false;
            this.actions = [];
            if (actionBuffer) {
                for (const a of actionBuffer) {
                    this.actions.push(new Action(a));
                }
            }
        }
        else {
            this.defaults = false;
            this.actions = false;
        }
        if (token) {
            this.token = token;
            // set prof pic
            const test = () => __awaiter(this, void 0, void 0, function* () {
                const data = yield fetch(`${MM_URL}/api/v4/users/me`, {
                    headers: new Headers({
                        Authorization: `Bearer ${token}`,
                    }),
                });
                console.log(data);
            });
            test();
        }
        else {
            this.token = false;
        }
    }
}
const test = new User({
    name: "zeek",
});
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
