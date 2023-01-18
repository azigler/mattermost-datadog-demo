"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
const utils_1 = require("./utils");
console.log("Rooster server online!");
const users = new Set();
for (const user of utils_1.userArray) {
    users.add(new models_1.User({
        name: user,
    }));
}
