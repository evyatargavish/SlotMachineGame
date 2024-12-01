"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const gameService_1 = require("./gameService");
const dbService_1 = require("./dbService");
const gameService_2 = require("./gameService");
const validations_1 = require("../utils/validations");
const prompt = (0, prompt_sync_1.default)();
/**
 * This is the "main" function that starts the game. It allows to Login / create a new player, and them stars the game
 */
async function index() {
    let playerID = null;
    while (!playerID) {
        const action = prompt("Do you want to Login or Create a new player? (type L/C): ").toLowerCase();
        switch (action) {
            case 'c':
                playerID = await (0, gameService_1.createNewPlayer)();
                break;
            case 'l':
                const enteredPlayerID = prompt("Enter your player ID: ").trim();
                if (!enteredPlayerID) {
                    console.log("Player ID cannot be empty. Please try again.");
                    break;
                }
                const playerData = await (0, dbService_1.getPlayerData)(enteredPlayerID);
                if ((0, validations_1.isInvalidPlayer)(playerData)) {
                    console.log("Player ID not found. Please create a new player.");
                    break;
                }
                playerID = enteredPlayerID;
                break;
            default:
                console.log("Invalid option. Please choose 'L' to Login or 'C' to Create a new player.");
                break;
        }
    }
    try {
        await (0, gameService_2.runGame)(playerID);
    }
    catch (error) {
        console.error("Error during game execution:", error);
    }
}
// Run the main function
index().catch((error) => {
    console.error("Error during game execution:", error);
});
