import * as utils from "../../AdventOfCodeUtils";

/** Day 11 Solution */
export function solution(rawValues: string[]): utils.Solution {
	
	const initialRocks: number[] = rawValues[0]!.split(" ").map(n => +n);

	const splitNumber = (n: number) => {
		const str = n.toString();
		if (str.length % 2) { return false; }
		const half = str.length / 2;
		return [+str.substring(0, half), +str.substring(half)];
	};

	const memo: utils.StringKeyedObject<number> = {};
	const countProgeny = (rockValue: number, blinks: number) => {
		if (blinks === 0) { return 1; }

		const key = `${rockValue},${blinks}`;
		if (memo[key]) { return memo[key]; }
		
		blinks--;

		if (rockValue === 0) {
			memo[key] = countProgeny(1, blinks);
			return memo[key];
		}
	
		const split = splitNumber(rockValue);
		if (!split) {
			memo[key] = countProgeny(2024 * rockValue, blinks);
			return memo[key];
		}
		
		memo[key] = countProgeny(split[0], blinks) + countProgeny(split[1], blinks);
		return memo[key];
	};

	let sums = [0, 0];
	let blinks = [25, 75];
	for (const ix in blinks) {
		for (const rock of initialRocks) {
			sums[ix] += countProgeny(rock, blinks[ix]);
		}
	}
	return sums;
}