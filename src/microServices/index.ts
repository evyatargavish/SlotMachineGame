import promptSync from 'prompt-sync';
import {createNewPlayer} from './gameService';
import {getPlayerData} from './dbService';
import {runGame} from './gameService';
import {isInvalidPlayer} from "../utils/validations";

const prompt = promptSync();

/**
 * This is the "main" function that starts the game. It allows to Login / create a new player, and them stars the game
 */
async function index() {
    let playerID: string | null = null;

    while (!playerID) {
        const action = prompt("Do you want to Login or Create a new player? (type L/C): ").toLowerCase();

        switch (action) {
            case 'c':
                playerID = await createNewPlayer();
                break;

            case 'l':
                const enteredPlayerID = prompt("Enter your player ID: ").trim();
                if (!enteredPlayerID) {
                    console.log("Player ID cannot be empty. Please try again.");
                    break;
                }

                const playerData = await getPlayerData(enteredPlayerID);
                if (isInvalidPlayer(playerData)) {
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
        await runGame(playerID);
    } catch (error) {
        console.error("Error during game execution:", error);
    }
}


// Run the main function
index().catch((error) => {
    console.error("Error during game execution:", error);
});