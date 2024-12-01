"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printBalance = printBalance;
exports.printRewardHistory = printRewardHistory;
const dbService_1 = require("../microServices/dbService");
function printBalance(playerData) {
    console.log(`   * You have ${playerData.coins} coins ${String.fromCodePoint(0x1F4B0)}, ${playerData.spins} spins ${String.fromCodePoint(0x1F4AB)} and ${playerData.points} points ${String.fromCodePoint(0x1F396, 0xFE0F)} \n   * Current mission: ${playerData.missionNumber + 1}`);
}
async function printRewardHistory(playerID) {
    const rewardsHistory = await (0, dbService_1.getRewardHistory)(playerID);
    if (rewardsHistory && rewardsHistory.length > 0) {
        for (const reward of rewardsHistory) {
            printSingleReward(reward);
        }
    }
    else {
        console.log("   * You didn't earn any reward yet. Keep playing.");
    }
}
function printSingleReward(reward) {
    let rewardMessage = `   * On ${reward.rewardTimestamp} you have completed mission ${reward.missionNumber} and earned`;
    if (reward.spins > 0 && reward.coins > 0) {
        rewardMessage += ` ${reward.spins} and spins ${reward.coins} coins.`;
    }
    else {
        if (reward.spins > 0) {
            rewardMessage += ` ${reward.spins} spins`;
        }
        if (reward.coins > 0) {
            rewardMessage += ` ${reward.coins} coins`;
        }
        rewardMessage += '.';
    }
    console.log(rewardMessage);
}
