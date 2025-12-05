import * as utils from "../../AdventOfCodeUtils";

/** Day 4 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const floor: Tile[][] = [];
	for (const line of rawInput) {
		floor.push(line.split("") as Tile[]);
	}

	const containsRoll = (orderedPair: number[]) => floor[orderedPair[0]]?.[orderedPair[1]] === "@";

	const out = [0, 0];

	let initialSweep: number[][] = [];
	let resample: number[][] = [];
 
	for (const row in floor) {
		for (const col in floor[row]) {
			if (floor[row][col] !== "@") { continue; }
			const adjacents = utils._getAdjacents([+row, +col], true);

			const neighbors = adjacents.filter(containsRoll);
			if (neighbors.length >= 4) { continue; }

			// Subsequent resamples needn't scan entire floor, only neighbors of removed rolls
			resample.push(...neighbors);
			out[1]++;

			// Preserve initial state to accurately count Part 1
			initialSweep.push([+row, +col]);
		}
	}

	out[0] = initialSweep.length;
	initialSweep.forEach(coord => floor[coord[0]][coord[1]] = ".");

	// Process resample queue until no further rolls can be removed
	while (resample.length) {
		const coord = resample.pop()!;
		if (!containsRoll(coord)) { continue; }
		const adjacents = utils._getAdjacents(coord, true);

		const neighbors = adjacents.filter(containsRoll);
		if (neighbors.length >= 4) { continue; }

		resample.push(...neighbors);
		out[1]++;
		floor[coord[0]][coord[1]] = ".";
	}
	
	return out;
}

type Tile = "." | "@";