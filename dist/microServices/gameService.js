"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGame = runGame;
exports.createNewPlayer = createNewPlayer;
const dbService_1 = require("./dbService");
const accumulationSystem_1 = require("./accumulationSystem");
const slotMachine_1 = require("./slotMachine");
const outputHelper_1 = require("../utils/outputHelper");
const uuid_1 = require("uuid");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
/**
 * This is the function that allow the user act according to their choise - spin the slotMachine,
 * check their balance or watch their rewards history,
 * @param playerID
 */
async function runGame(playerID) {
    let playerData = await (0, dbService_1.getPlayerData)(playerID);
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
        console.log("\nChoose option: ");
        const input = prompt("'S' for spinning the Slot Machine | 'B' to check your balance | 'H' to see you rewards history (or any other key to quit): ");
        switch (input.toLowerCase()) {
            case 'b':
                (0, outputHelper_1.printBalance)(playerData);
                break;
            case 'h':
                await (0, outputHelper_1.printRewardHistory)(playerID);
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
async function spinToPlay(playerID, playerData) {
    try {
        const spinResult = (0, slotMachine_1.randomSpin)();
        console.log(`Your spin results are: ${spinResult}`);
        playerData.spins -= 1;
        await (0, dbService_1.savePlayerData)(playerID, playerData); // Ensure spins decreased and saved for avoiding abuse
        let spinScore = 0;
        if ((0, slotMachine_1.isWinSpin)(spinResult)) {
            spinScore = (0, slotMachine_1.calculateSpinPoints)(spinResult);
            if (spinScore > 0) {
                console.log(`This is a winning spin \u2B50  You earned ${spinScore} points!`);
                playerData.points += spinScore;
                await (0, dbService_1.savePlayerData)(playerID, playerData);
            }
            else {
                console.log("That's a winning spin, but it gave you no points.");
            }
        }
        else {
            console.log("No luck this time. Better luck on the next spin!");
        }
        // Check if a mission was completed
        if (spinScore > 0) {
            const missionCompleted = await (0, accumulationSystem_1.handleMissionCompletion)(playerID);
            if (missionCompleted) {
                const updatedPlayerData = await (0, dbService_1.getPlayerData)(playerID);
                if (updatedPlayerData) {
                    return updatedPlayerData;
                }
                else {
                    console.error("Error fetching updated player data after mission completion.");
                }
            }
        }
        return playerData;
    }
    catch (error) {
        console.error("An error occurred during spin logic:", error);
        // Ensure player's spins are updated even if the process fails
        if (playerData.spins >= 0) {
            await (0, dbService_1.savePlayerData)(playerID, playerData);
        }
        return playerData;
    }
}
/**
 * This function creates a new player
 */
async function createNewPlayer() {
    console.log("Creating a new Player..");
    let playerName = prompt("Insert your name: ");
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
    const playerID = (0, uuid_1.v4)();
    await (0, dbService_1.savePlayerData)(playerID, playerData);
    console.log(`Player created! Your PlayerID is: ${playerID}`);
    return playerID;
}
