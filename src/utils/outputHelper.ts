import {Player, RewardsHistory} from "../interfaces/playerInterface";
import {getRewardHistory} from "../microServices/dbService";

export function printBalance(playerData: Player): void {
    console.log(`   * You have ${playerData.coins} coins ${String.fromCodePoint(0x1F4B0)}, ${playerData.spins} spins ${String.fromCodePoint(0x1F4AB)} and ${playerData.points} points ${String.fromCodePoint(0x1F396, 0xFE0F)} \n   * Current mission: ${playerData.missionNumber + 1}`);
}


export async function printRewardHistory(playerID: string): Promise<void> {
    const rewardsHistory: RewardsHistory[] = await getRewardHistory(playerID);
    if (rewardsHistory && rewardsHistory.length > 0) {
        for (const reward of rewardsHistory) {
            printSingleReward(reward);
        }
    } else {
        console.log("   * You didn't earn any reward yet. Keep playing.")
    }
}


function printSingleReward(reward: RewardsHistory) {
    let rewardMessage = `   * On ${reward.rewardTimestamp} you have completed mission ${reward.missionNumber} and earned`;
    if (reward.spins > 0 && reward.coins > 0) {
        rewardMessage += ` ${reward.spins} and spins ${reward.coins} coins.`;
    } else {
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