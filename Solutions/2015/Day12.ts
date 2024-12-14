import * as utils from "../../AdventOfCodeUtils";

/** Day 12 Solution */
export function solution(rawInput: string[]): utils.Solution {
	let sums = [0, 0];
	for (const line of rawInput) {
		const matches = line.matchAll(/-?\d+/g);
		for (const match of matches) { sums[0] += +match[0]; }
	}
	return sums;
}