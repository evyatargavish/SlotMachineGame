# Game README

## Pre-requisites

1. **Install Redis** (depends on your OS). Example: `brew install redis` for macOS with Brew.
2. **Start Redis manually**: Run the command `redis-server` in the terminal to start Redis.

## How to Run the Game

1. You can run the game using either of the following options:
    - Option 1: Run directly with `npx ts-node`:
      ```bash
      npx ts-node ./src/microServices/index.ts
      ```
    - Option 2: Start the `index.ts` file after transpiling to JavaScript:
        1. First, transpile the TypeScript files to JavaScript:
           ```bash
           npx tsc
           ```
        2. Then run the transpiled JavaScript:
           ```bash
           node dist/microServices/index.js
           ```

2. **Create a New User**:
    - Choose **C** to create a new user, and then enter your name. The output will be your **Player ID** that you’ll use to log in during your next game.


## Game Features
After logging in, you can choose from 3 options:
1. **'S'**: Spin the slot machine.
2. **'B'**: Check your balance (points, spins, and coins).
3. **'H'**: View your rewards history.


## Assumptions
1. The `configuration.json` file can be changed according to your preferences.
2. Every mission will have at least one reward, and the reward index is **1-based** (smaller than the mission's array length).

## Have Fun!

I'm available for questions if you need help. Enjoy the game!

Evyatar Gavish
