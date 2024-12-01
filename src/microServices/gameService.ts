import {getPlayerData, savePlayerData} from "./dbService";
import {handleMissionCompletion} from "./accumulationSystem";
import {randomSpin, isWinSpin, calculateSpinPoints} from "./slotMachine"
import {Player} from "../interfaces/playerInterface";
import {printBalance, printRewardHistory} from "../utils/outputHelper";
import {v4 as uuidv4} from 'uuid';
import promptSync from 'prompt-sync';

const prompt = promptSync();


/**
 * This is the function that allow the user act according to their choise - spin the slotMachine,
 * check their balance or watch their rewards history,
 * @param playerID
 */
export async function runGame(playerID: string) {
    let playerData: Player | null = await getPlayerData(playerID);

    if (!playerData) {
        console.log("Player not found. Please create a new player.");
        process.exit();
    }

    console.log(`Welcome ${playerData.playerName}! You have ${playerData.spins} spins.`);
    if (playerData && playerData.spins === 0) {
        console.log("Please create a new user in order to play.");
        process.exit();
    }

    while (playerData && playerData.spins > 0) {
        console.log("\nChoose option: ")
        const input = prompt("'S' for spinning the Slot Machine | 'B' to check your balance | 'H' to see you rewards history (or any other key to quit): ");
        switch (input.toLowerCase()) {
            case 'b':
                printBalance(playerData);
                break;
            case 'h':
                await printRewardHistory(playerID);
                break;
            case 's':
                playerData = await spinToPlay(playerID, playerData);
                if (playerData.spins === 0) {
                    console.log("No more spins left. Game over!");
                    return;
                }
                break;
            default:
                console.log(`See you in the next game ${playerData.playerName}! Goodbye!`);
                process.exit();
        }
    }
}


/**
 * This function allow a player to spin the slotMachine, and handle the spin results
 * @param playerID
 * @param playerData
 */
async function spinToPlay(playerID: string, playerData: Player): Promise<Player> {
    try {
        const spinResult = randomSpin();
        console.log(`Your spin results are: ${spinResult}`);

        playerData.spins -= 1;
        await savePlayerData(playerID, playerData); // Ensure spins decreased and saved for avoiding abuse

        let spinScore = 0;

        if (isWinSpin(spinResult)) {
            spinScore = calculateSpinPoints(spinResult);

            if (spinScore > 0) {
                console.log(`This is a winning spin \u2B50  You earned ${spinScore} points!`);
                playerData.points += spinScore;
                await savePlayerData(playerID, playerData);
            } else {
                console.log("That's a winning spin, but it gave you no points.");
            }
        } else {
            console.log("No luck this time. Better luck on the next spin!");
        }

        // Check if a mission was completed
        if (spinScore > 0) {
            const missionCompleted = await handleMissionCompletion(playerID);
            if (missionCompleted) {
                const updatedPlayerData = await getPlayerData(playerID);
                if (updatedPlayerData) {
                    return updatedPlayerData;
                } else {
                    console.error("Error fetching updated player data after mission completion.");
                }
            }
        }
        return playerData;
    } catch (error) {
        console.error("An error occurred during spin logic:", error);
        // Ensure player's spins are updated even if the process fails
        if (playerData.spins >= 0) {
            await savePlayerData(playerID, playerData);
        }
        return playerData;
    }
}


/**
 * This function creates a new player
 */
export async function createNewPlayer() {
    console.log("Creating a new Player..");
    let playerName: string = prompt("Insert your name: ");

    while (!playerName.trim()) {
        console.log("Name cannot be empty or just spaces.");
        playerName = prompt("Insert your name (at least one character required): ");
    }

    const playerData = {
        playerName: playerName,
        points: 0,
        spins: 10,
        missionNumber: 0,
        coins: 10,
    };
    const playerID = uuidv4();

    await savePlayerData(playerID, playerData);
    console.log(`Player created! Your PlayerID is: ${playerID}`)
    return playerID;
}