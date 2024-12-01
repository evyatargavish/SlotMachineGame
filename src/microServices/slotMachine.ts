export function randomSpin(): [number, number, number] {
    return [generateDigit(), generateDigit(), generateDigit()];
}


function generateDigit(): number {
    return Math.floor(Math.random() * 10);
}


export function isWinSpin(spinResult: [number, number, number]): boolean {
    return (spinResult[0] === spinResult[1] && spinResult[1] === spinResult[2]);
}


export function calculateSpinPoints(spinResult: [number, number, number]): number {
    return spinResult[0] * 3;
}