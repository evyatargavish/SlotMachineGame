export interface Player{
    playerName: string,
    missionNumber: number,
    points: number,
    spins: number,
    coins: number
}
export interface RewardsHistory {
    missionNumber: number,
    spins: number,
    coins: number,
    rewardTimestamp: Date
}