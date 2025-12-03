import * as utils from "../../AdventOfCodeUtils";

/** Day 3 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const out = [0, 0];
	for (const line of rawInput) {
		const bank = line.split("");
		out[0] += getMaxJoltage(bank, 2);
		out[1] += getMaxJoltage(bank, 12);
	}
	return out;
}

function getMaxJoltage(
	bank: string[],
	batteriesRemaining: number,
	currentIndex: number = 0,
	currentValue: string = ""
): number {
	if (!batteriesRemaining) { return +currentValue; }
	for (let digit = 9; digit >= 0; digit--) {
		const index = bank.indexOf(digit + "", currentIndex);
		if (index < 0 || batteriesRemaining + index > bank.length) { continue; }
		const max = getMaxJoltage(bank, batteriesRemaining - 1, index + 1, currentValue + digit);
		if (max === 0) { continue; }
		return max;
	}
	return 0;
}