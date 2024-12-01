import fs from 'fs';
import {gameConfig, Mission} from '../interfaces/configsInterface';
import path from 'path';

const CONFIG_FILE_PATH = path.resolve(__dirname, '../config/configuration.json');

export function getGameConfig(): gameConfig {
    const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
    return JSON.parse(data);
}

export function getMissions(config: gameConfig): Mission[] {
    return config.missions;
}

export function getRepeatedIndex0Based(config: gameConfig): number {
    return config.repeatedIndex - 1;
}