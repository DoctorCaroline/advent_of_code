import * as utils from "../../AdventOfCodeUtils";

/** Day 15 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const finalLength = 30000000;
	const sequence: number[] = rawInput[0].split(",").map(n => +n);
	const lastCalls: number[] = new Array(finalLength); // Pre-allocate memory or waste lots of time resizing this object

	for (const ix in sequence) {
		if (+ix === sequence.length - 1) { break; }
		lastCalls[sequence[ix]] = +ix;
	}

	let current = sequence[sequence.length - 1];
	const out = [];

	for (let ix = sequence.length; ix < finalLength; ix++) {
		if (ix === 2020) { out.push(current); } // Part 1
		const previous = current;
		current = lastCalls[previous] === undefined
			? 0
			: ix - lastCalls[previous] - 1;
		lastCalls[previous] = ix - 1;
	}
	out.push(current); // Part 2

	return out;
}