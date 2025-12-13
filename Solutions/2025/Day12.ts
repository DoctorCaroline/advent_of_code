import * as utils from "../../AdventOfCodeUtils";

/** Day 12 Solution */
export function solution(rawInput: string[]): utils.Solution {
	
	const areasToFill: number[] = [];
	const counts: number[][] = [];

	for (const line of rawInput) {
		const spaceMatch = line.match(/^(\d+)x(\d+): (\d+( \d+)*)$/);
		if (!spaceMatch) { continue; }
		areasToFill.push(+spaceMatch[1] * +spaceMatch[2]);
		counts.push(spaceMatch[3].split(" ").map(n => +n));
	}

	const out = [0];
	for (let index = 0; index < areasToFill.length; index++) {
		const combinedPresentsArea = 9 * counts[index].reduce((sum, count) => sum + count, 0);
		out[0] += +(combinedPresentsArea <= areasToFill[index]);
	}
	return out;
}