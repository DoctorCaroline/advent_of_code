import * as utils from "../../AdventOfCodeUtils";

/** Day 4 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const floor: Tile[][] = [];
	for (const line of rawInput) {
		floor.push(line.split("") as Tile[]);
	}

	const out = [0, 0];

	let rollTaken = true;
	let initialSweep: number[][] = [];

	while (rollTaken) {
		rollTaken = false;

		for (const row in floor) {
			for (const col in floor[row]) {
				if (floor[row][col] !== "@") { continue; }
				const adjacents = utils._getAdjacents([+row, +col], true);

				if (adjacents.filter(adj => floor[adj[0]]?.[adj[1]] === "@").length >= 4) { continue; }

				out[1]++;
				rollTaken = true;

				if (!out[0]) {
					// Preserve initial state to accurately count Part 1 (remove after full first pass)
					initialSweep.push([+row, +col]);
					continue;
				}
				
				floor[row][col] = ".";
			}
		}

		if (out[0]) { continue; }
		out[0] = initialSweep.length;
		initialSweep.forEach(coord => floor[coord[0]][coord[1]] = ".");
	}
	
	return out;
}

type Tile = "." | "@";