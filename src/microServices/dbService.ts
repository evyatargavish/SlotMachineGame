import Redis from 'ioredis';
import {Player, RewardsHistory} from "../interfaces/playerInterface";

// Building 2 DBs:
const gameDB = new Redis({db: 0}); // The main game DB which handle the current board for all players
const rewardsHistoryDB = new Redis({db: 1}); // Rewards history DB that saves the user mission completion rewards


/**
 * This function get a player ID and returns it's data (or null if invalid or not exist)
 * @param playerID
 */
export async function getPlayerData(playerID: string) {
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
    } catch (error) {
        console.error(`Error getting player ${playerID} data:`, error);
        return null;
    }
}


/**
 * This function gets a player ID and data, and save them in the main DB (as key-value)
 * @param playerID
 * @param playerData
 */
export async function savePlayerData(playerID: string, playerData: Player) {
    try {
        await gameDB.hset(playerID, playerData);
    } catch (error) {
        console.error(`Error saving player ${playerID} data:`, error);
    }
}


/**
 * This function gets the players' reward history
 * @param playerID
 */
export async function getRewardHistory(playerID: string): Promise<RewardsHistory[]> {
    try {
        const historyKey = `${playerID}:history`;
        const history = await rewardsHistoryDB.lrange(historyKey, 0, -1);
        return history.map(entry => JSON.parse(entry) as RewardsHistory);
    } catch (error) {
        console.error(`Error fetching reward history for ${playerID}:`, error);
        return [];
    }
}


/**
 * This function added a given reward into the player reward history array
 * @param playerID
 * @param reward
 */
export async function addRewardHistory(playerID: string, reward: RewardsHistory): Promise<void> {
    try {
        const historyKey = `${playerID}:history`;
        const rewardEntry = {...reward, rewardTimestamp: new Date()};
        await rewardsHistoryDB.rpush(historyKey, JSON.stringify(rewardEntry));
    } catch (error) {
        console.error(`Error saving reward history for ${playerID}:`, error);
    }
}
