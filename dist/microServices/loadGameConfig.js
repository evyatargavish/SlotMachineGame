"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameConfig = getGameConfig;
exports.getMissions = getMissions;
exports.getRepeatedIndex0Based = getRepeatedIndex0Based;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CONFIG_FILE_PATH = path_1.default.resolve(__dirname, '../config/configuration.json');
function getGameConfig() {
    const data = fs_1.default.readFileSync(CONFIG_FILE_PATH, 'utf-8');
    return JSON.parse(data);
}
function getMissions(config) {
    return config.missions;
}
function getRepeatedIndex0Based(config) {
    return config.repeatedIndex - 1;
}
