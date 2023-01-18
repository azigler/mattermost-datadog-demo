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
exports.userArray = exports.getAllUsers = exports.readUserFile = exports.matterFetch = exports.MM_URL = exports.USER_DEFAULTS = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.USER_DEFAULTS = {
    team: "main",
    channel: "example",
};
exports.MM_URL = "http://localhost:8065";
function matterFetch(endpoint, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = `${exports.MM_URL}/api/v4/`;
        const data = yield fetch(`${api}${endpoint}`, {
            headers: new Headers({
                Authorization: `Bearer ${token}`,
            }),
        });
        if (data.status === 200) {
            const text = yield data.text();
            return text;
        }
        else {
            const text = yield data.text();
            console.log(text);
            return false;
        }
    });
}
exports.matterFetch = matterFetch;
function readUserFile(filepath, type = "") {
    let contents;
    if (type !== "blob") {
        try {
            contents = fs_1.default.readFileSync(filepath, {
                encoding: "utf8",
            });
        }
        catch (_a) {
            return false;
        }
    }
    else {
        try {
            contents = fs_1.default.readFileSync(filepath);
            contents = Buffer.from(contents);
            return contents;
        }
        catch (_b) {
            return false;
        }
    }
    switch (type) {
        case "json":
            return JSON.parse(contents);
        default:
            return contents;
    }
}
exports.readUserFile = readUserFile;
function getAllUsers(filepath, json = true) {
    let contents;
    try {
        contents = fs_1.default.readFileSync(filepath, {
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
exports.getAllUsers = getAllUsers;
exports.userArray = fs_1.default.readdirSync(path_1.default.join(__dirname, "../../data/users/"));
