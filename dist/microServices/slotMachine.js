"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomSpin = randomSpin;
exports.isWinSpin = isWinSpin;
exports.calculateSpinPoints = calculateSpinPoints;
function randomSpin() {
    return [generateDigit(), generateDigit(), generateDigit()];
}
function generateDigit() {
    return Math.floor(Math.random() * 10);
}
function isWinSpin(spinResult) {
    return (spinResult[0] === spinResult[1] && spinResult[1] === spinResult[2]);
}
function calculateSpinPoints(spinResult) {
    return spinResult[0] * 3;
}
