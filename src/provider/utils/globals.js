"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGlobal = exports.getGlobal = void 0;
const globals = {};
const getGlobal = (key) => {
    return globals[key];
};
exports.getGlobal = getGlobal;
const setGlobal = (key, value) => {
    globals[key] = value;
};
exports.setGlobal = setGlobal;
