import * as utils from "../../AdventOfCodeUtils";

/** Day 1 Solution */
export function solution(masses: string[]): utils.Solution {
	const naiveFuel = masses.map(n => Math.floor(+n / 3) - 2).reduce((a, b) => a + b, 0);
	const fuelFuel = masses.map(nStr => {
		let n = +nStr;
		let sum = 0;
		while (n > 0) {
			n = Math.floor(n / 3) - 2;
			if (n > 0) { sum += n; }
		}
		return sum;
	}).reduce((a, b) => a + b, 0);
	return [naiveFuel, fuelFuel];
};