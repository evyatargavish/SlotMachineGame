"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInvalidPlayer = isInvalidPlayer;
function isInvalidPlayer(playerData) {
    return (!playerData || Object.keys(playerData).length === 0 ||
        isNaN(Number(playerData.points)) ||
        isNaN(Number(playerData.spins)) ||
        isNaN(Number(playerData.missionNumber)) ||
        isNaN(Number(playerData.coins)));
}
