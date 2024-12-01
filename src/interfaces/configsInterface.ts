export interface Reward{
    name: string,
    value: number;
}

export interface Mission{
    rewards: Reward[],
    pointsGoal: number;
}

export interface gameConfig{
    missions: Mission[],
    repeatedIndex: number;
}