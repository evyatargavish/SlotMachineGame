"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerData = getPlayerData;
exports.savePlayerData = savePlayerData;
exports.getRewardHistory = getRewardHistory;
exports.addRewardHistory = addRewardHistory;
const ioredis_1 = __importDefault(require("ioredis"));
// Building 2 DBs:
const gameDB = new ioredis_1.default({ db: 0 }); // The main game DB which handle the current board for all players
const rewardsHistoryDB = new ioredis_1.default({ db: 1 }); // Rewards history DB that saves the user mission completion rewards
/**
 * This function get a player ID and returns it's data (or null if invalid or not exist)
 * @param playerID
 */
async function getPlayerData(playerID) {
    try {
        const data = await gameDB.hgetall(playerID);
        if (!data || Object.keys(data).length === 0) {
            return null;
        }
        return {
            playerName: data.playerName,
            points: isNaN(parseInt(data.points)) ? 0 : parseInt(data.points),
            spins: isNaN(parseInt(data.spins)) ? 0 : parseInt(data.spins),
            missionNumber: isNaN(parseInt(data.missionNumber)) ? 0 : parseInt(data.missionNumber),
            coins: isNaN(parseInt(data.coins)) ? 0 : parseInt(data.coins)
        };
    }
    catch (error) {
        console.error(`Error getting player ${playerID} data:`, error);
        return null;
    }
}
/**
 * This function gets a player ID and data, and save them in the main DB (as key-value)
 * @param playerID
 * @param playerData
 */
async function savePlayerData(playerID, playerData) {
    try {
        await gameDB.hset(playerID, playerData);
    }
    catch (error) {
        console.error(`Error saving player ${playerID} data:`, error);
    }
}
/**
 * This function gets the players' reward history
 * @param playerID
 */
async function getRewardHistory(playerID) {
    try {
        const historyKey = `${playerID}:history`;
        const history = await rewardsHistoryDB.lrange(historyKey, 0, -1);
        return history.map(entry => JSON.parse(entry));
    }
    catch (error) {
        console.error(`Error fetching reward history for ${playerID}:`, error);
        return [];
    }
}
/**
 * This function added a given reward into the player reward history array
 * @param playerID
 * @param reward
 */
async function addRewardHistory(playerID, reward) {
    try {
        const historyKey = `${playerID}:history`;
        const rewardEntry = Object.assign(Object.assign({}, reward), { rewardTimestamp: new Date() });
        await rewardsHistoryDB.rpush(historyKey, JSON.stringify(rewardEntry));
    }
    catch (error) {
        console.error(`Error saving reward history for ${playerID}:`, error);
    }
}
