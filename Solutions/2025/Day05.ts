import * as utils from "../../AdventOfCodeUtils";

/** Day 5 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const rawRanges: number[][] = [];
	const ingredients: number[] = [];
	for (const line of rawInput) {
		const rangeMatch = line.match(/^(\d+)-(\d+)$/);
		rangeMatch && rawRanges.push([+rangeMatch[1], +rangeMatch[2]]);
		
		const ingredientMatch = line.match(/^(\d+)$/);
		ingredientMatch && ingredients.push(+ingredientMatch[0]);
	}

	rawRanges.sort((l, r) => l[0] - r[0]);
	ingredients.sort((l, r) => l - r);

	const out = [0, 0];
	
	// Consolidate overlapping ranges
	const ranges: number[][] = [];
	let current: number[] = rawRanges[0];
	for (const range of rawRanges) {
		if (current[1] + 1 < range[0]) {
			ranges.push(current);
			out[1] += current[1] - current[0] + 1;
			current = range;
			continue;
		}
		current[1] = Math.max(current[1], range[1]);
	}
	ranges.push(current);
	out[1] += current[1] - current[0] + 1;

	// Increment through both sorted lists, counting ingredients that fall within a range
	let rangeIndex = 0;
	let range = ranges[rangeIndex];
	for (const ingredient of ingredients) {
		while (range && ingredient > range[1]) {
			range = ranges[++rangeIndex];
		}
		out[0] += +(ingredient >= range[0]);
	}
	
	return out;
}