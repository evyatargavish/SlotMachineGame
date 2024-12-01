import {Player} from "../interfaces/playerInterface";

export function isInvalidPlayer(playerData: Player | null): boolean {
    return (!playerData || Object.keys(playerData).length === 0 ||
        isNaN(Number(playerData.points)) ||
        isNaN(Number(playerData.spins)) ||
        isNaN(Number(playerData.missionNumber)) ||
        isNaN(Number(playerData.coins)));
}