import {getGameConfig, getMissions, getRepeatedIndex0Based} from "./loadGameConfig";
import {getPlayerData, savePlayerData, addRewardHistory} from "./dbService";
import {Player, RewardsHistory} from "../interfaces/playerInterface";
import {gameConfig} from "../interfaces/configsInterface";

/**
 * This function check if a given user has completed their current mission (and the following ones if they have enough points),
 * and if so, the function calculate the mission's rewards (present it and save it), and move to the next mission.
 * @param playerID - the Player's unique id
 */
export async function handleMissionCompletion(playerID: string): Promise<boolean> {
    try {
        const playerData = await getPlayerData(playerID);
        if (!playerData) {
            console.error(`Player data not found for ID: ${playerID}`);
            return false;
        }

        const gameConfig: gameConfig = getGameConfig();
        const missions = getMissions(gameConfig);
        const repeatedIndex = getRepeatedIndex0Based(gameConfig);

        let missionCompleted = false;
        while (playerData.points >= missions[playerData.missionNumber].pointsGoal) {
            missionCompleted = true;
            await processMission(playerData, missions, repeatedIndex, playerID);
        }

        // Save updated player data
        await savePlayerData(playerID, playerData);
        return missionCompleted;

    } catch (error) {
        console.error(`Error handling mission completion for player ${playerID}:`, error);
        return false;
    }
}


/**
 * This function complete the mandatory steps for a completed mission - calculate the mission's rewards,
 * deduct the players points and moves on to the next mission
 * @param playerData
 * @param missions
 * @param repeatedIndex
 * @param playerID
 */
async function processMission(
    playerData: Player,
    missions: any[],
    repeatedIndex: number,
    playerID: string
): Promise<void> {
    const currentMission = missions[playerData.missionNumber];
    console.log(`\u2705  Mission ${playerData.missionNumber + 1} completed!`);

    // Reward calculation
    const {missionSpinsReward, missionCoinsReward} = rewardPlayer(playerData, currentMission);

    // Deduct points and go to next mission
    playerData.points -= currentMission.pointsGoal;
    playerData.missionNumber += 1;

    // Save reward history
    const rewardHistory: RewardsHistory = {
        missionNumber: playerData.missionNumber,
        spins: missionSpinsReward,
        coins: missionCoinsReward,
        rewardTimestamp: new Date(),
    };

    await addRewardHistory(playerID, rewardHistory);

    // Reset mission if they were all completed
    if (playerData.missionNumber >= missions.length) {
        console.log(`${String.fromCodePoint(0x1F3C6).repeat(3)} All missions were completed! Resetting to mission ${repeatedIndex + 1}.`);
        playerData.missionNumber = repeatedIndex;
    }
}


/**
 * This function calculate the current mission's rewards
 * @param playerData
 * @param currentMission
 */
function rewardPlayer(playerData: Player, currentMission: any): {
    missionSpinsReward: number;
    missionCoinsReward: number
} {
    let missionSpinsReward = 0;
    let missionCoinsReward = 0;

    for (const reward of currentMission.rewards) {
        if (reward.name === "spins") {
            missionSpinsReward += reward.value;
        } else if (reward.name === "coins") {
            missionCoinsReward += reward.value;
        }
        console.log(`   Added ${reward.value} ${reward.name} to your balance!`);
    }

    playerData.spins += missionSpinsReward;
    playerData.coins += missionCoinsReward;

    return {missionSpinsReward, missionCoinsReward};
}
