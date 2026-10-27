import * as utils from "../../AdventOfCodeUtils";

/** Day 24 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const map = rawInput.map(row => row.split(""));
	const hypermap: utils.StringKeyedObject<string[][]> = { 0: map.map(row => [...row]) }
	const seen: Set<number> = new Set();

	const out: utils.Solution = [];

	while (true) {
		const bd = __biodiversity(map);
		if (seen.has(bd)) { out.push(bd); break; }
		seen.add(bd);
		__iterate(map);
	}

	for (let _ = 0; _ < 200; _++) { __recursiveIterate(hypermap); }
	let bugs = 0;
	for (const level in hypermap) {
		bugs += hypermap[level].flat().reduce((count, cell) => count += +(cell === "#"), 0);
	}
	out.push(bugs);

	return out;
}

function __iterate(map: string[][]): void {
	const newMap: string[][] = [];
	for (const row in map) {
		const newRow: string[] = [];
		for (const col in map[row]) {
			const cell = map[row][col];
			const adjs = utils._getAdjacents([+row, +col]);
			let neighbors = 0;
			for (const adj of adjs) {
				neighbors += +(map[adj[0]]?.[adj[1]] === "#");
			}
			newRow.push(
				cell === "#"
					? neighbors === 1 ? "#" : "."
					: neighbors === 1 || neighbors === 2 ? "#" : "."
			);
		}
		newMap.push(newRow);
	}

	for (let rowIx = 0; rowIx < map.length; rowIx++) { map[rowIx] = newMap[rowIx]; }
}

function __biodiversity(map: string[][]): number {
	return map.flat().reduce((sum: number, cell: string, index: number) => sum + +(cell === "#") * (2 ** index), 0);
}

function __makeEmptyLevel(): string[][] {
	return [
		new Array(5).fill("."),
		new Array(5).fill("."),
		"..?..".split(""),
		new Array(5).fill("."),
		new Array(5).fill("."),
	];
}

function __recursiveIterate(hypermap: utils.StringKeyedObject<string[][]>): void {
	const newHypermap: utils.StringKeyedObject<string[][]> = {};
	
	let lowest = 0, highest = 0;
	for (const level in hypermap) {
		if (+level < lowest) { lowest = +level; }
		if (+level > highest) { highest = +level; }
	}
	
	hypermap[--lowest] = __makeEmptyLevel();
	hypermap[++highest] = __makeEmptyLevel();
	
	for (const level in hypermap) {
		const newLevel: string[][] = [];
		for (const row in hypermap[level]) {
			const newRow: string[] = [];
			for (const col in hypermap[level][row]) {
				const cell = hypermap[level][row][col];
				if (cell === "?") { newRow.push("?"); continue; }
				const adjs = __getRecursiveAdjacents(+level, +row, +col);
				let neighbors = 0;
				for (const adj of adjs) {
					neighbors += +(hypermap[adj[0]]?.[adj[1]]?.[adj[2]] === "#");
				}
				newRow.push(
					cell === "#"
						? neighbors === 1 ? "#" : "."
						: neighbors === 1 || neighbors === 2 ? "#" : "."
				);
			}
			newLevel.push(newRow);
		}
		if ((+level === lowest || +level === highest) && !newLevel.flat().includes("#")) {
			delete hypermap[level];
			continue;
		}
		newHypermap[level] = newLevel;
	}
	
	for (const level in newHypermap) {
		for (const row in newHypermap[level]) {
			hypermap[level][row] = newHypermap[level][row];
		}
	}
}

function __getRecursiveAdjacents(depth: number, row: number, col: number): number[][] {
	const adjs = utils._getAdjacents([row, col]);
	const adjustedAdjacents: number[][] = [];
	for (const adj of adjs) {
		if (adj[0] === 2 && adj[1] === 2) {
			// Center space; recurse inward
			if (row === 1) {
				adjustedAdjacents.push(...[0, 1, 2, 3, 4].map(c => [depth + 1, 0, c]));
			}
			if (row === 3) {
				adjustedAdjacents.push(...[0, 1, 2, 3, 4].map(c => [depth + 1, 4, c]));
			}
			if (col === 1) {
				adjustedAdjacents.push(...[0, 1, 2, 3, 4].map(r => [depth + 1, r, 0]));
			}
			if (col === 3) {
				adjustedAdjacents.push(...[0, 1, 2, 3, 4].map(r => [depth + 1, r, 4]));
			}
			continue;
		}
		if (adj[0] < 0) {
			adjustedAdjacents.push([depth - 1, 1, 2]);
			continue;
		}
		if (adj[0] > 4) {
			adjustedAdjacents.push([depth - 1, 3, 2]);
			continue;
		}
		if (adj[1] < 0) {
			adjustedAdjacents.push([depth - 1, 2, 1]);
			continue;
		}
		if (adj[1] > 4) {
			adjustedAdjacents.push([depth - 1, 2, 3]);
			continue;
		}
		adjustedAdjacents.push([depth, ...adj]);
	}
	return adjustedAdjacents;
}